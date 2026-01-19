import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const dbUrl = process.env.DATABASE_URL
    const isSet = !!dbUrl
    const maskedUrl = dbUrl ? dbUrl.replace(/:[^:@]+@/, ':***@') : 'not set'

    const count = await prisma.post.count()
    const posts = await prisma.post.findMany({
      take: 5,
      orderBy: { date: 'desc' }
    })

    return NextResponse.json({
      success: true,
      env: {
        DATABASE_URL_SET: isSet,
        DATABASE_URL_MASKED: maskedUrl,
        NODE_ENV: process.env.NODE_ENV
      },
      count,
      posts
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 })
  }
}
