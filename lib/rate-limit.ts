import { NextResponse } from "next/server";

interface RateLimitConfig {
  limit: number;      // Maximum requests allowed in the window
  windowMs: number;   // Time window in milliseconds
}

const ipCache = new Map<string, { count: number; resetTime: number }>();

/**
 * Resolves the client IP address from request headers.
 */
export function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return "127.0.0.1";
}

/**
 * Simple in-memory rate limiter.
 * Returns true if request is within limits, false if rate limit is exceeded.
 */
export function isRateLimited(
  ip: string,
  key: string,
  config: RateLimitConfig
): { success: boolean; remaining: number; reset: number } {
  const cacheKey = `${key}:${ip}`;
  const now = Date.now();
  const record = ipCache.get(cacheKey);

  if (!record) {
    ipCache.set(cacheKey, {
      count: 1,
      resetTime: now + config.windowMs,
    });
    return {
      success: true,
      remaining: config.limit - 1,
      reset: config.windowMs,
    };
  }

  // If window expired, reset
  if (now > record.resetTime) {
    record.count = 1;
    record.resetTime = now + config.windowMs;
    ipCache.set(cacheKey, record);
    return {
      success: true,
      remaining: config.limit - 1,
      reset: config.windowMs,
    };
  }

  // If over limit, block
  if (record.count >= config.limit) {
    return {
      success: false,
      remaining: 0,
      reset: Math.max(0, record.resetTime - now),
    };
  }

  // Increment count
  record.count += 1;
  ipCache.set(cacheKey, record);
  return {
    success: true,
    remaining: config.limit - record.count,
    reset: Math.max(0, record.resetTime - now),
  };
}

/**
 * Helper to build a standard 429 response when rate limited.
 */
export function rateLimitErrorResponse(resetMs: number): NextResponse {
  const resetSeconds = Math.ceil(resetMs / 1000);
  return new NextResponse(
    JSON.stringify({
      success: false,
      error: `Too many requests. Please try again in ${resetSeconds} seconds.`,
    }),
    {
      status: 429,
      headers: {
        "Content-Type": "application/json",
        "Retry-After": resetSeconds.toString(),
      },
    }
  );
}
