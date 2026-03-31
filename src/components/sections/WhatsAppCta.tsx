import { MessageCircle } from 'lucide-react'
import { WHATSAPP_URL } from '@/config'

export function WhatsAppCta() {
  return (
    <section className="py-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-card border border-border rounded-lg p-6 md:p-8 flex flex-col md:flex-row items-center gap-4 md:gap-8">
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h3 className="text-sm font-sans font-bold text-primary uppercase">
                Únete a la conversación
              </h3>
              <p className="text-xs font-mono text-muted">
                Comunidad tech de Sinaloa en WhatsApp
              </p>
            </div>
          </div>
          <p className="text-sm text-secondary text-center md:text-left flex-1">
            Comparte ideas, encuentra colaboradores y entérate de todo lo que pasa en el ecosistema.
          </p>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 border border-accent/30 text-accent font-mono font-semibold text-xs rounded hover:bg-accent/10 transition-colors shrink-0"
          >
            <MessageCircle className="w-4 h-4" />
            Unirme al grupo
          </a>
        </div>
      </div>
    </section>
  )
}
