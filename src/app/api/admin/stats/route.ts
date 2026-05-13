import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabaseUrl = process.env.SUPABASE_URL!
    const supabaseKey = process.env.SUPABASE_ANON_KEY!
    const supabase = createClient(supabaseUrl, supabaseKey)

    const now = new Date()
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const sevenDaysAgo = new Date(todayStart.getTime() - 7 * 24 * 60 * 60 * 1000)

    // 1. 总 PV
    const { count: totalPV } = await supabase
      .from('Visit')
      .select('*', { count: 'exact', head: true })

    // 2. 总 UV (去重 IP)
    const { data: allVisits } = await supabase
      .from('Visit')
      .select('ip')
    const totalUV = new Set(allVisits?.map(v => v.ip).filter(Boolean)).size

    // 3. 今日 PV
    const { count: todayPV } = await supabase
      .from('Visit')
      .select('*', { count: 'exact', head: true })
      .gte('createdAt', todayStart.toISOString())

    // 4. 今日 UV
    const { data: todayData } = await supabase
      .from('Visit')
      .select('ip')
      .gte('createdAt', todayStart.toISOString())
    const todayUV = new Set(todayData?.map(v => v.ip).filter(Boolean)).size

    // 5. 热门页面 Top 10
    const { data: topPagesData } = await supabase
      .from('Visit')
      .select('path')
      .order('createdAt', { ascending: false })
    const pathCount = new Map<string, number>()
    topPagesData?.forEach(v => {
      if (v.path) {
        pathCount.set(v.path, (pathCount.get(v.path) || 0) + 1)
      }
    })
    const topPages = Array.from(pathCount.entries())
      .map(([path, count]) => ({ path, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)

    // 6. 最近 7 天趋势
    const { data: recentData } = await supabase
      .from('Visit')
      .select('createdAt, ip')
      .gte('createdAt', sevenDaysAgo.toISOString())
      .order('createdAt', { ascending: true })

    const trendMap = new Map<string, { pv: number, ips: Set<string> }>()
    recentData?.forEach(v => {
      const dateStr = new Date(v.createdAt).toISOString().split('T')[0]
      if (!trendMap.has(dateStr)) {
        trendMap.set(dateStr, { pv: 0, ips: new Set() })
      }
      const entry = trendMap.get(dateStr)!
      entry.pv++
      if (v.ip) entry.ips.add(v.ip)
    })

    const trend = Array.from(trendMap.entries())
      .map(([date, data]) => ({
        date,
        pv: data.pv,
        uv: data.ips.size
      }))
      .sort((a, b) => a.date.localeCompare(b.date))

    // 7. 最近 20 条访问记录
    const { data: latestVisits } = await supabase
      .from('Visit')
      .select('id, path, ip, country, province, city, createdAt, userAgent')
      .order('createdAt', { ascending: false })
      .limit(20)

    return NextResponse.json({
      summary: {
        totalPV: totalPV || 0,
        totalUV,
        todayPV: todayPV || 0,
        todayUV
      },
      topPages,
      trend,
      latestVisits: latestVisits || []
    })
  } catch (error) {
    console.error('Stats API error:', error)
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}
