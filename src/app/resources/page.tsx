export const dynamic = 'force-dynamic'
import { getAllResources } from '@/lib/mdx'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { ResourceFilter } from '@/components/ResourceFilter'
import { Suspense } from 'react'
import { getAllTagPresets } from '@/app/actions/tags'

export default async function ResourcesPage() {
  const posts = await getAllResources()
  const tagPresets = await getAllTagPresets()

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="mb-12 text-center max-w-3xl mx-auto pt-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
            学习资源库
          </h1>
          <p className="text-slate-500 text-sm leading-relaxed font-normal">
            超级个体的两大杠杆 AI + IP，我们应该拥抱它
          </p>
        </div>
        <Suspense fallback={<div>Loading...</div>}>
          <ResourceFilter posts={posts as any} tagPresets={tagPresets} />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}
