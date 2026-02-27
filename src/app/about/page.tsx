import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { Mail, BookOpen, Target, Sparkles, Zap, ArrowUpRight } from 'lucide-react'
import { getPageContent } from '@/app/actions/page-content'
import { prisma } from '@/lib/prisma'
import Image from 'next/image'

export const revalidate = 3600 // 1 hour

export default async function AboutPage() {
  let content: any[] = []
  try {
    content = await getPageContent()
  } catch (error) {
    console.error('Failed to get page content:', error)
    content = []
  }
  const title = content.find((c: any) => c.page === 'about' && c.section === 'intro' && c.key === 'title')?.value || '关于我'
  const description = content.find((c: any) => c.page === 'about' && c.section === 'intro' && c.key === 'description')?.value || '你好，我是阿波，一名内容创作者和 AI 爱好者。'

  // Get the first user (admin) with error handling
  let user = null
  try {
    user = await prisma.user.findFirst({
      orderBy: { createdAt: 'asc' }
    })
  } catch (error) {
    console.error('Failed to fetch user for about page:', error)
    // Fallback is handled in UI (checking if user exists)
  }

  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-50/50">
      <Navbar />
      
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-50/50 rounded-full blur-[100px] mix-blend-multiply opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-50/50 rounded-full blur-[100px] mix-blend-multiply opacity-50"></div>
      </div>

      <main className="flex-1 container mx-auto px-4 py-16 max-w-5xl">
        {/* Header Section */}
        <div className="flex flex-col items-center text-center mb-16">
           <h1 className="text-3xl md:text-5xl font-light text-slate-800 tracking-widest opacity-90 leading-relaxed">
             我想快乐地生活在一个我不了解的世界里
           </h1>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
          
          {/* 1. Intro Section (No Card) */}
          <div className="md:col-span-3 flex flex-col md:flex-row gap-6 md:gap-16 items-start px-4">
               {/* Left: Headline & Avatar */}
               <div className="w-full md:w-1/4 flex-shrink-0 flex flex-col items-start md:items-end md:text-right">
                  <div className="w-24 h-24 rounded-full bg-slate-100 border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden mb-6 relative z-10">
                     {user?.image ? (
                       <Image 
                         src={user.image} 
                         alt={user.name || 'Avatar'} 
                         width={96} 
                         height={96}
                         className="w-full h-full object-cover"
                       />
                     ) : (
                       <span className="text-4xl">👋</span>
                     )}
                  </div>
                  <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight mb-2 tracking-tight">
                    {title}
                  </h2>
               </div>

               {/* Divider - Vertical on Desktop */}
               <div className="hidden md:block w-px self-stretch bg-gradient-to-b from-slate-100 via-slate-200 to-slate-100"></div>

               {/* Right: Content */}
               <div className="flex-1 prose prose-slate text-slate-600 leading-8 md:leading-9 text-lg max-w-none">
                  <p className="text-lg font-medium text-slate-800 mb-4">
                    {description}
                  </p>
                  <p className="mb-4">
                    我建立这个网站是为了解决我自己曾经遇到的问题：信息碎片化。
                  </p>
                  <p className="mb-4">
                    我花费了很多时间筛选 AI 学习资源和个人品牌策略。
                    现在，我将我发现的好的资源整理成结构化的学习路径分享给你。
                  </p>
                  <p>
                    我希望每个人都能成为超级创作者，利用 AI 放大自己独特的声音。
                  </p>
                  
                  <div className="md:hidden mt-12">
                     <h2 className="text-2xl font-bold text-slate-900 mb-2">保持联系</h2>
                     <div className="w-10 h-1 bg-blue-600 rounded-full mb-6"></div>
                  </div>
               </div>
            </div>

          {/* 2. Contact Section */}
          <div className="md:col-span-3 mt-12">
             <div className="hidden md:flex flex-col items-center mb-8 px-4">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">保持联系</h2>
                <div className="w-10 h-1 bg-blue-600 rounded-full"></div>
             </div>
             
             <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1 bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all flex items-center gap-4">
                  <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center text-red-500 flex-shrink-0">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 font-medium uppercase mb-1">小红书 & 公众号</div>
                    <div className="font-bold text-slate-900 text-lg">阿波思考笔记</div>
                    <p className="text-slate-500 text-sm mt-1">随时欢迎交流，有其他建议和反馈，可联系我。</p>
                  </div>
                </div>
                
                <a href="mailto:cxbyy129@163.com" className="relative flex-1 bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all flex items-center gap-4 group hover:border-blue-100">
                  <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors flex-shrink-0">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                       <div className="text-xs text-slate-400 font-medium uppercase mb-1 group-hover:text-blue-400">Email</div>
                       <ArrowUpRight className="w-5 h-5 text-slate-300 group-hover:text-blue-400" />
                    </div>
                    <div className="font-bold text-slate-900 text-lg group-hover:text-blue-700">cxbyy129@163.com</div>
                    <p className="text-slate-500 text-sm mt-1">商务合作和深度交流（左下角wechat）</p>
                  </div>
                </a>
             </div>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  )
}
