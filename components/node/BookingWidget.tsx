"use client"

import { useEffect, useMemo, useState, useTransition } from 'react'
import { createBooking } from '@/services/bookings'
import { fetchAvailability } from '@/services/availability'
import { useI18n } from '@/hooks/useI18n'

export function BookingWidget({ nodeId, baseId, openTime, seats }: { nodeId?: string; baseId?: string; openTime?: string; seats?: number }) {
  const { t } = useI18n('nodeUI')
  const [start, setStart] = useState<string>(new Date().toISOString().slice(0, 16))
  const [end, setEnd] = useState<string>(new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString().slice(0, 16))
  const [type, setType] = useState<'cowork_day' | 'coliving' | 'combo'>('cowork_day')
  const [includeHousing, setIncludeHousing] = useState<boolean>(false)
  const [includeCowork, setIncludeCowork] = useState<boolean>(true)
  const [tz, setTz] = useState<string>(Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC')
  const [note, setNote] = useState('')
  const [pending, startTransition] = useTransition()
  const [avail, setAvail] = useState<any>(null)

  useEffect(() => {
    if (!nodeId) return
    ;(async () => {
      try {
        const a = await fetchAvailability(nodeId, start)
        setAvail(a)
      } catch {}
    })()
  }, [nodeId, start])

  const capacity = seats || avail?.seats || 0
  const loadPct = useMemo(() => (avail ? Math.round((avail.occupied / Math.max(1, capacity)) * 100) : null), [avail, capacity])

  return (
    <div className="card p-4 space-y-3">
      <h4 className="font-semibold">{t('booking.title')}</h4>
      {openTime && <div className="text-xs text-gray-600">{t('common.open')}: {openTime}</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <label className="text-sm">
          <span className="block mb-1">{t('booking.start')}</span>
          <input type="datetime-local" value={start} onChange={(e) => setStart(e.target.value)} className="w-full border rounded-md px-2 py-2 bg-white dark:bg-gray-900 dark:border-gray-700" />
        </label>
        <label className="text-sm">
          <span className="block mb-1">{t('booking.end')}</span>
          <input type="datetime-local" value={end} onChange={(e) => setEnd(e.target.value)} className="w-full border rounded-md px-2 py-2 bg-white dark:bg-gray-900 dark:border-gray-700" />
        </label>
        <label className="text-sm">
          <span className="block mb-1">{t('booking.type')}</span>
          <select value={type} onChange={(e) => setType(e.target.value as any)} className="w-full border rounded-md px-2 py-2 bg-white dark:bg-gray-900 dark:border-gray-700">
            <option value="cowork_day">{t('booking.type_day')}</option>
            <option value="coliving">{t('booking.type_coliving')}</option>
            <option value="combo">{t('booking.type_combo')}</option>
          </select>
        </label>
        <label className="text-sm">
          <span className="block mb-1">{t('booking.timezone')}</span>
          <input value={tz} onChange={(e) => setTz(e.target.value)} className="w-full border rounded-md px-2 py-2 bg-white dark:bg-gray-900 dark:border-gray-700" />
        </label>
      </div>
      {type !== 'cowork_day' && (
        <div className="flex items-center gap-4 text-sm">
          <label className="flex items-center gap-2"><input type="checkbox" checked={includeHousing} onChange={(e) => setIncludeHousing(e.target.checked)} /> {t('booking.includeHousing')}</label>
          <label className="flex items-center gap-2"><input type="checkbox" checked={includeCowork} onChange={(e) => setIncludeCowork(e.target.checked)} /> {t('booking.includeCowork')}</label>
        </div>
      )}
      <label className="text-sm block">
        <span className="block mb-1">{t('booking.note')}</span>
        <input value={note} placeholder={t('booking.note_placeholder')} onChange={(e) => setNote(e.target.value)} className="w-full border rounded-md px-2 py-2 bg-white dark:bg-gray-900 dark:border-gray-700" />
      </label>
      <div className="flex items-center justify-between text-sm">
        <div className="text-gray-600">
          {avail ? (
            <span>{avail.available} / {capacity} {t('common.seats')} · {t('load.label', { value: String(loadPct ?? 0) })}</span>
          ) : (
            <span>{t('booking.availability_checking')}</span>
          )}
        </div>
        <button
          className="px-4 py-2 rounded-md bg-brand text-white disabled:opacity-50"
          disabled={pending}
          onClick={() => {
            startTransition(async () => {
              await createBooking({ nodeId, baseId, start: new Date(start).toISOString(), end: new Date(end).toISOString(), type, includeHousing, includeCowork, timezone: tz, note })
              alert(t('booking.ok'))
            })
          }}
        >
          {t('booking.submit')}
        </button>
      </div>
    </div>
  )
}
