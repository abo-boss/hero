export const dynamic = 'force-dynamic'
import { FileText, Database, Users } from 'lucide-react'
import Link from 'next/link'
import { getPosts } from '@/app/actions/content'

export default async function AdminDashboard() {
  const posts = await getPosts()
  const totalPosts = posts.length
  const resourceCount = posts.filter((post) => post.type === 'resource').length
  const blogCount = posts.filter((post) => post.type === 'blog').length

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">仪表盘</h1>
          <p className="text-slate-500 mt-1">欢迎回来，阿波</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-500">
              <FileText className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium text-slate-500 uppercase tracking-wider">文章总数</span>
          </div>
          <div className="text-3xl font-bold text-slate-900">{totalPosts}</div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 bg-purple-50 rounded-full flex items-center justify-center text-purple-500">
              <Database className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium text-slate-500 uppercase tracking-wider">资源数量</span>
          </div>
          <div className="text-3xl font-bold text-slate-900">{resourceCount}</div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center text-green-500">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium text-slate-500 uppercase tracking-wider">博客数量</span>
          </div>
          <div className="text-3xl font-bold text-slate-900">{blogCount}</div>
        </div>
      </div>
      
      <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm text-center py-20">
         <p className="text-slate-500 mb-4">从左侧边栏选择一个选项来管理内容。</p>
         <div className="flex items-center justify-center gap-4">
           <Link href="/admin/content" className="px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-medium">
             管理内容
           </Link>
           <Link href="/admin/blog" className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 text-sm font-medium">
             博客管理
           </Link>
         </div>
      </div>
    </div>
  )
}
