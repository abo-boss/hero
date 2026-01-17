
const { PrismaClient } = require('@prisma/client')
const { nanoid } = require('nanoid')

const prisma = new PrismaClient()

const newTools = [
  {
    title: "Cursor",
    slug: nanoid(10),
    description: "当前最强大的 AI 代码编辑器，基于 VS Code 构建。支持 Vibe Coding 模式，让编程变得像写作一样流畅。",
    content: "Cursor is the AI code editor...",
    type: "resource",
    category: "ai",
    resourceType: "tool",
    tags: "Coding,Productivity",
    link: "https://cursor.sh/",
    coverImage: "https://logo.clearbit.com/cursor.sh",
    published: true,
    date: new Date()
  },
  {
    title: "Midjourney",
    slug: nanoid(10),
    description: "艺术感最强的 AI 图像生成工具。V6 版本在光影、细节和质感上达到了惊人的摄影级效果，是设计师和艺术家的首选。",
    content: "Midjourney is...",
    type: "resource",
    category: "ai",
    resourceType: "tool",
    tags: "Image Gen,Art",
    link: "https://www.midjourney.com/",
    coverImage: "https://logo.clearbit.com/midjourney.com",
    published: true,
    date: new Date()
  },
  {
    title: "Runway",
    slug: nanoid(10),
    description: "AI 视频生成的领跑者。Gen-3 Alpha 模型支持高度可控的视频生成，是专业视频创作者和电影制作人的强大助手。",
    content: "Runway ML...",
    type: "resource",
    category: "ai",
    resourceType: "tool",
    tags: "Video Gen,Creative",
    link: "https://runwayml.com/",
    coverImage: "https://logo.clearbit.com/runwayml.com",
    published: true,
    date: new Date()
  },
  {
    title: "Claude 3.5 Sonnet",
    slug: nanoid(10),
    description: "Anthropic 推出的最强 AI 模型。Artifacts 功能让它不仅能写作，还能实时预览代码、文档和图表，是绝佳的创作伙伴。",
    content: "Claude...",
    type: "resource",
    category: "ai",
    resourceType: "tool",
    tags: "Writing,Coding,Chatbot",
    link: "https://claude.ai/",
    coverImage: "https://logo.clearbit.com/anthropic.com",
    published: true,
    date: new Date()
  },
  {
    title: "Suno",
    slug: nanoid(10),
    description: "让每个人都能创作音乐。只需输入简单的提示词，就能生成广播级音质的完整歌曲，支持多种风格和人声演唱。",
    content: "Suno AI...",
    type: "resource",
    category: "ai",
    resourceType: "tool",
    tags: "Music Gen,Audio",
    link: "https://suno.com/",
    coverImage: "https://logo.clearbit.com/suno.com",
    published: true,
    date: new Date()
  },
  {
    title: "Canva Magic Studio",
    slug: nanoid(10),
    description: "一站式 AI 设计平台。集成了文生图、魔术编辑、一键排版等功能，让非设计专业人士也能快速产出高质量的视觉内容。",
    content: "Canva...",
    type: "resource",
    category: "ai",
    resourceType: "tool",
    tags: "Design,Productivity",
    link: "https://www.canva.com/",
    coverImage: "https://logo.clearbit.com/canva.com",
    published: true,
    date: new Date()
  },
  {
    title: "NotebookLM",
    slug: nanoid(10),
    description: "Google 推出的 AI 笔记助手。最神奇的是它的“音频概览”功能，能将你的资料瞬间转化为一段生动的双人播客对话。",
    content: "NotebookLM...",
    type: "resource",
    category: "ai",
    resourceType: "tool",
    tags: "Research,Podcast,Note",
    link: "https://notebooklm.google.com/",
    coverImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Google_Gemini_logo.svg/1024px-Google_Gemini_logo.svg.png", // Use Gemini logo as proxy or specific notebooklm icon if available
    published: true,
    date: new Date()
  },
  {
    title: "Kling AI (可灵)",
    slug: nanoid(10),
    description: "快手推出的视频生成大模型。在人物动作幅度和物理规律模拟上表现出色，生成的视频流畅自然，支持长达 2 分钟的视频生成。",
    content: "Kling AI...",
    type: "resource",
    category: "ai",
    resourceType: "tool",
    tags: "Video Gen,Motion",
    link: "https://klingai.kuaishou.com/",
    coverImage: "https://s1-10761.kwaicdn.com/kos/nlav10761/kling-ai/static/logo.8099307f.svg", // Fallback to a valid URL or handle in frontend
    published: true,
    date: new Date()
  },
  {
    title: "Recraft",
    slug: nanoid(10),
    description: "专为设计师打造的生成式 AI。擅长生成矢量图（SVG）、图标和 3D 插画，生成的内容可直接用于专业的 UI/UX 设计项目。",
    content: "Recraft...",
    type: "resource",
    category: "ai",
    resourceType: "tool",
    tags: "Design,Vector,Icon",
    link: "https://www.recraft.ai/",
    coverImage: "https://logo.clearbit.com/recraft.ai",
    published: true,
    date: new Date()
  }
]

async function main() {
  console.log('Resetting AI Tools...')
  
  // 1. Delete all existing tools
  const deleteResult = await prisma.post.deleteMany({
    where: {
      resourceType: 'tool'
    }
  })
  console.log(`Deleted ${deleteResult.count} existing tools.`)

  // 2. Insert new tools
  for (const t of newTools) {
    await prisma.post.create({
      data: t
    })
    console.log(`Created: ${t.title}`)
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
