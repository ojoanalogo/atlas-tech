import Link from 'next/link'
import { Fragment } from 'react'

interface BreadcrumbItem {
  label: string
  href?: string
}

export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav className="text-xs font-mono text-muted mb-6 uppercase">
      {items.map((item, i) => (
        <Fragment key={i}>
          {i > 0 && <span className="mx-2">/</span>}
          {item.href ? (
            <Link href={item.href} className="hover:text-accent transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-primary">{item.label}</span>
          )}
        </Fragment>
      ))}
    </nav>
  )
}
