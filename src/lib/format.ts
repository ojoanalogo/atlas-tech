/**
 * Format an ISO date string to Spanish locale (es-MX).
 */
export function formatDateEs(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

/**
 * Extract URL from a Payload media/upload field (which can be `number | { url: string } | null`).
 */
export function extractImageUrl(field: unknown): string | null {
  if (typeof field === 'object' && field !== null && 'url' in field) {
    return (field as { url: string }).url
  }
  return null
}
