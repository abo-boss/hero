import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { getPostBySlug } from '@/app/actions/content'
import { notFound } from 'next/navigation'
import { serialize } from 'next-mdx-remote/serialize'
import { MDXContent } from '@/components/MDXContent'
import rehypeSlug from 'rehype-slug'
import remarkBreaks from 'remark-breaks'
import { getTableOfContents } from '@/lib/toc'
import { TableOfContents } from '@/components/TableOfContents'

export default async function BlogPage({ params }: { params: { slug: string } }) {
  try {
    const slug = decodeURIComponent(params.slug)
    const post = await getPostBySlug(slug)

    if (!post) {
      notFound()
    }
    
    // 1. 提取目录数据
    const toc = getTableOfContents(post.content)

    // 2. MDX 序列化配置
    const mdxSource = await serialize(post.content, {
      mdxOptions: {
        rehypePlugins: [rehypeSlug], // 自动生成标题 ID
        remarkPlugins: [remarkBreaks], // 还原换行风格
      },
    })

    // 格式化日期
    const date = new Date(post.date).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })

    return (
      <div className="min-h-screen flex flex-col font-sans bg-white">
        <Navbar />
        
        <main className="flex-1 container mx-auto px-4 py-16">
          <div className="grid grid-cols-12 gap-8 max-w-7xl mx-auto">
            {/* 侧边栏 TOC - 占据 2 列 */}
            <aside className="hidden lg:block col-span-2 pt-8">
               <TableOfContents toc={toc} />
            </aside>

            {/* 文章主体 - 占据 8 列，从第 5 列开始 (留出 2 列空隙) */}
            <article className="col-span-12 lg:col-span-8 lg:col-start-5 min-w-0">
              <header className="mb-8 not-prose text-center lg:text-left">
                {/* 1. 标题: 进一步调小字号 (从 4xl -> 3xl) */}
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6 leading-tight tracking-tight">
                  {post.title}
                </h1>
                
                {/* 2. Meta 信息: 分类 - 时间 - 作者 (删除头像) */}
                <div className="flex items-center gap-4 justify-center lg:justify-start text-sm text-slate-500">
                   {post.category && (
                     <>
                       <span className="uppercase tracking-wider text-xs font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded">{post.category}</span>
                       <span className="text-slate-300">|</span>
                     </>
                   )}
                   <span>{date}</span>
                   <span className="text-slate-300">|</span>
                   <span className="font-medium text-slate-900">阿波</span>
                </div>
              </header>
              
              {/* 3. 分割线: 改为细长线 (全宽, 1px) */}
              <div className="w-full h-px bg-slate-100 mb-10"></div>

              {/* 4. 正文: 统一行间距 (leading-relaxed) */}
              <div className="prose prose-slate prose-base max-w-none 
                prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-slate-900
                prose-p:leading-relaxed prose-p:text-slate-600 prose-p:mb-6
                prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
                prose-img:rounded-xl prose-img:shadow-sm
                prose-blockquote:border-l-4 prose-blockquote:border-slate-200 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-slate-500
                prose-li:text-slate-600">
                 <MDXContent source={mdxSource} />
              </div>
            </article>

            {/* 右侧留白 - 移除占位 div，正文自然占据剩余空间 */}
          </div>
        </main>
        <Footer />
      </div>
    )
  } catch (error) {
    console.error(error)
    notFound()
  }
}
