
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const posts = await prisma.post.findMany({
    where: { type: 'resource', resourceType: 'tool' },
    select: { title: true }
  })
  console.log(posts.map(p => p.title))
}

main()
  .finally(async () => {
    await prisma.$disconnect()
  })
