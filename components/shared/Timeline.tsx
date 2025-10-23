export function Timeline({
  items
}: {
  items: { day: number; title: string; desc: string; icon?: string }[]
}) {
  return (
    <ol className="relative border-s-2 border-gray-100 ml-3">
      {items.map((i) => (
        <li key={i.day} className="mb-8 ms-6">
          <span className="absolute -start-3 flex h-6 w-6 items-center justify-center rounded-full bg-brand text-white text-xs">
            {i.day}
          </span>
          <h4 className="font-semibold">{i.title}</h4>
          <p className="text-gray-600 text-sm">{i.desc}</p>
        </li>
      ))}
    </ol>
  )
}

