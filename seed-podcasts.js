
const { PrismaClient } = require('@prisma/client')
const { nanoid } = require('nanoid')
const prisma = new PrismaClient()

const podcasts = [
  {
    title: 'Sam Altman: OpenAI, GPT-5, Sora, Board Saga, Elon Musk, Ilya, Power & AGI',
    description: 'Lex Fridman 深度对话 Sam Altman，探讨 OpenAI 的未来、GPT-5、Sora 以及通往 AGI 的道路。',
    link: 'https://www.youtube.com/watch?v=jvqFAiSoRAE',
    author: 'Lex Fridman',
    tags: 'OpenAI, AGI, Podcast',
    category: 'ai',
    resourceType: 'podcast',
    coverImage: 'https://logo.clearbit.com/youtube.com'
  },
  {
    title: 'Mark Zuckerberg - Llama 3, AGI, & Open Source',
    description: 'Mark Zuckerberg 在 Dwarkesh Podcast 中深入探讨 Llama 3 的开源策略、AGI 愿景以及 Meta 的 AI 布局。',
    link: 'https://www.youtube.com/watch?v=bc6uFV9CJGg',
    author: 'Dwarkesh Patel',
    tags: 'Meta, Llama 3, Open Source',
    category: 'ai',
    resourceType: 'podcast',
    coverImage: 'https://logo.clearbit.com/meta.com'
  },
  {
    title: 'The AI Assistant Battle: ChatGPT vs Gemini vs Copilot!',
    description: 'MKBHD 对比测评三大主流 AI 助手，从响应速度、准确性和多模态能力等多维度进行硬核对决。',
    link: 'https://www.youtube.com/watch?v=2p8N6j2qJzI',
    author: 'Marques Brownlee',
    tags: 'Review, ChatGPT, Gemini',
    category: 'ai',
    resourceType: 'podcast',
    coverImage: 'https://logo.clearbit.com/youtube.com'
  },
  {
    title: '[1hr Talk] Intro to Large Language Models',
    description: '前 Tesla AI 总监 Andrej Karpathy 的硬核科普，深入浅出地讲解大语言模型（LLM）的原理与应用。',
    link: 'https://www.youtube.com/watch?v=zjkBMFhNj_g',
    author: 'Andrej Karpathy',
    tags: 'LLM, Tutorial, Deep Learning',
    category: 'ai',
    resourceType: 'podcast',
    coverImage: 'https://logo.clearbit.com/openai.com'
  },
  {
    title: 'The coming wave of AI technology | Mustafa Suleyman',
    description: 'DeepMind 联合创始人 Mustafa Suleyman 在 TED 演讲中预警 AI 技术浪潮带来的机遇与巨大挑战。',
    link: 'https://www.youtube.com/watch?v=plaJHx3TD-g',
    author: 'TED',
    tags: 'Future, Ethics, TED Talk',
    category: 'ai',
    resourceType: 'podcast',
    coverImage: 'https://logo.clearbit.com/ted.com'
  },
  {
    title: 'Jensen Huang, Founder and CEO of NVIDIA | Stanford GSB',
    description: 'NVIDIA 创始人黄仁勋在斯坦福商学院的精彩访谈，分享 AI 时代的算力革命与领导力哲学。',
    link: 'https://www.youtube.com/watch?v=cEg8cOx7nJM',
    author: 'Stanford GSB',
    tags: 'NVIDIA, Leadership, AI Chips',
    category: 'ai',
    resourceType: 'podcast',
    coverImage: 'https://logo.clearbit.com/nvidia.com'
  }
]

async function main() {
  console.log('Adding AI podcasts...')
  
  for (const podcast of podcasts) {
    const exists = await prisma.post.findFirst({
      where: { 
        title: podcast.title,
        type: 'resource'
      }
    })

    if (!exists) {
      await prisma.post.create({
        data: {
          title: podcast.title,
          slug: nanoid(10),
          description: podcast.description,
          content: `## ${podcast.title}\n\n${podcast.description}\n\n[Watch on YouTube](${podcast.link})`,
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
      console.log(`Created podcast: ${podcast.title}`)
    } else {
      console.log(`Skipped (already exists): ${podcast.title}`)
    }
  }
  console.log('Finished adding podcasts.')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
