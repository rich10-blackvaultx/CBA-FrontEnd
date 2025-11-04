"use client"

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type AuthState = {
  profile: { nickname?: string; avatar?: string; provider?: 'wechat' | 'google' | 'github' } | null
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
