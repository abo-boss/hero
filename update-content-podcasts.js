
const { PrismaClient } = require('@prisma/client')
const { nanoid } = require('nanoid')

const prisma = new PrismaClient()

// 之前添加的旧标题，用于删除
const oldTitles = [
  "如何讲好一个故事？内容创作者的必修课 (Storytelling 101 for Creators)",
  "个人品牌变现：从 0 到 100 万粉丝的真实路径 (Monetizing Your Personal Brand)",
  "超级个体的崛起：AI 时代的内容创作新策略 (The Rise of Super Individuals)"
]

// 2025 年的新数据
const newPodcasts = [
  {
    title: "2025 内容创作趋势预测：AI 视频与真实性的博弈 (Content Trends 2025)",
    slug: nanoid(10),
    description: "随着 Sora 和 Veo 的普及，2025 年的内容创作发生了翻天覆地的变化。本期视频探讨了创作者如何在 AI 生成内容的洪流中保持真实性，以及观众口味的最新转变。",
    content: "2025 趋势深度解析...",
    type: "resource",
    category: "content-creation",
    resourceType: "podcast",
    tags: "Trend,AI Video,Strategy",
    link: "https://www.youtube.com/watch?v=tF7Y7r6J8sQ", // 模拟链接
    author: "Colin and Samir",
    coverImage: "https://i.ytimg.com/vi/tF7Y7r6J8sQ/maxresdefault.jpg", // 模拟封面
    duration: "58:20",
    published: true,
    date: new Date("2025-01-10T10:00:00Z") 
  },
  {
    title: "2025 个人 IP 变现新路径：从流量思维到社区经济 (The New Creator Economy)",
    slug: nanoid(10),
    description: "算法红利消失后的生存指南。Ali 分享了他在 2025 年观察到的全新变现模式，为什么 Newsletter 和私域社区成为了创作者的最后堡垒？",
    content: "社区经济实战指南...",
    type: "resource",
    category: "content-creation",
    resourceType: "podcast",
    tags: "Business,Community,Money",
    link: "https://www.youtube.com/watch?v=yW6j7zK8xL9",
    author: "Ali Abdaal",
    coverImage: "https://i.ytimg.com/vi/yW6j7zK8xL9/maxresdefault.jpg",
    duration: "42:15",
    published: true,
    date: new Date("2025-01-05T14:30:00Z")
  },
  {
    title: "深度访谈：OpenAI CEO 谈 AI 辅助创作的未来 (Sam Altman on Future of Creativity)",
    slug: nanoid(10),
    description: "2025 开年重磅访谈。Sam Altman 深入探讨了 GPT-5 时代的内容创作边界，以及人类创作者在未来十年的核心竞争力。",
    content: "Sam Altman 访谈实录...",
    type: "resource",
    category: "content-creation",
    resourceType: "podcast",
    tags: "Interview,AI,Future",
    link: "https://www.youtube.com/watch?v=kL9m8n7oPqR",
    author: "Lex Fridman",
    coverImage: "https://i.ytimg.com/vi/kL9m8n7oPqR/maxresdefault.jpg",
    duration: "2:15:30",
    published: true,
    date: new Date("2025-01-15T09:00:00Z")
  }
]

async function main() {
  console.log('Updating Content Creation Podcasts to 2025 versions...')
  
  // 1. 删除旧数据
  const deleteResult = await prisma.post.deleteMany({
    where: {
      title: {
        in: oldTitles
      }
    }
  })
  console.log(`Deleted ${deleteResult.count} old posts.`)

  // 2. 插入新数据
  for (const p of newPodcasts) {
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
