import type { BaseSignals } from '@/types/base'

export function TrustSignals({ signals }: { signals: BaseSignals }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <div className="card p-4 text-center">
          <div className="text-xs text-gray-500">Active (30d)</div>
          <div className="text-2xl font-semibold">{signals.active30d}</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-xs text-gray-500">Residents (30d)</div>
          <div className="text-2xl font-semibold">{signals.residents30d}</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-xs text-gray-500">Top skills</div>
          <div className="font-medium">{signals.topSkills.join(', ')}</div>
        </div>
      </div>
      {signals.faqs?.length ? (
        <div className="card p-4">
          <h4 className="font-semibold mb-2">FAQ</h4>
          <div className="space-y-2">
            {signals.faqs.map((f, i) => (
              <details key={i} className="border rounded-md px-3 py-2 bg-white/60 dark:bg-gray-900/60">
                <summary className="font-medium cursor-pointer">{f.q}</summary>
                <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">{f.a}</div>
              </details>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}

