"use client"

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Modal } from '@/components/shared/Modal'
import { useAuthStore } from '@/stores/useAuthStore'

export function LoginButton({ variant = 'default' }: { variant?: 'default' | 'ghost' }) {
  const t = useTranslations('actions')
  const profile = useAuthStore((s) => s.profile)
  const setProfile = useAuthStore((s) => s.setProfile)
  const [open, setOpen] = useState(false)
  const [provider, setProvider] = useState<'wechat' | 'google' | 'github'>('wechat')
  const [nickname, setNickname] = useState('')
  const [qr, setQr] = useState<{ state: string; url: string } | null>(null)
  const [polling, setPolling] = useState<any>(null)

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
          <span className="max-w-[8rem] truncate">{profile.nickname || 'User'}</span>
        </button>
        <div className="absolute right-0 mt-1 hidden group-hover:block card p-2 min-w-36">
          <button
            onClick={() => setProfile(null)}
            className="block w-full text-left px-3 py-1 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 text-sm"
          >
            {t('logout', { default: 'Logout' })}
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={
          variant === 'ghost'
            ? 'h-9 px-3 rounded-md text-white/90 hover:text-white text-sm'
            : 'h-9 px-3 rounded-md border hover:bg-gray-50 text-gray-700 dark:text-gray-100 dark:border-gray-600 dark:hover:bg-gray-800 text-sm'
        }
      >
        {t('login', { default: 'Login' })}
      </button>
      <Modal open={open} title={t('login', { default: 'Login' })} onClose={() => { setOpen(false); setQr(null); if (polling) clearInterval(polling) }} width={560}>
        <div className="space-y-4">
          <div className="flex gap-2">
            {(['wechat', 'google', 'github'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setProvider(p)}
                className={`px-3 py-1.5 rounded-md border text-sm ${
                  provider === p ? 'bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900' : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                {p === 'wechat' ? 'WeChat' : p === 'google' ? 'Google' : 'GitHub'}
              </button>
            ))}
          </div>

          {/* Provider panes (mock) */}
          {provider === 'wechat' ? (
            <WeChatPane qr={qr} onInit={async () => {
              const r = await fetch('/api/auth/wechat/create')
              const d = await r.json()
              const url = d.authorizeUrl || ''
              setQr({ state: d.state, url })
              if (polling) clearInterval(polling)
              const timer = setInterval(async () => {
                const s = await fetch(`/api/auth/wechat/status?state=${d.state}`).then((r) => r.json())
                if (s.status === 'done') {
                  setProfile(s.profile)
                  clearInterval(timer)
                  setQr(null)
                  setOpen(false)
                }
              }, 2000)
              setPolling(timer)
            }} />
          ) : null}
          {provider !== 'wechat' ? (
            <div className="p-4 border rounded-lg dark:border-gray-700">
              <div className="text-sm mb-2">{provider === 'google' ? 'Google' : 'GitHub'} mocked login</div>
              <div className="text-xs opacity-70 mb-2">No real OAuth here. This sets a local profile.</div>
            </div>
          ) : null}

          <label className="block text-sm">
            <span className="block mb-1">Nickname</span>
            <input value={nickname} onChange={(e) => setNickname(e.target.value)} className="w-full border rounded-md px-3 py-2" />
          </label>

          <div className="flex justify-end">
            <button
              onClick={() => {
                const name = nickname.trim() || 'Guest'
                const avatar = `https://api.dicebear.com/7.x/thumbs/svg?seed=${encodeURIComponent(name)}`
                setProfile({ nickname: name, avatar, provider })
                setOpen(false)
              }}
              className="px-4 py-2 rounded-md bg-brand text-white"
            >
              Continue
            </button>
          </div>
        </div>
      </Modal>
    </>
  )
}

function WeChatPane({ qr, onInit }: { qr: { state: string; url: string } | null; onInit: () => void }) {
  useEffect(() => {
    if (!qr) onInit()
  }, [qr])
  return (
    <div className="p-4 border rounded-lg dark:border-gray-700">
      <div className="text-sm mb-2">Scan with WeChat to sign in</div>
      {qr?.url ? (
        <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qr.url)}`} alt="WeChat QR" className="h-40 w-40" />
      ) : (
        <div className="h-40 w-40 bg-[repeating-linear-gradient(45deg,#e5e7eb,#e5e7eb_8px,#f3f4f6_8px,#f3f4f6_16px)] dark:bg-[repeating-linear-gradient(45deg,#374151,#374151_8px,#1f2937_8px,#1f2937_16px)] rounded-md" />
      )}
      {!qr?.url && <div className="text-xs opacity-70 mt-2">Set WECHAT_APPID / WECHAT_REDIRECT_URI to enable real QR</div>}
    </div>
  )
}
