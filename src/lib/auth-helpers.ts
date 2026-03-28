import { auth } from './auth'
import { headers } from 'next/headers'

/**
 * Get the current better-auth session in a server context.
 * Returns null if not authenticated.
 */
export async function getServerSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })
  return session
}
