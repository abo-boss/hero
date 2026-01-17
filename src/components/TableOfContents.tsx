'use client'
import { useEffect, useState } from 'react'
import type { TocItem } from '@/lib/toc'

interface Props {
  toc: TocItem[]
}

export function TableOfContents({ toc }: Props) {
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: '0% 0% -80% 0%' }
    )

    toc.forEach((item) => {
      const element = document.getElementById(item.id)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [toc])

  if (toc.length === 0) return null

  return (
    <nav className="sticky top-24 self-start text-xs">
      <h3 className="font-bold text-slate-900 mb-3 uppercase tracking-wider text-[10px] text-slate-400">目录</h3>
      <ul className="space-y-1.5 border-l border-slate-100 relative">
        {toc.map((item) => (
          <li key={item.id} className="relative">
            <a
              href={`#${item.id}`}
              className={`block transition-all duration-200 pl-3 border-l-2 -ml-[1px] py-0.5 leading-snug ${
                activeId === item.id
                  ? 'border-slate-900 text-slate-900 font-medium'
                  : 'border-transparent text-slate-400 hover:text-slate-600 hover:border-slate-200'
              }`}
              style={{ paddingLeft: item.level === 3 ? '1rem' : '0.75rem' }}
              onClick={(e) => {
                e.preventDefault()
                document.getElementById(item.id)?.scrollIntoView({
                  behavior: 'smooth',
                })
              }}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
