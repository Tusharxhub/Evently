import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { rsvpSchema } from "@/lib/validations";
import {
  successResponse,
  unauthorizedResponse,
  notFoundResponse,
  handleApiError,
} from "@/lib/api-response";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// POST /api/events/:id/rsvp — Create or update RSVP
export async function POST(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session) return unauthorizedResponse();

    const { id: eventId } = await params;
    const body = await req.json();
    const input = rsvpSchema.parse(body);

    // Verify event exists and is published
    const event = await prisma.event.findUnique({
      where: { id: eventId, isPublished: true },
      select: { id: true, capacity: true, _count: { select: { rsvps: true } } },
    });

    if (!event) return notFoundResponse("Event");

    // Check capacity
    if (
      event.capacity &&
      input.status === "GOING" &&
      event._count.rsvps >= event.capacity
    ) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "This event is at full capacity",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Upsert RSVP
    const rsvp = await prisma.rsvp.upsert({
      where: {
        eventId_userId: {
          eventId,
          userId: session.user.id,
        },
      },
      create: {
        eventId,
        userId: session.user.id,
        status: input.status,
        note: input.note || null,
      },
      update: {
        status: input.status,
        note: input.note || null,
      },
    });

    return successResponse(rsvp);
  } catch (error) {
    return handleApiError(error);
  }
}

// GET /api/events/:id/rsvp — Get RSVPs for event
export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { id: eventId } = await params;

    const rsvps = await prisma.rsvp.findMany({
      where: { eventId },
      include: { user: { select: { name: true, image: true } } },
      orderBy: { createdAt: "desc" },
    });

    return successResponse(rsvps);
  } catch (error) {
    return handleApiError(error);
  }
}
