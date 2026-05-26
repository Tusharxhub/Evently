import type { Metadata } from "next";
import { notFound } from "next/navigation";
export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { EventDetailClient } from "@/components/events/event-detail-client";

interface EventDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: EventDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = await prisma.event.findUnique({
    where: { slug },
    select: { title: true, description: true },
  });

  if (!event) return { title: "Event Not Found" };

  return {
    title: event.title,
    description: event.description ?? `Join ${event.title} on Evently`,
  };
}

export default async function EventDetailPage({
  params,
}: EventDetailPageProps) {
  const { slug } = await params;

  const event = await prisma.event.findUnique({
    where: { slug, isPublished: true },
    include: {
      category: true,
      organizer: { select: { id: true, name: true, image: true, bio: true } },
      rsvps: {
        include: {
          user: { select: { name: true, image: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 20,
      },
      _count: { select: { rsvps: true } },
    },
  });

  if (!event) notFound();

  const session = await auth();
  const userRsvp = session?.user
    ? await prisma.rsvp.findUnique({
        where: {
          eventId_userId: {
            eventId: event.id,
            userId: session.user.id,
          },
        },
      })
    : null;

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <EventDetailClient
        event={JSON.parse(JSON.stringify(event))}
        userRsvp={userRsvp ? JSON.parse(JSON.stringify(userRsvp)) : null}
        isAuthenticated={!!session}
      />
    </div>
  );
}
