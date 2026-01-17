
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('Updating video covers...')
  
  // Find all resources that are videos
  const videos = await prisma.post.findMany({
    where: { 
      resourceType: 'video',
      link: { contains: 'youtube.com' }
    }
  })

  for (const video of videos) {
    // Extract Video ID
    // Supports: https://www.youtube.com/watch?v=VIDEO_ID
    const match = video.link.match(/v=([\w-]+)/)
    
    if (match && match[1]) {
      const videoId = match[1]
      // Use maxresdefault for high quality, fallback to hqdefault if needed (usually maxres exists for modern videos)
      const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
      
      console.log(`Updating cover for: ${video.title} -> ${thumbnailUrl}`)
      
      await prisma.post.update({
        where: { id: video.id },
        data: {
          coverImage: thumbnailUrl
        }
      })
    } else {
      console.log(`Could not extract ID from: ${video.link}`)
    }
  }
  
  console.log('Finished updating covers.')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
