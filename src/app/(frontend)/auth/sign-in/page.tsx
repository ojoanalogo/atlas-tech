import type { Metadata } from 'next'
import { SignInButton } from '@/components/auth/SignInButton'

export const metadata: Metadata = {
  title: 'Iniciar sesion',
  description: 'Inicia sesion en Tech Atlas para administrar tus registros y publicar empleos.',
  robots: { index: false },
}

export default function SignInPage() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-sm mx-auto text-center">
        <h1 className="text-2xl font-bold text-primary mb-2">Iniciar sesion</h1>
        <p className="text-sm text-muted mb-8">
          Inicia sesion para administrar tus registros y publicar empleos.
        </p>
        <SignInButton />
        <p className="text-2xs text-muted mt-6">
          Al iniciar sesion, aceptas nuestros terminos de uso.
        </p>
      </div>
    </section>
  )
}
