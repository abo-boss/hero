import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const post = await prisma.post.findFirst({
    orderBy: {
      date: 'desc', // Assuming user meant 'recently added' which usually correlates with date
    },
  })

  if (!post) {
    console.log('No posts found.')
    return
  }

  console.log('Most recent post:')
  console.log('-----------------')
  console.log(`Title:       ${post.title}`)
  console.log(`Slug:        ${post.slug}`)
  console.log(`Type:        ${post.type}`)
  console.log(`Category:    ${post.category}`)
  console.log(`ResourceType:${post.resourceType}`)
  console.log(`Link:        ${post.link}`)
  console.log(`ID:          ${post.id}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
