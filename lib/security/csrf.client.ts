/**
 * CSRF Token - Client-Safe API
 * 
 * ✅ SAFE FOR Client Components ("use client")
 * 
 * This module provides utilities for client-side CSRF token handling.
 * It does NOT contain any security implementation - just request submission.
 * 
 * All actual CSRF validation MUST happen on the server.
 */

/**
 * Retrieves CSRF token from the DOM.
 * 
 * Looks for CSRF token in multiple sources:
 * 1. Meta tag: <meta name="csrf-token" content="..." />
 * 2. Input field: <input type="hidden" name="_csrf" value="..." />
 * 3. Cookie: Parsed from httpOnly cookie via request header
 * 
 * @param source - Where to look for the token
 * @returns Token string or undefined
 * 
 * @example
 * const token = getCsrfToken('meta');
 * // Returns token from <meta name="csrf-token" content="..." />
 */
export function getCsrfToken(
  source: "meta" | "input" | "cookie" = "meta"
): string | undefined {
  if (typeof document === "undefined") {
    // Running in server environment (shouldn't happen with "use client")
    return undefined;
  }

  if (source === "meta") {
    const meta = document.querySelector(
      'meta[name="csrf-token"]'
    ) as HTMLMetaElement | null;
    return meta?.getAttribute("content") ?? undefined;
  }

  if (source === "input") {
    const input = document.querySelector(
      'input[name="_csrf"]'
    ) as HTMLInputElement | null;
    return input?.value ?? undefined;
  }

  // Note: Cookies are httpOnly in secure implementations,
  // so they cannot be accessed from JavaScript
  return undefined;
}

/**
 * Adds CSRF token to form data.
 * 
 * Useful when submitting forms that don't use Next.js Server Actions.
 * For Server Actions, the token is handled automatically.
 * 
 * @param formData - FormData object to modify
 * @param token - CSRF token (optional, auto-fetches if not provided)
 * @returns Same FormData object with CSRF token added
 * 
 * @example
 * const formData = new FormData(form);
 * addCsrfTokenToFormData(formData);
 * await fetch('/api/submit', { method: 'POST', body: formData });
 */
export function addCsrfTokenToFormData(
  formData: FormData,
  token?: string
): FormData {
  const csrfToken = token ?? getCsrfToken();

  if (csrfToken) {
    formData.append("_csrf", csrfToken);
  }

  return formData;
}

/**
 * Adds CSRF token to fetch request headers.
 * 
 * Useful for API calls that require CSRF protection.
 * 
 * @param headers - Headers object to modify
 * @param token - CSRF token (optional, auto-fetches if not provided)
 * @returns Same headers object with CSRF token added
 * 
 * @example
 * const headers = new Headers();
 * addCsrfTokenToHeaders(headers);
 * await fetch('/api/submit', { method: 'POST', headers });
 */
export function addCsrfTokenToHeaders(
  headers: HeadersInit = {},
  token?: string
): HeadersInit {
  const csrfToken = token ?? getCsrfToken();

  if (csrfToken) {
    if (headers instanceof Headers) {
      headers.set("X-CSRF-Token", csrfToken);
    } else if (Array.isArray(headers)) {
      headers.push(["X-CSRF-Token", csrfToken]);
    } else {
      headers["X-CSRF-Token"] = csrfToken;
    }
  }

  return headers;
}

/**
 * Creates fetch options with CSRF token for POST/PUT/PATCH/DELETE.
 * 
 * Convenience function that adds CSRF token to request headers
 * for common state-changing HTTP methods.
 * 
 * @param method - HTTP method
 * @param options - Additional fetch options
 * @param token - CSRF token (optional, auto-fetches if not provided)
 * @returns Fetch options with CSRF token and method
 * 
 * @example
 * const options = csrfFetchOptions('POST', { body: JSON.stringify(data) });
 * await fetch('/api/submit', options);
 */
export function csrfFetchOptions(
  method: "POST" | "PUT" | "PATCH" | "DELETE",
  options?: RequestInit,
  token?: string
): RequestInit {
  const csrfToken = token ?? getCsrfToken();

  return {
    ...options,
    method,
    headers: addCsrfTokenToHeaders(options?.headers, csrfToken),
  };
}

/**
 * Hook helper: Gets CSRF token with null safety.
 * 
 * Returns undefined if token is not found or in SSR environment.
 * This is safe to use in client components during initial render.
 * 
 * @returns CSRF token or undefined
 * 
 * @example
 * // In a "use client" component
 * const token = useCsrfToken();
 * // Safe to use in effects, handlers, etc.
 */
export function useCsrfToken(): string | undefined {
  if (typeof document === "undefined") {
    return undefined;
  }

  return getCsrfToken();
}

/**
 * Validates that token format is reasonable.
 * 
 * Client-side validation for early error detection.
 * This is NOT cryptographic validation - server must validate.
 * 
 * @param token - Token to validate
 * @returns True if token looks like a valid hex token
 */
export function isValidCsrfTokenFormat(token: unknown): boolean {
  if (typeof token !== "string") return false;
  if (token.length < 32 || token.length > 128) return false;
  // Basic hex validation
  return /^[a-f0-9]+$/.test(token);
}
