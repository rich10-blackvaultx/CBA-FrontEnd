import type { BaseDetail } from '@/types/base'

export function SummaryBar({ summary }: { summary: BaseDetail['summary'] }) {
  const stars = '★★★★★'.slice(0, Math.max(1, Math.min(5, Math.round(summary.visaLevel))))
  const cost = new Intl.NumberFormat(undefined, { style: 'currency', currency: summary.currency }).format(
    summary.monthlyCost
  )
  return (
    <div className="card p-3 text-sm flex flex-wrap gap-x-3 gap-y-1 items-center justify-center">
      <span>{cost} / mo</span>
      <span>• {summary.internetMbps} Mbps</span>
      <span>• Visa {stars}</span>
      <span>• Safety {summary.safety.toFixed(1)}</span>
      <span>• Community {summary.community.toFixed(1)}</span>
      <span>• Stay {summary.stayDays}d</span>
      <span>• {summary.climate}</span>
    </div>
  )
}

