"use client"

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Provider = 'wechat' | 'google' | 'github' | 'email' | 'metamask' | 'ocid'
type AuthState = {
  profile: { username?: string; avatar?: string; provider?: Provider; email?: string; address?: string, token?:string } | null
  setProfile: (p: AuthState['profile']) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      profile: null,
      setProfile: (p) => set({ profile: p })
    }),
    { name: 'auth' }
  )
)
