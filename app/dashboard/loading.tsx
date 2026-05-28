export default function DashboardLoading() {
  return (
    <div className="space-y-8 max-w-5xl animate-pulse">
      {/* Header Skeleton */}
      <div className="space-y-2">
        <div className="h-8 w-48 rounded bg-muted" />
        <div className="h-4 w-72 rounded bg-muted" />
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div key={idx} className="rounded-xl border border-border p-5 bg-card">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-3 w-16 bg-muted rounded" />
                <div className="h-7 w-12 bg-muted rounded" />
              </div>
              <div className="h-10 w-10 bg-muted rounded-lg" />
            </div>
          </div>
        ))}
      </div>

      {/* Section Header */}
      <div className="space-y-4">
        <div className="h-5 w-32 bg-muted rounded" />
        {/* Recent Activity / Cards Skeleton Grid */}
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="rounded-xl border border-border p-5 space-y-4 bg-card">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 space-y-2">
                  <div className="h-5 w-3/4 bg-muted rounded" />
                  <div className="h-3 w-1/2 bg-muted rounded" />
                </div>
                <div className="h-5 w-16 bg-muted rounded-full" />
              </div>
              <div className="flex items-center gap-3">
                <div className="h-3 w-24 bg-muted rounded" />
                <div className="h-3 w-16 bg-muted rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
