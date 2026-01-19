
'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'

const DEFAULT_TAG_PRESETS: Record<string, string[]> = {
  'resource:ai:video': ['基础知识', '提示词', '实用教程', 'Vibe Coding', 'AI 产品', '创始人访谈'],
  'resource:content-creation:video': ['写作', '内容创作', '小而美商业', '轻创业', '个人品牌', '运营策略'],
  'blog:default': ['Tech', 'Life', 'Thoughts', 'Coding', 'Guide']
}

export async function getTagPresets(key: string): Promise<string[]> {
  try {
    const preset = await prisma.tagPreset.findUnique({
      where: { key }
    })
    
    if (preset) {
      return JSON.parse(preset.tags) as string[]
    }
    
    // Return default if not found in DB
    return DEFAULT_TAG_PRESETS[key] || []
  } catch (error) {
    console.error('Failed to get tag presets:', error)
    return DEFAULT_TAG_PRESETS[key] || []
  }
}

export async function updateTagPresets(key: string, tags: string[]) {
  try {
    await prisma.tagPreset.upsert({
      where: { key },
      update: {
        tags: JSON.stringify(tags)
      },
      create: {
        key,
        tags: JSON.stringify(tags)
      }
    })
    
    revalidatePath('/admin')
    revalidatePath('/resources')
  } catch (error) {
    console.error('Failed to update tag presets:', error)
    throw new Error('Failed to update tags')
  }
}

export async function getAllTagPresets() {
  try {
    const presets = await prisma.tagPreset.findMany()
    const result: Record<string, string[]> = { ...DEFAULT_TAG_PRESETS }
    
    presets.forEach(preset => {
      try {
        result[preset.key] = JSON.parse(preset.tags)
      } catch (e) {
        console.error(`Failed to parse tags for key ${preset.key}`, e)
      }
    })
    
    return result
  } catch (error) {
    console.error('Failed to get all tag presets:', error)
    return DEFAULT_TAG_PRESETS
  }
}
