export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
import { NextResponse } from 'next/server'
import { getAllPosts } from '@/lib/mdx'

export async function GET() {
  // 分别获取不同目录下的资源，以便正确指定路由分类 (category)
  // 避免 frontmatter 中的 category (如 cc-video) 导致路由 404
  const aiPosts = await getAllPosts('resources', 'ai')
  const contentPosts = await getAllPosts('resources', 'content-creation')
  const blogPosts = await getAllPosts('blog')
  
  const allContent = [
    ...aiPosts.map(post => ({
      title: post.title,
      slug: post.slug,
      description: post.description,
      tags: post.tags,
      type: 'resource',
      category: 'ai' // 强制路由分类为 ai
    })),
    ...contentPosts.map(post => ({
      title: post.title,
      slug: post.slug,
      description: post.description,
      tags: post.tags,
      type: 'resource',
      category: 'content-creation' // 强制路由分类为 content-creation
    })),
    ...blogPosts.map(post => ({
      title: post.title,
      slug: post.slug,
      description: post.description,
      tags: post.tags,
      type: 'blog',
      category: 'blog'
    }))
  ]

  return NextResponse.json(allContent)
}
