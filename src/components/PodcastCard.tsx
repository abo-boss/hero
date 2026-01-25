import { ArrowUpRight } from 'lucide-react'
import { Post } from '@/lib/mdx'

interface PodcastCardProps {
  post: Post
}

export function PodcastCard({ post }: PodcastCardProps) {
  // 使用 tags 的第一个作为左上角标签，如果没有则显示 Podcast
  const tagLabel = post.tags?.[0] || "Podcast"
  
  return (
    <a 
      href={post.link || "#"} 
      target="_blank" 
      rel="noopener noreferrer"
      className="group flex flex-col h-full bg-white rounded-2xl border border-slate-100 p-8 transition-all hover:shadow-xl hover:-translate-y-1"
    >
      {/* Top Row: Tag + Date */}
      <div className="flex items-center justify-between mb-6">
        <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
          {tagLabel}
        </span>
        <span className="text-xs text-slate-400 font-medium">{post.author || post.date}</span>
      </div>

      {/* Content */}
      <div className="flex-1 mb-8">
        <h3 className="text-xl font-bold text-slate-900 mb-3 leading-tight group-hover:text-blue-600 transition-colors">
          {post.title}
        </h3>
        <p className="text-slate-500 text-sm leading-relaxed line-clamp-3">
          {post.description}
        </p>
      </div>

      {/* Footer: Read More */}
      <div className="flex items-center gap-1 text-sm font-medium text-slate-400 group-hover:text-blue-600 transition-colors">
         <span>阅读更多</span>
         <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </div>
    </a>
  )
}
