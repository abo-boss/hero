
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('Updating Google DeepMind and Every links to YouTube...')

  // Update Google DeepMind
  const deepmind = await prisma.post.findFirst({
    where: { 
      title: 'Google DeepMind Blog',
      type: 'resource' 
    }
  })

  if (deepmind) {
    await prisma.post.update({
      where: { id: deepmind.id },
      data: {
        title: 'Google DeepMind',
        link: 'https://www.youtube.com/@GoogleDeepMind',
        description: 'Google DeepMind 官方频道，发布关于 AlphaGo, AlphaFold, Gemini 等突破性 AI 技术的演示与纪录片。',
        content: `## Google DeepMind\n\nGoogle DeepMind 官方频道，发布关于 AlphaGo, AlphaFold, Gemini 等突破性 AI 技术的演示与纪录片。\n\n[Visit Channel](https://www.youtube.com/@GoogleDeepMind)`,
        resourceType: 'podcast', // Ensure it is podcast
        coverImage: 'https://logo.clearbit.com/deepmind.google' // Keep existing or update
      }
    })
    console.log('Updated Google DeepMind')
  } else {
      // If not found by exact name, maybe try 'Google DeepMind'
      const deepmind2 = await prisma.post.findFirst({
          where: { title: 'Google DeepMind', type: 'resource' }
      })
      if (deepmind2) {
          await prisma.post.update({
              where: { id: deepmind2.id },
              data: {
                  link: 'https://www.youtube.com/@GoogleDeepMind',
                  resourceType: 'podcast'
              }
          })
          console.log('Updated Google DeepMind (found by new title)')
      } else {
          console.log('Google DeepMind entry not found to update.')
      }
  }

  // Update Every
  const every = await prisma.post.findFirst({
    where: { 
      title: 'Every',
      type: 'resource'
    }
  })

  if (every) {
    await prisma.post.update({
      where: { id: every.id },
      data: {
        link: 'https://www.youtube.com/@EveryInc',
        description: 'Every 官方频道，探讨科技、AI 与商业的交叉点，提供深度的访谈与分析。',
        content: `## Every\n\nEvery 官方频道，探讨科技、AI 与商业的交叉点，提供深度的访谈与分析。\n\n[Visit Channel](https://www.youtube.com/@EveryInc)`,
        resourceType: 'podcast',
        coverImage: 'https://logo.clearbit.com/every.to'
      }
    })
    console.log('Updated Every')
  } else {
    console.log('Every entry not found to update.')
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
