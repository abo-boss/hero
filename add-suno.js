
const { PrismaClient } = require('@prisma/client')
const { nanoid } = require('nanoid')
const prisma = new PrismaClient()

const suno = {
  title: 'Suno',
  description: '强大的 AI 音乐生成工具，只需输入文字描述即可生成包含人声的高质量歌曲。',
  link: 'https://suno.com/',
  author: 'Suno',
  tags: 'Music, Audio, Creative',
  category: 'ai',
  resourceType: 'tool',
  coverImage: 'https://logo.clearbit.com/suno.com'
}

async function main() {
  console.log('Adding Suno...')
  
  const exists = await prisma.post.findFirst({
    where: { 
      title: suno.title,
      type: 'resource'
    }
  })

  if (!exists) {
    await prisma.post.create({
      data: {
        title: suno.title,
        slug: nanoid(10),
        description: suno.description,
        content: `## ${suno.title}\n\n${suno.description}\n\n[Visit Website](${suno.link})`,
        type: 'resource',
        category: suno.category,
        resourceType: suno.resourceType,
        link: suno.link,
        author: suno.author,
        tags: suno.tags,
        published: true,
        coverImage: suno.coverImage,
        date: new Date()
      }
    })
    console.log(`Created tool: ${suno.title}`)
  } else {
    console.log(`Skipped (already exists): ${suno.title}`)
    // Update if needed
    if (!exists.coverImage) {
        await prisma.post.update({
            where: { id: exists.id },
            data: { coverImage: suno.coverImage }
        })
        console.log('Updated logo')
    }
  }
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
