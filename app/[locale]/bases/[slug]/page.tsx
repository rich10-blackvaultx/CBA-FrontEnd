import { Section } from '@/components/shared/Section'
import { Map } from '@/components/shared/Map'
import { BaseActions } from '@/components/base/BaseActions'
import { getAbsoluteUrl } from '@/lib/ssr-helpers'
import { SummaryBar } from '@/components/base/SummaryBar'
import { VerifyTimeline } from '@/components/base/VerifyTimeline'
import { CostGrid } from '@/components/base/CostGrid'
import { TrustSignals } from '@/components/base/TrustSignals'
import { NodeAbilityCard } from '@/components/base/NodeAbilityCard'
import type { BaseDetail } from '@/types/base'

async function fetchDetail(slug: string): Promise<BaseDetail> {
  const url = await getAbsoluteUrl(`/api/bases?slug=${slug}`)
  const res = await fetch(url, {
    next: { revalidate: 30 }
  })
  return res.json()
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { slug } = await params
  const detail = await fetchDetail(slug)
  return {
    title: `${detail.name} – ${detail.country} | Glomia Life`,
    description: `${detail.name} – ${detail.country}. Budget ${detail.summary.monthlyCost}/mo, ${detail.summary.internetMbps} Mbps, Visa ${detail.summary.visaLevel}, Safety ${detail.summary.safety}, Community ${detail.summary.community}.`
  }
}

export default async function BaseDetailPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params
  const detail = await fetchDetail(slug)
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
        <div className="mt-2">
          <SummaryBar summary={detail.summary} />
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-2 space-y-6">
            <VerifyTimeline items={detail.timeline} baseSlug={slug} />
            <CostGrid cost={detail.cost} />
            <Section title="Map">
              <div id="map">
                <Map points={[]} />
              </div>
            </Section>
            <Section title="Trust Signals">
              <TrustSignals signals={detail.signals} />
            </Section>
            <Section title="Stories">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {detail.stories?.map((s) => (
                  <div key={s.id} className="card p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <img src={s.avatar || `https://api.dicebear.com/7.x/fun-emoji/svg?seed=${s.id}`} alt="avatar" className="w-8 h-8 rounded-full" />
                      <div className="text-sm">
                        <div className="font-medium">{s.author}</div>
                        <div className="text-gray-500 text-xs">Updated {s.updatedAt}</div>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm">{s.content || 'Community reviews and stories placeholder.'}</p>
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
              {/* <div className="grid grid-cols-1 gap-3">
                {detail.nodes.slice(0, 3).map((n) => (
                  <NodeAbilityCard key={n.id} node={n} href={`${base}/nodes/${n.id}`} />
                ))}
              </div> */}
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

