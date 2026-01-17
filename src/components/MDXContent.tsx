'use client'
import { MDXRemote } from 'next-mdx-remote'

const components = {
  h1: (props: any) => <h1 className="text-3xl font-bold mt-8 mb-4 text-slate-900" {...props} />,
  h2: (props: any) => <h2 className="text-2xl font-bold mt-8 mb-4 text-slate-900" {...props} />,
  h3: (props: any) => <h3 className="text-xl font-bold mt-6 mb-3 text-slate-900" {...props} />,
  p: (props: any) => <p className="leading-7 mb-4 text-slate-700" {...props} />,
  ul: (props: any) => <ul className="list-disc pl-5 mb-4 space-y-2 text-slate-700" {...props} />,
  ol: (props: any) => <ol className="list-decimal pl-5 mb-4 space-y-2 text-slate-700" {...props} />,
  li: (props: any) => <li className="" {...props} />,
  a: (props: any) => <a className="text-blue-600 hover:underline font-medium" {...props} />,
  blockquote: (props: any) => <blockquote className="border-l-4 border-blue-500 pl-4 italic my-6 bg-slate-50 py-4 pr-4 rounded-r text-slate-700" {...props} />,
  code: (props: any) => <code className="bg-slate-100 rounded px-1.5 py-0.5 text-sm font-mono text-pink-600" {...props} />,
  pre: (props: any) => <pre className="bg-slate-900 text-slate-50 p-4 rounded-lg overflow-x-auto mb-6 text-sm" {...props} />,
  hr: (props: any) => <hr className="my-8 border-slate-200" {...props} />,
}

export function MDXContent({ source }: { source: any }) {
  return (
    <div className="mdx-content">
      <MDXRemote {...source} components={components} />
    </div>
  )
}
