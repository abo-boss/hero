import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Checking "link" field in resource data...')

  // Fetch all posts of type 'resource'
  const posts = await prisma.post.findMany({
    where: {
      type: 'resource'
    },
    select: {
      slug: true,
      title: true,
      link: true,
      category: true,
      resourceType: true
    }
  })

  console.log(`Found ${posts.length} resources.\n`)

  let withLink = 0
  let withoutLink = 0

  console.log('--- Resources WITHOUT Link ---')
  posts.forEach(post => {
    if (post.link && post.link.trim() !== '') {
      withLink++
    } else {
      withoutLink++
      console.log(`[No Link] Slug: ${post.slug} | Type: ${post.resourceType} | Title: ${post.title}`)
    }
  })

  console.log('\n--- Summary ---')
  console.log(`With Link: ${withLink}`)
  console.log(`Without Link: ${withoutLink}`)
  console.log(`Total: ${posts.length}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
