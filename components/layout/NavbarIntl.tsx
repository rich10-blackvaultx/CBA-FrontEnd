"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useI18n } from '@/hooks/useI18n'
import { LanguageSwitch } from './LanguageSwitch'
import { WalletButtonCustom } from './WalletButtonCustom'
import { ThemeToggle } from './ThemeToggle'
import { useUIStore } from '@/stores/useUIStore'

export function NavbarIntl() {
  const { t, locale } = useI18n()
  const openNI = useUIStore((s) => s.openNI)
  const base = `/${locale}`
  const pathname = usePathname()
  const onHome = pathname === base || pathname === `${base}/`
  return (
    <header className={`${onHome ? 'absolute' : 'sticky'} top-0 z-30 w-full ${onHome ? 'bg-transparent' : 'bg-white/80 dark:bg-gray-900/70 backdrop-blur border-b dark:border-gray-800'}`}>
      <div className="container-responsive h-16 grid grid-cols-3 items-center">
        {/* Left menus (all under Pages) */}
        <nav className="hidden md:flex items-center gap-2">
          <div className="relative group">
            <button className="px-3 py-2 rounded-md text-gray-800 dark:text-gray-200 group-hover:text-brand">{t('nav.pages')}</button>
            <div className="absolute left-0 mt-1 hidden group-hover:block card p-2 min-w-44 menu-pop z-50">
              <Link href={`${base}/bases`} className="block px-3 py-1 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800">{t('nav.bases')}</Link>
              <Link href={`${base}/jobs`} className="block px-3 py-1 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800">{t('nav.jobs')}</Link>
              <Link href={`${base}/community`} className="block px-3 py-1 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800">{t('nav.community')}</Link>
              <Link href={`${base}/me`} className="block px-3 py-1 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800">{t('nav.me')}</Link>
            </div>
          </div>
        </nav>

        {/* Center brand */}
        <div className="flex items-center justify-center">
          <Link href={base} className="font-semibold text-xl flex items-center gap-2">
            <span className="text-brand">📍</span>
            <span className="tracking-wide">TIP</span>
          </Link>
        </div>

        {/* Right controls */}
        <div className={`hidden md:flex items-center justify-end gap-2 ${onHome ? 'text-white' : ''}`}>
          <button onClick={() => openNI('Contact')} className={`${onHome ? 'text-white/90 hover:text-white' : 'text-gray-800 dark:text-gray-200 hover:text-brand'} h-9 px-3 rounded-md text-sm`}>{t('nav.contact')}</button>
          {/* removed search box per request */}
          <ThemeToggle variant={onHome ? 'ghost' : 'default'} />
          <LanguageSwitch variant={onHome ? 'ghost' : 'default'} />
          <WalletButtonCustom variant={onHome ? 'ghost' : 'default'} />
        </div>
      </div>
    </header>
  )
}
