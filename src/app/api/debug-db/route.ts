import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const raw = process.env.DATABASE_URL || ''
    const isSet = !!raw
    const maskedUrl = raw ? raw.replace(/:[^:@]+@/, ':***@') : 'not set'
    const parsed = isSet ? new URL(raw) : null
    const details = parsed
      ? {
          protocol: parsed.protocol.replace(':', ''),
          host: parsed.hostname,
          port: parsed.port,
          db: parsed.pathname.replace('/', ''),
          userIsPostgres: parsed.username === 'postgres',
          isPoolerHost: parsed.hostname.includes('pooler.supabase.com'),
          is6543Port: parsed.port === '6543',
          hasPgbouncerParam: parsed.searchParams.has('pgbouncer') && parsed.searchParams.get('pgbouncer') === 'true',
          hasConnectionLimit: parsed.searchParams.has('connection_limit'),
        }
      : {}

    let count = 0
    let posts: any[] = []
    try {
      count = await prisma.post.count()
      posts = await prisma.post.findMany({
        take: 5,
        orderBy: { date: 'desc' }
      })
    } catch {}

    return NextResponse.json({
      success: true,
      env: {
        DATABASE_URL_SET: isSet,
        DATABASE_URL_MASKED: maskedUrl,
        NODE_ENV: process.env.NODE_ENV,
        details
      },
      count,
      posts
    })
  } catch (error: any) {
    const raw = process.env.DATABASE_URL || ''
    const parsed = raw ? new URL(raw) : null
    const details = parsed
      ? {
          protocol: parsed.protocol.replace(':', ''),
          host: parsed.hostname,
          port: parsed.port,
          db: parsed.pathname.replace('/', ''),
          userIsPostgres: parsed.username === 'postgres',
          isPoolerHost: parsed.hostname.includes('pooler.supabase.com'),
          is6543Port: parsed.port === '6543',
          hasPgbouncerParam: parsed.searchParams.has('pgbouncer') && parsed.searchParams.get('pgbouncer') === 'true',
          hasConnectionLimit: parsed.searchParams.has('connection_limit'),
        }
      : {}
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack,
      env: {
        DATABASE_URL_SET: !!raw,
        details
      }
    }, { status: 500 })
  }
}
