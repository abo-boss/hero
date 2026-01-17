
const { PrismaClient } = require('@prisma/client')
const { nanoid } = require('nanoid')

const prisma = new PrismaClient()

const articles = [
  {
    title: "一人公司的终极指南：如何年入百万且保持自由 (The Ultimate Guide to One-Person Businesses)",
    slug: nanoid(10),
    description: "不再追求规模扩张，而是追求利润和自由。这篇文章详细拆解了 Justin Welsh、Dan Koe 等超级个体的商业模式，教你如何利用互联网杠杆，建立一个高利润、低维护的一人公司。",
    content: "Full guide content...",
    type: "resource",
    category: "content-creation",
    resourceType: "article",
    tags: "Guide,Business,Money",
    link: "https://www.justinwelsh.me/blog/one-person-business-guide",
    author: "Justin Welsh",
    coverImage: "https://www.justinwelsh.me/_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fq33z48p65a6w%2F4Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z%2F4Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z%2FJustin_Welsh_One_Person_Business.jpg&w=3840&q=75", // Placeholder or valid URL
    published: true,
    date: new Date()
  },
  {
    title: "1000 个铁杆粉丝理论：AI 时代的重新解读 (1000 True Fans in the Age of AI)",
    slug: nanoid(10),
    description: "Kevin Kelly 的经典理论在 AI 时代依然适用吗？本文探讨了在算法推荐和 AI 生成内容泛滥的今天，如何通过建立真实的社区连接，找到属于你的 1000 个铁杆粉丝。",
    content: "Revisiting 1000 True Fans...",
    type: "resource",
    category: "content-creation",
    resourceType: "article",
    tags: "Opinion,Community,Strategy",
    link: "https://kk.org/thetechnium/1000-true-fans/",
    author: "Kevin Kelly",
    coverImage: "https://kk.org/mt-static/images/kk-logo.png", // Placeholder
    published: true,
    date: new Date()
  },
  {
    title: "从内容创作者到创业者：我的 5 年转型实录 (Creator to Entrepreneur)",
    slug: nanoid(10),
    description: "通过内容获得流量只是第一步，如何构建可持续的产品体系才是关键。作者分享了自己从接广告变现转型为售卖数字化产品（课程、模板、软件）的完整心路历程和实操经验。",
    content: "Transformation story...",
    type: "resource",
    category: "content-creation",
    resourceType: "article",
    tags: "Case Study,Growth,Product",
    link: "https://convertkit.com/blog/creator-to-entrepreneur",
    author: "Nathan Barry",
    coverImage: "https://convertkit.com/images/blog/creator-to-entrepreneur.jpg", // Placeholder
    published: true,
    date: new Date()
  }
]

async function main() {
  console.log('Seeding Content Creation Articles...')
  
  // Optional: clear existing articles to avoid duplicates if running multiple times
  // await prisma.post.deleteMany({ where: { resourceType: 'article', category: 'content-creation' } })

  for (const a of articles) {
    await prisma.post.create({
      data: a
    })
    console.log(`Created: ${a.title}`)
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
