
'use client'

import Link from 'next/link'

interface Visit {
  id: string
  path: string
  ip: string
  country: string | null
  province: string | null
  city: string | null
  createdAt: string
  userAgent: string | null
}

// 简单的国家代码转中文映射
const COUNTRY_MAP: Record<string, string> = {
  'CN': '中国',
  'US': '美国',
  'JP': '日本',
  'HK': '中国香港',
  'TW': '中国台湾',
  'SG': '新加坡',
  'GB': '英国',
  'DE': '德国',
  'FR': '法国',
  'KR': '韩国',
  'NL': '荷兰',
  'RU': '俄罗斯',
  'CA': '加拿大',
  'AU': '澳大利亚'
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
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 text-sm">
            {visits.map((visit) => {
              const date = new Date(visit.createdAt)
              // 强制转换为中国时区 (Asia/Shanghai, UTC+8)
              const timeStr = date.toLocaleString('zh-CN', {
                timeZone: 'Asia/Shanghai',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
              })
              
              // 处理城市乱码问题 (URL Decode) 并尽可能汉化国家
              let city = visit.city
              try {
                if (city) city = decodeURIComponent(city)
              } catch (e) {}

              const country = visit.country ? (COUNTRY_MAP[visit.country] || visit.country) : ''
              const province = visit.province || ''
              
              // 显示逻辑优化：
              // 1. 如果有省份信息，优先显示省份（IPAPI 提供，更精确）
              // 2. 否则显示城市（Vercel 提供）
              // 3. 如果都没有，显示 "-"
              let location = ''
              if (province) {
                // IPAPI 提供的省份信息，通常更可靠
                location = country ? `${country} ${province}` : province
              } else if (city && city !== 'unknown') {
                // Vercel 提供的城市信息
                location = country ? `${country} ${city}` : city
              } else if (country) {
                // 只有国家信息
                location = country
              } else {
                location = '-'
              }
              
              return (
                <tr key={visit.id} className="group hover:bg-slate-50 transition-colors">
                  <td className="py-3 pl-2 text-slate-500 whitespace-nowrap font-mono text-xs w-32">
                    {timeStr}
                  </td>
                  <td className="py-3 pr-4 text-slate-700 font-medium max-w-[300px] truncate" title={visit.path}>
                    <Link 
                      href={visit.path} 
                      target="_blank"
                      className="inline-block bg-slate-100 hover:bg-blue-50 hover:text-blue-600 transition-colors px-2 py-0.5 rounded text-xs text-slate-600 font-mono truncate max-w-full"
                    >
                      {visit.path}
                    </Link>
                  </td>
                  <td className="py-3 pr-4 text-slate-600 w-48 truncate" title={location}>
                    {location}
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
