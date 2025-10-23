"use client"

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type OnboardingState = {
  joinChat: boolean
  completeProfile: boolean
  attendEvent: boolean
  writePost: boolean
  toggle: (k: keyof Omit<OnboardingState, 'toggle'>) => void
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      joinChat: false,
      completeProfile: false,
      attendEvent: false,
      writePost: false,
      toggle: (k) => set((s) => ({ ...s, [k]: !s[k] }))
    }),
    { name: 'onboarding-store' }
  )
)

