"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Calendar,
  Eye,
  FileText,
  Users,
  Plus,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

interface DashboardOverviewProps {
  stats: {
    totalEvents: number;
    publishedEvents: number;
    draftEvents: number;
    totalRsvps: number;
  };
  recentEvents: any[];
  userName: string;
}

const statCards = [
  { key: "totalEvents", label: "Total Events", icon: Calendar, color: "text-blue-500" },
  { key: "publishedEvents", label: "Published", icon: Eye, color: "text-green-500" },
  { key: "draftEvents", label: "Drafts", icon: FileText, color: "text-yellow-500" },
  { key: "totalRsvps", label: "Total RSVPs", icon: Users, color: "text-purple-500" },
] as const;

export function DashboardOverview({
  stats,
  recentEvents,
  userName,
}: DashboardOverviewProps) {
  return (
    <div className="space-y-8 max-w-5xl">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Welcome back, {userName} 👋
        </h1>
        <p className="text-muted-foreground mt-1">
          Here&apos;s what&apos;s happening with your events.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((item, i) => (
          <motion.div
            key={item.key}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {item.label}
                    </p>
                    <p className="text-2xl font-bold mt-1">
                      {stats[item.key]}
                    </p>
                  </div>
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-lg bg-muted ${item.color}`}
                  >
                    <item.icon className="h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <Button asChild>
          <Link href="/dashboard/events/new">
            <Plus className="mr-2 h-4 w-4" />
            Create Event
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/dashboard/events">
            View All Events
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      {/* Recent Events */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Recent Events</h2>
        {recentEvents.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center">
              <Calendar className="mx-auto h-10 w-10 text-muted-foreground/50 mb-3" />
              <p className="font-medium">No events yet</p>
              <p className="text-sm text-muted-foreground mt-1">
                Create your first event to get started.
              </p>
              <Button asChild className="mt-4">
                <Link href="/dashboard/events/new">Create Event</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {recentEvents.map((event: any) => (
              <Link key={event.id} href={`/dashboard/events/${event.id}/edit`}>
                <Card className="hover:border-primary/20 transition-colors">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                        <Calendar className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{event.title}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          {event.eventDate && (
                            <span className="text-xs text-muted-foreground">
                              {formatDate(event.eventDate)}
                            </span>
                          )}
                          {event.category && (
                            <Badge variant="outline" className="text-[10px] px-1.5">
                              {event.category.name}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge
                        variant={event.isPublished ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {event.isPublished ? "Published" : "Draft"}
                      </Badge>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Users className="h-3.5 w-3.5" />
                        {event._count.rsvps}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
