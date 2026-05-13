import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { headers } from 'next/headers'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const { path, referer } = await request.json()
    
    if (!path) {
      return NextResponse.json({ error: 'Path is required' }, { status: 400 })
    }

    const headersList = headers()
    
    // 获取 IP (处理 Vercel 和本地环境)
    const ip = headersList.get('x-forwarded-for')?.split(',')[0] || 
               headersList.get('x-real-ip') || 
               'unknown'
    
    // 获取 Vercel 提供的地理位置信息
    const country = headersList.get('x-vercel-ip-country') || 'unknown'
    const city = headersList.get('x-vercel-ip-city') || 'unknown'
    const userAgent = headersList.get('user-agent') || 'unknown'

    // 排除管理员后台的访问统计
    if (path.startsWith('/admin') || path.startsWith('/api')) {
      return NextResponse.json({ success: true, skipped: true })
    }

    // 使用 IPAPI 获取更精确的地理位置（包括省份）
    let province = ''
    if (ip !== 'unknown' && !ip.includes('localhost')) {
      try {
        const response = await fetch(`http://ip-api.com/json/${ip}?lang=zh-CN`, {
          headers: { 'Accept': 'application/json' }
        })
        const data = await response.json()
        if (data.status === 'success') {
          province = data.regionName || ''
        }
      } catch (error) {
        console.warn('IPAPI lookup failed:', error)
      }
    }

    // 异步写入数据库，不阻塞响应
    await (prisma as any).visit.create({
      data: {
        path,
        ip,
        userAgent,
        referer: referer || headersList.get('referer') || '',
        country,
        province: province || null,
        city,
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Analytics track error:', error)
    // 即使失败也返回 200，避免影响前端
    return NextResponse.json({ success: false }, { status: 200 })
  }
}
