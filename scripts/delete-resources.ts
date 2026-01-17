import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    console.log('Deleting all posts with type="resource"...')
    
    // Delete all posts where type is 'resource'
    const result = await prisma.post.deleteMany({
      where: {
        type: 'resource',
      },
    })

    console.log(`Success: Deleted ${result.count} resource posts.`)
  } catch (error) {
    console.error('Error deleting resources:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
