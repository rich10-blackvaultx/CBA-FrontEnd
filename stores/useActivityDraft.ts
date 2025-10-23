"use client"

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ActivityInput } from '@/types/activity'

type Draft = Partial<ActivityInput> & { step: number }

type State = {
  draft: Draft
  update: (patch: Partial<ActivityInput>) => void
  next: () => void
  prev: () => void
  reset: () => void
  setStep: (s: number) => void
}

export const useActivityDraft = create<State>()(
  persist(
    (set, get) => ({
      draft: { step: 1 },
      update: (patch) => set({ draft: { ...get().draft, ...patch } }),
      next: () => set({ draft: { ...get().draft, step: Math.min(6, (get().draft.step || 1) + 1) } }),
      prev: () => set({ draft: { ...get().draft, step: Math.max(1, (get().draft.step || 1) - 1) } }),
      setStep: (s) => set({ draft: { ...get().draft, step: s } }),
      reset: () => set({ draft: { step: 1 } })
    }),
    { name: 'draft.activity' }
  )
)

