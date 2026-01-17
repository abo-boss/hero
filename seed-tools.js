
const { PrismaClient } = require('@prisma/client')
const { nanoid } = require('nanoid')
const prisma = new PrismaClient()

const tools = [
  {
    title: 'ChatGPT',
    description: 'OpenAI 开发的领先 AI 聊天机器人，擅长对话、写作、编码和创意任务。',
    link: 'https://chat.openai.com/',
    author: 'OpenAI',
    tags: 'AI Chat, Writing, Coding',
    category: 'ai',
    resourceType: 'tool'
  },
  {
    title: 'Midjourney',
    description: '目前最强大的 AI 图像生成工具之一，能创作出极具艺术感和细节的高质量图片。',
    link: 'https://www.midjourney.com/',
    author: 'Midjourney',
    tags: 'Image Generation, Art, Design',
    category: 'ai',
    resourceType: 'tool'
  },
  {
    title: 'Claude',
    description: 'Anthropic 开发的 AI 助手，以长文本处理能力和安全性著称，适合文档分析和写作。',
    link: 'https://claude.ai/',
    author: 'Anthropic',
    tags: 'AI Chat, Analysis, Writing',
    category: 'ai',
    resourceType: 'tool'
  },
  {
    title: 'Runway',
    description: '专业的 AI 视频创作套件，提供 Gen-2 等模型，支持文字生成视频和视频风格化。',
    link: 'https://runwayml.com/',
    author: 'Runway',
    tags: 'Video Generation, Editing, Creative',
    category: 'ai',
    resourceType: 'tool'
  },
  {
    title: 'Notion AI',
    description: '集成在 Notion 中的 AI 助手，帮助整理笔记、撰写文档和生成创意。',
    link: 'https://www.notion.so/product/ai',
    author: 'Notion',
    tags: 'Productivity, Writing, Note-taking',
    category: 'ai',
    resourceType: 'tool'
  },
  {
    title: 'Canva Magic Studio',
    description: 'Canva 的 AI 设计套件，包含自动修图、文生图、魔法排版等功能，让设计更简单。',
    link: 'https://www.canva.com/magic-home/',
    author: 'Canva',
    tags: 'Design, Image, Social Media',
    category: 'ai',
    resourceType: 'tool'
  },
  {
    title: 'Suno',
    description: '强大的 AI 音乐生成工具，只需输入文字描述即可生成包含人声的高质量歌曲。',
    link: 'https://suno.com/',
    author: 'Suno',
    tags: 'Music, Audio, Creative',
    category: 'ai',
    resourceType: 'tool'
  },
  {
    title: 'HeyGen',
    description: 'AI 数字人视频生成平台，可制作逼真的口型同步视频，适合营销和教育内容。',
    link: 'https://www.heygen.com/',
    author: 'HeyGen',
    tags: 'Video, Avatar, Marketing',
    category: 'ai',
    resourceType: 'tool'
  },
  {
    title: 'Perplexity',
    description: 'AI 驱动的智能搜索引擎，提供精准的答案和来源引用，是研究和学习的利器。',
    link: 'https://www.perplexity.ai/',
    author: 'Perplexity',
    tags: 'Search, Research, Learning',
    category: 'ai',
    resourceType: 'tool'
  }
]

async function main() {
  console.log('Start seeding tools...')
  for (const tool of tools) {
    const exists = await prisma.post.findFirst({
      where: { 
        title: tool.title,
        type: 'resource'
      }
    })

    if (!exists) {
      await prisma.post.create({
        data: {
          title: tool.title,
          slug: nanoid(10),
          description: tool.description,
          content: `## ${tool.title}\n\n${tool.description}\n\n[Visit Website](${tool.link})`,
          type: 'resource',
          category: tool.category,
          resourceType: tool.resourceType,
          link: tool.link,
          author: tool.author,
          tags: tool.tags,
          published: true,
          date: new Date()
        }
      })
      console.log(`Created tool: ${tool.title}`)
    } else {
      console.log(`Skipped (already exists): ${tool.title}`)
    }
  }
  console.log('Seeding finished.')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
