import type { Metadata } from 'next'
import { AuthGuard } from '@/components/auth/AuthGuard'
import { ProfileForm } from './ProfileForm'

export const metadata: Metadata = {
  title: 'Mi Perfil',
  robots: { index: false },
}

export default function ProfilePage() {
  return (
    <AuthGuard>
      <section className="py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold text-primary mb-8">Mi Perfil</h1>
          <ProfileForm />
        </div>
      </section>
    </AuthGuard>
  )
}
