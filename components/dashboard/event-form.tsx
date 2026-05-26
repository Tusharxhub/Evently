"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { createEventSchema, type CreateEventInput } from "@/lib/validations";
import { toast } from "sonner";

interface EventFormProps {
  event?: any;
  categories: { id: string; name: string; slug: string; color: string }[];
}

export function EventForm({ event, categories }: EventFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const isEditing = !!event;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateEventInput>({
    resolver: zodResolver(createEventSchema),
    defaultValues: event
      ? {
          title: event.title,
          description: event.description ?? "",
          location: event.location ?? "",
          venue: event.venue ?? "",
          imageUrl: event.imageUrl ?? "",
          eventDate: event.eventDate
            ? new Date(event.eventDate).toISOString().slice(0, 16)
            : "",
          endDate: event.endDate
            ? new Date(event.endDate).toISOString().slice(0, 16)
            : "",
          capacity: event.capacity ?? undefined,
          price: event.price ?? 0,
          isFree: event.isFree ?? true,
          isPublished: event.isPublished ?? false,
          categoryId: event.categoryId ?? "",
        }
      : {
          isFree: true,
          isPublished: false,
          price: 0,
        },
  });

  const isFree = watch("isFree");
  const isPublished = watch("isPublished");

  const onSubmit = async (data: CreateEventInput) => {
    setIsLoading(true);
    try {
      const url = isEditing
        ? `/api/events/${event.id}`
        : "/api/events";

      const res = await fetch(url, {
        method: isEditing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        toast.error(result.error ?? "Failed to save event");
        return;
      }

      toast.success(isEditing ? "Event updated!" : "Event created!");
      router.push("/dashboard/events");
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this event?")) return;

    setIsLoading(true);
    try {
      const res = await fetch(`/api/events/${event.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        toast.error("Failed to delete event");
        return;
      }

      toast.success("Event deleted");
      router.push("/dashboard/events");
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Event Title *</Label>
            <Input
              id="title"
              placeholder="e.g. React Summit 2025"
              {...register("title")}
            />
            {errors.title && (
              <p className="text-xs text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Tell people what your event is about..."
              rows={5}
              {...register("description")}
            />
            {errors.description && (
              <p className="text-xs text-destructive">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="categoryId">Category</Label>
            <select
              id="categoryId"
              {...register("categoryId")}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input
              id="imageUrl"
              placeholder="https://example.com/image.jpg"
              {...register("imageUrl")}
            />
          </div>
        </CardContent>
      </Card>

      {/* Date & Location */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Date & Location</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="eventDate">Start Date</Label>
              <Input
                id="eventDate"
                type="datetime-local"
                {...register("eventDate")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="datetime-local"
                {...register("endDate")}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="e.g. San Francisco, CA"
                {...register("location")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="venue">Venue</Label>
              <Input
                id="venue"
                placeholder="e.g. Moscone Center"
                {...register("venue")}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Capacity & Pricing */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Capacity & Pricing</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="capacity">Max Capacity</Label>
            <Input
              id="capacity"
              type="number"
              placeholder="Leave empty for unlimited"
              {...register("capacity")}
            />
          </div>

          <div className="flex items-center gap-3">
            <Switch
              id="isFree"
              checked={isFree}
              onCheckedChange={(checked) => {
                setValue("isFree", checked);
                if (checked) setValue("price", 0);
              }}
            />
            <Label htmlFor="isFree">This is a free event</Label>
          </div>

          {!isFree && (
            <div className="space-y-2">
              <Label htmlFor="price">Price ($)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                placeholder="0.00"
                {...register("price")}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Publish */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">Publish Event</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Make this event visible to the public
              </p>
            </div>
            <Switch
              id="isPublished"
              checked={isPublished}
              onCheckedChange={(checked) => setValue("isPublished", checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEditing ? "Update Event" : "Create Event"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
        >
          Cancel
        </Button>
        {isEditing && (
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isLoading}
            className="ml-auto"
          >
            Delete Event
          </Button>
        )}
      </div>
    </form>
  );
}
