/**
 * Next.js Proxy Middleware - Edge Runtime Handler
 * 
 * Runs on Node.js runtime for Vercel and compatible platforms.
 * ✅ NO direct crypto module access in this file
 * ✅ Uses server-side auth for credential management
 * ✅ Lightweight middleware for protected routes
 * 
 * This replaces the deprecated middleware.ts pattern.
 * 
 * @see https://nextjs.org/docs/app/building-your-application/routing/middleware
 */

import { NextRequest, NextResponse } from "next/server";

/**
 * Detects if request is a Next.js Server Action POST.
 * Server Actions are special POST requests with Next-Action headers.
 * 
 * These should bypass middleware authentication to allow proper
 * server-side rendering and security handling.
 */
function isServerActionPost(request: NextRequest): boolean {
  if (request.method !== "POST") return false;
  
  const headers = request.headers;
  // Check both header variations for compatibility
  return Boolean(
    headers.get("Next-Action") ?? headers.get("next-action")
  );
}

/**
 * Main middleware handler for protected routes.
 * 
 * Handles authentication and routing for:
 * - /dashboard/* (authenticated user dashboard)
 * - /events/* (event management)
 * 
 * Delegates actual auth logic to server-side auth module
 * via dynamic import (only evaluated when needed).
 */
export default async function proxy(request: NextRequest): Promise<NextResponse> {
  // Skip middleware for Server Actions - they handle their own auth
  if (isServerActionPost(request)) {
    return NextResponse.next();
  }

  // For regular navigation, verify authentication
  // Uses dynamic import to keep bundle lean
  const { auth } = await import("@/lib/auth/server");
  
  return auth.middleware({
    loginUrl: "/auth/sign-in",
  })(request);
}

/**
 * Middleware configuration - which routes to protect.
 * 
 * Only processes requests matching these patterns.
 * This significantly reduces middleware execution overhead.
 */
export const config = {
  matcher: [
    // Protected routes that require authentication
    "/dashboard/:path*",
    "/events/:path*",
  ],
};


