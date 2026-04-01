import Link from 'next/link'

export function CtaSection() {
  return (
    <section className="py-4 px-4">
      <div className="max-w-3xl mx-auto text-center">
        <div className="bg-card border border-border rounded-lg p-8 md:p-12 space-y-6">
          <h2 className="text-2xl md:text-3xl font-sans font-bold text-primary uppercase">
            Pon a Sinaloa en el mapa
          </h2>
          <p className="text-secondary max-w-lg mx-auto">
            Ya seas una startup, consultoría, comunidad, empresa o profesional tech,
            si estás construyendo desde Sinaloa mereces ser visible. Únete al
            directorio y conecta con el ecosistema.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-background font-mono font-semibold text-sm rounded-lg hover:bg-primary/90 transition-colors"
            >
              Registrarme
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </Link>
            <Link
              href="/directorio"
              className="inline-flex items-center gap-2 px-6 py-3 border border-border text-primary font-mono font-semibold text-sm rounded-lg hover:border-accent/50 hover:text-accent transition-colors"
            >
              Explorar directorio
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
