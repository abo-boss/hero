'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { nanoid } from 'nanoid'
import { POST_TYPES, CATEGORIES, RESOURCE_TYPES } from '@/lib/constants'
import { MOCK_RESOURCES, MOCK_BLOGS } from '@/lib/mock-data'

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
  return [...MOCK_RESOURCES, ...MOCK_BLOGS].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export async function getPost(id: string) {
  // In mock data mode, we might not have 'id', but we can try to find by slug or just return null
  // The Admin Edit page uses this. Let's assume slug matches id for mock, or just fail gracefully.
  // Actually, for mock data, let's treat 'id' as 'slug' if id is not found
  const allPosts = [...MOCK_RESOURCES, ...MOCK_BLOGS]
  const post = allPosts.find(p => p.slug === id || p.id === id)
  return post || null
}

export async function getPostBySlug(slug: string) {
  const allPosts = [...MOCK_RESOURCES, ...MOCK_BLOGS]
  const post = allPosts.find(p => p.slug === slug)
  return post || null
}

export async function createPost(formData: FormData) {
  const data = parsePostFormData(formData)

  console.log('CREATE POST (File Mode - No Persistence):', data)
  // In a real file-based CMS, we would write this to a JSON/MDX file here.
  // For now, this just logs and redirects.
  
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

  console.log('UPDATE POST (File Mode - No Persistence):', id, data)

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
  console.log('DELETE POST (File Mode - No Persistence):', id)
  revalidatePath('/admin/content')
}
