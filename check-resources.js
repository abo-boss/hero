
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const resources = await prisma.post.findMany({
    where: {
      type: 'resource',
    },
    orderBy: {
      createdAt: 'desc'
    },
    take: 5
  })
  console.log(JSON.stringify(resources, null, 2))
}

main()
  .catch(e => {
    throw e
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
