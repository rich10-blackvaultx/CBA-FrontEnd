"use client"

import { ProfileForm } from '@/components/forms/ProfileForm'
import { useUIStore } from '@/stores/useUIStore'

export default function MePage() {
  const openNI = useUIStore((s) => s.openNI)
  return (
    <div className="container-responsive py-6 space-y-4">
      <h1 className="text-2xl font-semibold">Me</h1>
      <ProfileForm />
      <div className="grid md:grid-cols-2 gap-4">
        {['DID', 'Reputation', 'Orders', 'Favorites'].map((feat) => (
          <button key={feat} onClick={() => openNI(feat)} className="card p-6 text-left">
            <h3 className="font-semibold">{feat}</h3>
            <p className="text-gray-600 text-sm">Coming soon...</p>
          </button>
        ))}
      </div>
    </div>
  )
}

