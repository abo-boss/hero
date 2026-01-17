
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const titlesToMove = [
  'Google DeepMind Blog',
  'Every'
]

async function main() {
  console.log('Moving blogs to podcast category...')
  
  const result = await prisma.post.updateMany({
    where: {
      title: { in: titlesToMove },
      type: 'resource'
    },
    data: {
      resourceType: 'podcast' // Change from 'article' to 'podcast'
    }
  })

  console.log(`Updated ${result.count} entries.`)
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
