'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Settings, LogOut, Home, ChevronDown, Database, Video, PenTool, User } from 'lucide-react'
import { signOut } from 'next-auth/react'
import { useState } from 'react'

export function AdminSidebar() {
  const pathname = usePathname()
  const [aiOpen, setAiOpen] = useState(false)
  const [creationOpen, setCreationOpen] = useState(false)

  const navigation = [
    { name: '仪表盘', href: '/admin', icon: LayoutDashboard },
    { name: '博客管理', href: '/admin/blog', icon: PenTool },
  ]

  const aiItems = [
    { name: '精选视频', href: '/admin/resources/ai/video' },
    { name: '精选播客', href: '/admin/resources/ai/podcast' },
    { name: 'AI 产品', href: '/admin/resources/ai/tool' },
  ]

  const creationItems = [
    { name: '精选视频', href: '/admin/resources/content-creation/video' },
    { name: '精选播客', href: '/admin/resources/content-creation/podcast' },
    { name: '精选文章', href: '/admin/resources/content-creation/article' },
  ]

  return (
    <aside className="w-64 bg-white border-r border-slate-100 flex flex-col fixed inset-y-0 z-50">
      <div className="p-6 border-b border-slate-100 flex items-center gap-3">
        <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white font-bold">W</div>
        <span className="font-bold text-slate-900 text-lg">web网站管理系统</span>
      </div>
      
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-slate-900 text-white shadow-md shadow-slate-200'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          )
        })}

        {/* AI Resources Dropdown */}
        <div className="pt-2">
          <button
            onClick={() => setAiOpen(!aiOpen)}
            className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-all"
          >
            <div className="flex items-center gap-3">
              <Database className="w-5 h-5" />
              AI 资源
            </div>
            <ChevronDown className={`w-4 h-4 transition-transform ${aiOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {aiOpen && (
            <div className="mt-1 space-y-1 pl-4">
              {aiItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-current opacity-50" />
                    {item.name}
                  </Link>
                )
              })}
            </div>
          )}
        </div>

        {/* Content Creation Dropdown */}
        <div className="pt-2">
          <button
            onClick={() => setCreationOpen(!creationOpen)}
            className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-all"
          >
            <div className="flex items-center gap-3">
              <Video className="w-5 h-5" />
              内容创作 IP
            </div>
            <ChevronDown className={`w-4 h-4 transition-transform ${creationOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {creationOpen && (
            <div className="mt-1 space-y-1 pl-4">
              {creationItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-current opacity-50" />
                    {item.name}
                  </Link>
                )
              })}
            </div>
          )}
        </div>

        <Link
          href="/admin/pages"
          className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
            pathname === '/admin/pages'
              ? 'bg-slate-900 text-white shadow-md shadow-slate-200'
              : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          <Settings className="w-5 h-5" />
          页面配置
        </Link>

        <Link
          href="/admin/settings/account"
          className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
            pathname === '/admin/settings/account'
              ? 'bg-slate-900 text-white shadow-md shadow-slate-200'
              : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          <User className="w-5 h-5" />
          账号设置
        </Link>
        
        <div className="pt-4 mt-4 border-t border-slate-100">
           <Link
              href="/"
              target="_blank"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-all"
            >
              <Home className="w-5 h-5" />
              查看站点
            </Link>
        </div>
      </nav>

      <div className="p-4 border-t border-slate-100">
        <button
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 w-full transition-all"
        >
          <LogOut className="w-5 h-5" />
          退出登录
        </button>
      </div>
    </aside>
  )
}
