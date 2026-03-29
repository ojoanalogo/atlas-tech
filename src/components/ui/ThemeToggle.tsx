'use client'

import { useState, useEffect, useRef } from 'react'
import { useTheme } from 'next-themes'
import { Sun, Moon, Monitor, Check } from 'lucide-react'

const OPTIONS = [
  { value: 'light', label: 'Claro', Icon: Sun },
  { value: 'dark', label: 'Oscuro', Icon: Moon },
  { value: 'system', label: 'Sistema', Icon: Monitor },
] as const

export default function ThemeToggle({ className = '' }: { className?: string }) {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('click', handler, true)
    return () => document.removeEventListener('click', handler, true)
  }, [open])

  const ActiveIcon = mounted
    ? (OPTIONS.find((o) => o.value === theme)?.Icon ?? Monitor)
    : Monitor

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); setOpen((v) => !v) }}
        aria-label="Cambiar tema"
        aria-haspopup="true"
        aria-expanded={open}
        className="p-2 min-h-11 min-w-11 flex items-center justify-center text-secondary hover:text-accent transition-all duration-200 rounded-lg hover:bg-elevated"
      >
        <ActiveIcon className="w-4 h-4" />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-40 py-1 bg-card border border-border rounded-lg shadow-xl z-50">
          {OPTIONS.map(({ value, label, Icon }) => (
            <button
              key={value}
              type="button"
              onClick={() => { setTheme(value); setOpen(false) }}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-mono text-secondary hover:text-accent hover:bg-elevated transition-colors"
            >
              <Icon className="w-4 h-4" />
              {label}
              {theme === value && <Check className="w-3 h-3 ml-auto text-accent" />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
