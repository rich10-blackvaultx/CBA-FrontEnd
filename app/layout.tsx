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
      <body>
        <script
          dangerouslySetInnerHTML={{
            __html: `(() => {try {var t = localStorage.getItem('theme'); if (t==='dark' || (!t && window.matchMedia('(prefers-color-scheme: dark)').matches)) { document.documentElement.classList.add('dark'); }} catch(e) {}})()`
          }}
        />
        {children}
      </body>
    </html>
  )
}
