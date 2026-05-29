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
import { getClientIp, isRateLimited, rateLimitErrorResponse } from "@/lib/rate-limit";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// POST /api/events/:id/rsvp — Create or update RSVP
export async function POST(req: NextRequest, { params }: RouteParams) {
  try {
    const ip = getClientIp(req);
    const limitCheck = isRateLimited(ip, "rsvp", { limit: 15, windowMs: 60 * 1000 });
    if (!limitCheck.success) {
      return rateLimitErrorResponse(limitCheck.reset);
    }

    const session = await auth();
    if (!session) return unauthorizedResponse();

    const { id: eventId } = await params;
    const body = await req.json();
    const input = rsvpSchema.parse(body);

    // Verify event exists and is published
    const event = await prisma.event.findUnique({
      where: { id: eventId, isPublished: true },
      select: { id: true, capacity: true },
    });

    if (!event) return notFoundResponse("Event");

    // Check capacity if the user plans to attend
    if (event.capacity && input.status === "GOING") {
      const goingCount = await prisma.rsvp.count({
        where: { eventId, status: "GOING" },
      });

      if (goingCount >= event.capacity) {
        return new Response(
          JSON.stringify({
            success: false,
            error: "This event is at full capacity",
          }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }
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

// GET /api/events/:id/rsvp — Get RSVPs for event with pagination
export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { id: eventId } = await params;
    const { searchParams } = new URL(req.url);
    const limit = Math.min(100, parseInt(searchParams.get("limit") || "50", 10));
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const skip = (page - 1) * limit;

    const rsvps = await prisma.rsvp.findMany({
      where: { eventId },
      include: { user: { select: { name: true, image: true } } },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    });

    return successResponse(rsvps);
  } catch (error) {
    return handleApiError(error);
  }
}
