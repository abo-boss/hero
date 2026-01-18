import { Post } from './mdx'

export const MOCK_RESOURCES: Post[] = [
  {
    slug: 'chatgpt-guide',
    title: 'ChatGPT 完全指南',
    date: new Date().toISOString(),
    description: '从入门到精通，掌握 ChatGPT 的核心使用技巧与提示词工程。',
    tags: ['AI', 'ChatGPT', 'Guide'],
    category: 'ai',
    author: 'Admin',
    content: 'Mock content for ChatGPT guide...',
    type: 'resource',
    resourceType: 'article'
  },
  {
    slug: 'midjourney-masterclass',
    title: 'Midjourney 绘画大师班',
    date: new Date().toISOString(),
    description: '探索 AI 艺术创作的无限可能，学习高级参数与风格控制。',
    tags: ['AI Art', 'Midjourney', 'Design'],
    category: 'ai',
    author: 'Admin',
    content: 'Mock content for Midjourney...',
    type: 'resource',
    resourceType: 'video',
    link: 'https://youtube.com'
  },
  {
    slug: 'personal-brand-building',
    title: '个人品牌构建实战',
    date: new Date().toISOString(),
    description: '在这个超级个体时代，如何打造属于你自己的独特 IP。',
    tags: ['Branding', 'Marketing', 'Growth'],
    category: 'content-creation',
    author: 'Admin',
    content: 'Mock content for Personal Branding...',
    type: 'resource',
    resourceType: 'article'
  }
]

export const MOCK_BLOGS: Post[] = [
  {
    slug: 'hello-world',
    title: 'Hello World: 我的 AI 之路',
    date: new Date().toISOString(),
    description: '这是博客的第一篇文章，记录我为什么开始做这个网站。',
    tags: ['Life', 'Intro'],
    category: 'blog',
    author: 'Admin',
    content: 'Welcome to my blog...',
    type: 'blog'
  }
]
