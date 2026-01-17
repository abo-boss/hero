import { ExternalLink, ArrowUpRight } from 'lucide-react'
import { Post } from '@/lib/mdx'
import { useState } from 'react'

interface ProductCardProps {
  post: Post
}

export function ProductCard({ post }: ProductCardProps) {
  // 提取域名用于 fallback
  const getDomain = (url?: string) => {
    if (!url) return ''
    try {
      return new URL(url).hostname
    } catch {
      return ''
    }
  }

  const domain = getDomain(post.link || '')
  
  // 图片源优先级状态
  // 1. post.coverImage (通常是 Clearbit)
  // 2. Google Favicon (高清)
  // 3. DuckDuckGo Favicon (备选)
  // 4. DiceBear (最终兜底)
  const [imgSrc, setImgSrc] = useState(post.coverImage || `https://www.google.com/s2/favicons?domain=${domain}&sz=128`)
  const [errorCount, setErrorCount] = useState(0)

  const handleError = () => {
    // 级联回退策略
    if (errorCount === 0) {
      // 第一次失败 (Clearbit/Google 挂了)：尝试 Google (如果初始不是 Google) 或 DuckDuckGo
      if (!imgSrc.includes('google.com')) {
         setImgSrc(`https://www.google.com/s2/favicons?domain=${domain}&sz=128`)
      } else {
         setImgSrc(`https://icons.duckduckgo.com/ip3/${domain}.ico`)
      }
      setErrorCount(1)
    } else if (errorCount === 1) {
      // 第二次失败：尝试 DuckDuckGo (如果刚才没试过)
      if (!imgSrc.includes('duckduckgo.com')) {
        setImgSrc(`https://icons.duckduckgo.com/ip3/${domain}.ico`)
      } else {
        // 如果已经试过 DDG，直接去兜底
        setImgSrc(`https://ui-avatars.com/api/?name=${encodeURIComponent(post.title)}&background=random&color=fff&size=128`)
      }
      setErrorCount(2)
    } else if (errorCount === 2) {
      // 第三次失败：使用 UI Avatars 生成字母头像
      setImgSrc(`https://ui-avatars.com/api/?name=${encodeURIComponent(post.title)}&background=random&color=fff&size=128`)
      setErrorCount(3)
    }
  }
  
  return (
    <a 
      href={post.link || "#"} 
      target="_blank" 
      rel="noopener noreferrer"
      className="group flex flex-col h-full bg-white rounded-2xl border border-slate-100 p-6 transition-all hover:shadow-lg hover:border-slate-200 hover:-translate-y-1"
    >
      <div className="flex items-start gap-4 mb-4">
        {/* App Icon */}
        <div className="w-12 h-12 rounded-xl bg-slate-50 overflow-hidden shrink-0 border border-slate-100 group-hover:border-blue-100 transition-colors">
          <img 
            src={imgSrc} 
            onError={handleError}
            alt={post.title}
            className="w-full h-full object-cover p-2"
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-base font-bold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
              {post.title}
            </h3>
            <ExternalLink className="w-4 h-4 text-slate-300 group-hover:text-blue-400 transition-colors shrink-0" />
          </div>
          <p className="text-slate-500 text-xs mt-1 line-clamp-2 leading-relaxed">
            {post.description}
          </p>
        </div>
      </div>

      <div className="mt-auto pt-2 flex items-center text-xs font-medium text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 duration-300">
         <ArrowUpRight className="w-3 h-3 mr-1" />
         Visit Website
      </div>
    </a>
  )
}
