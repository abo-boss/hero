import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { Post } from '@/lib/mdx'

interface ResourceCardProps {
  post: Post
  type?: 'resource' | 'blog'
}

export function ResourceCard({ post, type = 'resource' }: ResourceCardProps) {
  const isExternal = type === 'resource' && post.link
  const href = isExternal 
    ? post.link!
    : type === 'blog' 
      ? `/blog/${post.slug}` 
      : `/resources/${post.category === 'ai' ? 'ai' : 'content-creation'}/${post.slug}`

  const Component = isExternal ? 'a' : Link
  const props = isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {}

  // 格式化日期
  const date = new Date(post.date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })

  return (
    <Component href={href} {...props} className="group flex flex-col justify-between rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-slate-200">
       <div>
         <div className="flex items-center justify-between mb-4">
           <span className="inline-block px-3 py-1 rounded-full bg-slate-50 text-slate-600 text-xs font-semibold uppercase tracking-wider">
             {post.category === 'ai' ? 'AI 学习' : post.category === 'content-creation' ? '内容创作' : post.category}
           </span>
           <span className="text-slate-400 text-xs">
             {post.author ? post.author : date}
           </span>
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
          {post.title}
        </h3>
        <p className="text-slate-500 text-sm line-clamp-3 leading-relaxed">
          {post.description}
        </p>
      </div>
      <div className="mt-6 flex items-center text-sm font-medium text-blue-600">
        阅读更多 <ArrowUpRight className="ml-1 h-4 w-4" />
      </div>
    </Component>
  )
}
