"use client"

import dynamic from 'next/dynamic'

const ResponsiveContainer = dynamic(() => import('recharts').then((m) => m.ResponsiveContainer), {
  ssr: false
})
const BarChart = dynamic(() => import('recharts').then((m) => m.BarChart), { ssr: false })
const Bar = dynamic(() => import('recharts').then((m) => m.Bar), { ssr: false })
const XAxis = dynamic(() => import('recharts').then((m) => m.XAxis), { ssr: false })
const YAxis = dynamic(() => import('recharts').then((m) => m.YAxis), { ssr: false })

export function MetricCard({ title, data }: { title: string; data: { name: string; value: number }[] }) {
  return (
    <div className="card p-4">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold">{title}</h4>
      </div>
      <div className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          {/* @ts-ignore dynamic recharts types */}
          <BarChart data={data}>
            {/* @ts-ignore */}
            <XAxis dataKey="name" hide />
            {/* @ts-ignore */}
            <YAxis hide />
            {/* @ts-ignore */}
            <Bar dataKey="value" fill="#3B82F6" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

