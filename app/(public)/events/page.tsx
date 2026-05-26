import type { Metadata } from "next";
export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { EventsGrid } from "@/components/events/events-grid";
import { EventsFilter } from "@/components/events/events-filter";

export const metadata: Metadata = {
  title: "Browse Events",
  description: "Discover upcoming events near you. From tech conferences to music festivals.",
};

interface EventsPageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
    sort?: string;
    page?: string;
  }>;
}

export default async function EventsPage({ searchParams }: EventsPageProps) {
  const params = await searchParams;
  const page = parseInt(params.page ?? "1");
  const limit = 12;
  const skip = (page - 1) * limit;

  const where: any = {
    isPublished: true,
  };

  if (params.search) {
    where.OR = [
      { title: { contains: params.search, mode: "insensitive" } },
      { description: { contains: params.search, mode: "insensitive" } },
      { location: { contains: params.search, mode: "insensitive" } },
    ];
  }

  if (params.category) {
    where.category = { slug: params.category };
  }

  let orderBy: any = { createdAt: "desc" };
  if (params.sort === "oldest") orderBy = { createdAt: "asc" };
  if (params.sort === "price-low") orderBy = { price: "asc" };
  if (params.sort === "price-high") orderBy = { price: "desc" };

  const [events, total, categories] = await Promise.all([
    prisma.event.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: {
        category: true,
        organizer: { select: { name: true, image: true } },
        _count: { select: { rsvps: true } },
      },
    }),
    prisma.event.count({ where }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Browse Events</h1>
        <p className="mt-2 text-muted-foreground">
          Discover {total} upcoming events
        </p>
      </div>

      <EventsFilter categories={categories} />

      <EventsGrid
        events={events as any}
        currentPage={page}
        totalPages={totalPages}
      />
    </div>
  );
}
