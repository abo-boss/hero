import { prisma } from '@/lib/prisma'
import { MOCK_RESOURCES, MOCK_BLOGS } from './mock-data'

export type ResourceType = 'ai' | 'content-creation'

export interface Post {
  slug: string
  title: string
  date: string
  description: string
  tags: string[]
  category: string
  author?: string
  content: string
  duration?: string
  [key: string]: any
}

// Helper to convert Prisma Post to our Post interface
function mapPrismaPost(post: any): Post {
  return {
    ...post,
    date: post.date.toISOString(),
    tags: post.tags ? post.tags.split(',').map((t: string) => t.trim()) : [],
    duration: post.duration || undefined,
  }
}

export async function getAllPosts(section: 'blog' | 'resources' | 'resource', subType?: ResourceType) {
  // In our DB, 'resources' are stored as type='resource'
  // But legacy code might call it with 'resources'
  const type = section === 'resources' ? 'resource' : section
  
  const where: any = { type, published: true }
  
  if (subType) {
    // In migration, we stored subType (ai/content-creation) in 'category' for resources
    // But wait, 'category' in DB is 'ai', 'content-creation', etc.
    // Let's check how migration script did it:
    // type: 'resource', category: 'ai' or 'content-creation'
    where.category = subType
  }

  try {
    const posts = await prisma.post.findMany({
      where,
      orderBy: { date: 'desc' }
    })
    return posts.map(mapPrismaPost)
  } catch (e) {
    console.error('getAllPosts error:', e)
    // Fallback to mock data
    if (type === 'blog') return MOCK_BLOGS
    if (type === 'resource') {
      if (subType) return MOCK_RESOURCES.filter(p => p.category === subType)
      return MOCK_RESOURCES
    }
    return []
  }
}

export async function getPostBySlug(slug: string) {
  try {
    const post = await prisma.post.findUnique({
      where: { slug }
    })
    if (!post) return null
    return mapPrismaPost(post)
  } catch (e) {
    console.error('getPostBySlug error:', e)
    // Fallback to mock data
    const mockPost = [...MOCK_RESOURCES, ...MOCK_BLOGS].find(p => p.slug === slug)
    return mockPost || null
  }
}

export async function getAllResources() {
  try {
    const posts = await prisma.post.findMany({
      where: { 
        type: 'resource',
        published: true
      },
      orderBy: { date: 'desc' }
    })
    return posts.map(mapPrismaPost)
  } catch (e) {
    console.error('getAllResources error:', e)
    return MOCK_RESOURCES
  }
}
