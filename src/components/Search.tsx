'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Search as SearchIcon, X, Loader2, FileText, Video, Mic } from 'lucide-react'
import Link from 'next/link'

interface SearchResult {
  title: string
  slug: string
  description: string
  tags: string[]
  type: 'resource' | 'blog'
  category: string
}

export function Search() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [allData, setAllData] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  // Load data once when component mounts (or when first opened)
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const res = await fetch('/api/search')
        const data = await res.json()
        setAllData(data)
      } catch (error) {
        console.error('Failed to fetch search data', error)
      } finally {
        setLoading(false)
      }
    }

    if (isOpen && allData.length === 0) {
      fetchData()
    }
  }, [isOpen, allData.length])

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen])

  // Handle search
  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }

    const lowercaseQuery = query.toLowerCase()
    const filtered = allData.filter(item => {
      return (
        item.title.toLowerCase().includes(lowercaseQuery) ||
        item.description?.toLowerCase().includes(lowercaseQuery) ||
        item.tags?.some(tag => tag.toLowerCase().includes(lowercaseQuery))
      )
    }).slice(0, 10) // Limit to 10 results

    setResults(filtered)
  }, [query, allData])

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false)
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen(true)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleSelect = (item: SearchResult) => {
    setIsOpen(false)
    setQuery('')
    
    // Blog 跳转
    if (item.category === 'blog' || item.type === 'blog') {
      router.push(`/blog/${item.slug}`)
      return
    }

    // Resource 跳转
    // 确保 category 是 ai 或 content-creation，如果不是，尝试根据 path 或其他信息推断，或者给默认值
    // 这里我们直接信任 item.category，但要注意 API 返回的 category 是否正确对应路由段
    // 在 getAllResources 中，我们强制覆盖了 category 为 'ai' 或 'content-creation'
    router.push(`/resources/${item.category}/${item.slug}`)
  }

  const getIcon = (item: SearchResult) => {
    if (item.category === 'podcast' || item.category === 'cc-podcast') return <Mic className="w-4 h-4 text-purple-500" />
    if (item.category === 'ai' || item.category === 'cc-video') return <Video className="w-4 h-4 text-blue-500" />
    return <FileText className="w-4 h-4 text-slate-500" />
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500 hover:text-slate-900"
      >
        <SearchIcon className="h-5 w-5" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4">
          <div 
            className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity" 
            onClick={() => setIsOpen(false)}
          />
          
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl ring-1 ring-slate-900/5 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center border-b border-slate-100 px-4 py-3">
              <SearchIcon className="w-5 h-5 text-slate-400 mr-3" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="搜索资源、文章、标签..."
                className="flex-1 bg-transparent text-lg outline-none placeholder:text-slate-400 text-slate-900 h-10"
              />
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto scrollbar-hide p-2">
              {loading && allData.length === 0 && (
                <div className="flex items-center justify-center py-12 text-slate-400">
                  <Loader2 className="w-6 h-6 animate-spin mr-2" />
                  加载索引中...
                </div>
              )}

              {!loading && query && results.length === 0 && (
                <div className="py-12 text-center text-slate-500 text-sm">
                  未找到与 "{query}" 相关的内容
                </div>
              )}

              {!query && allData.length > 0 && (
                <div className="px-2 py-8 text-center">
                  <p className="text-sm text-slate-400 mb-4">尝试搜索</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {['ChatGPT', 'Cursor', 'Prompt', '个人品牌', '写作'].map(tag => (
                      <button
                        key={tag}
                        onClick={() => setQuery(tag)}
                        className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 rounded-lg text-sm text-slate-600 transition-colors border border-slate-100"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {results.length > 0 && (
                <div className="space-y-1">
                  {results.map((item) => (
                    <button
                      key={item.slug}
                      onClick={() => handleSelect(item)}
                      className="w-full text-left flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors group"
                    >
                      <div className="mt-1 p-2 bg-white border border-slate-100 rounded-lg shadow-sm group-hover:border-slate-200 group-hover:shadow-md transition-all">
                        {getIcon(item)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                          {item.title}
                        </h4>
                        <p className="text-xs text-slate-500 truncate mt-0.5">
                          {item.description}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {item.tags?.slice(0, 3).map(tag => (
                            <span key={tag} className="text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded-md">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="text-[10px] font-medium text-slate-400 uppercase tracking-wider mt-1.5">
                        {item.type === 'blog' ? 'Blog' : 'Resource'}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
