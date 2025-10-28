"use client"

import { useLocale } from 'next-intl'
import { usePathname } from 'next/navigation'

export function Footer() {
  const pathname = usePathname()
  const locale = useLocale()
  const base = `/${locale}`
  const onHome = pathname === base || pathname === `${base}/`
  if (onHome) return null
  return (
    <footer className="border-t mt-12 py-10 text-sm text-gray-500 dark:border-gray-800 dark:text-gray-400">
      <div className="container-responsive flex flex-col sm:flex-row items-center justify-between gap-4">
        <p>© {new Date().getFullYear()} Glomia Life</p>
        <p>Made with Next 15 + React 19</p>
      </div>
    </footer>
  )
}
