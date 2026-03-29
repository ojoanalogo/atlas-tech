'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useSession, signOut } from '@/lib/auth-client'
import { LogOut, LayoutDashboard } from 'lucide-react'
import { useClickOutside } from '@/hooks/useClickOutside'

export function UserMenu() {
  const { data: session, isPending } = useSession()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useClickOutside(ref, useCallback(() => setOpen(false), []))

  useEffect(() => {
    if (!open) return
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open])

  if (isPending) {
    return <div className="w-8 h-8 rounded-full bg-elevated animate-pulse" />
  }

  if (!session) {
    return null
  }

  const user = session.user
  const initials = (user.name || user.email || '?').charAt(0).toUpperCase()

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-xs font-bold"
        title={user.name || user.email}
      >
        {user.image ? (
          <Image src={user.image} alt={user.name || ''} width={32} height={32} className="w-8 h-8 rounded-full object-cover" />
        ) : (
          initials
        )}
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 w-48 bg-card border border-border rounded-lg shadow-lg py-1 z-50">
          <div className="px-4 py-2 border-b border-border">
            <p className="text-xs font-mono text-primary truncate">{user.name || 'Usuario'}</p>
            <p className="text-2xs text-muted truncate">{user.email}</p>
          </div>
          <Link
            href="/dashboard"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-4 py-2 text-xs font-mono text-secondary hover:text-primary hover:bg-elevated transition-colors"
          >
            <LayoutDashboard className="w-3.5 h-3.5" /> Dashboard
          </Link>
          <button
            onClick={() => { signOut(); setOpen(false) }}
            className="flex items-center gap-2 w-full px-4 py-2 text-xs font-mono text-secondary hover:text-primary hover:bg-elevated transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" /> Cerrar sesion
          </button>
        </div>
      )}
    </div>
  )
}
