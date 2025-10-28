"use client"

import { useLocale } from 'next-intl'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

export function LanguageSwitch({ variant = 'default' }: { variant?: 'default' | 'ghost' }) {
  const locale = useLocale()
  const pathname = usePathname() || '/'
  const to = locale === 'en' ? pathname.replace(/^\/en/, '/zh') : pathname.replace(/^\/zh/, '/en')
  const base =
    variant === 'ghost'
      ? 'h-9 px-3 rounded-md text-white/90 hover:text-white text-sm flex items-center'
      : 'h-9 px-3 rounded-md border text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-800 text-sm flex items-center'
  return (
    <Link href={to} className={base}>
      {locale === 'en' ? '中文' : 'EN'}
    </Link>
  )
}
