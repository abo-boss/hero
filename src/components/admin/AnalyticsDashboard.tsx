'use client'

import { useState, useEffect } from 'react'
import { Eye, Users, BarChart3, TrendingUp } from 'lucide-react'

interface Stats {
  summary: {
    totalPV: number
    totalUV: number
    todayPV: number
    todayUV: number
  }
  topPages: {
    path: string
    count: number
  }[]
  trend: {
    date: string
    pv: number
    uv: number
  }[]
}

export function AnalyticsDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/api/admin/stats')
        if (res.ok) {
          const data = await res.json()
          setStats(data)
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  if (loading) {
    return <div className="animate-pulse space-y-4">
      <div className="h-32 bg-slate-50 rounded-2xl"></div>
      <div className="h-64 bg-slate-50 rounded-2xl"></div>
    </div>
  }

  if (!stats) {
    return (
      <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm text-center">
        <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center text-amber-500 mx-auto mb-4">
          <BarChart3 className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-2">访问统计暂未就绪</h3>
        <p className="text-slate-500 text-sm max-w-md mx-auto mb-6">
          代码已部署，但数据库中尚未创建统计表。请确保已执行数据库同步指令。
        </p>
        <div className="bg-slate-900 text-slate-100 p-3 rounded-lg text-xs font-mono inline-block">
          npx prisma db push
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* 核心指标卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard 
          title="今日浏览量" 
          value={stats.summary.todayPV} 
          icon={<Eye className="w-4 h-4" />} 
          color="blue"
        />
        <StatCard 
          title="今日访客数" 
          value={stats.summary.todayUV} 
          icon={<Users className="w-4 h-4" />} 
          color="purple"
        />
        <StatCard 
          title="累计浏览量" 
          value={stats.summary.totalPV} 
          icon={<BarChart3 className="w-4 h-4" />} 
          color="green"
        />
        <StatCard 
          title="累计访客数" 
          value={stats.summary.totalUV} 
          icon={<TrendingUp className="w-4 h-4" />} 
          color="orange"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 热门页面表格 */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6">热门页面 Top 10</h3>
          <div className="space-y-4">
            {stats.topPages.map((page, index) => (
              <div key={page.path} className="flex items-center justify-between group">
                <div className="flex items-center gap-3 overflow-hidden">
                  <span className="text-xs font-bold text-slate-300 w-4">{index + 1}</span>
                  <span className="text-sm text-slate-600 truncate group-hover:text-blue-600 transition-colors">
                    {page.path === '/' ? '首页' : page.path}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-1.5 bg-slate-100 rounded-full w-24 overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 rounded-full" 
                      style={{ width: `${(page.count / stats.topPages[0].count) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-xs font-bold text-slate-900 w-8 text-right">{page.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 7天趋势简图 (纯 CSS 实现) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6">最近 7 天趋势</h3>
          <div className="flex items-end justify-between h-48 gap-2 pt-4">
            {stats.trend.map((day) => {
              const maxPV = Math.max(...stats.trend.map(d => d.pv), 1)
              const height = (day.pv / maxPV) * 100
              return (
                <div key={day.date} className="flex-1 flex flex-col items-center gap-2 group relative">
                  <div className="w-full bg-slate-50 rounded-t-lg relative overflow-hidden flex items-end h-full">
                    <div 
                      className="w-full bg-blue-500/20 group-hover:bg-blue-500/40 transition-all rounded-t-sm" 
                      style={{ height: `${height}%` }}
                    ></div>
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-slate-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                      {day.date}: {day.pv} PV / {day.uv} UV
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400 rotate-45 mt-2 origin-left whitespace-nowrap">
                    {day.date.split('-').slice(1).join('/')}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ title, value, icon, color }: { title: string, value: number, icon: React.ReactNode, color: 'blue' | 'purple' | 'green' | 'orange' }) {
  const colors = {
    blue: 'bg-blue-50 text-blue-500',
    purple: 'bg-purple-50 text-purple-500',
    green: 'bg-green-50 text-green-500',
    orange: 'bg-orange-50 text-orange-500'
  }

  return (
    <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
      <div className="flex items-center gap-3 mb-2">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${colors[color]}`}>
          {icon}
        </div>
        <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">{title}</span>
      </div>
      <div className="text-2xl font-bold text-slate-900">{value.toLocaleString()}</div>
    </div>
  )
}
