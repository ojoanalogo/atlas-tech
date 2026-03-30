import Link from 'next/link'
import { Plus, CreditCard, MessageCircle, ArrowRight } from 'lucide-react'
import { WHATSAPP_URL } from '@/config'

export function CombinedCtaSection() {
  return (
    <section className="py-4 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-sans font-bold text-primary uppercase">
            Pon a Sinaloa en el mapa
          </h2>
          <p className="text-sm text-secondary mt-3 max-w-xl mx-auto">
            Únete al ecosistema tech de Sinaloa. Registra tu proyecto, crea tu tarjeta digital, y conecta con la comunidad.
          </p>
        </div>

        {/* Three cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: Register */}
          <div className="bg-card border border-border rounded-xl p-6 flex flex-col">
            <div className="w-10 h-10 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center mb-4">
              <Plus className="w-5 h-5 text-accent" />
            </div>
            <h3 className="text-sm font-bold text-primary mb-2">Registra tu proyecto</h3>
            <p className="text-xs text-muted leading-relaxed flex-1">
              Ya seas startup, consultoría, comunidad o profesional tech — si estás
              construyendo desde Sinaloa, mereces ser visible.
            </p>
            <Link
              href="/directorio/submit"
              className="mt-4 inline-flex items-center gap-2 px-4 py-2.5 bg-accent text-accent-foreground font-mono font-semibold text-xs rounded-md hover:bg-accent/90 transition-colors w-fit"
            >
              Agregar proyecto
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 2: Wallet */}
          <div className="bg-gradient-to-br from-accent/5 to-card border border-accent/15 rounded-xl p-6 flex flex-col relative overflow-hidden">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-10 h-10 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-accent" />
              </div>
              <span className="text-2xs font-mono font-semibold text-accent bg-accent/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
                Nuevo
              </span>
            </div>
            <h3 className="text-sm font-bold text-primary mb-2">Tu tarjeta digital</h3>
            <p className="text-xs text-muted leading-relaxed flex-1">
              Crea tu tarjeta de presentación para Apple Wallet y Google Wallet. Comparte tu perfil tech con un tap.
            </p>

            {/* Mini card preview */}
            <div className="mt-4 mb-4 bg-card/80 border border-border rounded-lg p-3 flex items-center gap-3">
              <div className="w-9 h-12 bg-elevated border border-border rounded-md flex flex-col items-center justify-center shrink-0">
                <div className="w-4 h-4 rounded-sm bg-accent/20 mb-1" />
                <div className="w-5 h-0.5 bg-border rounded" />
                <div className="w-3.5 h-0.5 bg-border rounded mt-0.5" />
              </div>
              <div>
                <div className="text-xs font-semibold text-secondary">Tu Nombre</div>
                <div className="text-2xs text-muted font-mono">Tu título · Tu empresa</div>
              </div>
            </div>

            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-4 py-2.5 border border-accent/30 text-accent font-mono font-semibold text-xs rounded-md hover:bg-accent/10 transition-colors w-fit"
            >
              Regístrate para obtenerla
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 3: WhatsApp */}
          <div className="bg-card border border-border rounded-xl p-6 flex flex-col">
            <div className="w-10 h-10 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center mb-4">
              <MessageCircle className="w-5 h-5 text-green-600 dark:text-green-500" />
            </div>
            <h3 className="text-sm font-bold text-primary mb-2">Únete a la comunidad</h3>
            <p className="text-xs text-muted leading-relaxed flex-1">
              Comparte ideas, encuentra colaboradores y entérate de todo lo que pasa en el ecosistema tech de Sinaloa.
            </p>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 px-4 py-2.5 border border-green-500/20 text-green-600 dark:text-green-500 font-mono font-semibold text-xs rounded-md hover:bg-green-500/10 transition-colors w-fit"
            >
              Unirme al grupo
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Bottom explore link */}
        <p className="text-center text-xs text-muted mt-6">
          O{' '}
          <Link href="/directorio" className="text-secondary hover:text-primary underline">
            explora el directorio
          </Link>{' '}
          para ver quién ya está aquí.
        </p>
      </div>
    </section>
  )
}
