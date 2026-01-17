
const { PrismaClient } = require('@prisma/client')
const { nanoid } = require('nanoid')
const prisma = new PrismaClient()

const newPodcasters = [
  {
    title: 'Unsupervised Learning',
    description: 'Redpoint Ventures 推出的 AI 播客，深入探讨人工智能的前沿技术与创业机会，对话行业领袖。',
    link: 'https://www.youtube.com/@RedpointVentures', // Or specific playlist
    author: 'Redpoint Ventures',
    tags: 'VC, Startups, Tech Trends',
    category: 'ai',
    resourceType: 'podcast',
    coverImage: 'https://logo.clearbit.com/redpoint.com'
  },
  {
    title: 'No Priors',
    description: '由 Elad Gil 和 Sarah Guo 主持，专注于 AI、机器学习与科技创业，以“无先验”视角探索技术未来。',
    link: 'https://www.youtube.com/@NoPriorsPodcast',
    author: 'Elad Gil & Sarah Guo',
    tags: 'Investing, Machine Learning, Future',
    category: 'ai',
    resourceType: 'podcast',
    coverImage: 'https://logo.clearbit.com/nopriors.com' // Fallback might be needed
  }
]

async function main() {
  console.log('Adding new podcasters...')
  for (const podcaster of newPodcasters) {
    const exists = await prisma.post.findFirst({
      where: { 
        title: podcaster.title,
        type: 'resource'
      }
    })

    if (!exists) {
      await prisma.post.create({
        data: {
          title: podcaster.title,
          slug: nanoid(10),
          description: podcaster.description,
          content: `## ${podcaster.title}\n\n${podcaster.description}\n\n[Visit Channel](${podcaster.link})`,
          type: 'resource',
          category: podcaster.category,
          resourceType: podcaster.resourceType,
          link: podcaster.link,
          author: podcaster.author,
          tags: podcaster.tags,
          published: true,
          coverImage: podcaster.coverImage,
          date: new Date()
        }
      })
      console.log(`Created podcaster entry: ${podcaster.title}`)
    } else {
      console.log(`Skipped (already exists): ${podcaster.title}`)
    }
  }
  console.log('Finished.')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
