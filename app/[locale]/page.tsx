import { HomeHero } from '@/components/sections/HomeHero'
import { getAbsoluteUrl } from '@/lib/ssr-helpers'

async function getHomeData() {
  const [basesUrl] = await Promise.all([
    getAbsoluteUrl('/api/bases'),
    // getAbsoluteUrl('/api/nodes'),
    // getAbsoluteUrl('/api/community')
  ])
  const [basesRes] = await Promise.all([
    fetch(basesUrl, { next: { revalidate: 60 } }),
    // fetch(nodesUrl, { next: { revalidate: 60 } }),
    // fetch(postsUrl, { next: { revalidate: 60 } })
  ])
  const [bases] = await Promise.all([basesRes.json()])
  return { bases: bases?.data?.items?.slice(0, 8)}
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { bases } = await getHomeData()
  const { locale } = await params
  const base = `/${locale}`
  return (
    <div>
      <HomeHero ctaHref={`${base}/bases`} slides={bases.slice(0,5).map((b:any)=>({ image: b.cover_image_url, title: b.name, subtitle: b.country }))} />
    </div>
  )
}
