'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Rocket, Users, Briefcase, User, Menu, X, Map, CalendarDays, Plus } from 'lucide-react'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { ENTRY_TYPE_CONFIG, ENTRY_TYPES } from '@/config'

const iconMap: Record<string, React.ReactNode> = {
  rocket: <Rocket className="w-4 h-4" />,
  users: <Users className="w-4 h-4" />,
  briefcase: <Briefcase className="w-4 h-4" />,
  user: <User className="w-4 h-4" />,
}

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  const categories = ENTRY_TYPES.map((type) => ({
    type,
    ...ENTRY_TYPE_CONFIG[type],
  }))

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-mono text-sm font-bold text-primary">
          <span className="text-accent">{'>'}</span> tech_atlas
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-mono text-secondary hover:text-primary rounded-md hover:bg-elevated transition-colors"
            >
              Directorio
              <svg className={`w-3 h-3 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {dropdownOpen && (
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
                    {iconMap[cat.icon]}
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
            Noticias
          </Link>
          <Link href="/empleos" className="flex items-center gap-1 px-3 py-1.5 text-xs font-mono text-secondary hover:text-primary rounded-md hover:bg-elevated transition-colors">
            Empleos
          </Link>
          <Link href="/#map" className="flex items-center gap-1 px-3 py-1.5 text-xs font-mono text-secondary hover:text-primary rounded-md hover:bg-elevated transition-colors">
            <Map className="w-3.5 h-3.5" />
            Mapa
          </Link>
          <ThemeToggle />
          <Link
            href="/directorio/submit"
            className="ml-2 flex items-center gap-1 px-3 py-1.5 text-xs font-mono font-medium bg-accent text-accent-foreground rounded-md hover:bg-accent/90 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Agregar
          </Link>
        </nav>

        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 text-secondary hover:text-primary">
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden fixed inset-0 top-14 bg-background z-40 overflow-y-auto">
          <nav className="px-4 py-6 space-y-1">
            <Link href="/directorio" className="block px-4 py-3 text-sm font-mono text-secondary hover:text-primary rounded-md hover:bg-elevated">Directorio</Link>
            {categories.map((cat) => (
              <Link key={cat.type} href={`/${cat.slug}`} className="flex items-center gap-2 px-4 py-3 text-sm font-mono text-secondary hover:text-primary rounded-md hover:bg-elevated ml-2">
                {iconMap[cat.icon]}
                {cat.labelPlural}
              </Link>
            ))}
            <div className="h-px bg-border my-2" />
            <Link href="/eventos" className="block px-4 py-3 text-sm font-mono text-secondary hover:text-primary rounded-md hover:bg-elevated">Eventos</Link>
            <Link href="/noticias" className="block px-4 py-3 text-sm font-mono text-secondary hover:text-primary rounded-md hover:bg-elevated">Noticias</Link>
            <Link href="/empleos" className="block px-4 py-3 text-sm font-mono text-secondary hover:text-primary rounded-md hover:bg-elevated">Empleos</Link>
            <Link href="/#map" className="block px-4 py-3 text-sm font-mono text-secondary hover:text-primary rounded-md hover:bg-elevated">Mapa</Link>
            <div className="h-px bg-border my-2" />
            <Link href="/directorio/submit" className="flex items-center justify-center gap-2 mx-4 py-3 text-sm font-mono font-medium bg-accent text-accent-foreground rounded-md">
              <Plus className="w-4 h-4" />
              Agregar proyecto
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
