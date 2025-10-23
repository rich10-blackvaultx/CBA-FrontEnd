"use client"

import { useEffect, useState, useTransition } from 'react'
import { useParams } from 'next/navigation'
import { useWallet } from '@/hooks/useWallet'
import { signMessageAction } from '@/lib/actions'

export default function NodeDetailPage() {
  const params = useParams<{ locale: string; id: string }>()
  const [node, setNode] = useState<any>(null)
  const { isConnected } = useWallet()
  const [pending, startTransition] = useTransition()

  useEffect(() => {
    ;(async () => {
      const res = await fetch(`/api/nodes?id=${params.id}`)
      const data = await res.json()
      setNode(data)
    })()
  }, [params.id])

  if (!node) return <div className="container-responsive py-6">Loading...</div>

  return (
    <div className="container-responsive py-6 grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        <div className="card overflow-hidden">
          <img src={node.coverUrl} className="w-full h-56 object-cover" />
          <div className="p-4">
            <h1 className="text-2xl font-semibold">{node.name}</h1>
            <p className="text-gray-600">{node.address}</p>
            <p className="text-sm text-gray-500">Open: {node.openTime} • Seats: {node.seats || '-'} </p>
          </div>
        </div>
        <div className="card p-4">
          <h3 className="font-semibold mb-2">Activities</h3>
          <p className="text-gray-600 text-sm">Upcoming activities shown here.</p>
        </div>
      </div>
      <aside className="space-y-4">
        <div className="card p-4">
          <h4 className="font-semibold mb-2">Apply</h4>
          <button
            className="w-full px-4 py-2 rounded-md bg-brand text-white disabled:opacity-50"
            disabled={pending}
            onClick={() => {
              if (!isConnected) return alert('Please connect wallet')
              startTransition(async () => {
                const { message } = await signMessageAction('Join node')
                alert(`Signature requested: ${message}`)
              })
            }}
          >
            Signup
          </button>
        </div>
      </aside>
    </div>
  )
}

