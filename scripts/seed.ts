import fs from 'node:fs/promises'
import path from 'node:path'

const baseDir = path.join(process.cwd(), 'app', 'api', '_data')

async function ensure(file: string, data: any) {
  const p = path.join(baseDir, file)
  try {
    await fs.access(p)
    console.log('exists', file)
  } catch {
    await fs.mkdir(baseDir, { recursive: true })
    await fs.writeFile(p, JSON.stringify(data, null, 2), 'utf-8')
    console.log('seeded', file)
  }
}

async function main() {
  await ensure('bases.json', [
    {
      id: 'base-bali',
      slug: 'bali',
      name: 'Bali Ubud',
      country: 'Indonesia',
      coverUrl: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1400&auto=format&fit=crop',
      monthlyCost: 1200,
      internetMbps: 200,
      visaLevel: 2,
      climate: 'tropical',
      safety: 4.2,
      communityScore: 4.6,
      timeline: [
        { day: 1, title: 'Arrival', desc: 'Check-in and orientation.' },
        { day: 2, title: 'Adapt', desc: 'Find your rhythm and workspace.' },
        { day: 3, title: 'Connect', desc: 'Meet community members.' },
        { day: 4, title: 'Co-create', desc: 'Hack and collaborate.' },
        { day: 5, title: 'Grow', desc: 'Share outcomes and next steps.' }
      ],
      cost: { housing: 700, cowork: 200, food: 250, commute: 50, currency: 'USD' },
      storyIds: ['s1', 's2'],
      nodeIds: ['node-ubud-cafe', 'node-ubud-cowork']
    }
  ])
  await ensure('nodes.json', [
    {
      id: 'node-ubud-cafe',
      baseId: 'base-bali',
      name: 'Ubud Jungle Cafe',
      type: 'cafe',
      coverUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1400&auto=format&fit=crop',
      geo: { lat: -8.5069, lng: 115.2625 },
      address: 'Jalan Hanoman, Ubud',
      openTime: '08:00-20:00',
      seats: 30,
      tags: ['wifi', 'outdoor'],
      eventIds: []
    }
  ])
  await ensure('posts.json', [
    {
      id: 'p1',
      title: 'How to get started in Bali',
      coverUrl: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=1400&auto=format&fit=crop',
      author: 'Alice',
      createdAt: new Date().toISOString(),
      tags: ['bali', 'guide'],
      excerpt: 'Everything you need to know for your first week in Ubud.',
      content: 'Detailed guide with maps and tips.'
    }
  ])
  await ensure('activities.json', [
    {
      id: 'act-1',
      title: 'Ubud Hack Night',
      intro: 'Weekly hack and share.',
      nodeId: 'node-ubud-cowork',
      baseId: 'base-bali',
      quota: 40,
      startAt: new Date().toISOString(),
      endAt: new Date(Date.now() + 7200000).toISOString(),
      price: 0,
      poster: '',
      creator: '0x0000000000000000000000000000000000000000'
    }
  ])
}

main()
  .then(() => console.log('Seed done'))
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })

