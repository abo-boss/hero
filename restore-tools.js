
const { PrismaClient } = require('@prisma/client')
const { nanoid } = require('nanoid')
const prisma = new PrismaClient()

const toolsToAdd = [
  {
    title: 'ChatGPT',
    description: 'OpenAI 开发的领先 AI 聊天机器人，擅长对话、写作、编码和创意任务。',
    link: 'https://chat.openai.com/',
    author: 'OpenAI',
    tags: 'AI Chat, Writing, Coding',
    category: 'ai',
    resourceType: 'tool',
    coverImage: 'https://logo.clearbit.com/openai.com'
  },
  {
    title: 'Claude',
    description: 'Anthropic 开发的 AI 助手，以长文本处理能力和安全性著称，适合文档分析和写作。',
    link: 'https://claude.ai/',
    author: 'Anthropic',
    tags: 'AI Chat, Analysis, Writing',
    category: 'ai',
    resourceType: 'tool',
    coverImage: 'https://logo.clearbit.com/anthropic.com'
  },
  {
    title: 'Notion AI',
    description: '集成在 Notion 中的 AI 助手，帮助整理笔记、撰写文档和生成创意。',
    link: 'https://www.notion.so/product/ai',
    author: 'Notion',
    tags: 'Productivity, Writing, Note-taking',
    category: 'ai',
    resourceType: 'tool',
    coverImage: 'https://logo.clearbit.com/notion.so'
  },
  {
    title: 'Perplexity',
    description: 'AI 驱动的智能搜索引擎，提供精准的答案和来源引用，是研究和学习的利器。',
    link: 'https://www.perplexity.ai/',
    author: 'Perplexity',
    tags: 'Search, Research, Learning',
    category: 'ai',
    resourceType: 'tool',
    coverImage: 'https://logo.clearbit.com/perplexity.ai'
  },
  {
    title: 'UrbanistAI',
    description: '专注于城市规划和设计的生成式 AI 平台，帮助规划师快速可视化城市改造方案和未来场景。',
    link: 'https://urbanistai.com/',
    author: 'UrbanistAI',
    tags: 'Urban Planning, Design, Visualization',
    category: 'ai',
    resourceType: 'tool',
    coverImage: 'https://logo.clearbit.com/urbanistai.com'
  }
]

async function main() {
  console.log('Start restoring missing tools...')
  for (const tool of toolsToAdd) {
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
          coverImage: tool.coverImage,
          date: new Date()
        }
      })
      console.log(`Created tool: ${tool.title}`)
    } else {
      console.log(`Skipped (already exists): ${tool.title}`)
      // Update logo if exists but missing
      if (tool.coverImage) {
          await prisma.post.update({
              where: { id: exists.id },
              data: { coverImage: tool.coverImage }
          })
          console.log(`Updated logo for existing: ${tool.title}`)
      }
    }
  }
  console.log('Restore finished.')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
