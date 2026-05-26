import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  unauthorizedResponse,
  forbiddenResponse,
  notFoundResponse,
  handleApiError,
} from "@/lib/api-response";
import { NextResponse } from "next/server";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// DELETE /api/categories/:id — Delete category (admin only)
export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session) return unauthorizedResponse();
    if ((session.user as any).role !== "ADMIN") return forbiddenResponse();

    const { id } = await params;

    const category = await prisma.category.findUnique({ where: { id } });
    if (!category) return notFoundResponse("Category");

    await prisma.category.delete({ where: { id } });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return handleApiError(error);
  }
}
