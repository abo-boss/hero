import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    console.log('Starting AI video classification migration...')

    // Define keywords that identify a video
    // These keywords match the titles we saw in the previous step
    const videoKeywords = [
      '3Blue1Brown',
      'Andrew Ng',
      'Karpathy', // Andrej Karpathy
      'MKBHD',
      'Jensen Huang',
      'Sam Altman',
      'Elon Musk',
      '演示',      // Demo
      '实况编程',  // Live Coding
      '视频',      // Video
      '访谈',      // Interview
      '演讲',      // Speech/Talk
      '实战',      // Hands-on / Tutorial
      '入门',      // Intro / Tutorial (often video)
      'Top 10',    // Futurepedia video
      'Vibe Coding' // Likely a concept video
    ]

    // Find all AI articles
    const aiArticles = await prisma.post.findMany({
      where: {
        category: 'ai',
        resourceType: 'article'
      }
    })

    console.log(`Found ${aiArticles.length} AI articles. Checking for videos...`)

    let updatedCount = 0

    for (const post of aiArticles) {
      // Check if title contains any of the video keywords
      const isVideo = videoKeywords.some(keyword => 
        post.title.toLowerCase().includes(keyword.toLowerCase())
      )

      if (isVideo) {
        console.log(`Converting to VIDEO: ${post.title}`)
        await prisma.post.update({
          where: { id: post.id },
          data: { resourceType: 'video' }
        })
        updatedCount++
      }
    }

    console.log(`\nMigration complete!`)
    console.log(`Converted ${updatedCount} posts from 'article' to 'video'.`)
    console.log(`Remaining articles: ${aiArticles.length - updatedCount}`)

  } catch (error) {
    console.error('Migration failed:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
