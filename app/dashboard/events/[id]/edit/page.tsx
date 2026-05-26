import type { Metadata } from "next";
import { auth } from "@/lib/auth";
export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import { EventForm } from "@/components/dashboard/event-form";

export const metadata: Metadata = {
  title: "Edit Event",
};

interface EditEventPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditEventPage({ params }: EditEventPageProps) {
  const session = await auth();
  if (!session) redirect("/sign-in");

  const { id } = await params;

  const [event, categories] = await Promise.all([
    prisma.event.findFirst({
      where: { id, organizerId: session.user.id },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!event) notFound();

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Edit Event</h1>
        <p className="text-muted-foreground mt-1">
          Update the details for your event.
        </p>
      </div>

      <EventForm
        event={JSON.parse(JSON.stringify(event))}
        categories={JSON.parse(JSON.stringify(categories))}
      />
    </div>
  );
}
