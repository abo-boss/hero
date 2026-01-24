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
        urlPrefix: process.env.DATABASE_URL?.substring(0, 15)
      }
    })
  } catch (e: any) {
    console.error('Database connection failed:', e)
    const raw = process.env.DATABASE_URL || ''
    let details: any = {}
    try {
      const parsed = new URL(raw)
      const searchParams = parsed.searchParams
      details = {
        protocol: parsed.protocol.replace(':',''),
        host: parsed.hostname,
        port: parsed.port,
        db: parsed.pathname.replace('/',''),
        userIsPostgres: parsed.username === 'postgres',
        isPoolerHost: parsed.hostname.includes('pooler.supabase.com'),
        is6543Port: parsed.port === '6543',
        hasPgbouncerParam: searchParams.has('pgbouncer') && searchParams.get('pgbouncer') === 'true',
        hasConnectionLimit: searchParams.has('connection_limit'),
      }
    } catch {}
    return NextResponse.json({
      status: 'error',
      database: 'disconnected',
      error: e.message,
      code: e.code,
      meta: e.meta,
      name: e.name,
      envCheck: {
        hasUrl: !!raw,
        details
      }
    }, { status: 500 })
  }
}
