export function Section({ title, children, action }: { title: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <section className="my-8">
      <div className="container-responsive">
        <div className="flex items-end justify-between mb-4">
          <h2 className="text-xl font-semibold">{title}</h2>
          {action}
        </div>
        {children}
      </div>
    </section>
  )
}

