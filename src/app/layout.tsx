import type { Metadata } from 'next'
import { SITE_TITLE, SITE_DESCRIPTION, SITE_URL } from '@/config'

export const metadata: Metadata = {
  title: {
    default: `${SITE_TITLE} | Directorio del Ecosistema Tech de Sinaloa`,
    template: `%s | ${SITE_TITLE}`,
  },
  description: SITE_DESCRIPTION,
  metadataBase: new URL(SITE_URL),
  openGraph: {
    type: 'website',
    locale: 'es_MX',
    siteName: SITE_TITLE,
    images: [{ url: '/og.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
  },
  icons: {
    icon: [
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children
}
