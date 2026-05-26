import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updateProfileSchema } from "@/lib/validations";
import {
  successResponse,
  unauthorizedResponse,
  handleApiError,
} from "@/lib/api-response";

// PATCH /api/users/profile — Update current user profile
export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) return unauthorizedResponse();

    const body = await req.json();
    const input = updateProfileSchema.parse(body);

    const updated = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        ...(input.name !== undefined && { name: input.name }),
        ...(input.bio !== undefined && { bio: input.bio }),
        ...(input.image !== undefined && { image: input.image || null }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        bio: true,
        role: true,
      },
    });

    return successResponse(updated);
  } catch (error) {
    return handleApiError(error);
  }
}
