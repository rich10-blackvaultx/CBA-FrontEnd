export function Rating({ value = 0, outOf = 5 }: { value?: number; outOf?: number }) {
  const full = Math.round(value)
  return (
    <div className="flex items-center gap-1 text-amber-500">
      {Array.from({ length: outOf }).map((_, i) => (
        <span key={i}>{i < full ? '★' : '☆'}</span>
      ))}
    </div>
  )
}

