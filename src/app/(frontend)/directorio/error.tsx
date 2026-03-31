'use client'

import { ErrorFallback } from '@/components/ui/ErrorFallback'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <ErrorFallback
      error={error}
      reset={reset}
      title="Error al cargar"
      message="No pudimos cargar el directorio."
    />
  )
}
