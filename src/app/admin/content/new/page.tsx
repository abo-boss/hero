import { PostForm } from '@/components/admin/PostForm'
import { createPost } from '@/app/actions/content'

export default function NewContentPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const type = typeof searchParams.type === 'string' ? searchParams.type : undefined
  const category = typeof searchParams.category === 'string' ? searchParams.category : undefined
  const resourceType = typeof searchParams.resourceType === 'string' ? searchParams.resourceType : undefined

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">新建内容</h1>
        <p className="text-slate-500 text-sm">添加新的博客文章或资源</p>
      </div>
      
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <PostForm 
          action={createPost} 
          defaultType={type}
          defaultCategory={category}
          defaultResourceType={resourceType}
        />
      </div>
    </div>
  )
}
