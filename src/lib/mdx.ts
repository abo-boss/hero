import db from './db.json'

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
  
  // Read from local JSON file
  let posts = (db.posts as Post[]).filter(p => p.type === type)
  
  if (type === 'resource' && subType) {
    posts = posts.filter(p => p.category === subType)
  }
  
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export async function getPostBySlug(slug: string) {
  const allPosts = db.posts as Post[]
  const post = allPosts.find(p => p.slug === slug)
  return post || null
}

export async function getAllResources() {
  const posts = (db.posts as Post[]).filter(p => p.type === 'resource')
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}
