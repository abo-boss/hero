
'use client'

interface Visit {
  id: string
  path: string
  ip: string
  country: string | null
  city: string | null
  createdAt: string
  userAgent: string | null
}

export function RecentVisits({ visits }: { visits: Visit[] }) {
  if (!visits || visits.length === 0) {
    return (
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm h-full">
        <h3 className="text-lg font-bold text-slate-900 mb-6">最近访问记录</h3>
        <p className="text-slate-500 text-sm">暂无数据</p>
      </div>
    )
  }

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm h-full">
      <h3 className="text-lg font-bold text-slate-900 mb-6">最近访问记录</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 text-slate-500 text-xs uppercase tracking-wider">
              <th className="pb-3 pl-2 font-medium">时间</th>
              <th className="pb-3 font-medium">路径</th>
              <th className="pb-3 font-medium">地点</th>
              <th className="pb-3 font-medium">IP</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 text-sm">
            {visits.map((visit) => {
              const date = new Date(visit.createdAt)
              const timeStr = date.toLocaleString('zh-CN', {
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
              })
              
              const location = [visit.country, visit.city].filter(Boolean).join(' ') || '-'
              
              return (
                <tr key={visit.id} className="group hover:bg-slate-50 transition-colors">
                  <td className="py-3 pl-2 text-slate-500 whitespace-nowrap font-mono text-xs w-32">
                    {timeStr}
                  </td>
                  <td className="py-3 pr-4 text-slate-700 font-medium max-w-[200px] truncate" title={visit.path}>
                    <span className="bg-slate-100 px-2 py-0.5 rounded text-xs text-slate-600 font-mono">
                      {visit.path}
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-slate-600 w-32 truncate" title={location}>
                    {location}
                  </td>
                  <td className="py-3 text-slate-400 font-mono text-xs w-32">
                    {visit.ip || '-'}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
