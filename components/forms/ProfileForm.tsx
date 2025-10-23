"use client"

import { useAuthStore } from '@/stores/useAuthStore'
import { useWallet } from '@/hooks/useWallet'
import { truncateAddress } from '@/lib/constants'
import { useState } from 'react'

export function ProfileForm() {
  const profile = useAuthStore((s) => s.profile)
  const setProfile = useAuthStore((s) => s.setProfile)
  const { address, isConnected } = useWallet()
  const [nickname, setNickname] = useState(profile?.nickname || '')
  const [avatar, setAvatar] = useState(profile?.avatar || '')
  return (
    <div className="card p-6">
      <h3 className="font-semibold mb-4">Profile</h3>
      <div className="grid md:grid-cols-2 gap-4">
        <label className="text-sm">
          <div>Nickname</div>
          <input value={nickname} onChange={(e) => setNickname(e.target.value)} className="w-full border rounded-md px-3 py-2" />
        </label>
        <label className="text-sm">
          <div>Avatar URL</div>
          <input value={avatar} onChange={(e) => setAvatar(e.target.value)} className="w-full border rounded-md px-3 py-2" />
        </label>
      </div>
      <div className="text-sm text-gray-600 mt-4">
        Wallet: {isConnected && address ? truncateAddress(address) : 'Not connected'}
      </div>
      <div className="mt-4">
        <button
          onClick={() => setProfile({ nickname, avatar })}
          className="px-4 py-2 rounded-md bg-brand text-white"
        >
          Save
        </button>
      </div>
    </div>
  )
}

