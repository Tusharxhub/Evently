import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signUpSchema } from "@/lib/validations";
import { errorResponse, createdResponse, handleApiError } from "@/lib/api-response";
import { getClientIp, isRateLimited, rateLimitErrorResponse } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const limitCheck = isRateLimited(ip, "register", { limit: 5, windowMs: 60 * 1000 });
    if (!limitCheck.success) {
      return rateLimitErrorResponse(limitCheck.reset);
    }

    const body = await req.json();
    const input = signUpSchema.parse(body);

    const existing = await prisma.user.findUnique({
      where: { email: input.email },
    });

    if (existing) {
      return errorResponse("An account with this email already exists", 409);
    }

    const hashedPassword = await bcrypt.hash(input.password, 10);

    const user = await prisma.user.create({
      data: {
        name: input.name,
        email: input.email,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    return createdResponse(user);
  } catch (error) {
    return handleApiError(error);
  }
}
