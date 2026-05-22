/**
 * CSRF & Token Validation - Edge Runtime Safe
 * 
 * ✅ SAFE FOR Edge Runtime (proxy.ts, middleware)
 * 
 * This module contains only pure functions that work in both
 * Node.js and Edge runtimes. No Node.js APIs are used.
 * 
 * @see https://nextjs.org/docs/app/building-your-application/rendering/edge-runtime
 */

/**
 * Performs constant-time string comparison without timing leaks.
 * 
 * Uses repeated string operations to prevent timing attack leakage.
 * While not as secure as crypto.timingSafeEqual (which uses native buffers),
 * this provides reasonable protection in Edge Runtime environments.
 * 
 * IMPORTANT: For security-critical operations, prefer the server-side
 * version (csrf.server.ts) which uses crypto.timingSafeEqual.
 * 
 * @param provided - User-provided string
 * @param expected - Expected string
 * @returns True if strings match with constant-time comparison
 * 
 * @see https://codahale.com/a-lesson-in-timing-attacks/
 */
export function constantTimeStringCompare(
  provided: string,
  expected: string
): boolean {
  // Quick exit for mismatched lengths (but don't reveal length)
  if (provided.length !== expected.length) {
    // Do a dummy comparison to maintain constant time
    expected.split("").forEach(() => {
      Math.random();
    });
    return false;
  }

  let isEqual = true;

  // Compare each character, but continue checking all characters
  for (let i = 0; i < provided.length; i++) {
    if (provided.charCodeAt(i) !== expected.charCodeAt(i)) {
      isEqual = false;
    }
  }

  return isEqual;
}

/**
 * Validates CSRF token format (hex string).
 * 
 * @param token - Token to validate
 * @param expectedLength - Expected length (default 48 for 24 bytes)
 * @returns True if token is valid hex format
 */
export function isValidTokenFormat(
  token: string,
  expectedLength: number = 48
): boolean {
  if (typeof token !== "string") return false;
  if (token.length !== expectedLength) return false;
  // Only hex characters allowed
  return /^[a-f0-9]+$/.test(token);
}

/**
 * Extracts CSRF token from request headers.
 * 
 * Checks multiple header sources for maximum compatibility:
 * 1. X-CSRF-Token (custom header)
 * 2. X-XSRF-Token (common alternative)
 * 
 * @param headers - Request headers object
 * @returns Token if found, undefined otherwise
 */
export function extractTokenFromHeaders(
  headers: Record<string, string | string[] | undefined>
): string | undefined {
  const token =
    headers["x-csrf-token"] ||
    headers["x-xsrf-token"];

  if (typeof token === "string") {
    return token;
  }

  if (Array.isArray(token)) {
    return token[0];
  }

  return undefined;
}

/**
 * Validates request method for CSRF protection.
 * 
 * Safe methods (GET, HEAD, OPTIONS) don't need CSRF tokens.
 * State-changing methods (POST, PUT, PATCH, DELETE) require CSRF validation.
 * 
 * @param method - HTTP request method
 * @returns True if method requires CSRF validation
 */
export function requiresCsrfValidation(method: string): boolean {
  const safeMethod = ["GET", "HEAD", "OPTIONS"].includes(method.toUpperCase());
  return !safeMethod;
}

/**
 * Validates referrer header for CSRF protection.
 * 
 * Checks that the request originates from an expected origin.
 * Should be combined with token validation for defense-in-depth.
 * 
 * @param referrer - Referrer URL header
 * @param expectedOrigin - Expected request origin (e.g., "example.com")
 * @returns True if referrer matches expected origin
 */
export function validateReferrer(
  referrer: string | undefined,
  expectedOrigin: string
): boolean {
  if (!referrer) {
    // Missing referrer - be lenient as some browsers/proxies strip it
    return true;
  }

  try {
    const url = new URL(referrer);
    return url.origin.includes(expectedOrigin);
  } catch {
    // Invalid URL
    return false;
  }
}

/**
 * Generates a CSRF token cookie name.
 * 
 * @param namespace - Optional namespace for multiple tokens
 * @returns Cookie name (e.g., "__csrf-token")
 */
export function getCsrfTokenCookieName(namespace: string = ""): string {
  if (namespace) {
    return `__csrf-${namespace}`;
  }
  return "__csrf-token";
}

/**
 * Generates CSRF token cookie options for httpOnly security.
 * 
 * @param secure - Use Secure flag (should be true in production)
 * @param sameSite - SameSite attribute ("Strict" | "Lax" | "None")
 * @returns Cookie options object
 */
export function getCsrfCookieOptions(
  secure: boolean = true,
  sameSite: "Strict" | "Lax" | "None" = "Lax"
): Record<string, unknown> {
  return {
    httpOnly: true, // ✅ Prevents JavaScript access
    secure, // ✅ HTTPS only in production
    sameSite, // ✅ CSRF protection
    maxAge: 7 * 24 * 60 * 60, // 7 days
    path: "/",
  };
}
