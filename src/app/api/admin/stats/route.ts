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
    const trend = await prisma.$queryRaw`
      SELECT 
        TO_CHAR("createdAt", 'YYYY-MM-DD') as date,
        COUNT(*) as pv,
        COUNT(DISTINCT ip) as uv
      FROM "Visit"
      WHERE "createdAt" >= ${sevenDaysAgo}
      GROUP BY date
      ORDER BY date ASC
    `

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
      trend: (trend as any).map((t: any) => ({
        date: t.date,
        pv: Number(t.pv),
        uv: Number(t.uv)
      }))
    })
  } catch (error) {
    console.error('Stats API error:', error)
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}
