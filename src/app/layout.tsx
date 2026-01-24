import type { Metadata } from 'next'
import { Inter, Noto_Sans_SC } from 'next/font/google'
import './globals.css'
import { cn } from '@/lib/utils'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const notoSansSC = Noto_Sans_SC({ subsets: ['latin'], variable: '--font-noto-sans' })

import { getPageContent } from '@/app/actions/page-content'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  try {
    const content = await getPageContent()
    const title = content.find(c => c.page === 'home' && c.section === 'hero' && c.key === 'title')?.value || '阿波的学习库'
    const description = content.find(c => c.page === 'home' && c.section === 'hero' && c.key === 'description')?.value || '我整合了最优质的AI学习资源与内容创作策略，助你高效产出。'

    return {
      title,
      description,
    }
  } catch (error) {
    // console.error('Failed to fetch page content for metadata:', error)
    return {
      title: '阿波的学习库',
      description: '我整合了最优质的AI学习资源与内容创作策略，助你高效产出。',
    }
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className={cn(inter.variable, notoSansSC.variable, 'font-sans antialiased min-h-screen bg-white text-slate-900')}>
        {children}
      </body>
    </html>
  )
}
