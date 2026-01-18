export const dynamic = 'force-dynamic'
import Link from 'next/link'
import { getPosts, deletePost } from '@/app/actions/content'
import { Plus, Edit } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { DeleteButton } from '@/components/admin/DeleteButton'

export default async function BlogManagementPage() {
  const allPosts = await getPosts()
  const posts = allPosts.filter(p => p.type === 'blog')

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">博客管理</h1>
          <p className="text-slate-500 text-sm">发布和管理博客文章</p>
        </div>
        <Link
          href="/admin/content/new?type=blog"
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <Plus className="w-4 h-4" />
          写文章
        </Link>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 font-semibold text-slate-900">标题</th>
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
                  <td className="px-6 py-4 text-slate-600">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                      {post.category}
                    </span>
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
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                    暂无博客文章。点击右上角开始写作！
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
