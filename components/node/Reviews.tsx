"use client"

import { useEffect, useState, useTransition } from 'react'
import { fetchReviews, postReview } from '@/services/reviews'
import { useI18n } from '@/hooks/useI18n'

export function Reviews({ nodeId, baseId }: { nodeId?: string; baseId?: string }) {
  const { t } = useI18n('nodeUI')
  const [list, setList] = useState<any[]>([])
  const [author, setAuthor] = useState('')
  const [rating, setRating] = useState(5)
  const [content, setContent] = useState('')
  const [pending, startTransition] = useTransition()

  useEffect(() => {
    ;(async () => {
      try {
        setList(await fetchReviews({ nodeId, baseId }))
      } catch {}
    })()
  }, [nodeId, baseId])

  return (
    <div className="card p-4 space-y-3">
      <h4 className="font-semibold">{t('reviews.title')}</h4>
      {list.length > 0 && (
        <div className="text-sm text-gray-700 dark:text-gray-300">
          {t('reviews.avg', { value: String(Math.round((list.reduce((s, r) => s + (r.rating || 0), 0) / list.length) * 10) / 10), count: String(list.length) })}
        </div>
      )}
      {list.length === 0 ? (
        <div className="text-sm text-gray-600">{t('reviews.empty')}</div>
      ) : (
        <div className="space-y-2">
          {list.map((r) => (
            <div key={r.id} className="border rounded-md p-3 dark:border-gray-700">
              <div className="text-sm font-medium">{r.author} · {'★★★★★'.slice(0, Math.round(r.rating))}</div>
              <div className="text-sm text-gray-700 dark:text-gray-300 mt-1">{r.content}</div>
              <div className="text-xs text-gray-500 mt-1">{new Date(r.createdAt).toLocaleString()}</div>
            </div>
          ))}
        </div>
      )}
      <div className="pt-2 border-t dark:border-gray-800">
        <div className="text-sm font-medium mb-2">{t('reviews.add')}</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input placeholder={t('reviews.name_placeholder')} value={author} onChange={(e) => setAuthor(e.target.value)} className="w-full border rounded-md px-2 py-2 bg-white dark:bg-gray-900 dark:border-gray-700" />
          <select value={rating} onChange={(e) => setRating(Number(e.target.value))} className="w-full border rounded-md px-2 py-2 bg-white dark:bg-gray-900 dark:border-gray-700">
            {[5,4,3,2,1].map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
          <button
            className="px-4 py-2 rounded-md border dark:border-gray-700"
            disabled={pending || !author || !content}
            onClick={() => {
              startTransition(async () => {
                const r = await postReview({ nodeId, baseId, author, rating, content })
                setList((l) => [r, ...l])
                setAuthor('')
                setContent('')
                setRating(5)
              })
            }}
          >
            {t('reviews.submit')}
          </button>
        </div>
        <textarea placeholder={t('reviews.content_placeholder')} value={content} onChange={(e) => setContent(e.target.value)} className="mt-2 w-full border rounded-md px-2 py-2 bg-white dark:bg-gray-900 dark:border-gray-700" />
      </div>
    </div>
  )
}
