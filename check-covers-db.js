
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const videos = await prisma.post.findMany({
    where: { 
      resourceType: 'video'
    },
    select: {
      id: true,
      title: true,
      coverImage: true,
      link: true
    }
  })
  console.log('Current Video Covers in DB:')
  console.log(JSON.stringify(videos, null, 2))
}

main()
  .finally(async () => {
    await prisma.$disconnect()
  })
