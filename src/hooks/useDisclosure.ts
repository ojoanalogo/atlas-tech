'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { useClickOutside } from './useClickOutside'

export function useDisclosure() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const close = useCallback(() => setOpen(false), [])
  const toggle = useCallback(() => setOpen((v) => !v), [])

  useClickOutside(ref, close)

  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open])

  return { open, setOpen, ref, close, toggle }
}
