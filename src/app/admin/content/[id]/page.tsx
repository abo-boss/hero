import { PostForm } from '@/components/admin/PostForm'
import { getPost, updatePost } from '@/app/actions/content'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function EditContentPage({ params }: { params: { id: string } }) {
  const post = await getPost(params.id)

  if (!post) {
    notFound()
  }

  const updateAction = updatePost.bind(null, post.id)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">编辑内容</h1>
        <p className="text-slate-500 text-sm">正在编辑: {post.title}</p>
      </div>
      
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <PostForm 
          action={updateAction} 
          initialData={{
            ...post,
            description: post.description || '',
            tags: post.tags || '',
          }}
          isEditing 
        />
      </div>
    </div>
  )
}
