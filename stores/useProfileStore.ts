import { create } from 'zustand'

interface ProfileState {
  skills: string[]
  interests: string[]
  setSkills: (skills: string[]) => void
  setInterests: (interests: string[]) => void
}

export const useProfileStore = create<ProfileState>((set) => ({
  skills: ['ai', 'product'],
  interests: ['wifi', 'community'],
  setSkills: (skills) => set({ skills }),
  setInterests: (interests) => set({ interests })
}))

