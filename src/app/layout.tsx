import type { Metadata } from 'next'
import { Inter, Noto_Sans_SC } from 'next/font/google'
import './globals.css'
import { cn } from '@/lib/utils'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const notoSansSC = Noto_Sans_SC({ subsets: ['latin'], variable: '--font-noto-sans' })

export const metadata: Metadata = {
  title: '阿波的超级个体空间',
  description: '我整合了最优质的AI学习资源与内容创作策略，助你高效产出。',
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
