import type { Metadata } from 'next'
import Link from 'next/link'
import { AuthGuard } from '@/components/auth/AuthGuard'
import { MyEntries } from '@/components/dashboard/MyEntries'
import { MyJobs } from '@/components/dashboard/MyJobs'
import { Plus, Briefcase } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Dashboard',
}

export default function DashboardPage() {
  return (
    <AuthGuard>
      <section className="py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold text-primary">Dashboard</h1>
            <div className="flex gap-2">
              <Link
                href="/directorio/submit"
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-mono font-medium bg-accent text-accent-foreground rounded-md hover:bg-accent/90 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Agregar proyecto
              </Link>
              <Link
                href="/dashboard/jobs/new"
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-mono font-medium border border-border text-primary rounded-md hover:bg-elevated transition-colors"
              >
                <Briefcase className="w-3.5 h-3.5" /> Publicar empleo
              </Link>
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <h2 className="text-lg font-semibold text-primary mb-4">Mis proyectos</h2>
              <MyEntries />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-primary mb-4">Mis empleos</h2>
              <MyJobs />
            </div>
          </div>
        </div>
      </section>
    </AuthGuard>
  )
}
