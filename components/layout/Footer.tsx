export function Footer() {
  return (
    <footer className="border-t mt-12 py-10 text-sm text-gray-500 dark:border-gray-800 dark:text-gray-400">
      <div className="container-responsive flex flex-col sm:flex-row items-center justify-between gap-4">
        <p>© {new Date().getFullYear()} Glomia Life</p>
        <p>Made with Next 15 + React 19</p>
      </div>
    </footer>
  )
}
