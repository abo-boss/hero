import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
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

    const results = []

    for (const item of defaultContents) {
      const content = await prisma.pageContent.upsert({
        where: {
          page_section_key: {
            page: item.page,
            section: item.section,
            key: item.key
          }
        },
        update: {
          value: item.value // Update value if exists (reset to default) or keep? Let's update to ensure it's set.
        },
        create: {
          page: item.page,
          section: item.section,
          key: item.key,
          value: item.value
        }
      })
      results.push(content)
    }

    return NextResponse.json({
      message: '✅ Page content seeded successfully',
      count: results.length,
      results
    })
  } catch (error: any) {
    console.error('Failed to seed page content:', error)
    return NextResponse.json({
      message: '❌ Failed to seed page content',
      error: error.message
    }, { status: 500 })
  }
}
