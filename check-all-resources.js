
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const allResources = await prisma.post.findMany({
    where: { type: 'resource' },
    select: { title: true, resourceType: true }
  })
  console.log(allResources)
}

main()
  .finally(async () => {
    await prisma.$disconnect()
  })
