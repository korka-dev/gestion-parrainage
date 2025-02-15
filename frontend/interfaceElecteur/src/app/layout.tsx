import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SenParrainage Électoral - Plateforme de Parrainage des Candidats',
  description: 'Plateforme officielle de parrainage électoral au Sénégal. Parrainez votre candidat de manière simple et sécurisée.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>{children}</body>
    </html>
  )
}