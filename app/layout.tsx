import '@/styles/globals.css'
import '@/styles/theme.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Glomia Life',
  description: 'Explore bases, nodes and stories across the world'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  )
}
