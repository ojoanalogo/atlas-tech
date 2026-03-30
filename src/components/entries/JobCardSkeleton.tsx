export function JobCardSkeleton() {
  return (
    <div className="bg-card border border-border rounded-lg p-4 animate-pulse">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-2">
          <div className="h-4 w-2/3 bg-elevated rounded" />
          <div className="h-3 w-1/4 bg-elevated rounded" />
          <div className="flex gap-3 mt-2">
            <div className="h-3 w-20 bg-elevated rounded" />
            <div className="h-3 w-16 bg-elevated rounded" />
            <div className="h-3 w-16 bg-elevated rounded" />
          </div>
          <div className="flex gap-1 mt-2">
            <div className="h-4 w-12 bg-elevated rounded" />
            <div className="h-4 w-14 bg-elevated rounded" />
          </div>
        </div>
        <div className="h-4 w-16 bg-elevated rounded" />
      </div>
    </div>
  )
}
