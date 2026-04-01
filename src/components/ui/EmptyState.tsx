import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  subtitle?: string
  action?: ReactNode
}

export function EmptyState({ icon: Icon, title, subtitle, action }: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-elevated border border-border mb-4">
        <Icon className="w-5 h-5 text-muted" />
      </div>
      <p className="text-sm font-medium text-primary mb-1">{title}</p>
      {subtitle && <p className="text-xs text-muted font-mono mb-4">{subtitle}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
