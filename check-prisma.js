
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('Checking TagPreset model...')
  try {
    const count = await prisma.tagPreset.count()
    console.log(`TagPreset count: ${count}`)
    const presets = await prisma.tagPreset.findMany()
    console.log('Presets:', presets)
  } catch (e) {
    console.error('Error:', e)
  }
}

main()
  .finally(async () => {
    await prisma.$disconnect()
  })
