import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updateEventSchema } from "@/lib/validations";
import {
  successResponse,
  unauthorizedResponse,
  forbiddenResponse,
  notFoundResponse,
  handleApiError,
} from "@/lib/api-response";
import { NextResponse } from "next/server";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/events/:id — Get single event
export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        category: true,
        organizer: { select: { id: true, name: true, image: true } },
        rsvps: {
          take: 20, // Limit preview list size to avoid massive DB load and response payloads
          include: { user: { select: { name: true, image: true } } },
          orderBy: { createdAt: "desc" },
        },
        _count: { select: { rsvps: true } },
      },
    });

    if (!event) return notFoundResponse("Event");

    return successResponse(event);
  } catch (error) {
    return handleApiError(error);
  }
}

// PATCH /api/events/:id — Update event
export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session) return unauthorizedResponse();

    const { id } = await params;

    const event = await prisma.event.findUnique({
      where: { id },
      select: { organizerId: true },
    });

    if (!event) return notFoundResponse("Event");
    if (event.organizerId !== session.user.id) return forbiddenResponse();

    const body = await req.json();
    const input = updateEventSchema.parse(body);

    const updated = await prisma.event.update({
      where: { id },
      data: {
        ...(input.title !== undefined && { title: input.title }),
        ...(input.description !== undefined && {
          description: input.description || null,
        }),
        ...(input.location !== undefined && {
          location: input.location || null,
        }),
        ...(input.venue !== undefined && { venue: input.venue || null }),
        ...(input.imageUrl !== undefined && {
          imageUrl: input.imageUrl || null,
        }),
        ...(input.eventDate !== undefined && {
          eventDate: input.eventDate ? new Date(input.eventDate) : null,
        }),
        ...(input.endDate !== undefined && {
          endDate: input.endDate ? new Date(input.endDate) : null,
        }),
        ...(input.capacity !== undefined && {
          capacity: input.capacity || null,
        }),
        ...(input.isFree !== undefined && { isFree: input.isFree }),
        ...(input.price !== undefined && {
          price: input.isFree ? 0 : input.price,
        }),
        ...(input.isPublished !== undefined && {
          isPublished: input.isPublished,
        }),
        ...(input.categoryId !== undefined && {
          categoryId: input.categoryId || null,
        }),
      },
    });

    return successResponse(updated);
  } catch (error) {
    return handleApiError(error);
  }
}

// DELETE /api/events/:id — Delete event
export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session) return unauthorizedResponse();

    const { id } = await params;

    const event = await prisma.event.findUnique({
      where: { id },
      select: { organizerId: true },
    });

    if (!event) return notFoundResponse("Event");

    // Allow owner or admin
    const isAdmin = (session.user as any).role === "ADMIN";
    if (event.organizerId !== session.user.id && !isAdmin) {
      return forbiddenResponse();
    }

    await prisma.event.delete({ where: { id } });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return handleApiError(error);
  }
}
