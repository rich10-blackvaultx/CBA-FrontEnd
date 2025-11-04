"use client"

import { useEffect, useMemo, useState } from 'react'
import type { Job } from '@/types/job'
import { useI18n } from '@/hooks/useI18n'
import { Modal } from '@/components/shared/Modal'

// Quick tag suggestions to roughly mirror the reference UI chips
const SUGGESTED_TAGS = [
  'ai','analyst','backend','blockchain','community manager','crypto','data science','design','devops','discord',
  'frontend','full stack','gaming','golang','hardhat','intern','java','javascript','layer 2','marketing','mobile',
  'nft','node','open source','product manager','project manager','react','research','rust','sales','solidity','web3js'
]

export default function JobsPage() {
  const { t } = useI18n()

  const [jobs, setJobs] = useState<Job[]>([])
  const [query, setQuery] = useState('')
  const [remoteOnly, setRemoteOnly] = useState(false)
  const [skillFilters, setSkillFilters] = useState<string[]>([])
  const [selected, setSelected] = useState<Job | null>(null)
  const [applyOpen, setApplyOpen] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', portfolio: '', message: '' })

  useEffect(() => {
    ;(async () => {
      const res = await fetch('/api/jobs')
      const data: Job[] = await res.json()
      setJobs(data)
      setSelected((s) => s || data[0] || null)
    })()
  }, [])

  const allTags = useMemo(() => {
    const fromJobs = Array.from(new Set(jobs.flatMap((j) => j.skills))).slice(0, 30)
    return Array.from(new Set([...fromJobs, ...SUGGESTED_TAGS]))
  }, [jobs])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return jobs
      .filter((j) => (q ? `${j.title} ${j.owner?.name || ''} ${j.skills.join(' ')}`.toLowerCase().includes(q) : true))
      .filter((j) => (skillFilters.length ? skillFilters.every((s) => j.skills.map((x) => x.toLowerCase()).includes(s.toLowerCase())) : true))
      // No remote field in current mock data; keep toggle for future wiring
      .filter(() => (remoteOnly ? true : true))
  }, [jobs, query, skillFilters, remoteOnly])

  return (
    <div className="container-responsive py-6 space-y-4">
      {/* Search + quick tags */}
      <div className="rounded-2xl border border-fuchsia-400/40 bg-fuchsia-700/20 p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex-1 flex items-center gap-2">
            <div className="flex-1">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={(t('jobs.search_placeholder') as any) || 'Tag, Location, Company'}
                className="w-full px-3 py-2 rounded-md border bg-white/80 dark:bg-gray-900/80 dark:border-gray-700"
              />
            </div>
            <label className="flex items-center gap-2 text-sm select-none">
              <input type="checkbox" checked={remoteOnly} onChange={(e) => setRemoteOnly(e.target.checked)} />
              <span>{(t('jobs.remote') as any) || 'Remote'}</span>
            </label>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {allTags.map((tag) => {
            const active = skillFilters.includes(tag)
            return (
              <button
                key={tag}
                onClick={() =>
                  setSkillFilters((prev) => (prev.includes(tag) ? prev.filter((x) => x !== tag) : [...prev, tag]))
                }
                className={[
                  'px-2 py-1 rounded-md border text-xs',
                  active ? 'bg-fuchsia-600 text-white border-fuchsia-500' : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                ].join(' ')}
              >
                {tag}
              </button>
            )
          })}
        </div>
      </div>

      {/* Two-column: list + detail */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left: list */}
        <div className="space-y-3">
          {filtered.map((j) => {
            const active = selected?.id === j.id
            return (
              <button
                key={j.id}
                onClick={() => setSelected(j)}
                className={[
                  'w-full text-left rounded-2xl border p-4 transition',
                  active
                    ? 'border-fuchsia-400 bg-fuchsia-700/20 shadow'
                    : 'border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/60 hover:bg-gray-50/70 dark:hover:bg-gray-800'
                ].join(' ')}
                aria-label={j.title}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-lg">{j.title}</h3>
                    <div className="mt-1 flex flex-wrap gap-1.5">
                      {j.skills.map((s) => (
                        <span key={s} className="px-2 py-0.5 rounded-full text-xs border bg-white/70 dark:bg-gray-900/40 border-gray-200 dark:border-gray-700">
                          {s}
                        </span>
                      ))}
                    </div>
                    <div className="text-sm mt-2 opacity-80">
                      {j.payType} · {j.timezone}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-sm">{j.budget.currency}</div>
                    <div className="font-medium">{j.budget.min}-{j.budget.max}</div>
                    {j.reputationRequired && (
                      <div className="text-xs opacity-70 mt-1">Rep ~{j.reputationRequired}</div>
                    )}
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        {/* Right: detail */}
        <aside className="lg:sticky lg:top-6 self-start">
          <div className="rounded-2xl border bg-white/70 dark:bg-gray-800/60 border-gray-200 dark:border-gray-700 overflow-hidden">
            {selected ? (
              <div className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-semibold">{selected.title}</h2>
                    <div className="text-sm opacity-80 mt-1">
                      {selected.payType} · {selected.timezone}
                    </div>
                  </div>
                  <button className="px-3 py-1.5 rounded-md bg-fuchsia-600 text-white text-sm" onClick={() => setApplyOpen(true)}>
                    {(t('actions.apply') as any) || 'Apply'}
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {selected.skills.map((s) => (
                    <span key={s} className="px-2 py-0.5 rounded-full text-xs border bg-white/70 dark:bg-gray-900/40 border-gray-200 dark:border-gray-700">
                      {s}
                    </span>
                  ))}
                </div>
                <div className="h-80 overflow-y-auto pr-1">
                  <h3 className="font-semibold mb-1">About</h3>
                  <p className="text-sm leading-6 opacity-90">
                    This is a placeholder description for the selected job. Add real descriptions in the jobs API
                    data to enrich this panel. Candidates can review details and click Apply to proceed.
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-6 text-sm opacity-70">Select a job to view details.</div>
            )}
          </div>
        </aside>
      </div>

      {/* Apply modal */}
      <Modal open={applyOpen} title={(t('actions.apply') as any) || 'Apply'} onClose={() => setApplyOpen(false)}>
        <form
          className="space-y-3"
          onSubmit={async (e) => {
            e.preventDefault()
            if (!selected) return
            await fetch('/api/bids', {
              method: 'POST',
              headers: { 'content-type': 'application/json' },
              body: JSON.stringify({
                jobId: selected.id,
                message: form.message || 'Interested!',
                profile: { name: form.name, email: form.email, portfolio: form.portfolio }
              })
            })
            setApplyOpen(false)
            alert((t('jobs.applyForm.ok') as any) || 'Submitted!')
            setForm({ name: '', email: '', portfolio: '', message: '' })
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <label className="text-sm">
              <span className="block mb-1">{(t('jobs.applyForm.name') as any) || 'Name'}</span>
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full border rounded-md px-3 py-2" />
            </label>
            <label className="text-sm">
              <span className="block mb-1">{(t('jobs.applyForm.email') as any) || 'Email'}</span>
              <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full border rounded-md px-3 py-2" />
            </label>
            <label className="text-sm md:col-span-2">
              <span className="block mb-1">{(t('jobs.applyForm.portfolio') as any) || 'Portfolio'}</span>
              <input placeholder="https://" value={form.portfolio} onChange={(e) => setForm({ ...form, portfolio: e.target.value })} className="w-full border rounded-md px-3 py-2" />
            </label>
            <label className="text-sm md:col-span-2">
              <span className="block mb-1">{(t('jobs.applyForm.message') as any) || 'Message'}</span>
              <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="w-full border rounded-md px-3 py-2 min-h-28" />
            </label>
          </div>
          <div className="pt-2 flex justify-end">
            <button type="submit" className="px-4 py-2 rounded-md bg-fuchsia-600 text-white">
              {(t('actions.submit') as any) || 'Submit'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
