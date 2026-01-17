import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    console.log('Starting data migration...')

    // 1. AI Resources: Podcast -> category: ai, resourceType: podcast
    const podcastResult = await prisma.post.updateMany({
      where: { category: 'podcast' },
      data: { category: 'ai', resourceType: 'podcast' }
    })
    console.log(`Updated ${podcastResult.count} AI podcasts`)

    // 2. AI Resources: Product -> category: ai, resourceType: tool
    const productResult = await prisma.post.updateMany({
      where: { category: 'product' },
      data: { category: 'ai', resourceType: 'tool' }
    })
    console.log(`Updated ${productResult.count} AI tools`)

    // 3. Content Creation: cc-video -> category: content-creation, resourceType: video
    const ccVideoResult = await prisma.post.updateMany({
      where: { category: 'cc-video' },
      data: { category: 'content-creation', resourceType: 'video' }
    })
    console.log(`Updated ${ccVideoResult.count} Content Creation videos`)

    // 4. Content Creation: cc-podcast -> category: content-creation, resourceType: podcast
    const ccPodcastResult = await prisma.post.updateMany({
      where: { category: 'cc-podcast' },
      data: { category: 'content-creation', resourceType: 'podcast' }
    })
    console.log(`Updated ${ccPodcastResult.count} Content Creation podcasts`)

    // 5. Content Creation: cc-article -> category: content-creation, resourceType: article
    const ccArticleResult = await prisma.post.updateMany({
      where: { category: 'cc-article' },
      data: { category: 'content-creation', resourceType: 'article' }
    })
    console.log(`Updated ${ccArticleResult.count} Content Creation articles`)

    // 6. AI Resources: Remaining 'ai' category with null resourceType -> default to 'article'
    const aiArticleResult = await prisma.post.updateMany({
      where: { category: 'ai', resourceType: null },
      data: { resourceType: 'article' }
    })
    console.log(`Updated ${aiArticleResult.count} AI articles (defaulted)`)

    console.log('Migration completed successfully!')

  } catch (error) {
    console.error('Migration failed:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
