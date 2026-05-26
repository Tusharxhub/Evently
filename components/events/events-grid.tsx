"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  MapPin,
  Calendar as CalendarIcon,
  Users,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDate, formatPrice, getInitials } from "@/lib/utils";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

interface EventItem {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  location: string | null;
  imageUrl: string | null;
  eventDate: string | null;
  price: number;
  isFree: boolean;
  category: { name: string; slug: string; color: string } | null;
  organizer: { name: string | null; image: string | null };
  _count: { rsvps: number };
}

export function EventsGrid({
  events,
  currentPage,
  totalPages,
}: {
  events: EventItem[];
  currentPage: number;
  totalPages: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const changePage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  if (events.length === 0) {
    return (
      <div className="py-20 text-center">
        <CalendarIcon className="mx-auto h-12 w-12 text-muted-foreground/50" />
        <h3 className="mt-4 text-lg font-medium">No events found</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Try adjusting your search or filters.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {events.map((event, i) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Link href={`/events/${event.slug}`}>
              <Card className="group overflow-hidden transition-all hover:border-primary/20 hover:shadow-md">
                {/* Image placeholder */}
                <div className="relative h-48 bg-gradient-to-br from-primary/10 to-primary/5">
                  {event.imageUrl ? (
                    <img
                      src={event.imageUrl}
                      alt={event.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <CalendarIcon className="h-12 w-12 text-primary/20" />
                    </div>
                  )}
                  {event.category && (
                    <Badge
                      className="absolute top-3 left-3 text-xs"
                      style={{
                        backgroundColor: event.category.color + "20",
                        color: event.category.color,
                        borderColor: event.category.color + "30",
                      }}
                    >
                      {event.category.name}
                    </Badge>
                  )}
                  <Badge
                    variant={event.isFree ? "secondary" : "default"}
                    className="absolute top-3 right-3 text-xs"
                  >
                    {formatPrice(event.price)}
                  </Badge>
                </div>

                <CardContent className="p-5">
                  <h3 className="font-semibold group-hover:text-primary transition-colors line-clamp-1">
                    {event.title}
                  </h3>

                  {event.description && (
                    <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2">
                      {event.description}
                    </p>
                  )}

                  <div className="mt-4 flex flex-col gap-2 text-xs text-muted-foreground">
                    {event.eventDate && (
                      <div className="flex items-center gap-1.5">
                        <CalendarIcon className="h-3.5 w-3.5" />
                        {formatDate(event.eventDate)}
                      </div>
                    )}
                    {event.location && (
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5" />
                        <span className="line-clamp-1">{event.location}</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage
                          src={event.organizer.image ?? undefined}
                        />
                        <AvatarFallback className="text-[10px]">
                          {getInitials(event.organizer.name ?? "U")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs text-muted-foreground">
                        {event.organizer.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Users className="h-3.5 w-3.5" />
                      {event._count.rsvps}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage <= 1}
            onClick={() => changePage(currentPage - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground px-3">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage >= totalPages}
            onClick={() => changePage(currentPage + 1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </>
  );
}
