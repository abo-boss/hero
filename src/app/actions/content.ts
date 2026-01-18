'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { nanoid } from 'nanoid'
import { POST_TYPES, CATEGORIES, RESOURCE_TYPES } from '@/lib/constants'
import db from '@/lib/db.json'
import fs from 'fs'
import path from 'path'

// Helper to save to db.json (Only works in local dev environment)
function saveToDb(newDb: any) {
  if (process.env.NODE_ENV === 'development') {
    const dbPath = path.join(process.cwd(), 'src/lib/db.json')
    fs.writeFileSync(dbPath, JSON.stringify(newDb, null, 2))
    console.log('Saved to local DB file:', dbPath)
  } else {
    console.warn('Cannot write to file system in production (Vercel is read-only).')
  }
}

// Helper to extract and process form data
function parsePostFormData(formData: FormData) {
  const title = formData.get('title') as string
  let slug = formData.get('slug') as string
  const content = formData.get('content') as string
  const description = formData.get('description') as string
  const type = formData.get('type') as string
  const category = formData.get('category') as string
  const tags = formData.get('tags') as string
  const link = formData.get('link') as string
  const resourceType = formData.get('resourceType') as string
  const author = formData.get('author') as string
  const duration = formData.get('duration') as string
  const coverImage = formData.get('coverImage') as string

  // Auto-generate slug if empty
  if (!slug || slug.trim() === '') {
    slug = nanoid(10)
  }

  return {
    title,
    slug,
    content,
    description,
    type,
    category,
    tags,
    link: link || null,
    resourceType: resourceType || null,
    author: author || null,
    duration: duration || null,
    coverImage: coverImage || null,
  }
}

// Helper to handle redirects based on post type and category
function handlePostRedirect(type: string, category: string, resourceType: string | null) {
  if (type === POST_TYPES.BLOG) {
    redirect('/admin/blog')
  } else if (category === CATEGORIES.AI) {
    redirect(`/admin/resources/ai/${resourceType || RESOURCE_TYPES.ARTICLE}`)
  } else if (category === CATEGORIES.CONTENT_CREATION) {
    redirect(`/admin/resources/content-creation/${resourceType || RESOURCE_TYPES.ARTICLE}`)
  } else {
    redirect('/admin')
  }
}

export async function getPosts() {
  return (db.posts as any[]).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export async function getPost(id: string) {
  const allPosts = db.posts as any[]
  const post = allPosts.find(p => p.slug === id || p.id === id)
  return post || null
}

export async function getPostBySlug(slug: string) {
  const allPosts = db.posts as any[]
  const post = allPosts.find(p => p.slug === slug)
  return post || null
}

export async function createPost(formData: FormData) {
  const data = parsePostFormData(formData)

  console.log('CREATE POST:', data)
  
  const newPost = {
    ...data,
    id: nanoid(),
    date: new Date().toISOString(),
  }
  
  const newDb = {
    ...db,
    posts: [newPost, ...db.posts]
  }
  
  saveToDb(newDb)
  
  // Revalidate Admin Paths
  revalidatePath('/admin/content')
  revalidatePath('/admin/blog')
  // New granular paths
  revalidatePath('/admin/resources/ai/video')
  revalidatePath('/admin/resources/ai/podcast')
  revalidatePath('/admin/resources/ai/tool')
  revalidatePath('/admin/resources/content-creation/video')
  revalidatePath('/admin/resources/content-creation/podcast')
  revalidatePath('/admin/resources/content-creation/article')
  
  // Revalidate Public Paths
  revalidatePath('/blog')
  revalidatePath('/resources')
  revalidatePath(`/blog/${data.slug}`)
  revalidatePath(`/resources/${data.category}/${data.slug}`)
  
  handlePostRedirect(data.type, data.category, data.resourceType)
}

export async function updatePost(id: string, formData: FormData) {
  const data = parsePostFormData(formData)

  console.log('UPDATE POST:', id, data)

  const posts = db.posts as any[]
  const index = posts.findIndex(p => p.id === id || p.slug === id)
  
  if (index !== -1) {
    const updatedPost = {
      ...posts[index],
      ...data,
      date: new Date().toISOString() // Update date on edit? Or keep original? Usually keep original unless republishing.
    }
    
    const newPosts = [...posts]
    newPosts[index] = updatedPost
    
    const newDb = {
      ...db,
      posts: newPosts
    }
    
    saveToDb(newDb)
  }

  // Revalidate Admin Paths
  revalidatePath('/admin/content')
  revalidatePath('/admin/blog')
  revalidatePath(`/admin/content/${id}`)
  // New granular paths
  revalidatePath('/admin/resources/ai/video')
  revalidatePath('/admin/resources/ai/podcast')
  revalidatePath('/admin/resources/ai/tool')
  revalidatePath('/admin/resources/content-creation/video')
  revalidatePath('/admin/resources/content-creation/podcast')
  revalidatePath('/admin/resources/content-creation/article')

  // Revalidate Public Paths
  revalidatePath('/blog')
  revalidatePath('/resources')
  revalidatePath(`/blog/${data.slug}`)
  revalidatePath(`/resources/${data.category}/${data.slug}`)
  
  handlePostRedirect(data.type, data.category, data.resourceType)
}

export async function deletePost(id: string) {
  console.log('DELETE POST:', id)
  
  const posts = db.posts as any[]
  const newPosts = posts.filter(p => p.id !== id && p.slug !== id)
  
  const newDb = {
    ...db,
    posts: newPosts
  }
  
  saveToDb(newDb)

  revalidatePath('/admin/content')
}
