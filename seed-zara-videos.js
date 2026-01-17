
const { PrismaClient } = require('@prisma/client')
const { nanoid } = require('nanoid')
const prisma = new PrismaClient()

const videos = [
  {
    title: 'Deep Dive into LLMs like ChatGPT',
    description: 'The best introduction into LLMs on the Internet',
    channel: 'Andrej Karpathy',
    tags: 'Fundamentals',
    url: 'https://www.youtube.com/watch?v=7xTGNNLPyMI'
  },
  {
    title: 'How I use LLMs',
    description: 'Beginner-friendly guide to using LLMs',
    channel: 'Andrej Karpathy',
    tags: 'Fundamentals, Practical tutorial',
    url: 'https://www.youtube.com/watch?v=EWvNQjAaOHw'
  }
]

async function main() {
  console.log('Adding Zara/Karpathy videos...')
  
  for (const video of videos) {
    const exists = await prisma.post.findFirst({
      where: { 
        title: video.title,
        type: 'resource'
      }
    })

    if (!exists) {
      await prisma.post.create({
        data: {
          title: video.title,
          slug: nanoid(10),
          description: video.description,
          content: `## ${video.title}\n\n${video.description}\n\n[Watch on YouTube](${video.url})`,
          type: 'resource',
          category: 'ai', // General category
          resourceType: 'video', // Featured Video
          link: video.url,
          author: video.channel,
          tags: video.tags,
          published: true,
          coverImage: 'https://logo.clearbit.com/youtube.com', // Default
          date: new Date()
        }
      })
      console.log(`Created video: ${video.title}`)
    } else {
      console.log(`Skipped: ${video.title}`)
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
