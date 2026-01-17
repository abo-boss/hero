
const { PrismaClient } = require('@prisma/client')
const { nanoid } = require('nanoid')
const axios = require('axios')
const { parse } = require('node-html-parser')
const he = require('he')

const prisma = new PrismaClient()

// Extracted links from previous step
const videoLinks = [
  'https://www.youtube.com/watch?v=7xTGNNLPyMI', // Intro to LLMs (Andrej Karpathy)
  'https://www.youtube.com/watch?v=IcbuTTVUY7M',
  'https://www.youtube.com/watch?v=mccQdu5afZw',
  'https://www.youtube.com/watch?v=jmHBMtpR36M',
  'https://www.youtube.com/watch?v=_K_F_icxtrI',
  'https://www.youtube.com/watch?v=GRoU1T4E9rQ'
]

async function getTitle(url) {
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9'
      }
    })
    const root = parse(response.data)
    let title = root.querySelector('title')?.text || 
                root.querySelector('meta[property="og:title"]')?.getAttribute('content') || ''
    title = he.decode(title).replace(' - YouTube', '').trim()
    return title
  } catch (e) {
    console.error(`Failed to fetch title for ${url}:`, e.message)
    return 'AI Learning Video'
  }
}

async function main() {
  console.log('Processing Zara\'s video list...')

  for (const link of videoLinks) {
    // Check existence first
    const exists = await prisma.post.findFirst({
      where: { link, type: 'resource' }
    })

    if (exists) {
      console.log(`Skipped (exists): ${link}`)
      continue
    }

    const title = await getTitle(link)
    console.log(`Adding: ${title}`)

    await prisma.post.create({
      data: {
        title: title,
        slug: nanoid(10),
        description: 'From Zara\'s AI Learning Library. A curated video for understanding AI fundamentals and trends.',
        content: `## ${title}\n\nSelected from Zara's AI Learning Library.\n\n[Watch on YouTube](${link})`,
        type: 'resource',
        category: 'ai',
        resourceType: 'video', // Using 'video' as requested
        link: link,
        author: 'YouTube',
        tags: 'AI, Learning, Curated',
        published: true,
        coverImage: 'https://logo.clearbit.com/youtube.com',
        date: new Date()
      }
    })
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
