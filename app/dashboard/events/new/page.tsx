import type { Metadata } from "next";
import { auth } from "@/lib/auth";
export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { EventForm } from "@/components/dashboard/event-form";

export const metadata: Metadata = {
  title: "Create Event",
};

export default async function CreateEventPage() {
  const session = await auth();
  if (!session) redirect("/sign-in");

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Create Event</h1>
        <p className="text-muted-foreground mt-1">
          Fill in the details for your new event.
        </p>
      </div>

      <EventForm categories={JSON.parse(JSON.stringify(categories))} />
    </div>
  );
}
