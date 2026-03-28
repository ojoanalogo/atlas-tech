import { cn } from '@/lib/utils'

interface CardProps {
  children: React.ReactNode
  className?: string
  as?: keyof React.JSX.IntrinsicElements
}

export function Card({ children, className, as: Tag = 'div' }: CardProps) {
  return (
    <Tag className={cn('bg-card/90 backdrop-blur-sm border border-border rounded-lg p-6', className)}>
      {children}
    </Tag>
  )
}
