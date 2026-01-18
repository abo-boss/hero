export const runtime = 'nodejs'
import { getPostBySlug, ResourceType } from '@/lib/mdx'
import { MDXContent } from '@/components/MDXContent'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { notFound } from 'next/navigation'
import { serialize } from 'next-mdx-remote/serialize'

export async function generateStaticParams() {
  return []
}

export default async function ResourcePage({ params }: { params: { category: string, slug: string } }) {
  try {
    // Validate category (optional, DB query will fail if not found or we can check post.category)
    if (params.category !== 'ai' && params.category !== 'content-creation') {
       // Allow dynamic categories from DB? For now keep strict or loose.
       // return notFound() 
    }

    const post = await getPostBySlug(params.slug)
    if (!post) {
      notFound()
    }
    const mdxSource = await serialize(post.content)

    return (
      <div className="min-h-screen flex flex-col font-sans">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-12 max-w-3xl">
           <article>
             <div className="mb-8 pb-8 border-b border-slate-100">
               <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold uppercase tracking-wider mb-4">
                 {post.category.replace('-', ' ')}
               </span>
               <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">{post.title}</h1>
               <div className="flex items-center gap-4 text-slate-500 text-sm">
                  <span>{post.date}</span>
                  <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                  <span>{post.author || '管理员'}</span>
                  {post.tags && (
                    <>
                      <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                      <div className="flex gap-2">
                        {post.tags.map(tag => <span key={tag}>#{tag}</span>)}
                      </div>
                    </>
                  )}
               </div>
             </div>
             <MDXContent source={mdxSource} />
           </article>
        </main>
        <Footer />
      </div>
    )
  } catch (e) {
    notFound()
  }
}
