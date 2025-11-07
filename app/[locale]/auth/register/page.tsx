"use client"

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAuthStore } from '@/stores/useAuthStore'
import { useToast } from '@/components/providers/ToastProvider'

export default function RegisterPage() {
  const router = useRouter()
  const params = useParams<{ locale: string }>()
  const locale = (params as any)?.locale || 'en'
  const setProfile = useAuthStore((s) => s.setProfile)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nickname, setNickname] = useState('')
  const [loading, setLoading] = useState(false)
  const { show } = useToast()

  async function onRegister() {
    const missing: string[] = []
    if (!nickname.trim()) missing.push('昵称')
    if (!email.trim()) missing.push('电子邮箱')
    if (!password.trim()) missing.push('密码')
    if (missing.length) {
      show(`${missing.join('、')} 为必填项`, 'error')
      return
    }
    setLoading(true)
    try {
      // Register via external API (rewritten by Next):
      const res = await fetch('/api/users/register', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email, password, username: nickname })
      })
      const data = await res.json().catch(() => null)
      if (data.code !== 0) {
        const msg = (data && (data.brief || data.message)) || 'register_failed'
        throw new Error(msg)
      } else {
        show('创建成功，请登录', 'success')
        router.push(`/${locale}/auth/login`)
      }
    } catch (e: any) {
      show(e?.message || '创建失败', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container-responsive py-12">
      <div className="max-w-md mx-auto card p-6">
        <h1 className="text-2xl font-semibold text-center mb-6">创建账号</h1>
        <div className="space-y-4">
          <label className="block text-sm">
            <span className="block mb-1">昵称</span>
            <input value={nickname} onChange={(e) => setNickname(e.target.value)} className="w-full border rounded-md px-3 py-2 bg-white dark:bg-gray-900 dark:border-gray-700" />
          </label>
          <label className="block text-sm">
            <span className="block mb-1">电子邮箱</span>
            <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border rounded-md px-3 py-2 bg-white dark:bg-gray-900 dark:border-gray-700" />
          </label>
          <label className="block text-sm">
            <span className="block mb-1">密码</span>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border rounded-md px-3 py-2 bg-white dark:bg-gray-900 dark:border-gray-700" />
          </label>
          <button disabled={loading} onClick={onRegister} className="w-full h-11 rounded-md bg-brand text-white font-medium disabled:opacity-60">{loading ? '创建中…' : '创建账号 →'}</button>
        </div>
      </div>
    </div>
  )
}
