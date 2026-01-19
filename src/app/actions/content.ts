'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { nanoid } from 'nanoid'
import { POST_TYPES, CATEGORIES, RESOURCE_TYPES } from '@/lib/constants'
import { prisma } from '@/lib/prisma'

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
  const posts = await prisma.post.findMany({
    orderBy: {
      date: 'desc',
    },
  })

  return posts
}

export async function getPost(id: string) {
  const post = await prisma.post.findFirst({
    where: {
      OR: [{ id }, { slug: id }],
    },
  })

  return post
}

export async function getPostBySlug(slug: string) {
  const post = await prisma.post.findUnique({
    where: { slug },
  })

  return post
}

export async function createPost(formData: FormData) {
  const data = parsePostFormData(formData)

  console.log('CREATE POST:', data)
  
  await prisma.post.create({
    data: {
      id: nanoid(),
      slug: data.slug,
      title: data.title,
      description: data.description,
      content: data.content,
      type: data.type,
      resourceType: data.resourceType,
      category: data.category,
      tags: data.tags,
      link: data.link,
      coverImage: data.coverImage,
      duration: data.duration,
      author: data.author,
      published: true,
      date: new Date(),
    },
  })
  
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

  await prisma.post.update({
    where: { id },
    data: {
      slug: data.slug,
      title: data.title,
      description: data.description,
      content: data.content,
      type: data.type,
      resourceType: data.resourceType,
      category: data.category,
      tags: data.tags,
      link: data.link,
      coverImage: data.coverImage,
      duration: data.duration,
      author: data.author,
    },
  })

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

  await prisma.post.delete({
    where: { id },
  })

  revalidatePath('/admin/content')
}
