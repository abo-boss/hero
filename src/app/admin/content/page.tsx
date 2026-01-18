export const dynamic = 'force-dynamic'
import Link from 'next/link'
import { getPosts, deletePost } from '@/app/actions/content'
import { Plus, Edit } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { DeleteButton } from '@/components/admin/DeleteButton'

export default async function ContentPage() {
  const posts = await getPosts()

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">内容管理</h1>
          <p className="text-slate-500 text-sm">管理博客文章和资源</p>
        </div>
        <Link
          href="/admin/content/new"
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <Plus className="w-4 h-4" />
          新建
        </Link>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 font-semibold text-slate-900">标题</th>
                <th className="px-6 py-4 font-semibold text-slate-900">类型</th>
                <th className="px-6 py-4 font-semibold text-slate-900">分类</th>
                <th className="px-6 py-4 font-semibold text-slate-900">日期</th>
                <th className="px-6 py-4 font-semibold text-slate-900 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900">{post.title}</div>
                    <div className="text-slate-500 text-xs mt-0.5">{post.slug}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      post.type === 'blog' 
                        ? 'bg-blue-50 text-blue-700' 
                        : 'bg-purple-50 text-purple-700'
                    }`}>
                      {post.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {post.category}
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    {formatDate(post.date.toISOString())}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/content/${post.id}`}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <form action={deletePost.bind(null, post.id)}>
                        <DeleteButton />
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
              {posts.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    未找到内容。请创建您的第一篇文章！
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
