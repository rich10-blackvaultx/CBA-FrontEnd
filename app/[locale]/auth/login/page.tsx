"use client"

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAuthStore } from '@/stores/useAuthStore'
import { useAccount, useSignMessage } from 'wagmi'
import { useToast } from '@/components/providers/ToastProvider'

export default function LoginPage() {
  const router = useRouter()
  const params = useParams<{ locale: string }>()
  const locale = (params as any)?.locale || 'en'
  const setProfile = useAuthStore((s) => s.setProfile)

  // email form
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  // wallet
  const { address, isConnected } = useAccount()
  const { signMessageAsync } = useSignMessage()
  const { show } = useToast()

  async function onEmailLogin() {
    if (!email.trim() || !password.trim()) {
      show('电子邮箱、密码为必填项', 'error')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await res.json()
      console.log('Login response:', data)
      console.log('Response ok status:', res)
      if (!res.ok) throw new Error(data?.error || data?.message || 'login_failed')

      setProfile({...data?.data?.user_info,token:data?.token, provider: 'email'})
      show('登录成功', 'success')
      router.push(`/${locale}`)
    } catch (e: any) {
      show(e?.message || '登录失败', 'error')
    } finally {
      setLoading(false)
    }
  }

  async function startOAuth(provider: 'google' | 'github' | 'ocid') {
    const r = await fetch(`/api/auth/oauth/${provider}/create`)
    const d = await r.json()
    if (d.authorizeUrl) window.open(d.authorizeUrl, '_blank', 'width=480,height=640')
    const timer = setInterval(async () => {
      const s = await fetch(`/api/auth/oauth/${provider}/status?state=${d.state}`).then((x) => x.json())
      if (s.status === 'done') {
        setProfile(s.profile)
        clearInterval(timer)
        show('登录成功', 'success')
        router.push(`/${locale}`)
      }
    }, 2000)
  }

  async function walletLogin() {
    if (!isConnected || !address) return
    const n = await fetch('/api/auth/wallet/nonce', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ address })
    }).then((r) => r.json())
    const sig = await signMessageAsync({ message: n.message })
    const v = await fetch('/api/auth/wallet/verify', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ address, message: n.message, signature: sig })
    }).then((r) => r.json())
    setProfile(v.profile)
    show('登录成功', 'success')
    router.push(`/${locale}`)
  }

  useEffect(() => {
    if (isConnected && address) {
      // ready for wallet login
    }
  }, [isConnected, address])

  return (
    <div className="container-responsive py-12">
      <div className="max-w-md mx-auto card p-6">
        <h1 className="text-2xl font-semibold text-center mb-6">登录</h1>

        <div className="space-y-3">
          <button onClick={() => startOAuth('google')} className="w-full h-11 rounded-full border hover:bg-gray-50 dark:hover:bg-gray-800">使用 Google 登录</button>
          <button onClick={() => startOAuth('github')} className="w-full h-11 rounded-full border hover:bg-gray-50 dark:hover:bg-gray-800">使用 Github 登录</button>
          <button onClick={walletLogin} className="w-full h-11 rounded-full border hover:bg-gray-50 dark:hover:bg-gray-800">使用 Metamask 登录</button>
          <button onClick={() => startOAuth('ocid')} className="w-full h-11 rounded-full border hover:bg-gray-50 dark:hover:bg-gray-800">使用 OCID 登录</button>
        </div>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px bg-gray-200 dark:bg-gray-700 flex-1" />
          <span className="text-sm text-gray-500">或者</span>
          <div className="h-px bg-gray-200 dark:bg-gray-700 flex-1" />
        </div>

        <div className="space-y-4">
          <label className="block text-sm">
            <span className="block mb-1">电子邮箱</span>
            <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border rounded-md px-3 py-2 bg-white dark:bg-gray-900 dark:border-gray-700" />
          </label>
          <label className="block text-sm">
            <span className="block mb-1">密码</span>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border rounded-md px-3 py-2 bg-white dark:bg-gray-900 dark:border-gray-700" />
          </label>
          <button disabled={loading} onClick={onEmailLogin} className="w-full h-11 rounded-md bg-brand text-white font-medium disabled:opacity-60">{loading ? '登录中…' : '登录 →'}</button>
        </div>

        <div className="mt-4 text-center text-sm">
          <a className="text-brand hover:underline" href="#" onClick={(e) => { e.preventDefault(); alert('重置密码暂未开启'); }}>忘记密码？</a>
        </div>

        <div className="mt-2 text-center text-sm">
          首次访问 Glomia ？ <a className="text-brand hover:underline" href={`/${locale}/auth/register`}>创建账号</a>
        </div>
      </div>
    </div>
  )
}
