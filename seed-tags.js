
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const PRESETS = [
  {
    key: 'resource:ai:video',
    tags: ['基础知识', '提示词', '实用教程', 'Vibe Coding', 'AI 产品', '创始人访谈']
  },
  {
    key: 'resource:content-creation:video',
    tags: ['写作', '内容创作', '小而美商业', '轻创业', '个人品牌', '运营策略']
  },
  {
    key: 'resource:ai:tool',
    tags: ['Productivity', 'Coding', 'Image Gen', 'Video Gen', 'Chatbot']
  },
  {
    key: 'resource:ai:podcast',
    tags: ['Interview', 'News', 'Tech', 'Research']
  },
  {
    key: 'resource:content-creation:podcast',
    tags: ['Interview', 'Story', 'Business']
  },
  {
    key: 'resource:content-creation:article',
    tags: ['Guide', 'Case Study', 'Opinion']
  },
  {
    key: 'blog:default',
    tags: ['Tech', 'Life', 'Coding', 'Update']
  }
]

async function main() {
  console.log('Seeding Tag Presets...')
  
  for (const p of PRESETS) {
    const tagsStr = p.tags.join(',')
    
    const exists = await prisma.tagPreset.findUnique({
      where: { key: p.key }
    })

    if (exists) {
      console.log(`Updating ${p.key}...`)
      await prisma.tagPreset.update({
        where: { key: p.key },
        data: { tags: tagsStr }
      })
    } else {
      console.log(`Creating ${p.key}...`)
      await prisma.tagPreset.create({
        data: {
          key: p.key,
          tags: tagsStr
        }
      })
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
