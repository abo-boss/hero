import Link from 'next/link'
import { Search as SearchComponent } from './Search'

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto px-4 flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center space-x-2 font-bold text-xl tracking-tight text-slate-900">
            <span>Hero.</span>
          </Link>
          <div className="hidden md:flex gap-6 text-sm font-medium text-slate-600">
            <Link href="/resources" className="hover:text-slate-900 transition-colors">资源库</Link>
            <Link href="/blog" className="hover:text-slate-900 transition-colors">博客</Link>
            <Link href="/about" className="hover:text-slate-900 transition-colors">关于</Link>
          </div>
        </div>
        <div className="flex items-center gap-4">
           <SearchComponent />
        </div>
      </div>
    </nav>
  )
}
