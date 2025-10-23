import Link from 'next/link'
import { Section } from '@/components/shared/Section'
import { Carousel } from '@/components/shared/Carousel'
import { BaseCard } from '@/components/cards/BaseCard'
import { NodeCard } from '@/components/cards/NodeCard'
import { PostCard } from '@/components/cards/PostCard'
import { getAbsoluteUrl } from '@/lib/ssr-helpers'

async function getHomeData() {
  const [basesUrl, nodesUrl, postsUrl] = await Promise.all([
    getAbsoluteUrl('/api/bases'),
    getAbsoluteUrl('/api/nodes'),
    getAbsoluteUrl('/api/community')
  ])
  const [basesRes, nodesRes, postsRes] = await Promise.all([
    fetch(basesUrl, { next: { revalidate: 60 } }),
    fetch(nodesUrl, { next: { revalidate: 60 } }),
    fetch(postsUrl, { next: { revalidate: 60 } })
  ])
  const [bases, nodes, posts] = await Promise.all([basesRes.json(), nodesRes.json(), postsRes.json()])
  return { bases: bases.slice(0, 8), nodes: nodes.slice(0, 8), posts: posts.slice(0, 8) }
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { bases, nodes, posts } = await getHomeData()
  const { locale } = await params
  const base = `/${locale}`
  return (
    <div>
      <section className="py-16 bg-gradient-to-b from-blue-50 to-white border-b">
        <div className="container-responsive text-center">
          <h1 className="text-4xl font-bold">Start Glomia life</h1>
          <p className="mt-3 text-gray-600">Explore bases, nodes and stories across the world</p>
          <div className="mt-6">
            <Link href={`${base}/bases`} className="px-6 py-3 rounded-md bg-brand text-white">
              Explore Bases
            </Link>
          </div>
        </div>
      </section>

      <Section title="Featured Bases" action={<Link href={`${base}/bases`} className="text-brand">See all</Link>}>
        <Carousel>
          {bases.map((b: any, i: number) => (
            <BaseCard
              key={b.id}
              base={b}
              href={`${base}/bases/${b.slug}`}
              ctaLabel={i === 0 ? 'Lets Journey' : 'More'}
              emphasized={i === 0}
            />
          ))}
        </Carousel>
      </Section>

      <Section title="Featured Nodes" action={<Link href={`${base}/nodes`} className="text-brand">See all</Link>}>
        <Carousel>
          {nodes.map((n: any) => (
            <NodeCard key={n.id} node={n} href={`${base}/nodes/${n.id}`} />
          ))}
        </Carousel>
      </Section>

      <Section title="Community Stories" action={<Link href={`${base}/community`} className="text-brand">See all</Link>}>
        <Carousel>
          {posts.map((p: any) => (
            <PostCard key={p.id} post={p} href={`${base}/community/post/${p.id}`} />
          ))}
        </Carousel>
      </Section>
    </div>
  )
}
