export default function AdminLoading() {
  return (
    <div className="space-y-8 max-w-6xl animate-pulse">
      {/* Header */}
      <div className="space-y-2">
        <div className="h-8 w-44 rounded bg-muted" />
        <div className="h-4 w-64 rounded bg-muted" />
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div key={idx} className="rounded-xl border border-border p-5 bg-card">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-3 w-20 bg-muted rounded" />
                <div className="h-6 w-10 bg-muted rounded" />
              </div>
              <div className="h-10 w-10 bg-muted rounded-lg" />
            </div>
          </div>
        ))}
      </div>

      {/* Admin details tables skeleton */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Panel 1 */}
        <div className="rounded-xl border border-border bg-card p-6 space-y-4">
          <div className="h-5 w-28 bg-muted rounded" />
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, idx) => (
              <div key={idx} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div className="space-y-2">
                  <div className="h-4 w-32 bg-muted rounded" />
                  <div className="h-3 w-40 bg-muted rounded" />
                </div>
                <div className="h-5 w-12 bg-muted rounded" />
              </div>
            ))}
          </div>
        </div>

        {/* Panel 2 */}
        <div className="rounded-xl border border-border bg-card p-6 space-y-4">
          <div className="h-5 w-28 bg-muted rounded" />
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, idx) => (
              <div key={idx} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div className="space-y-2">
                  <div className="h-4 w-36 bg-muted rounded" />
                  <div className="h-3 w-24 bg-muted rounded" />
                </div>
                <div className="h-5 w-12 bg-muted rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
