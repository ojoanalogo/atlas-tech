import type { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
  title: 'Atlas Sinaloa',
  description: 'Atlas - Tecnologias e Innovacion de Sinaloa',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
