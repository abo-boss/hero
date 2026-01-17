
const { PrismaClient } = require('@prisma/client')
const { nanoid } = require('nanoid')
const prisma = new PrismaClient()

const blogs = [
  {
    title: 'Google DeepMind Blog',
    description: '探索通用人工智能（AGI）的前沿研究。DeepMind 官方博客发布关于 AlphaFold, Gemini 等突破性技术的深度文章与论文解读。',
    link: 'https://deepmind.google/discover/blog/',
    author: 'Google DeepMind',
    tags: 'Research, AGI, Science',
    category: 'ai',
    resourceType: 'article', // Using 'article' for blog sources
    coverImage: 'https://logo.clearbit.com/deepmind.google'
  },
  {
    title: 'Every',
    description: '汇集了科技、生产力与 AI 领域的深度思考。Every 是一个作家集合体，提供关于 AI 如何改变工作与生活的独到见解。',
    link: 'https://every.to/',
    author: 'Every',
    tags: 'Tech, Productivity, Culture',
    category: 'ai',
    resourceType: 'article',
    coverImage: 'https://logo.clearbit.com/every.to'
  }
]

async function main() {
  console.log('Adding blogs...')
  for (const blog of blogs) {
    const exists = await prisma.post.findFirst({
      where: { 
        title: blog.title,
        type: 'resource'
      }
    })

    if (!exists) {
      await prisma.post.create({
        data: {
          title: blog.title,
          slug: nanoid(10),
          description: blog.description,
          content: `## ${blog.title}\n\n${blog.description}\n\n[Read Blog](${blog.link})`,
          type: 'resource',
          category: blog.category,
          resourceType: blog.resourceType,
          link: blog.link,
          author: blog.author,
          tags: blog.tags,
          published: true,
          coverImage: blog.coverImage,
          date: new Date()
        }
      })
      console.log(`Created blog entry: ${blog.title}`)
    } else {
      console.log(`Skipped (already exists): ${blog.title}`)
    }
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
