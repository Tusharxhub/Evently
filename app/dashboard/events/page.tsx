import { auth } from "@/lib/auth";
export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Calendar, Users, Plus, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

export default async function MyEventsPage() {
  const session = await auth();
  if (!session) redirect("/sign-in");

  const events = await prisma.event.findMany({
    where: { organizerId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      category: true,
      _count: { select: { rsvps: true } },
    },
  });

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Events</h1>
          <p className="text-muted-foreground mt-1">
            Manage and organize all your events
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/events/new">
            <Plus className="mr-2 h-4 w-4" />
            Create Event
          </Link>
        </Button>
      </div>

      {events.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <Calendar className="mx-auto h-12 w-12 text-muted-foreground/40 mb-4" />
            <h3 className="text-lg font-medium">No events yet</h3>
            <p className="text-sm text-muted-foreground mt-2 max-w-sm mx-auto">
              You haven&apos;t created any events yet. Start by creating your
              first event.
            </p>
            <Button asChild className="mt-6">
              <Link href="/dashboard/events/new">
                <Plus className="mr-2 h-4 w-4" />
                Create your first event
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {events.map((event) => (
            <Link key={event.id} href={`/dashboard/events/${event.id}/edit`}>
              <Card className="hover:border-primary/20 transition-all group h-full">
                <CardContent className="p-5 space-y-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold group-hover:text-primary transition-colors truncate">
                        {event.title}
                      </h3>
                      {event.location && (
                        <p className="text-xs text-muted-foreground mt-1 truncate">
                          📍 {event.location}
                        </p>
                      )}
                    </div>
                    <Badge
                      variant={event.isPublished ? "default" : "secondary"}
                      className="text-xs shrink-0"
                    >
                      {event.isPublished ? "Published" : "Draft"}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    {event.eventDate && (
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(event.eventDate)}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {event._count.rsvps} RSVPs
                    </span>
                    {event.category && (
                      <Badge
                        variant="outline"
                        className="text-[10px] px-1.5"
                        style={{ borderColor: event.category.color + "40" }}
                      >
                        {event.category.name}
                      </Badge>
                    )}
                  </div>

                  {event.isFree ? (
                    <Badge variant="outline" className="text-xs">Free</Badge>
                  ) : (
                    <Badge variant="outline" className="text-xs">${event.price}</Badge>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
