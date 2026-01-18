export const dynamic = 'force-dynamic'
import { getPageContent, updatePageContent } from '@/app/actions/page-content'
import { Save } from 'lucide-react'

export default async function PageConfigPage() {
  const contents = await getPageContent()
  
  // Group by page
  const groupedContent = contents.reduce((acc, item) => {
    if (!acc[item.page]) acc[item.page] = []
    acc[item.page].push(item)
    return acc
  }, {} as Record<string, typeof contents>)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">页面配置</h1>
        <p className="text-slate-500 text-sm">编辑页面上的静态文本</p>
      </div>

      <form action={updatePageContent} className="space-y-8">
        {Object.entries(groupedContent).map(([page, items]) => (
          <div key={page} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 capitalize mb-4 pb-2 border-b border-slate-100">
              {page === 'home' ? '首页 (Home)' : page === 'about' ? '关于页 (About)' : page === 'footer' ? '页脚 (Footer)' : page}
            </h2>
            <div className="grid gap-6">
              {items.map((item) => (
                <div key={item.id} className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 capitalize">
                    {item.section} - {item.key}
                  </label>
                  <input
                    name={`content-${item.id}`}
                    defaultValue={item.value}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="flex justify-end sticky bottom-6">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl shadow-lg hover:bg-slate-800 transition-all"
          >
            <Save className="w-5 h-5" />
            保存更改
          </button>
        </div>
      </form>
    </div>
  )
}
