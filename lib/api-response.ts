import { NextResponse } from "next/server";
import { ZodError } from "zod";

export type ApiResponse<T = any> = {
  success: boolean;
  data?: T;
  error?: string;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export function successResponse<T>(data: T, meta?: ApiResponse["meta"]): NextResponse {
  return NextResponse.json({ success: true, data, meta }, { status: 200 });
}

export function createdResponse<T>(data: T): NextResponse {
  return NextResponse.json({ success: true, data }, { status: 201 });
}

export function errorResponse(message: string, status = 400): NextResponse {
  return NextResponse.json({ success: false, error: message }, { status });
}

export function unauthorizedResponse(): NextResponse {
  return errorResponse("You must be signed in to perform this action", 401);
}

export function forbiddenResponse(): NextResponse {
  return errorResponse("You don't have permission to perform this action", 403);
}

export function notFoundResponse(resource = "Resource"): NextResponse {
  return errorResponse(`${resource} not found`, 404);
}

export function handleApiError(error: unknown): NextResponse {
  console.error("[API Error]:", error);

  if (error instanceof ZodError) {
    const message = error.errors.map((e) => e.message).join(", ");
    return errorResponse(message, 422);
  }

  // Handle known database errors safely without leaking internal database logs
  if (error && typeof error === "object" && "code" in error) {
    const code = (error as any).code;
    if (code === "P2002") {
      const targets = (error as any).meta?.target || [];
      const fields = Array.isArray(targets) ? targets.join(", ") : String(targets);
      return errorResponse(`A record with this ${fields || "value"} already exists`, 409);
    }
    if (code === "P2025") {
      return errorResponse("The requested record was not found or is unavailable", 404);
    }
  }

  if (error instanceof Error) {
    return errorResponse(error.message, 500);
  }

  return errorResponse("An unexpected error occurred", 500);
}
