'use server'

import { PrismaClient } from '@prisma/client'
import { revalidatePath } from 'next/cache'

const prisma = new PrismaClient()

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
