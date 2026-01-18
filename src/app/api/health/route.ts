export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    console.log('Testing database connection...')
    const userCount = await prisma.user.count()
    return NextResponse.json({ 
      status: 'ok', 
      database: 'connected', 
      userCount,
      env: {
        hasUrl: !!process.env.DATABASE_URL,
        urlPrefix: process.env.DATABASE_URL?.substring(0, 15) // 只显示前缀以安全检查协议
      }
    })
  } catch (e: any) {
    console.error('Database connection failed:', e)
    return NextResponse.json({ 
      status: 'error', 
      database: 'disconnected', 
      error: e.message,
      code: e.code,
      meta: e.meta,
      name: e.name
    }, { status: 500 })
  }
}
