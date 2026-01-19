import { prisma } from '@/lib/prisma'

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

export async function getAllPosts(section: 'blog' | 'resources' | 'resource', subType?: ResourceType) {
  const type = section === 'resources' ? 'resource' : section

  const posts = await prisma.post.findMany({
    where: {
      type,
      ...(type === 'resource' && subType ? { category: subType } : {}),
      published: true,
    },
    orderBy: {
      date: 'desc',
    },
  })

  return posts.map((post) => ({
    ...post,
    date: post.date.toISOString(),
    tags: post.tags
      ? post.tags.split(',').map((t) => t.trim()).filter(Boolean)
      : [],
  })) as unknown as Post[]
}

export async function getPostBySlug(slug: string) {
  const post = await prisma.post.findUnique({
    where: { slug },
  })

  if (!post) return null

  return {
    ...post,
    date: post.date.toISOString(),
    tags: post.tags
      ? post.tags.split(',').map((t) => t.trim()).filter(Boolean)
      : [],
  } as unknown as Post
}

export async function getAllResources() {
  const posts = await prisma.post.findMany({
    where: {
      type: 'resource',
      published: true,
    },
    orderBy: {
      date: 'desc',
    },
  })

  return posts.map((post) => ({
    ...post,
    date: post.date.toISOString(),
    tags: post.tags
      ? post.tags.split(',').map((t) => t.trim()).filter(Boolean)
      : [],
  })) as unknown as Post[]
}
