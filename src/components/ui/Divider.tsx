import { cn } from '@/lib/utils'

interface DividerProps {
  orientation?: 'horizontal' | 'vertical'
  subtle?: boolean
  className?: string
}

export function Divider({ orientation = 'horizontal', subtle = true, className }: DividerProps) {
  return (
    <div className={cn(
      subtle ? 'bg-border/50' : 'bg-border',
      orientation === 'horizontal' ? 'h-px w-full' : 'w-px h-full',
      className,
    )} />
  )
}
