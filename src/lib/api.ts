export interface PaginatedResponse<T> {
  docs: T[]
  totalDocs: number
  totalPages: number
  page: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export async function fetchPaginated<T>(
  endpoint: string,
  params?: Record<string, string>,
): Promise<PaginatedResponse<T>> {
  const url = new URL(endpoint, window.location.origin)
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value) url.searchParams.set(key, value)
    }
  }
  const res = await fetch(url.toString())
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json()
}
