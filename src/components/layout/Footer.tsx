import Link from 'next/link'
import { ENTRY_TYPE_CONFIG, ENTRY_TYPES, SOCIAL_LINKS } from '@/config'
import { Github } from 'lucide-react'

export function Footer() {
  const categories = ENTRY_TYPES.map((type) => ({ type, ...ENTRY_TYPE_CONFIG[type] }))

  return (
    <footer className="border-t border-border mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <p className="font-mono text-sm font-bold text-primary mb-2">
              <span className="text-accent">{'>'}</span> tech_atlas
            </p>
            <p className="text-xs text-muted leading-relaxed">
              Directorio abierto del ecosistema tecnológico de Sinaloa. Código abierto, hecho con cariño desde Sinaloa.
            </p>
            {SOCIAL_LINKS.map((link) => (
              <a key={link.platform} href={link.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-muted hover:text-accent mt-3 font-mono">
                <Github className="w-3.5 h-3.5" />{link.label}
              </a>
            ))}
          </div>
          <div>
            <p className="text-xs font-mono uppercase text-muted mb-3 tracking-wider">Directorio</p>
            <ul className="space-y-2">
              {categories.map((cat) => (
                <li key={cat.type}><Link href={`/${cat.slug}`} className="text-xs text-secondary hover:text-accent transition-colors font-mono">{cat.labelPlural}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-mono uppercase text-muted mb-3 tracking-wider">Recursos</p>
            <ul className="space-y-2">
              <li><Link href="/directorio" className="text-xs text-secondary hover:text-accent transition-colors font-mono">Explorar</Link></li>
              <li><Link href="/#map" className="text-xs text-secondary hover:text-accent transition-colors font-mono">Mapa</Link></li>
              <li><Link href="/eventos" className="text-xs text-secondary hover:text-accent transition-colors font-mono">Eventos</Link></li>
              <li><Link href="/noticias" className="text-xs text-secondary hover:text-accent transition-colors font-mono">Noticias</Link></li>
              <li><Link href="/empleos" className="text-xs text-secondary hover:text-accent transition-colors font-mono">Empleos</Link></li>
              <li><Link href="/directorio/submit" className="text-xs text-secondary hover:text-accent transition-colors font-mono">Agregar proyecto</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-2xs text-muted font-mono">&copy; {new Date().getFullYear()} Tech Atlas — Sinaloa, México</p>
          <p className="text-2xs text-muted font-mono">Hecho con open source</p>
        </div>
      </div>
    </footer>
  )
}
