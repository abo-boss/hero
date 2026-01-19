import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const getDatabaseUrl = () => {
  let url = process.env.DATABASE_URL
  if (!url) return undefined

  // Force port 6543 (Transaction Pooler) for Vercel/Serverless
  if (url.includes(':5432')) {
    url = url.replace(':5432', ':6543')
  }

  // Ensure pgbouncer parameters are present
  if (!url.includes('pgbouncer=true')) {
    const separator = url.includes('?') ? '&' : '?'
    url = `${url}${separator}pgbouncer=true&connection_limit=1`
  }

  return url
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  datasources: {
    db: {
      url: getDatabaseUrl()
    }
  }
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
