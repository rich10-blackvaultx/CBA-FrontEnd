"use client"

import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import type { ActivityInput } from '@/types/activity'
import { useDraftStore } from '@/stores/useDraftStore'
import { useState, useTransition } from 'react'
import { createActivityAction } from '@/lib/actions'
import { createActivity } from '@/services/activities'
import { useWallet } from '@/hooks/useWallet'

const schema = z.object({
  title: z.string().min(2),
  intro: z.string().min(2),
  nodeId: z.string().min(1),
  baseId: z.string().optional(),
  quota: z.coerce.number().min(1),
  startAt: z.string(),
  endAt: z.string(),
  price: z.coerce.number().optional(),
  poster: z.string().url().optional()
})

export function CreateActivityForm() {
  const { address, isConnected } = useWallet()
  const draft = useDraftStore((s) => s.activity)
  const setDraft = useDraftStore((s) => s.setDraft)
  const clearDraft = useDraftStore((s) => s.clear)
  const [step, setStep] = useState(1)
  const [pending, startTransition] = useTransition()

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues
  } = useForm<ActivityInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: draft.title || '',
      intro: draft.intro || '',
      nodeId: draft.nodeId || '',
      baseId: draft.baseId || '',
      quota: draft.quota || 10,
      startAt: draft.startAt || new Date().toISOString(),
      endAt: draft.endAt || new Date(Date.now() + 2 * 3600 * 1000).toISOString(),
      price: draft.price || 0,
      poster: draft.poster || ''
    }
  })

  function onSaveDraft() {
    setDraft(getValues())
  }

  function next() {
    onSaveDraft()
    setStep((s) => Math.min(4, s + 1))
  }

  function prev() {
    setStep((s) => Math.max(1, s - 1))
  }

  const onSubmitServer = (fd: FormData) => {
    if (!isConnected || !address) return alert('Please connect wallet')
    fd.set('creator', address)
    startTransition(async () => {
      await createActivityAction(fd)
      clearDraft()
      alert('Created!')
    })
  }

  const onSubmitAPI = handleSubmit(async (values) => {
    if (!isConnected || !address) return alert('Please connect wallet')
    await createActivity({ ...values, creator: address })
    clearDraft()
    alert('Created via API!')
  })

  return (
    <div className="card p-6">
      <div className="flex items-center gap-2 mb-4 text-sm">
        <span className={step >= 1 ? 'text-brand' : ''}>1. Basic</span>
        <span>›</span>
        <span className={step >= 2 ? 'text-brand' : ''}>2. Time & Place</span>
        <span>›</span>
        <span className={step >= 3 ? 'text-brand' : ''}>3. Ticket</span>
        <span>›</span>
        <span className={step >= 4 ? 'text-brand' : ''}>4. Poster</span>
      </div>

      <form action={onSubmitServer} onSubmit={(e) => e.preventDefault()}>
        {step === 1 && (
          <div className="grid md:grid-cols-2 gap-4">
            <label className="text-sm">
              <div>Title</div>
              <input {...register('title')} className="w-full border rounded-md px-3 py-2" />
              {errors.title && <p className="text-red-500 text-xs">{errors.title.message}</p>}
            </label>
            <label className="text-sm md:col-span-2">
              <div>Introduction</div>
              <textarea {...register('intro')} className="w-full border rounded-md px-3 py-2 h-24" />
              {errors.intro && <p className="text-red-500 text-xs">{errors.intro.message}</p>}
            </label>
          </div>
        )}

        {step === 2 && (
          <div className="grid md:grid-cols-2 gap-4">
            <label className="text-sm">
              <div>Base ID</div>
              <input {...register('baseId')} className="w-full border rounded-md px-3 py-2" />
            </label>
            <label className="text-sm">
              <div>Node ID</div>
              <input {...register('nodeId')} className="w-full border rounded-md px-3 py-2" />
            </label>
            <label className="text-sm">
              <div>Start at</div>
              <input type="datetime-local" {...register('startAt')} className="w-full border rounded-md px-3 py-2" />
            </label>
            <label className="text-sm">
              <div>End at</div>
              <input type="datetime-local" {...register('endAt')} className="w-full border rounded-md px-3 py-2" />
            </label>
          </div>
        )}

        {step === 3 && (
          <div className="grid md:grid-cols-3 gap-4">
            <label className="text-sm">
              <div>Quota</div>
              <input type="number" {...register('quota')} className="w-full border rounded-md px-3 py-2" />
            </label>
            <label className="text-sm">
              <div>Price</div>
              <input type="number" step="0.01" {...register('price')} className="w-full border rounded-md px-3 py-2" />
            </label>
          </div>
        )}

        {step === 4 && (
          <div className="grid md:grid-cols-2 gap-4">
            <label className="text-sm">
              <div>Poster URL</div>
              <input {...register('poster')} className="w-full border rounded-md px-3 py-2" />
            </label>
          </div>
        )}

        <div className="flex items-center justify-between mt-6">
          <div className="flex gap-2">
            <button type="button" onClick={onSaveDraft} className="px-3 py-2 border rounded-md">
              Save draft
            </button>
            <button type="button" onClick={prev} className="px-3 py-2 border rounded-md">
              Prev
            </button>
            <button type="button" onClick={next} className="px-3 py-2 border rounded-md">
              Next
            </button>
          </div>
          <div className="flex gap-2">
            <button formAction={onSubmitServer} className="px-4 py-2 rounded-md bg-brand text-white" disabled={pending}>
              Submit
            </button>
            <button onClick={onSubmitAPI} className="px-4 py-2 rounded-md border">
              Submit via API
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

