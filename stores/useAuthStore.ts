"use client"

import { create } from 'zustand'

type AuthState = {
  profile: { nickname?: string; avatar?: string } | null
  setProfile: (p: AuthState['profile']) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  profile: null,
  setProfile: (p) => set({ profile: p })
}))

