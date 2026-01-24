import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-center px-4">
      <h2 className="text-4xl font-bold text-slate-900 mb-4">404 - 页面未找到</h2>
      <p className="text-slate-500 mb-8 max-w-md">
        抱歉，你访问的页面不存在或已被移除。
      </p>
      <Link 
        href="/"
        className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-slate-700 transition-all"
      >
        返回首页
      </Link>
    </div>
  )
}
