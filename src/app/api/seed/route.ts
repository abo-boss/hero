import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { nanoid } from 'nanoid'

export const dynamic = 'force-dynamic'

const toolsToRestore = [
  {
    title: 'NotebookLM',
    description: 'Google 推出的个性化 AI 笔记本，可以上传文档、PDF、网页等资料，自动生成问答、摘要、时间线和音频概览（Audio Overview），是学习和研究的绝佳助手。',
    link: 'https://notebooklm.google.com/',
    author: 'Google',
    tags: 'AI产品,Google,Note-taking',
    category: 'ai',
    resourceType: 'tool',
    coverImage: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://notebooklm.google.com&size=128'
  },
  {
    title: 'Cursor',
    description: '新一代 AI 代码编辑器，基于 VS Code 构建。内置强大的 AI 编程助手，支持代码生成、自动补全、自然语言编辑和代码库问答，显著提升开发效率。',
    link: 'https://www.cursor.com/',
    author: 'Cursor',
    tags: 'AI Code Editor,Developer Tools,Programming',
    category: 'ai',
    resourceType: 'tool',
    coverImage: 'https://logo.clearbit.com/cursor.com'
  },
  {
    title: 'Nano Banana',
    description: '基于 Google Gemini 模型的 AI 图像编辑工具。支持通过自然语言指令编辑图片（如“把背景改成雪山”），以及高质量的文生图功能，适合创意设计和内容创作。',
    link: 'https://nanobanana.ai/',
    author: 'Nano Banana',
    tags: 'AI Image Editor,Creative,Design',
    category: 'ai',
    resourceType: 'tool',
    coverImage: 'https://logo.clearbit.com/nanobanana.ai'
  },
  {
    title: 'Comet',
    description: '专业的机器学习实验跟踪和可视化平台。帮助数据科学家管理模型版本、对比实验结果、监控模型性能，是 MLOps 流程中的关键工具。',
    link: 'https://www.comet.com/',
    author: 'Comet',
    tags: 'MLOps,Machine Learning,Experiment Tracking',
    category: 'ai',
    resourceType: 'tool',
    coverImage: 'https://logo.clearbit.com/comet.com'
  },
  {
    title: 'Suno',
    description: '现象级 AI 音乐生成平台。只需输入简单的文本提示词，即可生成包含人声和伴奏的高质量完整歌曲，支持多种音乐风格和语言。',
    link: 'https://suno.com/',
    author: 'Suno',
    tags: 'AI Music,Audio Generation,Creative',
    category: 'ai',
    resourceType: 'tool',
    coverImage: 'https://logo.clearbit.com/suno.com'
  },
  {
    title: 'Replika',
    description: '最知名的 AI 伴侣应用。它能通过对话学习你的性格和偏好，提供情感支持、即时陪伴和心理疏导，是你永远在线的数字朋友。',
    link: 'https://replika.com/',
    author: 'Luka, Inc',
    tags: 'AI Companion,Chatbot,Mental Wellness',
    category: 'ai',
    resourceType: 'tool',
    coverImage: 'https://logo.clearbit.com/replika.com'
  },
  {
    title: 'Onsen',
    description: '专注于心理健康的 AI 伴侣和日记应用。通过 AI 引导的对话和日记记录，帮助用户进行自我反思、情绪管理和个人成长。',
    link: 'https://www.onsenapp.com/',
    author: 'Onsen',
    tags: 'Mental Health,Journaling,AI Companion',
    category: 'ai',
    resourceType: 'tool',
    coverImage: 'https://logo.clearbit.com/onsenapp.com'
  },
  {
    title: 'Codia',
    description: '强大的 Design-to-Code AI 工具。可以一键将 Figma 设计稿转换为高质量的生产级代码（HTML, CSS, React, Vue 等），大幅缩短前端开发周期。',
    link: 'https://codia.ai/',
    author: 'Codia',
    tags: 'Design to Code,Frontend,Developer Tools',
    category: 'ai',
    resourceType: 'tool',
    coverImage: 'https://logo.clearbit.com/codia.ai'
  },
  {
    title: 'Midjourney',
    description: '目前公认效果最好的 AI 绘画工具之一。以其极高的艺术性和图像质量著称，能够根据文本提示词生成令人惊叹的写实、艺术或创意图像。',
    link: 'https://www.midjourney.com/',
    author: 'Midjourney',
    tags: 'AI Art,Image Generation,Creative',
    category: 'ai',
    resourceType: 'tool',
    coverImage: 'https://logo.clearbit.com/midjourney.com'
  },
  {
    title: 'Snipd',
    description: 'AI 驱动的播客播放器。能自动生成播客摘要、提取精彩片段（Snips）、转录文本，并支持通过 AI 搜索播客内容，极大提升听播客的效率。',
    link: 'https://www.snipd.com/',
    author: 'Snipd',
    tags: 'Podcast,AI Summary,Learning',
    category: 'ai',
    resourceType: 'tool',
    coverImage: 'https://logo.clearbit.com/snipd.com'
  }
]

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const secret = searchParams.get('secret')

  if (secret !== 'hero-seed-2025') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const results = []

  for (const tool of toolsToRestore) {
    const exists = await prisma.post.findFirst({
      where: { 
        title: tool.title,
        type: 'resource'
      }
    })

    if (!exists) {
      const post = await prisma.post.create({
        data: {
          title: tool.title,
          slug: nanoid(10),
          description: tool.description,
          content: `## ${tool.title}\n\n${tool.description}\n\n[Visit Website](${tool.link})`,
          type: 'resource',
          category: tool.category,
          resourceType: tool.resourceType as any,
          link: tool.link,
          author: tool.author,
          tags: tool.tags,
          published: true,
          coverImage: tool.coverImage,
          date: new Date()
        }
      })
      results.push({ status: 'created', title: tool.title })
    } else {
      results.push({ status: 'exists', title: tool.title })
    }
  }

  return NextResponse.json({ success: true, results })
}
