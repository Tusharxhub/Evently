export default function EventsLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-8 animate-pulse">
      {/* Title */}
      <div className="space-y-2">
        <div className="h-9 w-48 bg-muted rounded" />
        <div className="h-4 w-60 bg-muted rounded" />
      </div>

      {/* Filter bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border border-border/40 rounded-xl p-4 bg-card/50">
        <div className="h-10 w-full sm:w-72 bg-muted rounded-lg" />
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="h-8 w-20 bg-muted rounded-full" />
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div key={idx} className="rounded-xl border border-border overflow-hidden bg-card/40">
            {/* Image Placeholder */}
            <div className="h-48 w-full bg-muted" />
            <div className="p-5 space-y-4">
              <div className="space-y-2">
                <div className="h-4 w-20 bg-muted rounded-full" />
                <div className="h-6 w-3/4 bg-muted rounded" />
                <div className="h-3 w-full bg-muted rounded" />
              </div>
              <div className="flex items-center gap-2 pt-2">
                <div className="h-8 w-8 bg-muted rounded-full" />
                <div className="h-3 w-24 bg-muted rounded" />
              </div>
              <div className="flex items-center justify-between pt-2">
                <div className="h-4 w-12 bg-muted rounded" />
                <div className="h-4 w-16 bg-muted rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
