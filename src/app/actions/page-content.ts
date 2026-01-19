'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'

export async function getPageContent() {
  try {
    return await prisma.pageContent.findMany({
      orderBy: [{ page: 'asc' }, { section: 'asc' }]
    })
  } catch (error) {
    console.error('Failed to fetch page content:', error)
    return []
  }
}

export async function updatePageContent(formData: FormData) {
  const updates = Array.from(formData.entries()).filter(([key]) => key.startsWith('content-'))

  for (const [key, value] of updates) {
    const id = key.replace('content-', '')
    await prisma.pageContent.update({
      where: { id },
      data: { value: value as string }
    })
  }

  revalidatePath('/')
  revalidatePath('/about')
  revalidatePath('/admin/pages')
}

export async function seedPageContent() {
  const defaultContents = [
    // Home Page
    { page: 'home', section: 'hero', key: 'title', value: '阿波的学习库' },
    { page: 'home', section: 'hero', key: 'description', value: '探索 AI 技术，打造超级个体' },
    
    // About Page
    { page: 'about', section: 'intro', key: 'title', value: '关于我' },
    { page: 'about', section: 'intro', key: 'description', value: '你好，我是阿波，一名内容创作者和 AI 爱好者。' },
    
    // Footer
    { page: 'footer', section: 'main', key: 'slogan', value: '用AI+IP成为强大的个体' },
    { page: 'footer', section: 'copyright', key: 'text', value: '© 2025 阿波. All rights reserved.' },
  ]

  for (const item of defaultContents) {
    await prisma.pageContent.upsert({
      where: {
        page_section_key: {
          page: item.page,
          section: item.section,
          key: item.key
        }
      },
      update: {}, // Don't overwrite if exists
      create: {
        page: item.page,
        section: item.section,
        key: item.key,
        value: item.value
      }
    })
  }

  revalidatePath('/admin/pages')
}
