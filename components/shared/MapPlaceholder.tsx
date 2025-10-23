export type MapPoint = { lat: number; lng: number; label?: string }

export function MapPlaceholder({ points = [] }: { points?: MapPoint[] }) {
  return (
    <div className="card h-64 w-full flex items-center justify-center relative">
      <span className="text-gray-500">Map placeholder</span>
      <div className="absolute inset-0 overflow-hidden">
        {points.map((p, idx) => (
          <div
            key={idx}
            className="absolute w-3 h-3 rounded-full bg-brand"
            style={{ left: `${(p.lng % 360 + 360) % 360 / 3.6}%`, top: `${(p.lat + 90) / 1.8}%` }}
            title={p.label}
          />
        ))}
      </div>
    </div>
  )
}

