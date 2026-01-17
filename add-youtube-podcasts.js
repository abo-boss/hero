
const { PrismaClient } = require('@prisma/client')
const { nanoid } = require('nanoid')
const prisma = new PrismaClient()

const podcastsToAdd = [
  {
    title: 'Google DeepMind',
    description: 'Google DeepMind 官方频道，发布关于 AlphaGo, AlphaFold, Gemini 等突破性 AI 技术的演示与纪录片。',
    link: 'https://www.youtube.com/@GoogleDeepMind',
    author: 'Google DeepMind',
    tags: 'Research, AGI, Science',
    category: 'ai',
    resourceType: 'podcast',
    coverImage: 'https://logo.clearbit.com/deepmind.google'
  },
  {
    title: 'Every',
    description: 'Every 官方频道，探讨科技、AI 与商业的交叉点，提供深度的访谈与分析。',
    link: 'https://www.youtube.com/@EveryInc',
    author: 'Every',
    tags: 'Tech, Productivity, Culture',
    category: 'ai',
    resourceType: 'podcast',
    coverImage: 'https://logo.clearbit.com/every.to'
  }
]

async function main() {
  console.log('Adding/Updating YouTube podcasts...')
  
  for (const podcast of podcastsToAdd) {
    // Try to find by title (including old 'Blog' title for DeepMind)
    let exists = await prisma.post.findFirst({
      where: { 
        OR: [
          { title: podcast.title },
          { title: podcast.title + ' Blog' } // Check for old name
        ],
        type: 'resource'
      }
    })

    if (exists) {
      console.log(`Updating existing entry: ${exists.title} -> ${podcast.title}`)
      await prisma.post.update({
        where: { id: exists.id },
        data: {
          title: podcast.title,
          link: podcast.link,
          description: podcast.description,
          content: `## ${podcast.title}\n\n${podcast.description}\n\n[Visit Channel](${podcast.link})`,
          resourceType: 'podcast',
          coverImage: podcast.coverImage
        }
      })
    } else {
      console.log(`Creating new entry: ${podcast.title}`)
      await prisma.post.create({
        data: {
          title: podcast.title,
          slug: nanoid(10),
          description: podcast.description,
          content: `## ${podcast.title}\n\n${podcast.description}\n\n[Visit Channel](${podcast.link})`,
          type: 'resource',
          category: podcast.category,
          resourceType: podcast.resourceType,
          link: podcast.link,
          author: podcast.author,
          tags: podcast.tags,
          published: true,
          coverImage: podcast.coverImage,
          date: new Date()
        }
      })
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
