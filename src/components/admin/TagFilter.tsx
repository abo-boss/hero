'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronDown, X } from 'lucide-react'

interface TagFilterProps {
  tags: string[]
  selectedTag: string | null
}

export function TagFilter({ tags, selectedTag }: TagFilterProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  const handleSelect = (tag: string | null) => {
    setIsOpen(false)
    const url = new URL(window.location.href)
    if (tag) {
      url.searchParams.set('tag', tag)
    } else {
      url.searchParams.delete('tag')
    }
    router.push(url.pathname + url.search)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${
          selectedTag
            ? 'bg-blue-50 text-blue-700 border-blue-200'
            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
        }`}
      >
        {selectedTag ? (
          <>
            <span className="font-normal text-slate-500">标签:</span>
            {selectedTag}
            <span
              onClick={(e) => {
                e.stopPropagation()
                handleSelect(null)
              }}
              className="ml-1 p-0.5 rounded-full hover:bg-blue-100 cursor-pointer"
            >
              <X className="w-3 h-3" />
            </span>
          </>
        ) : (
          <>
            筛选标签
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </>
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-slate-100 py-1 z-20 max-h-64 overflow-y-auto">
            <button
              onClick={() => handleSelect(null)}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 ${
                !selectedTag ? 'text-blue-600 font-medium' : 'text-slate-700'
              }`}
            >
              全部
            </button>
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => handleSelect(tag)}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 ${
                  selectedTag === tag ? 'text-blue-600 font-medium' : 'text-slate-700'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
