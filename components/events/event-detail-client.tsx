"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  MapPin,
  Calendar as CalendarIcon,
  Clock,
  Users,
  DollarSign,
  Share2,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { formatDate, formatDateTime, formatPrice, getInitials } from "@/lib/utils";
import { toast } from "sonner";

interface EventDetailProps {
  event: any;
  userRsvp: any | null;
  isAuthenticated: boolean;
}

export function EventDetailClient({
  event,
  userRsvp,
  isAuthenticated,
}: EventDetailProps) {
  const [rsvpStatus, setRsvpStatus] = useState(userRsvp?.status ?? null);
  const [loading, setLoading] = useState(false);

  const handleRsvp = async (status: string) => {
    if (!isAuthenticated) {
      toast.error("Please sign in to RSVP");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/events/${event.id}/rsvp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) throw new Error("Failed to RSVP");

      setRsvpStatus(status);
      toast.success(
        status === "GOING"
          ? "You're going! 🎉"
          : status === "MAYBE"
          ? "Marked as maybe"
          : "RSVP updated"
      );
    } catch {
      toast.error("Failed to update RSVP");
    } finally {
      setLoading(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header Image */}
      <div className="relative h-64 sm:h-80 rounded-xl overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5 mb-8">
        {event.imageUrl ? (
          <Image
            src={event.imageUrl}
            alt={event.title}
            fill
            sizes="(max-width: 1024px) 100vw, 1024px"
            className="object-cover"
            priority
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <CalendarIcon className="h-20 w-20 text-primary/15" />
          </div>
        )}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            {event.category && (
              <Badge
                className="mb-3"
                style={{
                  backgroundColor: event.category.color + "15",
                  color: event.category.color,
                  borderColor: event.category.color + "25",
                }}
              >
                {event.category.name}
              </Badge>
            )}
            <h1 className="text-3xl font-bold tracking-tight">{event.title}</h1>
          </div>

          {/* Meta info */}
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            {event.eventDate && (
              <div className="flex items-center gap-1.5">
                <CalendarIcon className="h-4 w-4" />
                {formatDateTime(event.eventDate)}
              </div>
            )}
            {event.location && (
              <div className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4" />
                {event.location}
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <Users className="h-4 w-4" />
              {event._count.rsvps} attending
            </div>
            <div className="flex items-center gap-1.5">
              <DollarSign className="h-4 w-4" />
              {formatPrice(event.price)}
            </div>
          </div>

          <Separator />

          {/* Description */}
          <div>
            <h2 className="text-lg font-semibold mb-3">About this event</h2>
            <div className="prose prose-sm prose-invert max-w-none text-muted-foreground">
              {event.description ? (
                <p className="whitespace-pre-wrap">{event.description}</p>
              ) : (
                <p className="italic">No description provided.</p>
              )}
            </div>
          </div>

          <Separator />

          {/* Attendees preview */}
          <div>
            <h2 className="text-lg font-semibold mb-4">
              Attendees ({event._count.rsvps})
            </h2>
            {event.rsvps.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {event.rsvps.map((rsvp: any) => (
                  <div
                    key={rsvp.id}
                    className="flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5"
                  >
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={rsvp.user.image ?? undefined} />
                      <AvatarFallback className="text-[10px]">
                        {getInitials(rsvp.user.name ?? "U")}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs">{rsvp.user.name}</span>
                    <Badge variant="outline" className="text-[10px] px-1.5">
                      {rsvp.status.replace("_", " ")}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No attendees yet. Be the first!
              </p>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-card p-6 space-y-4 sticky top-24">
            <div className="text-center">
              <p className="text-2xl font-bold">{formatPrice(event.price)}</p>
              {event.capacity && (
                <p className="text-xs text-muted-foreground mt-1">
                  {event.capacity - event._count.rsvps} spots remaining
                </p>
              )}
            </div>

            {/* RSVP Buttons */}
            <div className="space-y-2">
              {(["GOING", "MAYBE", "NOT_GOING"] as const).map((status) => (
                <Button
                  key={status}
                  variant={rsvpStatus === status ? "default" : "outline"}
                  className="w-full"
                  disabled={loading}
                  onClick={() => handleRsvp(status)}
                >
                  {status === "GOING"
                    ? "🎉 Going"
                    : status === "MAYBE"
                    ? "🤔 Maybe"
                    : "😔 Not Going"}
                </Button>
              ))}
            </div>

            <Separator />

            <Button
              variant="ghost"
              size="sm"
              className="w-full"
              onClick={handleShare}
            >
              <Share2 className="mr-2 h-4 w-4" />
              Share Event
            </Button>

            {/* Organizer */}
            <div className="pt-2">
              <p className="text-xs text-muted-foreground mb-2">Organized by</p>
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={event.organizer.image ?? undefined}
                  />
                  <AvatarFallback>
                    {getInitials(event.organizer.name ?? "U")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">
                    {event.organizer.name}
                  </p>
                  {event.organizer.bio && (
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {event.organizer.bio}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
