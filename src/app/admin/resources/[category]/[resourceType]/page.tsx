import Link from 'next/link'
import { getPosts, deletePost } from '@/app/actions/content'
import { Plus, Edit } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { DeleteButton } from '@/components/admin/DeleteButton'
import { notFound } from 'next/navigation'
import { TagFilter } from '@/components/admin/TagFilter'

// Map internal resource types to display names
const RESOURCE_TYPE_MAP: Record<string, string> = {
  'video': '视频',
  'article': '文章',
  'tool': '工具',
  'podcast': '播客',
}

// Map internal categories to display names
const CATEGORY_MAP: Record<string, string> = {
  'ai': 'AI',
  'content-creation': '内容创作',
}

interface PageProps {
  params: {
    category: string
    resourceType: string
  }
  searchParams: {
    tag?: string
  }
}

export default async function ResourceSubCategoryPage({ params, searchParams }: PageProps) {
  const { category, resourceType } = params
  const selectedTag = searchParams.tag || null
  
  // Validate category and resourceType
  if (!CATEGORY_MAP[category] || !RESOURCE_TYPE_MAP[resourceType]) {
    notFound()
  }

  const allPosts = await getPosts()
  let posts = allPosts.filter(p => 
    p.type === 'resource' && 
    p.category === category && 
    p.resourceType === resourceType
  )

  // Collect all unique tags from the filtered posts (before tag filtering)
  const allTags = Array.from(new Set(
    posts.flatMap(p => p.tags ? p.tags.split(',').map(t => t.trim()) : [])
  )).sort()

  // Apply tag filter if selected
  if (selectedTag) {
    posts = posts.filter(p => 
      p.tags && p.tags.split(',').map(t => t.trim()).includes(selectedTag)
    )
  }

  const categoryName = CATEGORY_MAP[category]
  const resourceTypeName = RESOURCE_TYPE_MAP[resourceType]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{categoryName} {resourceTypeName}</h1>
          <p className="text-slate-500 text-sm">管理 {categoryName} 板块下的精选{resourceTypeName}</p>
        </div>
        <div className="flex items-center gap-3">
          <TagFilter tags={allTags} selectedTag={selectedTag} />
          <Link
            href={`/admin/content/new?type=resource&category=${category}&resourceType=${resourceType}`}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <Plus className="w-4 h-4" />
            添加{resourceTypeName}
          </Link>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 font-semibold text-slate-900">标题</th>
                <th className="px-6 py-4 font-semibold text-slate-900">链接</th>
                <th className="px-6 py-4 font-semibold text-slate-900">标签</th>
                <th className="px-6 py-4 font-semibold text-slate-900">日期</th>
                <th className="px-6 py-4 font-semibold text-slate-900 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900">{post.title}</div>
                    <div className="text-slate-500 text-xs mt-0.5 line-clamp-1">{post.description}</div>
                  </td>
                  <td className="px-6 py-4 text-slate-500 max-w-xs truncate">
                    {post.link ? (
                      <a href={post.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        {post.link}
                      </a>
                    ) : '-'}
                  </td>
                  <td className="px-6 py-4">
                     <div className="flex flex-wrap gap-1">
                      {post.tags ? post.tags.split(',').map(tag => (
                        <span key={tag} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600">
                          {tag.trim()}
                        </span>
                      )) : '-'}
                     </div>
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
                    暂无{resourceTypeName}。点击右上角添加！
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
