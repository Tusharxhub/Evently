/**
 * CSRF & Token Generation - Node.js Server Runtime Only
 * 
 * ⚠️ IMPORTANT: This file uses Node.js `crypto` module.
 * It MUST ONLY be imported in:
 * - Server Actions ("use server" files)
 * - API route handlers
 * - Server components
 * 
 * NEVER import in:
 * - Client components ("use client" files)
 * - Hooks used by client components
 * - proxy.ts or Edge middleware
 * 
 * @see https://nextjs.org/docs/app/building-your-application/rendering/server-components
 */

import { randomBytes } from "crypto";

/**
 * Generates a cryptographically secure random token.
 * Uses 32 bytes (256 bits) for production-grade security.
 * 
 * @returns Base64-encoded random token
 * @example
 * const token = generateSecureToken();
 * // "a1b2c3d4e5f6g7h8..."
 */
export function generateSecureToken(): string {
  return randomBytes(32).toString("hex");
}

/**
 * Generates a URL-safe invite token.
 * Suitable for use in public URLs without encoding.
 * 
 * @returns URL-safe hex token (no special characters)
 * @example
 * const inviteToken = generateInviteToken();
 * // "abc123def456..."
 */
export function generateInviteToken(): string {
  // Using hex format for URL safety (no special chars, no padding)
  return randomBytes(24).toString("hex");
}

/**
 * Generates a UUID v4 as string without hyphens.
 * Useful for event invite tokens.
 * 
 * @returns UUID v4 without hyphens
 * @example
 * const uuid = generateUuid();
 * // "550e8400e29b41d4a716446655440000"
 */
export function generateUuid(): string {
  // Node.js crypto.randomUUID() generates cryptographically secure UUIDs
  return require("crypto").randomUUID().replace(/-/g, "");
}

/**
 * Timing-safe token comparison to prevent timing attacks.
 * 
 * NOTE: Only available in Node.js runtime.
 * For Edge Runtime, use constant-time string comparison instead.
 * 
 * @param provided - User-provided token
 * @param expected - Expected token from database
 * @returns True if tokens match (timing-safe)
 */
export function timingSafeTokenCompare(provided: string, expected: string): boolean {
  if (typeof provided !== "string" || typeof expected !== "string") {
    return false;
  }
  
  if (provided.length !== expected.length) {
    return false;
  }
  
  // Node.js crypto.timingSafeEqual is only available in server runtime
  const { timingSafeEqual } = require("crypto");
  
  try {
    return timingSafeEqual(
      Buffer.from(provided, "utf8"),
      Buffer.from(expected, "utf8")
    );
  } catch {
    return false;
  }
}

/**
 * Validates token format (hex string of expected length).
 * Lightweight validation before database lookup.
 * 
 * @param token - Token to validate
 * @param expectedLength - Expected token length in characters
 * @returns True if token format is valid
 */
export function isValidTokenFormat(
  token: string,
  expectedLength: number = 48 // 24 bytes * 2 hex chars
): boolean {
  if (typeof token !== "string") return false;
  if (token.length !== expectedLength) return false;
  // Hex string: only 0-9, a-f
  return /^[a-f0-9]+$/.test(token);
}
