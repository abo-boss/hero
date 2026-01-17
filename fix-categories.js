
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  // 查找所有 category 不是 ai 或 content-creation 的资源
  const resources = await prisma.post.findMany({
    where: {
      type: 'resource',
      category: {
        notIn: ['ai', 'content-creation']
      }
    }
  })

  console.log(`Found ${resources.length} resources with invalid category`)

  for (const r of resources) {
    console.log(`Fixing resource: ${r.title}, category: ${r.category}`)
    
    // 假设非标分类都归为 content-creation，并将原分类加到 tags
    let newTags = r.tags ? r.tags + ',' + r.category : r.category
    
    await prisma.post.update({
      where: { id: r.id },
      data: {
        category: 'content-creation', // 默认归为 content-creation，或者根据情况判断
        tags: newTags
      }
    })
  }
  
  console.log('Done')
}

main()
  .catch(e => {
    throw e
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
