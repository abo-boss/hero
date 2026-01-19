import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const start = Date.now()
    // 尝试简单的查询，获取用户数量作为连通性测试
    const userCount = await prisma.user.count()
    const duration = Date.now() - start
    
    return NextResponse.json({
      status: 'ok',
      message: '✅ Database connection successful!',
      duration: `${duration}ms`,
      userCount,
      databaseUrlConfigured: !!process.env.DATABASE_URL,
      timestamp: new Date().toISOString()
    })
  } catch (error: any) {
    console.error('Database connection failed:', error)
    return NextResponse.json({
      status: 'error',
      message: '❌ Database connection failed',
      errorDetails: error.message,
      errorCode: error.code,
      errorMeta: error.meta,
      databaseUrlConfigured: !!process.env.DATABASE_URL,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
