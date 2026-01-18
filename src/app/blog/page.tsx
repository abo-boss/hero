export const dynamic = 'force-dynamic'
import { getAllPosts } from '@/lib/mdx'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { ResourceCard } from '@/components/ResourceCard'

export default async function BlogListPage() {
  const posts = await getAllPosts('blog')

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="mb-12 text-center max-w-3xl mx-auto pt-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
            博客 & 笔记
          </h1>
          <p className="text-slate-500 text-sm leading-relaxed font-normal">
            我的学习心得、成长故事以及对内容创作未来的思考。
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post: any) => (
            <ResourceCard key={post.slug} post={post} type="blog" />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  )
}
