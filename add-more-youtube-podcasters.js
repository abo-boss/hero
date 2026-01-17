
const { PrismaClient } = require('@prisma/client')
const { nanoid } = require('nanoid')
const prisma = new PrismaClient()

const newPodcasters = [
  {
    title: 'AI Explained',
    description: '公认的高质量 AI 资讯频道，以冷静、深入的分析著称。专注于解读最新论文、模型发布及 AI 行业的深层影响。',
    link: 'https://www.youtube.com/@aiexplained-official',
    author: 'AI Explained',
    tags: 'Analysis, News, Deep Dive',
    category: 'ai',
    resourceType: 'podcast',
    coverImage: 'https://logo.clearbit.com/youtube.com' // Fallback, maybe try fetching specific avatar later if possible, but standard logo is safe
  },
  {
    title: 'Two Minute Papers',
    description: 'Károly Zsolnai-Fehér 主持的经典频道，用两分钟（左右）的时间生动演示最前沿的 AI 与图形学论文成果，视觉效果极佳。',
    link: 'https://www.youtube.com/@TwoMinutePapers',
    author: 'Two Minute Papers',
    tags: 'Research, Demo, Science',
    category: 'ai',
    resourceType: 'podcast',
    coverImage: 'https://logo.clearbit.com/twominutepapers.com' // Fallback
  }
]

async function main() {
  console.log('Adding new YouTube podcasters...')
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
