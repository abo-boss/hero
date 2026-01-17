
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const tools = await prisma.post.findMany({
    where: { 
      resourceType: 'tool'
    },
    select: {
      id: true,
      title: true,
      coverImage: true,
      link: true
    }
  })
  console.log('Current AI Tools in DB:')
  console.log(JSON.stringify(tools, null, 2))
}

main()
  .finally(async () => {
    await prisma.$disconnect()
  })
