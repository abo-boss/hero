
'use server'

import { PrismaClient } from '@prisma/client'
import { revalidatePath } from 'next/cache'

const prisma = new PrismaClient()

export async function getTagPresets(key: string): Promise<string[]> {
  const preset = await prisma.tagPreset.findUnique({
    where: { key }
  })
  
  if (!preset) return []
  
  return preset.tags.split(',').map(t => t.trim()).filter(Boolean)
}

export async function updateTagPresets(key: string, tags: string[]) {
  const tagsStr = tags.join(',')
  
  // Upsert
  await prisma.tagPreset.upsert({
    where: { key },
    update: { tags: tagsStr },
    create: { key, tags: tagsStr }
  })

  // Revalidate everything since tags might be used anywhere
  revalidatePath('/admin')
  revalidatePath('/resources')
}

export async function getAllTagPresets() {
  const presets = await prisma.tagPreset.findMany()
  const result: Record<string, string[]> = {}
  
  presets.forEach(p => {
    result[p.key] = p.tags.split(',').map(t => t.trim()).filter(Boolean)
  })
  
  return result
}
