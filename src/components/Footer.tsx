import { getPageContent } from '@/app/actions/page-content'
import { WeChatModal } from './WeChatModal'

export async function Footer() {
  const content = await getPageContent()
  const slogan = content.find((c: any) => c.page === 'footer' && c.section === 'main' && c.key === 'slogan')?.value || '用AI+IP成为强大的个体'
  const copyright = content.find((c: any) => c.page === 'footer' && c.section === 'copyright' && c.key === 'text')?.value || `© ${new Date().getFullYear()} 阿波. All rights reserved.`

  return (
    <footer className="border-t border-slate-100 bg-white py-8 mt-16">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 items-center gap-4">
        {/* Left: Social Links */}
        <div className="flex justify-center md:justify-start gap-4 text-xs text-slate-500 font-medium order-2 md:order-1">
          <WeChatModal />
          <a href="#" className="hover:text-slate-900 transition-colors">GitHub</a>
          <a href="#" className="hover:text-slate-900 transition-colors">RSS</a>
        </div>

        {/* Center: Hero Logo */}
        <div className="flex justify-center items-center gap-4 order-1 md:order-2">
          <h3 className="font-bold text-lg text-slate-900 tracking-tight">Hero.</h3>
          <p className="text-xs text-slate-400 hidden md:block border-l border-slate-200 pl-4">{slogan}</p>
        </div>

        {/* Right: Copyright & Privacy */}
        <div className="flex justify-center md:justify-end items-center gap-4 text-xs text-slate-400 order-3">
          <span>{copyright}</span>
          <a href="#" className="hover:text-slate-600 transition-colors">隐私条款</a>
        </div>
      </div>
    </footer>
  )
}

