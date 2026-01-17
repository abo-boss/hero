export const POST_TYPES = {
  BLOG: 'blog',
  RESOURCE: 'resource'
} as const

export const CATEGORIES = {
  AI: 'ai',
  CONTENT_CREATION: 'content-creation',
  ALL: 'all' // Special category for "All Resources" view
} as const

export const RESOURCE_TYPES = {
  ARTICLE: 'article',
  VIDEO: 'video',
  PODCAST: 'podcast',
  TOOL: 'tool'
} as const

export const CATEGORY_LABELS = {
  [CATEGORIES.ALL]: '全部资源',
  [CATEGORIES.AI]: 'AI 学习资源',
  [CATEGORIES.CONTENT_CREATION]: '内容 & IP'
} as const

export const RESOURCE_TYPE_LABELS = {
  [RESOURCE_TYPES.ARTICLE]: '精选文章',
  [RESOURCE_TYPES.VIDEO]: '视频链接',
  [RESOURCE_TYPES.PODCAST]: '精选播客',
  [RESOURCE_TYPES.TOOL]: 'AI 产品/工具'
} as const

export type PostType = typeof POST_TYPES[keyof typeof POST_TYPES]
export type Category = typeof CATEGORIES[keyof typeof CATEGORIES]
export type ResourceType = typeof RESOURCE_TYPES[keyof typeof RESOURCE_TYPES]
