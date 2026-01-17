
const { PrismaClient } = require('@prisma/client')
const { nanoid } = require('nanoid')

const prisma = new PrismaClient()

const podcasts = [
  {
    title: "如何讲好一个故事？内容创作者的必修课 (Storytelling 101 for Creators)",
    slug: nanoid(10),
    description: "在这个视频中，我们将探讨故事讲述的核心原则，以及如何将其应用到你的视频、播客和文章中，以吸引更多的受众并建立深刻的连接。",
    content: "详细的 Storytelling 技巧分享...",
    type: "resource",
    category: "content-creation",
    resourceType: "podcast",
    tags: "Story,Interview",
    link: "https://www.youtube.com/watch?v=Nj-hdQMa3uA",
    author: "Colin and Samir",
    coverImage: "https://i.ytimg.com/vi/Nj-hdQMa3uA/maxresdefault.jpg",
    duration: "1:12:45",
    published: true,
    date: new Date()
  },
  {
    title: "个人品牌变现：从 0 到 100 万粉丝的真实路径 (Monetizing Your Personal Brand)",
    slug: nanoid(10),
    description: "深入剖析顶级创作者的商业模式，揭示他们如何通过构建个人 IP 实现多元化收入。适合所有希望通过内容创业的人群。",
    content: "商业模式解析...",
    type: "resource",
    category: "content-creation",
    resourceType: "podcast",
    tags: "Business,Interview",
    link: "https://www.youtube.com/watch?v=n3Cn3sWvL6E",
    author: "Ali Abdaal",
    coverImage: "https://i.ytimg.com/vi/n3Cn3sWvL6E/maxresdefault.jpg",
    duration: "45:30",
    published: true,
    date: new Date(Date.now() - 86400000) // 1 day ago
  },
  {
    title: "超级个体的崛起：AI 时代的内容创作新策略 (The Rise of Super Individuals)",
    slug: nanoid(10),
    description: "在 AI 工具的加持下，一个人就是一支队伍。本期播客探讨了如何利用最新的技术提升创作效率，建立不可替代的竞争优势。",
    content: "AI 与内容创作的结合...",
    type: "resource",
    category: "content-creation",
    resourceType: "podcast",
    tags: "Business,Story",
    link: "https://www.youtube.com/watch?v=6p1e2r3s4t5",
    author: "GaryVee",
    coverImage: "https://i.ytimg.com/vi/6p1e2r3s4t5/maxresdefault.jpg",
    duration: "38:15",
    published: true,
    date: new Date(Date.now() - 172800000) // 2 days ago
  }
]

async function main() {
  console.log('Seeding Content Creation Podcasts...')
  
  for (const p of podcasts) {
    await prisma.post.create({
      data: p
    })
    console.log(`Created: ${p.title}`)
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
