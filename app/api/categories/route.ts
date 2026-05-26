import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { categorySchema } from "@/lib/validations";
import {
  successResponse,
  createdResponse,
  unauthorizedResponse,
  forbiddenResponse,
  handleApiError,
} from "@/lib/api-response";

// GET /api/categories — List all categories
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
      include: { _count: { select: { events: true } } },
    });

    return successResponse(categories);
  } catch (error) {
    return handleApiError(error);
  }
}

// POST /api/categories — Create category (admin only)
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) return unauthorizedResponse();
    if ((session.user as any).role !== "ADMIN") return forbiddenResponse();

    const body = await req.json();
    const input = categorySchema.parse(body);

    const slug = input.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    const category = await prisma.category.create({
      data: {
        name: input.name,
        slug,
        description: input.description || null,
        color: input.color,
      },
    });

    return createdResponse(category);
  } catch (error) {
    return handleApiError(error);
  }
}
