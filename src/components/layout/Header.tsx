'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Briefcase, Menu, X, Map, CalendarDays, Plus, FolderOpen, Newspaper } from 'lucide-react'
import { motion, useScroll, useMotionValueEvent } from 'motion/react'
import ThemeToggle from '@/components/ui/ThemeToggle'
import { UserMenu } from '@/components/auth/UserMenu'
import { ENTRY_TYPE_CONFIG, ENTRY_TYPES } from '@/config'
import { ENTRY_TYPE_ICON_MAP } from '@/lib/icons'
import { useDisclosure } from '@/hooks/useDisclosure'

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const dropdown = useDisclosure()
  const pathname = usePathname()
  const { scrollY } = useScroll()
  const [scrolled, setScrolled] = useState(false)
  const [isLg, setIsLg] = useState(false)

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 50)
  })

  useEffect(() => {
    const mql = window.matchMedia('(min-width: 1024px)')
    setIsLg(mql.matches)
    const handler = (e: MediaQueryListEvent) => setIsLg(e.matches)
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  const categories = ENTRY_TYPES.map((type) => ({
    type,
    ...ENTRY_TYPE_CONFIG[type],
  }))

  return (
    <>
      <motion.header
        animate={scrolled ? "sticky" : "floating"}
        variants={{
          floating: {
            marginLeft: isLg ? 24 : 16,
            marginRight: isLg ? 24 : 16,
            top: 12,
            borderRadius: 16,
            boxShadow: "0 8px 32px rgba(0,0,0,0.15), 0 0 0 1px rgba(26,122,79,0.1)",
            backdropFilter: "blur(16px)",
            borderBottom: "1px solid transparent",
          },
          sticky: {
            marginLeft: 0,
            marginRight: 0,
            top: 0,
            borderRadius: 0,
            boxShadow: "none",
            backdropFilter: "blur(20px)",
            borderBottom: "1px solid var(--color-border)",
          },
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="sticky z-50 bg-background/80"
      >
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:bg-accent focus:text-accent-foreground focus:rounded-md focus:text-sm focus:font-mono"
        >
          Ir al contenido
        </a>
        <div className={`max-w-7xl mx-auto px-4 flex items-center justify-between transition-[height] duration-300 ${scrolled ? 'h-12' : 'h-14'}`}>
          <Link href="/" className="flex items-center gap-2 font-mono text-sm font-bold text-primary shrink-0">
            <span className="text-accent">{'>'}</span> tech_atlas
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            <div className="relative" ref={dropdown.ref}>
              <button
                onClick={dropdown.toggle}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-mono text-secondary hover:text-primary rounded-md hover:bg-elevated transition-colors"
              >
                <FolderOpen className="w-3.5 h-3.5" />
                Directorio
                <svg className={`w-3 h-3 transition-transform ${dropdown.open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {dropdown.open && (
                <div className="absolute top-full left-0 mt-1 w-56 bg-card border border-border rounded-lg shadow-lg py-1 z-50">
                  <Link href="/directorio" className="block px-4 py-2 text-xs font-mono text-secondary hover:text-primary hover:bg-elevated transition-colors">
                    Ver todo
                  </Link>
                  <div className="h-px bg-border my-1" />
                  {categories.map((cat) => (
                    <Link
                      key={cat.type}
                      href={`/${cat.slug}`}
                      className="flex items-center gap-2 px-4 py-2 text-xs font-mono text-secondary hover:text-primary hover:bg-elevated transition-colors"
                    >
                      {(() => { const Icon = ENTRY_TYPE_ICON_MAP[cat.icon]; return Icon ? <Icon className="w-4 h-4" /> : null })()}
                      {cat.labelPlural}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link href="/eventos" className="flex items-center gap-1 px-3 py-1.5 text-xs font-mono text-secondary hover:text-primary rounded-md hover:bg-elevated transition-colors">
              <CalendarDays className="w-3.5 h-3.5" />
              Eventos
            </Link>
            <Link href="/noticias" className="flex items-center gap-1 px-3 py-1.5 text-xs font-mono text-secondary hover:text-primary rounded-md hover:bg-elevated transition-colors">
              <Newspaper className="w-3.5 h-3.5" />
              Noticias
            </Link>
            <Link href="/empleos" className="flex items-center gap-1 px-3 py-1.5 text-xs font-mono text-secondary hover:text-primary rounded-md hover:bg-elevated transition-colors">
              <Briefcase className="w-3.5 h-3.5" />
              Empleos
            </Link>
            <Link href="/#map" className="flex items-center gap-1 px-3 py-1.5 text-xs font-mono text-secondary hover:text-primary rounded-md hover:bg-elevated transition-colors">
              <Map className="w-3.5 h-3.5" />
              Mapa
            </Link>
            <ThemeToggle />
            <UserMenu />
            <Link
              href="/directorio/submit"
              className="ml-2 flex items-center gap-1 px-3 py-1.5 text-xs font-mono font-medium bg-accent text-accent-foreground rounded-md hover:bg-accent/90 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Agregar
            </Link>
          </nav>

          <div className="flex lg:hidden items-center gap-2">
            <ThemeToggle />
            <UserMenu />
            <button onClick={() => setMobileOpen(!mobileOpen)} className="relative p-2 text-secondary hover:text-primary w-9 h-9 flex items-center justify-center">
              <Menu className={`w-5 h-5 absolute transition-all duration-300 ${mobileOpen ? 'opacity-0 rotate-90 scale-75' : 'opacity-100 rotate-0 scale-100'}`} />
              <X className={`w-5 h-5 absolute transition-all duration-300 ${mobileOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-75'}`} />
            </button>
          </div>
        </div>
      </motion.header>

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Menú de navegación"
        className={`lg:hidden fixed inset-0 z-[100] bg-background flex flex-col transition-all duration-300 ${
          mobileOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        <div className="flex items-center justify-between px-8 py-6">
          <Link href="/" className="flex items-center gap-2 font-mono text-sm font-bold text-primary">
            <span className="text-accent">{'>'}</span> tech_atlas
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            className="p-2 min-h-11 min-w-11 flex items-center justify-center text-secondary hover:text-accent transition-colors"
            aria-label="Cerrar menú"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 flex flex-col justify-center px-8 space-y-2 uppercase">
          <Link href="/directorio" className="flex items-center gap-2 py-3 text-lg font-mono font-semibold text-primary hover:text-accent transition-colors">
            <FolderOpen className="w-5 h-5" />
            Directorio
          </Link>
          <div className="pl-4 space-y-1 border-l-2 border-border">
            {categories.map((cat) => (
              <Link
                key={cat.type}
                href={`/${cat.slug}`}
                className="flex items-center gap-2 py-2 text-sm font-mono text-secondary hover:text-accent transition-colors"
              >
                {(() => { const Icon = ENTRY_TYPE_ICON_MAP[cat.icon]; return Icon ? <Icon className="w-4 h-4" /> : null })()}
                {cat.labelPlural}
              </Link>
            ))}
          </div>

          <Link href="/eventos" className="flex items-center gap-2 py-3 text-lg font-mono font-semibold text-primary hover:text-accent transition-colors">
            <CalendarDays className="w-5 h-5" />
            Eventos
          </Link>
          <Link href="/noticias" className="flex items-center gap-2 py-3 text-lg font-mono font-semibold text-primary hover:text-accent transition-colors">
            <Newspaper className="w-5 h-5" />
            Noticias
          </Link>
          <Link href="/empleos" className="flex items-center gap-2 py-3 text-lg font-mono font-semibold text-primary hover:text-accent transition-colors">
            <Briefcase className="w-5 h-5" />
            Empleos
          </Link>
          <Link href="/#map" className="flex items-center gap-2 py-3 text-lg font-mono font-semibold text-primary hover:text-accent transition-colors">
            <Map className="w-5 h-5" />
            Mapa
          </Link>

          <div className="pt-4">
            <Link
              href="/directorio/submit"
              className="inline-flex items-center gap-2 px-5 py-3 bg-accent text-accent-foreground font-mono font-bold text-sm rounded hover:bg-accent/90 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Agregar proyecto
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
