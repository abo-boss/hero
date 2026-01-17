import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const defaultContent = [
  // Home Page
  { page: 'home', section: 'hero', key: 'title', value: '你好，我是阿波' },
  { page: 'home', section: 'hero', key: 'subtitle', value: '一名内容创作者和 AI 爱好者' },
  { page: 'home', section: 'hero', key: 'description', value: '探索 AI 技术，打造超级个体' },
  
  // Footer
  { page: 'footer', section: 'main', key: 'slogan', value: '用AI+IP成为强大的个体' },
  { page: 'footer', section: 'copyright', key: 'text', value: '© 2024 阿波. All rights reserved.' },
  
  // About Page
  { page: 'about', section: 'intro', key: 'title', value: '关于我' },
  { page: 'about', section: 'intro', key: 'description', value: '你好，我是阿波，一名内容创作者和 AI 爱好者。' },
]

async function main() {
  console.log('Seeding page content...')
  
  for (const item of defaultContent) {
    await prisma.pageContent.upsert({
      where: {
        page_section_key: {
          page: item.page,
          section: item.section,
          key: item.key
        }
      },
      update: {}, // Don't overwrite if exists
      create: {
        page: item.page,
        section: item.section,
        key: item.key,
        value: item.value,
        type: 'text'
      }
    })
  }
  
  console.log('Page content seeded.')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
