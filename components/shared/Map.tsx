"use client"

import { useEffect, useRef } from 'react'

export type MapPoint = { lat: number; lng: number; label?: string }

// Lightweight MapLibre map using public demo style. No API key required.
export function Map({ points = [] }: { points?: MapPoint[] }) {
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    let map: any
    let maplibregl: any
    let markers: any[] = []

    ;(async () => {
      const m = await import('maplibre-gl')
      maplibregl = m

      if (!ref.current) return
      const center = points.length ? [points[0].lng, points[0].lat] : [0, 20]
      map = new maplibregl.Map({
        container: ref.current,
        style: 'https://demotiles.maplibre.org/style.json',
        center,
        zoom: points.length ? 2.5 : 1.3,
        attributionControl: false
      })

      map.addControl(new maplibregl.NavigationControl({ showZoom: true }))
      // Add markers
      markers = points.map((p) => new maplibregl.Marker({ color: '#3b82f6' }).setLngLat([p.lng, p.lat]).setPopup(p.label ? new maplibregl.Popup().setText(p.label) : undefined).addTo(map))

      // Fit bounds to all points
      if (points.length > 1) {
        const bounds = new maplibregl.LngLatBounds([points[0].lng, points[0].lat], [points[0].lng, points[0].lat])
        points.forEach((p) => bounds.extend([p.lng, p.lat]))
        map.fitBounds(bounds, { padding: 40 })
      }
    })()

    return () => {
      try {
        markers.forEach((mk) => mk?.remove?.())
        map?.remove?.()
      } catch {}
    }
  }, [JSON.stringify(points)])

  return <div ref={ref} className="card h-64 w-full overflow-hidden" />
}
