import type { ActivityInput } from '@/types/activity'
import { useFormContext } from 'react-hook-form'

export function ReviewStep() {
  const { getValues } = useFormContext<ActivityInput>()
  const v = getValues()
  return (
    <div className="space-y-3">
      <div className="card p-4">
        <h3 className="font-semibold mb-2">预览</h3>
        <div className="text-sm">{v.title} · {v.tagline}</div>
        <div className="text-sm">{v.startAt} — {v.endAt} ({v.timezone})</div>
        <div className="text-sm">Base: {v.baseId} · Node: {v.nodeId || '-'}</div>
        <div className="text-sm">名额: {v.ticket?.quota} · {v.ticket?.type === 'paid' ? `价格: ${v.ticket?.price} ${v.ticket?.currency}` : '免费'}</div>
      </div>
    </div>
  )
}

