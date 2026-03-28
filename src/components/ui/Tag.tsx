import { cn } from '@/lib/utils'
import Link from 'next/link'

interface TagProps {
  children: React.ReactNode
  href?: string
  className?: string
}

export function Tag({ children, href, className }: TagProps) {
  const classes = cn(
    'inline-block text-2xs font-mono px-2 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/20',
    className,
  )
  if (href) return <Link href={href} className={classes}>{children}</Link>
  return <span className={classes}>{children}</span>
}
