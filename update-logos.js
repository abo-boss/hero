
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// Logo mapping
const logos = {
  'ChatGPT': 'https://logo.clearbit.com/openai.com',
  'Midjourney': 'https://logo.clearbit.com/midjourney.com',
  'Claude': 'https://logo.clearbit.com/anthropic.com',
  'Runway': 'https://logo.clearbit.com/runwayml.com',
  'Notion AI': 'https://logo.clearbit.com/notion.so',
  'Canva Magic Studio': 'https://logo.clearbit.com/canva.com',
  'Suno': 'https://logo.clearbit.com/suno.com',
  'HeyGen': 'https://logo.clearbit.com/heygen.com',
  'Perplexity': 'https://logo.clearbit.com/perplexity.ai',
  'Cursor': 'https://logo.clearbit.com/cursor.sh',
  'LookX': 'https://logo.clearbit.com/lookx.ai',
  'PromeAI': 'https://logo.clearbit.com/promeai.com',
  'UrbanistAI': 'https://logo.clearbit.com/urbanistai.com',
  'Harvey': 'https://logo.clearbit.com/harvey.ai'
}

async function main() {
  console.log('Start updating logos...')
  
  for (const [title, logoUrl] of Object.entries(logos)) {
    const post = await prisma.post.findFirst({
      where: { 
        title: title,
        type: 'resource'
      }
    })

    if (post) {
      await prisma.post.update({
        where: { id: post.id },
        data: {
          coverImage: logoUrl
        }
      })
      console.log(`Updated logo for: ${title}`)
    } else {
      console.log(`Tool not found: ${title}`)
    }
  }
  console.log('Logo update finished.')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
