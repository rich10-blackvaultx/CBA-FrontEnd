"use client"

import { useEffect, useRef } from 'react'
import maplibregl from 'maplibre-gl'

type Base = { id: string; slug: string; name: string; country: string }

const GEO: Record<string, [number, number]> = {
  // lng, lat
  bali: [115.1889, -8.4095],
  lisbon: [-9.1393, 38.7223],
  kyoto: [135.7681, 35.0116],
  paris: [2.3522, 48.8566],
  'chiang-mai': [98.9853, 18.7883],
  tbilisi: [44.8271, 41.7151],
  'mexico-city': [-99.1332, 19.4326],
  medellin: [-75.567, 6.2088],
  barcelona: [2.1734, 41.3851],
  berlin: [13.405, 52.52],
  singapore: [103.8198, 1.3521],
  taipei: [121.5654, 25.033]
}

export function BasesMap({ bases }: { bases: Base[] }) {
  const ref = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    if (!ref.current) return
    const map = new maplibregl.Map({
      container: ref.current,
      style: 'https://demotiles.maplibre.org/style.json',
      center: [0, 20],
      zoom: 2
    })
    bases.forEach((b) => {
      const coord = GEO[b.slug]
      if (!coord) return
      const el = document.createElement('div')
      el.className = 'map-pin'
      el.style.cssText = 'background:#ef4444;width:10px;height:10px;border-radius:50%;box-shadow:0 0 0 2px #fff'
      new maplibregl.Marker(el).setLngLat(coord).setPopup(new maplibregl.Popup().setText(`${b.name}`)).addTo(map)
    })
    return () => map.remove()
  }, [bases])
  return <div className="w-full h-64 rounded-md overflow-hidden" ref={ref} />
}

