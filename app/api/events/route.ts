import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createEventSchema, paginationSchema } from "@/lib/validations";
import {
  successResponse,
  createdResponse,
  unauthorizedResponse,
  handleApiError,
} from "@/lib/api-response";
import { generateSlug } from "@/lib/utils";

// GET /api/events — List events with pagination, search, filters
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const params = paginationSchema.parse({
      page: searchParams.get("page") ?? 1,
      limit: searchParams.get("limit") ?? 12,
      search: searchParams.get("search") ?? undefined,
      category: searchParams.get("category") ?? undefined,
      sort: searchParams.get("sort") ?? "newest",
    });

    const where: any = { isPublished: true };

    if (params.search) {
      where.OR = [
        { title: { contains: params.search, mode: "insensitive" } },
        { description: { contains: params.search, mode: "insensitive" } },
      ];
    }

    if (params.category) {
      where.category = { slug: params.category };
    }

    let orderBy: any = { createdAt: "desc" };
    if (params.sort === "oldest") orderBy = { createdAt: "asc" };
    if (params.sort === "price-low") orderBy = { price: "asc" };
    if (params.sort === "price-high") orderBy = { price: "desc" };
    if (params.sort === "popular") orderBy = { rsvps: { _count: "desc" } };

    const skip = (params.page - 1) * params.limit;

    const [events, total] = await Promise.all([
      prisma.event.findMany({
        where,
        orderBy,
        skip,
        take: params.limit,
        include: {
          category: true,
          organizer: { select: { name: true, image: true } },
          _count: { select: { rsvps: true } },
        },
      }),
      prisma.event.count({ where }),
    ]);

    return successResponse(events, {
      page: params.page,
      limit: params.limit,
      total,
      totalPages: Math.ceil(total / params.limit),
    });
  } catch (error) {
    return handleApiError(error);
  }
}

// POST /api/events — Create event
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) return unauthorizedResponse();

    const body = await req.json();
    const input = createEventSchema.parse(body);

    const slug = generateSlug(input.title);

    const event = await prisma.event.create({
      data: {
        title: input.title,
        slug,
        description: input.description || null,
        location: input.location || null,
        venue: input.venue || null,
        imageUrl: input.imageUrl || null,
        eventDate: input.eventDate ? new Date(input.eventDate) : null,
        endDate: input.endDate ? new Date(input.endDate) : null,
        capacity: input.capacity || null,
        price: input.isFree ? 0 : input.price,
        isFree: input.isFree,
        isPublished: input.isPublished,
        categoryId: input.categoryId || null,
        organizerId: session.user.id,
      },
    });

    return createdResponse(event);
  } catch (error) {
    return handleApiError(error);
  }
}
