import Link from 'next/link'
import { WHATSAPP_URL } from '@/config'

export function InfoBanner() {
  return (
    <div className="w-full bg-black py-2 px-4 text-center">
      <p className="text-2xs font-mono text-neutral-400 tracking-wide">
        🚧 Estás visitando la nueva versión del Atlas
        <span className="hidden md:inline">{' · '}</span>
        <br className="md:hidden" />
        <Link
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-yellow-400 hover:underline"
        >
          Únete a la comunidad
        </Link>
      </p>
    </div>
  )
}
