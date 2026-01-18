import { MOCK_RESOURCES, MOCK_BLOGS } from './mock-data'

export type ResourceType = 'ai' | 'content-creation'

export interface Post {
  slug: string
  title: string
  date: string
  description: string
  tags: string[]
  category: string
  author?: string
  content: string
  duration?: string
  [key: string]: any
}

// 纯前端模式：直接返回 Mock 数据（作为文件存储的数据源）
// 后续如果需要在线编辑，可以在后台将内容写入到这个 mock-data.ts 文件（通过 fs 在构建时）或者 json 文件
// 但目前的请求是“本地后台管理编辑上传内容，代码推送同步至 vercel”，所以最简单的方案就是把 mock-data.ts 当作数据源

export async function getAllPosts(section: 'blog' | 'resources' | 'resource', subType?: ResourceType) {
  const type = section === 'resources' ? 'resource' : section
  
  // 模拟从文件/Mock数据读取
  let posts = type === 'blog' ? MOCK_BLOGS : MOCK_RESOURCES
  
  if (type === 'resource' && subType) {
    posts = posts.filter(p => p.category === subType)
  }
  
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export async function getPostBySlug(slug: string) {
  const allPosts = [...MOCK_RESOURCES, ...MOCK_BLOGS]
  const post = allPosts.find(p => p.slug === slug)
  return post || null
}

export async function getAllResources() {
  return MOCK_RESOURCES.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}
