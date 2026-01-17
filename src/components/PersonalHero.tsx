import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { getPageContent } from '@/app/actions/page-content'

export async function PersonalHero() {
  const content = await getPageContent()
  const title = content.find((c: any) => c.page === 'home' && c.section === 'hero' && c.key === 'title')?.value || '阿波的超级个体空间'
  const description = content.find((c: any) => c.page === 'home' && c.section === 'hero' && c.key === 'description')?.value || '探索 AI 技术，打造超级个体'

  return (
    <section className="relative overflow-hidden pt-32 pb-40 md:pt-48 md:pb-56">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-gray-100/50 rounded-full blur-[100px] mix-blend-multiply opacity-50 animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-slate-200/50 rounded-full blur-[100px] mix-blend-multiply opacity-50 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-32 left-1/3 w-[500px] h-[500px] bg-zinc-100/50 rounded-full blur-[100px] mix-blend-multiply opacity-50 animate-blob animation-delay-4000"></div>
      </div>

      <div className="container mx-auto px-4 flex flex-col items-center text-center relative z-10">
        <h1 className="text-4xl md:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-slate-800 to-slate-600 mb-8 max-w-4xl drop-shadow-sm">
          {title}
        </h1>
        <p className="text-lg md:text-2xl text-slate-600 mb-12 max-w-2xl leading-relaxed font-light">
          {description}
        </p>
        <div className="flex flex-col sm:flex-row gap-5">
          <Link href="/resources" className="inline-flex h-14 items-center justify-center rounded-full bg-slate-900 px-10 text-base font-medium text-white transition-all hover:bg-slate-800 hover:scale-105 shadow-lg shadow-slate-900/20 hover:shadow-slate-900/30">
            探索资源库
          </Link>
          <Link href="/blog" className="inline-flex h-14 items-center justify-center rounded-full border border-slate-200 bg-white/50 backdrop-blur-sm px-10 text-base font-medium text-slate-900 transition-all hover:bg-white hover:scale-105 shadow-sm hover:shadow-md">
            阅读博客
          </Link>
        </div>
      </div>
    </section>
  )
}
