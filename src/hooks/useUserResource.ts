'use client'

import { useState, useEffect } from 'react'

export function useUserResource<T>(url: string) {
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(url)
      .then((r) => r.json())
      .then((d) => setData(d.docs ?? []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [url])

  return { data, loading }
}
