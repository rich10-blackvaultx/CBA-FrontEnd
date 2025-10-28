import { getAbsoluteUrl } from '@/lib/ssr-helpers'

async function getData() {
  const url = await getAbsoluteUrl('/api/community/leaderboard')
  const res = await fetch(url, { next: { revalidate: 60 } })
  return res.json()
}

export default async function LeaderboardPage() {
  const data = await getData()
  return (
    <div className="container-responsive py-6 space-y-4">
      <h1 className="text-2xl font-semibold">Leaderboard</h1>
      <div className="card p-4">
        <div className="grid grid-cols-12 text-sm font-medium pb-2 border-b dark:border-gray-800">
          <div className="col-span-1">#</div>
          <div className="col-span-7">Contributor</div>
          <div className="col-span-2">Projects</div>
          <div className="col-span-2 text-right">Points</div>
        </div>
        <div className="divide-y dark:divide-gray-800">
          {data.map((x: any, i: number) => (
            <div key={x.id} className="grid grid-cols-12 items-center py-2 text-sm">
              <div className="col-span-1">{i + 1}</div>
              <div className="col-span-7 flex items-center gap-3">
                <img src={x.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${x.name}`} className="h-8 w-8 rounded-full" alt={x.name} />
                <div>
                  <div className="font-medium">{x.name}</div>
                  {x.skills?.length ? <div className="text-xs text-gray-600 dark:text-gray-400">{x.skills.join(', ')}</div> : null}
                </div>
              </div>
              <div className="col-span-2">{x.projects?.length || '-'}</div>
              <div className="col-span-2 text-right">{x.points}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

