
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const podcasts = await prisma.post.findMany({
    where: { type: 'resource', resourceType: 'podcast' },
    select: { title: true, link: true }
  })
  console.log(podcasts)
}

main()
  .finally(async () => {
    await prisma.$disconnect()
  })
