export function NewsCardSkeleton() {
  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden animate-pulse">
      <div className="flex flex-col sm:flex-row">
        <div className="sm:w-48 h-40 sm:h-auto bg-elevated flex-shrink-0" />
        <div className="p-4 flex-1 space-y-2">
          <div className="h-3 w-24 bg-elevated rounded" />
          <div className="h-5 w-3/4 bg-elevated rounded" />
          <div className="h-3 w-full bg-elevated rounded" />
          <div className="h-3 w-2/3 bg-elevated rounded" />
        </div>
      </div>
    </div>
  )
}
