
'use server'

import { revalidatePath } from 'next/cache'
import { MOCK_TAG_PRESETS } from '@/lib/mock-data'

export async function getTagPresets(key: string): Promise<string[]> {
  return MOCK_TAG_PRESETS[key] || []
}

export async function updateTagPresets(key: string, tags: string[]) {
  // In file-based mode, we can't persist changes online
  // But for local dev, we could write to mock-data.ts
  // For now, this is a no-op to prevent crash
  console.log('Update tags (no-op in file mode):', key, tags)
  
  revalidatePath('/admin')
  revalidatePath('/resources')
}

export async function getAllTagPresets() {
  return MOCK_TAG_PRESETS
}
