"use client"

import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'next/navigation'
import { useI18n } from '@/hooks/useI18n'
import { Modal } from '@/components/shared/Modal'
import { MultiSelect } from '@/components/shared/MultiSelect'
import { SearchSelect } from '@/components/shared/SearchSelect'
import { TagInput } from '@/components/shared/TagInput'
import { useProfileStore } from '@/stores/useProfileStore'

export default function WorkPage() {
  const { locale } = useParams<{ locale: string }>()
  const { t } = useI18n('workUI'); const { t: tRoot } = useI18n()
  const skills = useProfileStore((s) => s.skills)
  const interests = useProfileStore((s) => s.interests)
  const setSkills = useProfileStore((s) => s.setSkills)
  const setInterests = useProfileStore((s) => s.setInterests)
  const [projects, setProjects] = useState<any[]>([])
  const [tasks, setTasks] = useState<any[]>([])
  const [finance, setFinance] = useState<any[]>([])
  const [payments, setPayments] = useState<any[]>([])
  const [integrations, setIntegrations] = useState<any>({ slack: false, notion: false, figma: false, github: false })
  const [tz, setTz] = useState<string>(Intl.DateTimeFormat().resolvedOptions().timeZone)
  const [recs, setRecs] = useState<any[]>([])
  const [selected, setSelected] = useState<Record<string, boolean>>({})
  const [myProjects, setMyProjects] = useState<any[]>([])
  const [activePid, setActivePid] = useState<string>('')
  const [show, setShow] = useState<null | 'myWork' | 'myFinance' | 'myRecords' | 'jobDetail' | 'createProject' | 'addRecord' | 'createPayout'>(null)
  const [detail, setDetail] = useState<any>(null)
  const SKILLS = ['AI','Web3','Design','React','NextJS','CI','GitHub','Product','Figma','Solidity','Python','Go','PM']
  const TIMEZONES = ['UTC-8','UTC-5','UTC+0','UTC+1','UTC+3','UTC+5:30','UTC+7','UTC+8','UTC+9','UTC+10']

  useEffect(() => {
    ;(async () => {
      const [p, tsk, fin, integ, pays] = await Promise.all([
        fetch('/api/work/projects').then((r) => r.json()),
        fetch('/api/work/tasks').then((r) => r.json()),
        fetch('/api/work/finance').then((r) => r.json()),
        fetch('/api/work/integrations').then((r) => r.json()).catch(() => integrations),
        fetch('/api/work/payments').then((r) => r.json())
      ])
      setProjects(p); setTasks(tsk); setFinance(fin); setIntegrations(integ || integrations); setPayments(pays)
    })()
  }, [])
  useEffect(() => {
    ;(async () => {
      const url = new URL('/api/work/recommend', location.origin)
      if (skills.length) url.searchParams.set('skills', skills.join(','))
      if (tz) url.searchParams.set('timezone', tz)
      if (interests.length) url.searchParams.set('interests', interests.join(','))
      const res = await fetch(url.toString())
      setRecs(await res.json())
    })()
  }, [skills.join(','), interests.join(','), tz])

  const income = useMemo(() => finance.filter((f) => f.type === 'income').reduce((s, x) => s + x.amount, 0), [finance])
  const expense = useMemo(() => finance.filter((f) => f.type === 'expense').reduce((s, x) => s + x.amount, 0), [finance])

  return (
    <div className="container-responsive py-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{t('title')}</h1>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 rounded-md border text-sm" onClick={() => setShow('myRecords')}>{tRoot('workActions.myRecords')}</button>
          <button className="px-3 py-1.5 rounded-md border text-sm" onClick={() => setShow('myFinance')}>{tRoot('workActions.myFinance')}</button>
          <button className="px-3 py-1.5 rounded-md border text-sm" onClick={() => setShow('myWork')}>{tRoot('workActions.myWork')}</button>
        </div>
      </div>

      {/* Opportunities Match (first) */}
      <div className="card p-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">{t('match.title')}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-2">
          <label className="text-sm">
            <span className="block mb-1">{t('match.skills')}</span>
            <MultiSelect options={SKILLS} value={skills} onChange={setSkills} placeholder="Select skills" />
          </label>
          <label className="text-sm">
            <span className="block mb-1">{t('match.timezone')}</span>
            <SearchSelect options={TIMEZONES} value={tz} onChange={setTz} placeholder="Select timezone" />
          </label>
          <label className="text-sm">
            <span className="block mb-1">{t('match.interests')}</span>
            <TagInput value={interests} onChange={setInterests} placeholder="Add interest and press Enter" />
          </label>
        </div>
        <div className="flex items-center gap-2 mt-3">
          <button className="px-3 py-1.5 rounded-md border text-sm" onClick={() => {
            const picked = recs.filter((r) => selected[r.id])
            if (!picked.length) return
            setMyProjects((prev) => {
              const all = [...prev]
              picked.forEach((p) => { if (!all.find((x) => x.id === p.id)) all.push(p) })
              return all
            })
            setSelected({})
          }}>{t('match.add_to_my_work')}</button>
          <button className="px-3 py-1.5 rounded-md border text-sm" onClick={() => setSelected({})}>{t('match.clear')}</button>
        </div>
        <div className="grid md:grid-cols-2 gap-3 mt-3">
          {recs.map((p) => (
            <label key={p.id} className="border rounded-md p-3 dark:border-gray-700 flex items-start gap-3">
              <input type="checkbox" checked={!!selected[p.id]} onChange={(e) => setSelected((s) => ({ ...s, [p.id]: e.target.checked }))} className="mt-1" />
              <div>
                <div className="font-medium flex items-center justify-between gap-3">
                  <span>{p.title}</span>
                  <button type="button" className="text-xs px-2 py-1 rounded-md border" onClick={() => { setDetail(p); setShow('jobDetail') }}>{tRoot('workActions.view')}</button>
                </div>
                <div className="text-xs text-gray-600">{(p.skills || []).join(', ')} 路 {p.timezone}</div>
                <div className="text-xs mt-1">{p.budget?.min}-{p.budget?.max} {p.budget?.currency}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* My Work & Tasks (hidden in page; open via modal) */}
      {false && (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-semibold">{t('mywork.title')}</h2>
            <button
              className="px-3 py-1.5 rounded-md border text-sm"
              onClick={async () => {
                const title = prompt(t('projects.create_prompt') as any)
                if (!title) return
                const res = await fetch('/api/work/projects', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ title, skills, timezone: tz, budget: { min: 1000, max: 3000, currency: 'USD' } }) })
                const p = await res.json(); setProjects((list) => [p, ...list]); setMyProjects((l) => [p, ...l])
              }}
            >{t('projects.create')}</button>
          </div>
          <div className="space-y-2 max-h-72 overflow-auto pr-1">
            {myProjects.length === 0 ? (
              <div className="text-sm text-gray-600">{t('mywork.empty')}</div>
            ) : (
              myProjects.map((p) => (
                <button key={p.id} onClick={() => setActivePid(p.id)} className={`w-full text-left border rounded-md p-2 dark:border-gray-700 ${activePid===p.id?'bg-gray-50 dark:bg-gray-800':''}`}>
                  <div className="text-sm font-medium">{p.title}</div>
                  <div className="text-xs text-gray-600">{(p.skills || []).join(', ')} 路 {p.timezone}</div>
                </button>
              ))
            )}
          </div>
        </div>
        <div className="lg:col-span-2 card p-4">
          <div className="font-semibold mb-2">{t('tasks.title')}</div>
          <div className="space-y-2 max-h-72 overflow-auto pr-1">
            {tasks.filter((t0) => !activePid || t0.projectId === activePid).map((t0) => (
              <div key={t0.id} className="border rounded-md p-2 dark:border-gray-700 flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">{t0.title}</div>
                  <div className="text-xs text-gray-600">{t0.assignee || '-'} 路 {t0.status}</div>
                </div>
                <button className="text-xs px-2 py-1 rounded-md border" onClick={async () => {
                  const res = await fetch('/api/work/tasks', { method: 'PATCH', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ id: t0.id, status: t0.status === 'done' ? 'todo' : 'done' }) })
                  const updated = await res.json(); setTasks((list) => list.map((x) => (x.id === updated.id ? updated : x)))
                }}>{t0.status === 'done' ? t('tasks.reopen') : t('tasks.complete')}</button>
              </div>
            ))}
          </div>
          <div className="mt-2 flex gap-2">
            <input className="flex-1 border rounded-md px-2 py-1 bg-white dark:bg-gray-900 dark:border-gray-700 text-sm" placeholder={t('tasks.add_placeholder') as any} id="newTask" />
            <button className="text-sm px-3 py-1.5 rounded-md border" onClick={async () => {
              const input = document.getElementById('newTask') as HTMLInputElement
              const title = input?.value?.trim(); if (!title) return
              const res = await fetch('/api/work/tasks', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ title, status: 'todo', projectId: activePid || (myProjects[0]?.id || '') }) })
              const created = await res.json(); setTasks((l) => [created, ...l]); input.value = ''
            }}>{t('tasks.add')}</button>
          </div>
        </div>
      </div>
      )}

      {/* Finance (hidden in page; open via modal) */}
      {false && (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="card p-4">
          <div className="font-semibold">{t('finance.title')}</div>
          <div className="text-sm mt-2">{t('finance.income')}: {income}</div>
          <div className="text-sm">{t('finance.expense')}: {expense}</div>
          <div className="text-xs text-gray-600 mt-1">{t('finance.note')}</div>
        </div>
        <div className="lg:col-span-2 card p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="font-semibold">{t('finance.records')}</div>
            <button className="text-sm px-3 py-1.5 rounded-md border" onClick={() => setShow('addRecord')}>{t('finance.add')}</button>
          </div>
          <div className="space-y-2 max-h-72 overflow-auto pr-1">
            {finance.map((f) => (
              <div key={f.id} className="border rounded-md p-2 dark:border-gray-700 text-sm flex items-center justify-between">
                <div>{f.title || f.category} 路 {f.type}</div>
                <div>{f.amount} {f.currency}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      )}

      {/* Payments (hidden in page; open via modal) */}
      {false && (
      <div className="card p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="font-semibold">{t('payments.title')}</div>
          <button className="text-sm px-3 py-1.5 rounded-md border" onClick={() => setShow('createPayout')}>{t('payments.create')}</button>
        </div>
        <div className="grid md:grid-cols-2 gap-3">
          {payments.map((p) => (
            <div key={p.id} className="border rounded-md p-3 dark:border-gray-700 text-sm flex items-center justify-between">
              <div>{p.to} 路 {p.status}</div>
              <div>{p.amount} {p.currency}</div>
            </div>
          ))}
        </div>
      </div>
      )}

      {/* Modals */}
      <Modal open={show==='jobDetail'} title={detail?.title} onClose={() => setShow(null)}>
        {detail ? (
          <div className="space-y-2 text-sm">
            <div className="text-gray-600">{(detail.skills || []).join(', ')} · {detail.timezone}</div>
            <div>{detail.budget?.min}-{detail.budget?.max} {detail.budget?.currency}</div>
            {detail.desc && <p className="mt-2 whitespace-pre-line">{detail.desc}</p>}
            <div className="pt-2">
              <button className="px-3 py-1.5 rounded-md border text-sm" onClick={() => { setMyProjects((l)=> l.find(x=>x.id===detail.id)? l : [detail, ...l]); setShow(null) }}>{t('match.add_to_my_work')}</button>
            </div>
          </div>
        ) : null}
      </Modal>

      <Modal open={show==='myWork'} title={t('mywork.title')} onClose={() => setShow(null)}>
        <div className="flex items-center justify-end mb-3">
          <button className="px-3 py-1.5 rounded-md border text-sm" onClick={() => setShow('createProject')}>{t('projects.create')}</button>
        </div>
        <div className="space-y-2">
          {myProjects.length === 0 ? (
            <div className="text-sm text-gray-600">{t('mywork.empty')}</div>
          ) : (
            myProjects.map((p)=> (
              <div key={p.id} className="border rounded-md p-2 dark:border-gray-700">
                <div className="text-sm font-medium">{p.title}</div>
                <div className="text-xs text-gray-600">{(p.skills||[]).join(', ')} · {p.timezone}</div>
              </div>
            ))
          )}
        </div>
      </Modal>

      <Modal open={show==='myFinance'} title={t('finance.title')} onClose={() => setShow(null)}>
        <div className="text-sm">{t('finance.income')}: {income}</div>
        <div className="text-sm">{t('finance.expense')}: {expense}</div>
        <div className="text-xs text-gray-600 mt-2">{t('finance.note')}</div>
        <div className="mt-3 flex items-center gap-2">
          <button className="text-sm px-3 py-1.5 rounded-md border" onClick={() => setShow('addRecord')}>{t('finance.add')}</button>
          <button className="text-sm px-3 py-1.5 rounded-md border" onClick={() => setShow('createPayout')}>{t('payments.create')}</button>
        </div>
      </Modal>

      <Modal open={show==='myRecords'} title={t('finance.records')} onClose={() => setShow(null)}>
        <div className="space-y-2 max-h-[60vh] overflow-auto">
          {finance.map((f)=> (
            <div key={f.id} className="border rounded-md p-2 dark:border-gray-700 text-sm flex items-center justify-between">
              <div>{f.title || f.category} · {f.type}</div>
              <div>{f.amount} {f.currency}</div>
            </div>
          ))}
        </div>
      </Modal>

      <Modal open={show==='createProject'} title={t('projects.create')} onClose={() => setShow(null)}>
        <form
          onSubmit={async (e) => {
            e.preventDefault()
            const fd = new FormData(e.currentTarget as HTMLFormElement)
            const title = String(fd.get('title') || '')
            if (!title) return
            const res = await fetch('/api/work/projects', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ title, skills, timezone: tz, budget: { min: 1000, max: 3000, currency: 'USD' } }) })
            const p = await res.json(); setProjects((list) => [p, ...list]); setMyProjects((l) => [p, ...l]); setShow(null)
          }}
          className="space-y-3"
        >
          <label className="block text-sm">
            <div className="mb-1">Title</div>
            <input name="title" className="w-full border rounded-md px-2 py-2 bg-white dark:bg-gray-900 dark:border-gray-700" />
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <label className="text-sm">
              <div className="mb-1">{t('match.skills')}</div>
              <MultiSelect options={SKILLS} value={skills} onChange={setSkills} />
            </label>
            <label className="text-sm">
              <div className="mb-1">{t('match.timezone')}</div>
              <SearchSelect options={TIMEZONES} value={tz} onChange={setTz} />
            </label>
          </div>
          <div className="flex items-center justify-end gap-2">
            <button type="button" className="px-3 py-1.5 rounded-md border text-sm" onClick={() => setShow(null)}>{tRoot('workActions.close')}</button>
            <button type="submit" className="px-3 py-1.5 rounded-md border text-sm bg-brand text-white">{tRoot('workActions.add')}</button>
          </div>
        </form>
      </Modal>

      <Modal open={show==='addRecord'} title={t('finance.add')} onClose={() => setShow(null)}>
        <form
          onSubmit={async (e) => {
            e.preventDefault()
            const fd = new FormData(e.currentTarget as HTMLFormElement)
            const type = String(fd.get('type') || 'income')
            const amount = Number(fd.get('amount') || 0)
            const title = String(fd.get('title') || '')
            const res = await fetch('/api/work/finance', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ type, title, amount, currency: 'USD', date: new Date().toISOString().slice(0,10) }) })
            const created = await res.json(); setFinance((l) => [created, ...l]); setShow(null)
          }}
          className="grid grid-cols-1 md:grid-cols-3 gap-3"
        >
          <label className="text-sm"><div className="mb-1">Type</div>
            <select name="type" className="w-full border rounded-md px-2 py-2 bg-white dark:bg-gray-900 dark:border-gray-700">
              <option value="income">income</option>
              <option value="expense">expense</option>
            </select>
          </label>
          <label className="text-sm"><div className="mb-1">Amount</div>
            <input name="amount" type="number" className="w-full border rounded-md px-2 py-2 bg-white dark:bg-gray-900 dark:border-gray-700" />
          </label>
          <label className="text-sm md:col-span-3"><div className="mb-1">Title</div>
            <input name="title" className="w-full border rounded-md px-2 py-2 bg-white dark:bg-gray-900 dark:border-gray-700" />
          </label>
          <div className="md:col-span-3 flex items-center justify-end gap-2">
            <button type="button" className="px-3 py-1.5 rounded-md border text-sm" onClick={() => setShow(null)}>{tRoot('workActions.close')}</button>
            <button type="submit" className="px-3 py-1.5 rounded-md border text-sm bg-brand text-white">{tRoot('workActions.add')}</button>
          </div>
        </form>
      </Modal>

      <Modal open={show==='createPayout'} title={t('payments.create')} onClose={() => setShow(null)}>
        <form
          onSubmit={async (e) => {
            e.preventDefault()
            const fd = new FormData(e.currentTarget as HTMLFormElement)
            const to = String(fd.get('to') || '')
            const amount = Number(fd.get('amount') || 0)
            const currency = String(fd.get('currency') || 'USDC')
            const res = await fetch('/api/work/payments', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ to, amount, currency, method: 'stablecoin' }) })
            const created = await res.json(); setPayments((l) => [created, ...l]); setShow(null)
          }}
          className="grid grid-cols-1 md:grid-cols-3 gap-3"
        >
          <label className="text-sm"><div className="mb-1">To</div>
            <input name="to" className="w-full border rounded-md px-2 py-2 bg-white dark:bg-gray-900 dark:border-gray-700" />
          </label>
          <label className="text-sm"><div className="mb-1">Amount</div>
            <input name="amount" type="number" className="w-full border rounded-md px-2 py-2 bg-white dark:bg-gray-900 dark:border-gray-700" />
          </label>
          <label className="text-sm"><div className="mb-1">Currency</div>
            <select name="currency" className="w-full border rounded-md px-2 py-2 bg-white dark:bg-gray-900 dark:border-gray-700">
              <option value="USDC">USDC</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
            </select>
          </label>
          <div className="md:col-span-3 flex items-center justify-end gap-2">
            <button type="button" className="px-3 py-1.5 rounded-md border text-sm" onClick={() => setShow(null)}>{tRoot('workActions.close')}</button>
            <button type="submit" className="px-3 py-1.5 rounded-md border text-sm bg-brand text-white">{tRoot('workActions.add')}</button>
          </div>
        </form>
      </Modal>

      {/* Integrations */}
      <div className="card p-4">
        <div className="font-semibold mb-2">{t('integrations.title')}</div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
          {['slack','notion','figma','github'].map((k) => (
            <label key={k} className="flex items-center gap-2">
              <input type="checkbox" checked={!!integrations[k]} onChange={async (e) => {
                const next = { ...integrations, [k]: e.target.checked }
                setIntegrations(next)
                await fetch('/api/work/integrations', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(next) })
              }} /> {k}
            </label>
          ))}
        </div>
      </div>
    </div>
  )
}

