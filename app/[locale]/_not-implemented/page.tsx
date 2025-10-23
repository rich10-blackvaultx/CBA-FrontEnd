"use client"

import { useSearchParams } from 'next/navigation'

export default function NotImplementedPage() {
  const sp = useSearchParams()
  const feature = sp.get('feature') || 'Feature'
  return (
    <div className="container-responsive py-20 text-center">
      <div className="card p-10 inline-block">
        <h1 className="text-2xl font-semibold mb-2">{feature}</h1>
        <p className="text-gray-600">This feature is not available yet.</p>
      </div>
    </div>
  )
}

