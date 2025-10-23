import { Timeline } from '@/components/shared/Timeline'
import { NodeCard } from '@/components/cards/NodeCard'
import { Section } from '@/components/shared/Section'
import { MapPlaceholder } from '@/components/shared/MapPlaceholder'
import { BaseActions } from '@/components/base/BaseActions'
import { getAbsoluteUrl } from '@/lib/ssr-helpers'

async function fetchDetail(slug: string) {
  const url = await getAbsoluteUrl(`/api/bases?slug=${slug}`)
  const res = await fetch(url, {
    next: { revalidate: 30 }
  })
  return res.json()
}

async function fetchNodes(baseId: string) {
  const url = await getAbsoluteUrl(`/api/nodes?baseId=${baseId}`)
  const res = await fetch(url)
  return res.json()
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { slug } = await params
  const detail = await fetchDetail(slug)
  return {
    title: `${detail.name} – ${detail.country} | Glomia Life`,
    description: `${detail.name} – ${detail.country}. Budget $${detail.monthlyCost}/mo, ${detail.internetMbps} Mbps, Visa ${detail.visaLevel}, Safety ${detail.safety}, Community ${detail.communityScore}.`
  }
}

export default async function BaseDetailPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params
  const detail = await fetchDetail(slug)
  const nodes = await fetchNodes(detail.id)
  const base = `/${locale}`
  return (
    <div>
      <div className="h-64 relative">
        <img src={detail.coverUrl} className="object-cover w-full h-full" alt={detail.name} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center text-white">
          <h1 className="text-3xl font-bold">{detail.name}</h1>
          <p className="text-sm opacity-80">{detail.country}</p>
        </div>
      </div>

      <div className="container-responsive py-6">
        {/* Summary row */}
        <ul className="mt-2 grid grid-cols-2 md:grid-cols-5 gap-2 text-sm text-neutral-600">
          <li>${detail.monthlyCost.toLocaleString()} / mo</li>
          <li>{detail.internetMbps} Mbps</li>
          <li>Visa: {['★☆☆','★★☆','★★★','★★★★','★★★★★'][detail.visaLevel-1] || detail.visaLevel}</li>
          <li>Safety {detail.safety.toFixed(1)}</li>
          <li>Community {detail.communityScore.toFixed(1)}</li>
        </ul>

        <div className="grid lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-2 space-y-6">
            <Section title="Timeline">
              <Timeline items={detail.timeline} />
            </Section>
            <Section title="Costs">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Housing', value: detail.cost.housing },
                  { label: 'Cowork', value: detail.cost.cowork },
                  { label: 'Food', value: detail.cost.food },
                  { label: 'Commute', value: detail.cost.commute }
                ].map((it) => (
                  <div key={it.label} className="card p-4">
                    <p className="text-sm text-gray-600">{it.label}</p>
                    <p className="text-xl font-semibold">{new Intl.NumberFormat(undefined, { style: 'currency', currency: detail.cost.currency }).format(it.value)}</p>
                  </div>
                ))}
              </div>
              <div className="mt-2 text-sm text-gray-600">
                Total ≈ {new Intl.NumberFormat(undefined, { style: 'currency', currency: detail.cost.currency }).format(
                  detail.cost.housing + detail.cost.cowork + detail.cost.food + detail.cost.commute
                )} / mo
              </div>
            </Section>
            <Section title="Map">
              <div id="map">
                <MapPlaceholder points={nodes.map((n: any) => ({ lat: n.geo.lat, lng: n.geo.lng, label: n.name }))} />
              </div>
            </Section>
            <Section title="Stories">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {detail.storyIds.map((sid: string) => (
                  <div key={sid} className="card p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <img src={`https://api.dicebear.com/7.x/fun-emoji/svg?seed=${sid}`} alt="avatar" className="w-8 h-8 rounded-full" />
                      <div className="text-sm">
                        <div className="font-medium">Community member</div>
                        <div className="text-gray-500 text-xs">Updated recently • ★★★★☆</div>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm">Community reviews and stories placeholder.</p>
                  </div>
                ))}
                <button className="card p-4 text-left text-brand">Write a story (WIP)</button>
              </div>
            </Section>
          </div>
          <aside className="space-y-6">
            <BaseActions baseId={detail.id} baseName={detail.name} />
            <div>
            <h4 className="font-semibold mb-2">Recommended Nodes</h4>
            <div className="grid grid-cols-1 gap-3">
              {nodes.slice(0, 3).map((n: any) => (
                <NodeCard key={n.id} node={n} href={`${base}/nodes/${n.id}`} />
              ))}
            </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
