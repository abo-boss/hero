
const { PrismaClient } = require('@prisma/client')
const { nanoid } = require('nanoid')
const prisma = new PrismaClient()

const tools = [
  {
    title: 'Cursor',
    description: '新一代 AI 代码编辑器，基于 VS Code 构建，深度集成 AI 编程助手，让编码更智能高效。',
    link: 'https://cursor.sh/',
    author: 'Anysphere',
    tags: 'Coding, IDE, AI Assistant',
    category: 'ai',
    resourceType: 'tool'
  },
  {
    title: 'v0',
    description: 'Vercel 推出的生成式 UI 系统，通过简单的文本描述即可生成可复制的 React/Tailwind 代码。',
    link: 'https://v0.dev/',
    author: 'Vercel',
    tags: 'UI Design, Frontend, Coding',
    category: 'ai',
    resourceType: 'tool'
  },
  {
    title: 'Bolt.new',
    description: 'StackBlitz 推出的 AI Web 开发环境，可在浏览器中直接生成、运行和部署全栈应用。',
    link: 'https://bolt.new/',
    author: 'StackBlitz',
    tags: 'Web Development, Fullstack, Cloud IDE',
    category: 'ai',
    resourceType: 'tool'
  },
  {
    title: 'Windsurf',
    description: 'Codeium 推出的 AI 编辑器，主打上下文感知的代码补全和重构，提供流畅的开发体验。',
    link: 'https://codeium.com/windsurf',
    author: 'Codeium',
    tags: 'Coding, IDE, AI Assistant',
    category: 'ai',
    resourceType: 'tool'
  },
  {
    title: 'Lovable',
    description: '无需编码知识即可构建全栈 Web 应用的 AI 平台，让创意快速转化为产品。',
    link: 'https://lovable.dev/',
    author: 'Lovable',
    tags: 'No-Code, Web Development, Builder',
    category: 'ai',
    resourceType: 'tool'
  }
]

async function main() {
  console.log('Start seeding new tools...')
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
