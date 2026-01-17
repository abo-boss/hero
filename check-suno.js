
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const suno = await prisma.post.findFirst({
    where: { 
      title: 'Suno',
      type: 'resource'
    }
  })
  console.log(suno)
}

main()
  .finally(async () => {
    await prisma.$disconnect()
  })
