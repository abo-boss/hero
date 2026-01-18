import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

const RESET_TOKEN = process.env.RESET_ADMIN_TOKEN

export async function POST(request: Request) {
  const url = new URL(request.url)
  const token = url.searchParams.get('token')

  if (!RESET_TOKEN || token !== RESET_TOKEN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const email = 'cxbyy129@126.com'
  const password = 'cxb63607'
  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      password: hashedPassword,
      name: 'Admin',
    },
    create: {
      email,
      name: 'Admin',
      password: hashedPassword,
    },
  })

  return NextResponse.json({
    success: true,
    email: user.email,
  })
}

