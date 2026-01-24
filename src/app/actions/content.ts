 'use server'
 
 import { prisma } from '@/lib/prisma'
 import { revalidatePath } from 'next/cache'
 import { redirect } from 'next/navigation'
 import { nanoid } from 'nanoid'
 
 export async function getPosts() {
   try {
     return await prisma.post.findMany({
       orderBy: { date: 'desc' }
     })
   } catch (error) {
     console.error('Failed to fetch posts:', error)
     return []
   }
 }
 
 export async function getPost(id: string) {
   try {
     return await prisma.post.findUnique({
       where: { id }
     })
   } catch (error) {
     console.error('Failed to fetch post by id:', error)
     return null
   }
 }
 
 export async function getPostBySlug(slug: string) {
   try {
     return await prisma.post.findUnique({
       where: { slug }
     })
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
 
   await prisma.post.create({
     data: {
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
       date: new Date(),
     }
   })
 
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
 
   await prisma.post.update({
     where: { id },
     data: {
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
   })
 
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
   await prisma.post.delete({
     where: { id }
   })
 
   revalidatePath('/admin/content')
 }
