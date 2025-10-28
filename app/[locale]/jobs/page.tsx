"use client"

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import type { Job } from '@/types/job'
import { useI18n } from '@/hooks/useI18n'

export default function JobsPage({}: {}) {
  const [jobs, setJobs] = useState<Job[]>([])
  const [skills, setSkills] = useState<string[]>([])
  const [budget, setBudget] = useState<{ min?: number; max?: number }>({})
  const [timezone, setTimezone] = useState('')
  const [payType, setPayType] = useState('')
  const { t } = useI18n()

  useEffect(() => {
    ;(async () => {
      const res = await fetch('/api/jobs')
      setJobs(await res.json())
    })()
  }, [])

  const list = useMemo(() => {
    return jobs
      .filter((j) => (skills.length ? skills.every((s) => j.skills.includes(s)) : true))
      .filter((j) => (timezone ? j.timezone === timezone : true))
      .filter((j) => (payType ? j.payType === payType : true))
      .filter((j) => {
        if (budget.min && j.budget.min < budget.min) return false
        if (budget.max && j.budget.max > budget.max) return false
        return true
      })
  }, [jobs, skills, budget, timezone, payType])

  return (
    <div className="container-responsive py-6 space-y-4">
      {/* Module intro */}
      <div className="card p-4">
        <h2 className="text-xl font-semibold">{t('modules.work.title')}</h2>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{t('modules.work.goal')}</p>
        <ul className="mt-3 text-sm list-disc pl-5 space-y-1">
          <li>{t('modules.work.features.collab')}</li>
          <li>{t('modules.work.features.matching')}</li>
          <li>{t('modules.work.features.finance')}</li>
        </ul>
      </div>

      <h1 className="text-2xl font-semibold">Jobs</h1>
      <div className="card p-4 grid grid-cols-2 md:grid-cols-6 gap-3">
        <label className="text-sm md:col-span-2">
          <span className="block mb-1">Skills</span>
          <input
            placeholder="comma separated"
            className="w-full border rounded-md px-2 py-2 bg-white dark:bg-gray-900 dark:border-gray-700"
            onChange={(e) => setSkills(e.target.value.split(',').map((s) => s.trim()).filter(Boolean))}
          />
        </label>
        <label className="text-sm">
          <span className="block mb-1">Budget min</span>
          <input type="number" className="w-full border rounded-md px-2 py-2 bg-white dark:bg-gray-900 dark:border-gray-700" onChange={(e) => setBudget((b) => ({ ...b, min: e.target.value ? Number(e.target.value) : undefined }))} />
        </label>
        <label className="text-sm">
          <span className="block mb-1">Budget max</span>
          <input type="number" className="w-full border rounded-md px-2 py-2 bg-white dark:bg-gray-900 dark:border-gray-700" onChange={(e) => setBudget((b) => ({ ...b, max: e.target.value ? Number(e.target.value) : undefined }))} />
        </label>
        <label className="text-sm">
          <span className="block mb-1">Timezone</span>
          <input className="w-full border rounded-md px-2 py-2 bg-white dark:bg-gray-900 dark:border-gray-700" onChange={(e) => setTimezone(e.target.value)} />
        </label>
        <label className="text-sm">
          <span className="block mb-1">Pay type</span>
          <select className="w-full border rounded-md px-2 py-2 bg-white dark:bg-gray-900 dark:border-gray-700" value={payType} onChange={(e) => setPayType(e.target.value)}>
            <option value="">-</option>
            <option value="fixed">fixed</option>
            <option value="hourly">hourly</option>
            <option value="milestone">milestone</option>
          </select>
        </label>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {list.map((j) => (
          <Link key={j.id} href={`./jobs/${j.id}`} className="card p-4" aria-label={j.title}>
            <h3 className="font-semibold">{j.title}</h3>
            <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">{j.skills.join(', ')}</div>
            <div className="text-sm mt-1">{j.payType} · {j.timezone}</div>
            <div className="text-sm mt-1 font-medium">{j.budget.min}-{j.budget.max} {j.budget.currency}</div>
            {j.reputationRequired && <div className="text-xs mt-1 opacity-70">Rep ≥ {j.reputationRequired}</div>}
          </Link>
        ))}
      </div>
    </div>
  )
}
