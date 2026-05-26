import { auth } from "@/lib/auth";
export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { DashboardOverview } from "@/components/dashboard/overview";

export default async function DashboardPage() {
  const session = await auth();
  if (!session) redirect("/sign-in");

  const userId = session.user.id;

  const [totalEvents, publishedEvents, totalRsvps, recentEvents] =
    await Promise.all([
      prisma.event.count({ where: { organizerId: userId } }),
      prisma.event.count({
        where: { organizerId: userId, isPublished: true },
      }),
      prisma.rsvp.count({
        where: { event: { organizerId: userId } },
      }),
      prisma.event.findMany({
        where: { organizerId: userId },
        orderBy: { createdAt: "desc" },
        take: 5,
        include: {
          category: true,
          _count: { select: { rsvps: true } },
        },
      }),
    ]);

  return (
    <DashboardOverview
      stats={{
        totalEvents,
        publishedEvents,
        draftEvents: totalEvents - publishedEvents,
        totalRsvps,
      }}
      recentEvents={JSON.parse(JSON.stringify(recentEvents))}
      userName={session.user.name ?? "there"}
    />
  );
}