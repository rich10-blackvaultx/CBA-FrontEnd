export function StoryCard({ story }: { story: { id: string; title: string; excerpt: string; coverUrl?: string; author?: string } }) {
  return (
    <div className="card w-72 shrink-0 snap-start">
      {story.coverUrl && <img src={story.coverUrl} alt={story.title} className="cover-img" />}
      <div className="p-4">
        <h3 className="font-semibold">{story.title}</h3>
        <p className="text-sm text-gray-600 mt-2 line-clamp-3">{story.excerpt}</p>
      </div>
    </div>
  )
}

