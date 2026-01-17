
const { PrismaClient } = require('@prisma/client')
const { nanoid } = require('nanoid')
const prisma = new PrismaClient()

// Previous titles to delete
const titlesToDelete = [
  'Sam Altman: OpenAI, GPT-5, Sora, Board Saga, Elon Musk, Ilya, Power & AGI',
  'Mark Zuckerberg - Llama 3, AGI, & Open Source',
  'The AI Assistant Battle: ChatGPT vs Gemini vs Copilot!',
  '[1hr Talk] Intro to Large Language Models',
  'The coming wave of AI technology | Mustafa Suleyman',
  'Jensen Huang, Founder and CEO of NVIDIA | Stanford GSB'
]

const podcasters = [
  {
    title: 'Lex Fridman Podcast',
    description: '深度对话科技、科学与人类意识。Lex Fridman 经常邀请 Sam Altman, Elon Musk, Yann LeCun 等 AI 巨头进行长达数小时的硬核访谈。',
    link: 'https://www.youtube.com/@lexfridman',
    author: 'Lex Fridman',
    tags: 'Deep Dive, Philosophy, AGI',
    category: 'ai',
    resourceType: 'podcast',
    coverImage: 'https://logo.clearbit.com/lexfridman.com'
  },
  {
    title: 'Andrej Karpathy',
    description: '前 Tesla AI 总监和 OpenAI 创始成员的硬核教学频道。他能用最清晰的代码和直觉，手把手教你构建 LLM 和神经网络。',
    link: 'https://www.youtube.com/@AndrejKarpathy',
    author: 'Andrej Karpathy',
    tags: 'Education, Coding, LLM',
    category: 'ai',
    resourceType: 'podcast',
    coverImage: 'https://avatars.githubusercontent.com/u/241138?v=4'
  },
  {
    title: 'Latent Space',
    description: '由 AI 工程师 Swyx 和 Alessio 主持，专注于 AI 工程化、最新论文解读和技术趋势，是 AI 开发者必听的硬核播客。',
    link: 'https://www.youtube.com/@LatentSpaceTV',
    author: 'Latent Space',
    tags: 'Engineering, Industry, Tech',
    category: 'ai',
    resourceType: 'podcast',
    coverImage: 'https://logo.clearbit.com/latent.space'
  }
]

async function main() {
  console.log('Cleaning up old podcasts...')
  await prisma.post.deleteMany({
    where: {
      title: { in: titlesToDelete },
      type: 'resource'
    }
  })
  console.log('Deleted old podcasts.')

  console.log('Adding top 3 AI podcasters...')
  for (const podcaster of podcasters) {
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
      console.log(`Skipped: ${podcaster.title}`)
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
