require('dotenv').config({ path: '.env.local' })
const { PrismaClient } = require('@prisma/client')
const { nanoid } = require('nanoid')

const prisma = new PrismaClient()

const tool = {
  title: "NotebookLM",
  slug: nanoid(10),
  description: "Google 推出的个性化 AI 笔记本，可以上传文档生成问答、摘要和音频概览。",
  content: "NotebookLM 简介...",
  type: "resource",
  category: "ai",
  resourceType: "tool",
  tags: "AI产品,Google",
  link: "https://notebooklm.google.com/",
  coverImage: "https://www.google.com/s2/favicons?sz=128&domain=notebooklm.google.com",
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
