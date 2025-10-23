"use client"

import { useEffect, useState, useTransition } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useWallet } from '@/hooks/useWallet'
import type { Job } from '@/types/job'

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [job, setJob] = useState<Job | null>(null)
  const { isConnected, connect, address } = useWallet()
  const [pending, startTransition] = useTransition()
  const router = useRouter()

  useEffect(() => {
    ;(async () => {
      const res = await fetch(`/api/jobs?id=${id}`)
      const data = await res.json()
      setJob(data)
    })()
  }, [id])

  if (!job) return <div className="container-responsive py-6">Loading...</div>

  return (
    <div className="container-responsive py-6 grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        <div className="card p-4">
          <h1 className="text-2xl font-semibold">{job.title}</h1>
          <div className="mt-2 text-sm">Skills: {job.skills.join(', ')}</div>
          <p className="mt-2 text-gray-600 dark:text-gray-300">Milestones / description placeholder.</p>
        </div>
      </div>
      <aside className="space-y-4">
        <div className="card p-4">
          <div className="mb-2 font-semibold">Bid</div>
          {!isConnected ? (
            <button className="w-full px-4 py-2 rounded-md bg-brand text-white" onClick={() => connect()}>
              Connect wallet to bid
            </button>
          ) : (
            <button
              className="w-full px-4 py-2 rounded-md bg-brand text-white disabled:opacity-50"
              disabled={pending}
              onClick={() =>
                startTransition(async () => {
                  const message = prompt('Your bid message:') || 'Interested!'
                  const res = await fetch('/api/bids', {
                    method: 'POST',
                    headers: { 'content-type': 'application/json' },
                    body: JSON.stringify({ jobId: job.id, bidder: address, message })
                  })
                  const data = await res.json()
                  alert(data.ok ? 'Bid submitted' : 'Failed')
                  router.refresh()
                })
              }
            >
              Submit bid
            </button>
          )}
        </div>
      </aside>
    </div>
  )
}

