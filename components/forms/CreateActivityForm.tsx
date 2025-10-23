"use client"

import { useForm, FormProvider } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import type { ActivityInput } from '@/types/activity'
import { useActivityDraft } from '@/stores/useActivityDraft'
import { useTransition } from 'react'
import { createActivityAction } from '@/lib/actions'
import { createActivity } from '@/services/activities'
import { useWallet } from '@/hooks/useWallet'
import { PosterStep } from './steps/PosterStep'
import { CoreStep } from './steps/CoreStep'
import { TimePlaceStep } from './steps/TimePlaceStep'
import { TicketStep } from './steps/TicketStep'
import { HostStep } from './steps/HostStep'
import { ReviewStep } from './steps/ReviewStep'
import { useRouter, useParams } from 'next/navigation'

const schema = z
  .object({
    title: z.string().min(1).max(30),
    tagline: z.string().max(50).optional(),
    desc: z.string().max(500).optional(),
    baseId: z.string().min(1),
    nodeId: z.string().optional(),
    poster: z.string().optional(),
    startAt: z.string(),
    endAt: z.string(),
    timezone: z.string().min(1),
    host: z.string().optional(),
    hostAvatar: z.string().optional(),
    identityTags: z.array(z.string()).optional(),
    ticket: z.object({
      type: z.enum(['free', 'paid']),
      price: z.number().optional(),
      currency: z.enum(['USD', 'EUR', 'CNY']).optional(),
      quota: z.number().min(1),
      waitlist: z.boolean().optional()
    }),
    tags: z.array(z.string()).optional(),
    locationNote: z.string().optional()
  })
  .refine((v) => new Date(v.startAt) < new Date(v.endAt), {
    message: 'Start must be before end',
    path: ['endAt']
  })

export function CreateActivityForm() {
  const { address, isConnected, connect } = useWallet()
  const router = useRouter()
  const { locale } = useParams<{ locale: string }>()
  const draft = useActivityDraft((s) => s.draft)
  const update = useActivityDraft((s) => s.update)
  const next = useActivityDraft((s) => s.next)
  const prev = useActivityDraft((s) => s.prev)
  const setStep = useActivityDraft((s) => s.setStep)
  const reset = useActivityDraft((s) => s.reset)
  const [pending, startTransition] = useTransition()

  const methods = useForm<ActivityInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: (draft as any).title || '',
      tagline: (draft as any).tagline || '',
      desc: (draft as any).desc || '',
      baseId: (draft as any).baseId || '',
      nodeId: (draft as any).nodeId || '',
      poster: (draft as any).poster || '',
      startAt: ((draft as any).startAt || new Date().toISOString()).slice(0, 16),
      endAt: ((draft as any).endAt || new Date(Date.now() + 2 * 3600 * 1000).toISOString()).slice(0, 16),
      timezone: (draft as any).timezone || '+00:00',
      host: (draft as any).host || '',
      hostAvatar: (draft as any).hostAvatar || '',
      identityTags: (draft as any).identityTags || [],
      ticket: (draft as any).ticket || { type: 'free', quota: 10 },
      tags: (draft as any).tags || [],
      locationNote: (draft as any).locationNote || ''
    } as any
  })

  function saveDraft() {
    const v = methods.getValues()
    update(v)
  }

  async function handlePublishServer(fd: FormData) {
    if (!isConnected || !address) {
      connect?.()
      return alert('请先连接钱包')
    }
    const v = methods.getValues()
    fd.set('ticket', JSON.stringify(v.ticket))
    fd.set('tags', (v.tags || []).join(','))
    fd.set('identityTags', (v.identityTags || []).join(','))
    fd.set('creatorAddress', address)
    startTransition(async () => {
      try {
        const res = await createActivityAction(fd)
        reset()
        alert('发布成功')
        router.push(`/${locale}/bases`)
      } catch (e) {
        alert('发布失败，已退回 API 方案')
        const created = await createActivity({ ...v, creatorAddress: address })
        if ((created as any)?.id) {
          reset()
          alert('发布成功')
          router.push(`/${locale}/bases`)
        }
      }
    })
  }

  const step = (draft.step as number) || 1

  return (
    <FormProvider {...methods}>
      <div className="card p-6 hover-lift">
        <div className="mb-3 text-sm text-gray-600">填写完整信息，系统将生成展示页和报名链接</div>
        <div className="progress-track mb-3">
          <div className="progress-fill" style={{ width: `${(step/6)*100}%` }} />
        </div>
        <div className="flex items-center gap-2 mb-4 text-sm flex-wrap">
          {['海报','核心','时间地点','票务','主持人','复核'].map((label, idx) => {
            const n = idx + 1
            const state = step === n ? 'current' : step > n ? 'done' : 'todo'
            const cls = state === 'current' ? 'step-chip step-chip-current' : state === 'done' ? 'step-chip step-chip-done' : 'step-chip step-chip-todo'
            return (
              <span key={label} className={cls}>{n}/6 {label}</span>
            )
          })}
        </div>

        <form action={handlePublishServer} onChange={saveDraft} onSubmit={(e) => e.preventDefault()}>
          <div className="animate-fade-up">
            {step === 1 && <PosterStep />}
            {step === 2 && <CoreStep />}
            {step === 3 && <TimePlaceStep />}
            {step === 4 && <TicketStep />}
            {step === 5 && <HostStep />}
            {step === 6 && <ReviewStep />}
          </div>

        <div className="flex items-center justify-between mt-6">
          <div className="flex gap-2">
            <button type="button" onClick={saveDraft} className="btn-ghost px-3 py-2">保存草稿</button>
            <button type="button" onClick={() => { saveDraft(); prev(); }} className="btn-ghost px-3 py-2">上一步</button>
            <button type="button" onClick={() => { saveDraft(); next(); }} className="btn-ghost px-3 py-2">下一步</button>
            <button type="button" onClick={() => setStep(6)} className="btn-ghost px-3 py-2">去复核</button>
          </div>
          <div className="flex gap-2">
            <button formAction={handlePublishServer} className="btn-primary px-5 py-2 disabled:opacity-50" disabled={pending}>立即发布活动</button>
          </div>
        </div>
        </form>
      </div>
    </FormProvider>
  )
}
