
const { PrismaClient } = require('@prisma/client')
const { nanoid } = require('nanoid')

const prisma = new PrismaClient()

const tool = {
  title: "Perplexity",
  slug: nanoid(10),
  description: "革命性的 AI 搜索引擎。它能实时联网搜索信息，并提供带有确切引用的答案，是内容创作者进行深度研究和事实核查的最佳工具。",
  content: "Perplexity AI...",
  type: "resource",
  category: "ai",
  resourceType: "tool",
  tags: "Search,Research",
  link: "https://www.perplexity.ai/",
  coverImage: "https://logo.clearbit.com/perplexity.ai",
  published: true,
  date: new Date()
}

async function main() {
  console.log(`Adding ${tool.title}...`)
  
  await prisma.post.create({
    data: tool
  })
  
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
