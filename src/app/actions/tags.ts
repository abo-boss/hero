
'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { MOCK_TAG_PRESETS } from '@/lib/mock-data'

export async function getTagPresets(key: string): Promise<string[]> {
  try {
    const preset = await prisma.tagPreset.findUnique({
      where: { key }
    })
    
    if (!preset) return []
    
    return preset.tags.split(',').map(t => t.trim()).filter(Boolean)
  } catch (e) {
    console.error('getTagPresets error:', e)
    return MOCK_TAG_PRESETS[key] || []
  }
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
  try {
    const presets = await prisma.tagPreset.findMany()
    const result: Record<string, string[]> = {}
    
    presets.forEach(p => {
      result[p.key] = p.tags.split(',').map(t => t.trim()).filter(Boolean)
    })
    
    return result
  } catch (e) {
    console.error('getAllTagPresets error:', e)
    return MOCK_TAG_PRESETS
  }
}
