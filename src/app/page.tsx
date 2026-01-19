import { PersonalHero } from '@/components/PersonalHero'
import { ResourceCard } from '@/components/ResourceCard'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { getAllResources, getAllPosts } from '@/lib/mdx'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const allResources = await getAllResources()
  const recentResources = allResources.slice(0, 3)
  
  const allPosts = await getAllPosts('blog')
  const recentPosts = allPosts.slice(0, 3)

  return (
    <div className="min-h-screen flex flex-col font-sans bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <Navbar />
      <main className="flex-1">
        <PersonalHero />
        
        {/* Categories */}
        <section className="container mx-auto px-4 py-16 border-t border-slate-50">
           <div className="grid md:grid-cols-2 gap-8 mb-20">
              <div className="group p-8 rounded-3xl bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer">
                 <h2 className="text-2xl font-bold mb-2 text-slate-900">AI 学习资源</h2>
                 <div className="w-10 h-1 bg-blue-600 rounded-full mb-6"></div>
                 <p className="text-slate-600 mb-6">掌握最新的 AI 工具、提示词与工作流，让你的生产力提升 10 倍。</p>
                 <Link href="/resources?category=ai" className="font-medium flex items-center text-slate-900 hover:gap-2 transition-all">
                   探索 AI 学习资源 <ArrowRight className="ml-2 w-4 h-4"/>
                 </Link>
              </div>
              <div className="group p-8 rounded-3xl bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer">
                 <h2 className="text-2xl font-bold mb-2 text-slate-900">内容创作与 IP</h2>
                 <div className="w-10 h-1 bg-purple-600 rounded-full mb-6"></div>
                 <p className="text-slate-600 mb-6">利用经过验证的模版、策略与案例，构建属于你的个人品牌。</p>
                 <Link href="/resources?category=content-creation" className="font-medium flex items-center text-slate-900 hover:gap-2 transition-all">
                   开始打造 IP <ArrowRight className="ml-2 w-4 h-4"/>
                 </Link>
              </div>
           </div>

           {/* Latest Resources */}
           <div className="mb-20">
             <div className="flex justify-between items-end mb-8">
               <h2 className="text-3xl font-bold tracking-tight text-slate-900">最新资源</h2>
               <Link href="/resources" className="text-sm font-medium text-slate-500 hover:text-slate-900">查看全部</Link>
             </div>
             <div className="grid md:grid-cols-3 gap-6">
               {recentResources.map((post: any) => (
                <ResourceCard key={post.slug} post={post} type="resource" />
              ))}
             </div>
           </div>

           {/* Latest Blog */}
           <div>
             <div className="flex justify-between items-end mb-8">
               <h2 className="text-3xl font-bold tracking-tight text-slate-900">博客文章</h2>
               <Link href="/blog" className="text-sm font-medium text-slate-500 hover:text-slate-900">查看全部</Link>
             </div>
             <div className="grid md:grid-cols-3 gap-6">
               {recentPosts.map((post: any) => (
                <ResourceCard key={post.slug} post={post} type="blog" />
              ))}
             </div>
           </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
