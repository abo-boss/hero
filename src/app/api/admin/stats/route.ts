import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const now = new Date()
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const sevenDaysAgo = new Date(todayStart.getTime() - 7 * 24 * 60 * 60 * 1000)

    // 1. 总 PV 和 UV
    const totalPV = await (prisma as any).visit.count()
    const totalUVResult = await prisma.$queryRaw`SELECT COUNT(DISTINCT ip) as count FROM "Visit"`
    const totalUV = Number((totalUVResult as any)[0].count)

    // 2. 今日 PV 和 UV
    const todayPV = await (prisma as any).visit.count({
      where: { createdAt: { gte: todayStart } }
    })
    const todayUVResult = await prisma.$queryRaw`SELECT COUNT(DISTINCT ip) as count FROM "Visit" WHERE "createdAt" >= ${todayStart}`
    const todayUV = Number((todayUVResult as any)[0].count)

    // 3. 热门页面 Top 10
    const topPages = await (prisma as any).visit.groupBy({
      by: ['path'],
      _count: {
        path: true
      },
      orderBy: {
        _count: {
          path: 'desc'
        }
      },
      take: 10
    })

    // 4. 最近 7 天趋势
    const recentVisits = await (prisma as any).visit.findMany({
      where: {
        createdAt: {
          gte: sevenDaysAgo
        }
      },
      select: {
        createdAt: true,
        ip: true
      },
      orderBy: {
        createdAt: 'asc'
      }
    })

    const trendMap = new Map<string, { pv: number, ips: Set<string> }>()
    
    recentVisits.forEach((v: any) => {
      // Use local time formatting to match the 'todayStart' logic
      const year = v.createdAt.getFullYear()
      const month = String(v.createdAt.getMonth() + 1).padStart(2, '0')
      const day = String(v.createdAt.getDate()).padStart(2, '0')
      const dateStr = `${year}-${month}-${day}`
      
      if (!trendMap.has(dateStr)) {
        trendMap.set(dateStr, { pv: 0, ips: new Set() })
      }
      
      const entry = trendMap.get(dateStr)!
      entry.pv++
      if (v.ip) {
        entry.ips.add(v.ip)
      }
    })

    const trend = Array.from(trendMap.entries())
      .map(([date, data]) => ({
        date,
        pv: data.pv,
        uv: data.ips.size
      }))
      .sort((a, b) => a.date.localeCompare(b.date))

    return NextResponse.json({
      summary: {
        totalPV,
        totalUV,
        todayPV,
        todayUV
      },
      topPages: topPages.map((p: any) => ({
        path: p.path,
        count: p._count.path
      })),
      trend
    })
  } catch (error) {
    console.error('Stats API error:', error)
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}
