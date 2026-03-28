import type { Metadata } from 'next'
import { SITE_TITLE, SITE_DESCRIPTION, SITE_URL } from '@/config'
import '@/styles/globals.css'
import '@/styles/tooltip.css'

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
  return (
    <html lang="es-MX" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var t=localStorage.getItem("theme");if(t==="dark"||(t!=="light"&&window.matchMedia("(prefers-color-scheme: dark)").matches)){document.documentElement.classList.add("dark")}})()`,
          }}
        />
      </head>
      <body className="mx-auto font-sans w-full min-h-screen flex flex-col relative bg-background text-secondary selection:bg-accent selection:text-accent-foreground">
        {children}
      </body>
    </html>
  )
}
