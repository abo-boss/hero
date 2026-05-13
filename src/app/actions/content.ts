'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { nanoid } from 'nanoid'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_ANON_KEY!

function getSupabaseClient() {
  return createClient(supabaseUrl, supabaseKey)
}

export async function getPosts() {
  try {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from('Post')
      .select('*')
      .order('date', { ascending: false })
    
    if (error) {
      console.error('Failed to fetch posts:', error)
      return []
    }
    
    // 将日期字符串转换为 Date 对象
    return (data || []).map(post => ({
      ...post,
      date: new Date(post.date)
    }))
  } catch (error) {
    console.error('Failed to fetch posts:', error)
    return []
  }
}

export async function getPost(id: string) {
  try {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from('Post')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error || !data) {
      console.error('Failed to fetch post by id:', error)
      return null
    }
    
    return {
      ...data,
      date: new Date(data.date)
    }
  } catch (error) {
    console.error('Failed to fetch post by id:', error)
    return null
  }
}

export async function getPostBySlug(slug: string) {
  try {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from('Post')
      .select('*')
      .eq('slug', slug)
      .single()
    
    if (error || !data) {
      console.error('Failed to fetch post by slug:', error)
      return null
    }
    
    return {
      ...data,
      date: new Date(data.date)
    }
  } catch (error) {
    console.error('Failed to fetch post by slug:', error)
    return null
  }
}

export async function createPost(formData: FormData) {
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

  if (!slug || slug.trim() === '') {
    slug = nanoid(10)
  }

  const supabase = getSupabaseClient()
  const { error } = await supabase.from('Post').insert({
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
    date: new Date().toISOString(),
  })

  if (error) {
    console.error('Failed to create post:', error)
    return
  }

  revalidatePath('/admin/content')
  revalidatePath('/admin/blog')
  revalidatePath('/admin/resources/ai/video')
  revalidatePath('/admin/resources/ai/podcast')
  revalidatePath('/admin/resources/ai/tool')
  revalidatePath('/admin/resources/content-creation/video')
  revalidatePath('/admin/resources/content-creation/podcast')
  revalidatePath('/admin/resources/content-creation/article')

  revalidatePath('/blog')
  revalidatePath('/resources')
  revalidatePath(`/blog/${slug}`)
  revalidatePath(`/resources/${category}/${slug}`)

  if (type === 'blog') {
    redirect('/admin/blog')
  } else if (category === 'ai') {
    redirect(`/admin/resources/ai/${resourceType || 'article'}`)
  } else if (category === 'content-creation') {
    redirect(`/admin/resources/content-creation/${resourceType || 'article'}`)
  } else {
    redirect('/admin')
  }
}

export async function updatePost(id: string, formData: FormData) {
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

  if (!slug || slug.trim() === '') {
    slug = nanoid(10)
  }

  const supabase = getSupabaseClient()
  const { error } = await supabase
    .from('Post')
    .update({
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
    })
    .eq('id', id)

  if (error) {
    console.error('Failed to update post:', error)
    return
  }

  revalidatePath('/admin/content')
  revalidatePath('/admin/blog')
  revalidatePath(`/admin/content/${id}`)
  revalidatePath('/admin/resources/ai/video')
  revalidatePath('/admin/resources/ai/podcast')
  revalidatePath('/admin/resources/ai/tool')
  revalidatePath('/admin/resources/content-creation/video')
  revalidatePath('/admin/resources/content-creation/podcast')
  revalidatePath('/admin/resources/content-creation/article')

  revalidatePath('/blog')
  revalidatePath('/resources')
  revalidatePath(`/blog/${slug}`)
  revalidatePath(`/resources/${category}/${slug}`)

  if (type === 'blog') {
    redirect('/admin/blog')
  } else if (category === 'ai') {
    redirect(`/admin/resources/ai/${resourceType || 'article'}`)
  } else if (category === 'content-creation') {
    redirect(`/admin/resources/content-creation/${resourceType || 'article'}`)
  } else {
    redirect('/admin')
  }
}

export async function deletePost(id: string) {
  const supabase = getSupabaseClient()
  const { error } = await supabase
    .from('Post')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Failed to delete post:', error)
    return
  }

  revalidatePath('/admin/content')
}
