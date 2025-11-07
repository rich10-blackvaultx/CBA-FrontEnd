"use client"

import { useTranslations } from 'next-intl'
import { useI18n } from '@/hooks/useI18n'
import { useAuthStore } from '@/stores/useAuthStore'

export function LoginButton({ variant = 'default' }: { variant?: 'default' | 'ghost' }) {
  const t = useTranslations('actions')
  const { locale } = useI18n()
  const profile = useAuthStore((s) => s.profile)
  const setProfile = useAuthStore((s) => s.setProfile)

  console.log('Current profile in LoginButton:', profile)
  if (profile) {
    return (
      <div className="relative group">
        <button
          className={
            variant === 'ghost'
              ? 'h-9 px-3 rounded-md text-white/90 hover:text-white text-sm flex items-center gap-2'
              : 'h-9 px-3 rounded-md border hover:bg-gray-50 text-gray-700 dark:text-gray-100 dark:border-gray-600 dark:hover:bg-gray-800 text-sm flex items-center gap-2'
          }
        >
          {profile.avatar ? (
            <img src={profile.avatar} className="h-5 w-5 rounded-full" alt="avatar" />
          ) : (
            <span>🙂</span>
          )}
          <span className="max-w-[8rem] truncate">{profile.username || 'User'}</span>
        </button>
        <div className="absolute right-0 mt-1 hidden group-hover:block card p-2 min-w-36">
          <button
            onClick={async () => { try { await fetch('/api/auth/logout', { method: 'POST' }) } catch {}; setProfile(null) }}
            className="block w-full text-left px-3 py-1 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 text-sm"
          >
            {t('logout', { default: 'Logout' })}
          </button>
        </div>
      </div>
    )
  }

  return (
    <button
      onClick={() => (window.location.href = `/${locale}/auth/login`)}
      className={
        variant === 'ghost'
          ? 'h-9 px-3 rounded-md text-white/90 hover:text-white text-sm'
          : 'h-9 px-3 rounded-md border hover:bg-gray-50 text-gray-700 dark:text-gray-100 dark:border-gray-600 dark:hover:bg-gray-800 text-sm'
      }
    >
      {t('login', { default: 'Login' })}
    </button>
  )
}
 
