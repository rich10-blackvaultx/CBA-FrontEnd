export function EmptyState({ title = 'Nothing here', desc = 'No data to show.' }: { title?: string; desc?: string }) {
  return (
    <div className="text-center text-gray-500 py-12">
      <p className="font-medium">{title}</p>
      <p className="text-sm">{desc}</p>
    </div>
  )
}

