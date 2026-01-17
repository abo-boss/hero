import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    console.log('Fetching posts...')
    
    const posts = await prisma.post.findMany({
      select: {
        id: true,
        title: true,
        type: true,
        category: true,
        resourceType: true,
      },
    })

    console.log(JSON.stringify(posts, null, 2))
    console.log(`\nTotal posts found: ${posts.length}`)
  } catch (error) {
    console.error('Error fetching posts:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
