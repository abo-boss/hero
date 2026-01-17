
const { PrismaClient } = require('@prisma/client')
const { nanoid } = require('nanoid')
const prisma = new PrismaClient()

// 需要保留的工具：Cursor
// 需要删除的工具：v0, Bolt.new, Windsurf, Lovable
const toolsToDelete = ['v0', 'Bolt.new', 'Windsurf', 'Lovable']

const newTools = [
  {
    title: 'LookX',
    description: '专为建筑师和设计师打造的 AI 灵感生成平台，支持从草图或模型快速生成高质量建筑渲染图。',
    link: 'https://www.lookx.ai/',
    author: 'LookX',
    tags: 'Architecture, Design, Rendering',
    category: 'ai',
    resourceType: 'tool'
  },
  {
    title: 'PromeAI',
    description: '强大的 AI 设计助手，涵盖建筑、室内、产品设计，支持草图渲染、创意填充和风格转换。',
    link: 'https://www.promeai.com/',
    author: 'PromeAI',
    tags: 'Design, Architecture, Interior',
    category: 'ai',
    resourceType: 'tool'
  },
  {
    title: 'UrbanistAI',
    description: '专注于城市规划和设计的生成式 AI 平台，帮助规划师快速可视化城市改造方案和未来场景。',
    link: 'https://urbanistai.com/',
    author: 'UrbanistAI',
    tags: 'Urban Planning, Design, Visualization',
    category: 'ai',
    resourceType: 'tool'
  },
  {
    title: 'Harvey',
    description: '面向专业服务领域的 AI 平台，专为法律、咨询和税务事务所打造，提供深度文档分析和起草功能。',
    link: 'https://www.harvey.ai/',
    author: 'Harvey',
    tags: 'Consulting, Legal, Professional',
    category: 'ai',
    resourceType: 'tool'
  }
]

async function main() {
  console.log('Start updating tools...')
  
  // 1. Delete specified tools
  console.log('Deleting old tools...')
  const deleteResult = await prisma.post.deleteMany({
    where: {
      title: {
        in: toolsToDelete
      },
      type: 'resource'
    }
  })
  console.log(`Deleted ${deleteResult.count} tools.`)

  // 2. Add new diverse tools
  console.log('Adding new diverse tools...')
  for (const tool of newTools) {
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
  console.log('Update finished.')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
