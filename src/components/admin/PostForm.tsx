'use client'

import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react'
import 'easymde/dist/easymde.min.css'
import { Loader2, RefreshCw } from 'lucide-react'
import { TagInput } from './TagInput'
import { TagManager } from './TagManager'
import { nanoid } from 'nanoid'
import { POST_TYPES, CATEGORIES, RESOURCE_TYPES } from '@/lib/constants'

const SimpleMDE = dynamic(() => import('react-simplemde-editor'), { ssr: false })

interface PostFormProps {
  action: (formData: FormData) => Promise<void>
  initialData?: {
    title: string
    slug: string
    description: string
    content: string
    type: string
    category: string
    tags: string
    link?: string | null
    resourceType?: string | null
    author?: string | null
    duration?: string | null
    coverImage?: string | null
  }
  isEditing?: boolean
  defaultType?: string
  defaultCategory?: string
  defaultResourceType?: string
}

export function PostForm({ action, initialData, isEditing, defaultType, defaultCategory, defaultResourceType }: PostFormProps) {
  const [content, setContent] = useState(initialData?.content || '')
  const [title, setTitle] = useState(initialData?.title || '')
  const [description, setDescription] = useState(initialData?.description || '')
  const [slug, setSlug] = useState(initialData?.slug || '')
  const [loading, setLoading] = useState(false)
  const [parsing, setParsing] = useState(false)
  const [type, setType] = useState(initialData?.type || defaultType || POST_TYPES.BLOG)
  const [category, setCategory] = useState(initialData?.category || defaultCategory || CATEGORIES.AI)
  const [resourceType, setResourceType] = useState(initialData?.resourceType || defaultResourceType || RESOURCE_TYPES.ARTICLE)
  const [tags, setTags] = useState(initialData?.tags || '')
  const [link, setLink] = useState(initialData?.link || '')
  const [author, setAuthor] = useState(initialData?.author || '')
  const [duration, setDuration] = useState(initialData?.duration || '')
  const [coverImage, setCoverImage] = useState(initialData?.coverImage || '')
  const [suggestions, setSuggestions] = useState<string[]>([])

  // Determine context key for tags
  const getContextKey = () => {
    if (type === POST_TYPES.BLOG) return 'blog:default'
    if (type === POST_TYPES.RESOURCE) {
      const cat = category || CATEGORIES.AI
      const resType = resourceType || RESOURCE_TYPES.ARTICLE
      return `resource:${cat}:${resType}`
    }
    return 'default'
  }

  const contextKey = getContextKey()

  // 自动从内容提取信息
  useEffect(() => {
    if (!content) return

    // 1. 如果标题为空，尝试从 Markdown 第一行提取 (支持 # 标题 或 纯文本)
    if (!title) {
      const lines = content.split('\n')
      const firstLine = lines[0].replace(/^#+\s*/, '').trim()
      
      if (firstLine && firstLine.length < 50) { // 简单长度检查避免提取错误
        setTitle(firstLine)
        
        // 提取标题后，自动从正文中删除该标题行
        // 只要提取出的标题与第一行内容（去除 # 后）一致，就认为第一行是标题行，予以删除
        const firstLineContent = lines[0].replace(/^#+\s*/, '').trim()
        if (firstLineContent === firstLine) {
          const newContent = lines.slice(1).join('\n').trim()
          // 只有当内容确实变化时才更新，避免死循环
          if (newContent !== content) {
            setContent(newContent)
          }
        }
      }
    }

    // 2. 优化描述生成逻辑：提取正文第一段核心观点，约 15-30 字
    if (!description) {
      // 移除 Markdown 图片、链接、标题符号等
      const plainText = content
        .replace(/!\[.*?\]\(.*?\)/g, '') // 移除图片
        .replace(/\[.*?\]\(.*?\)/g, '$1') // 移除链接保留文本
        .replace(/#{1,6}\s/g, '') // 移除标题符号
        .replace(/(\*\*|__)(.*?)\1/g, '$2') // 移除加粗
        .replace(/(\*|_)(.*?)\1/g, '$2') // 移除斜体
        .replace(/`{1,3}.*?`{1,3}/g, '') // 移除代码块
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0) // 过滤空行
        
      // 找到第一个非标题的段落（通常是第一段正文）
      // 这里简单取第一个非空行，因为前面已经移除了标题符号
      const firstParagraph = plainText[0] || ''
      
      if (firstParagraph) {
        // 尝试截取第一句话（以句号、感叹号、问号结尾）
        const firstSentenceMatch = firstParagraph.match(/.*?[。！？.!?]/)
        let summary = firstSentenceMatch ? firstSentenceMatch[0] : firstParagraph

        // 如果太长，截取前 30 个字
        if (summary.length > 30) {
          summary = summary.slice(0, 30) + '...'
        }
        
        setDescription(summary)
      }
    }
  }, [content])

  const generateSlug = () => {
    // 尝试从标题生成拼音 slug 太复杂，这里使用随机 ID
    // 或者用户可以手动输入
    const randomSlug = nanoid(10)
    setSlug(randomSlug)
  }

  const parseUrl = async () => {
    if (!link) return
    setParsing(true)
    try {
      const res = await fetch('/api/parse-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: link })
      })
      
      if (!res.ok) throw new Error('Failed to parse')
      
      const data = await res.json()
      
      if (data.title) setTitle(data.title)
      if (data.description) setDescription(data.description)
      // 如果解析出作者，优先填入 author 字段
      if (data.author) {
        setAuthor(data.author)
      }
      if (data.duration) {
        setDuration(data.duration)
      }
      if (data.coverImage) {
        setCoverImage(data.coverImage)
      }
      
    } catch (error) {
      console.error(error)
      alert('解析失败，请手动输入')
    } finally {
      setParsing(false)
    }
  }

  const handleSubmit = async (formData: FormData) => {
    setLoading(true)
    formData.append('content', content)
    // 确保这些受控组件的值被提交
    formData.set('title', title)
    formData.set('description', description)
    formData.set('slug', slug)
    formData.set('tags', tags) // TagInput 会更新这个 state
    formData.set('link', link)
    formData.set('author', author)
    formData.set('duration', duration)
    if (coverImage) formData.set('coverImage', coverImage)
    
    // 对于博客类型，默认 category 为 'blog' (如果不显示分类框)
    // 但用户要求“删除分类框”，所以如果是 blog，可能需要一个默认值
    // 这里如果 defaultCategory 存在则用它，否则如果 type 是 blog 且没填分类，给一个默认值
    if (type === POST_TYPES.BLOG && !formData.get('category')) {
      // 检查是否有 defaultCategory，如果没有，可能需要给一个空或者 'blog'
      // 根据之前的逻辑，PostForm 接收 defaultCategory
      if (!defaultCategory) {
        // 如果是博客，通常不需要 category，或者 category='blog'
        // 但数据库 schema 中 category 是必须的
        // 现有的博客文章 category 是什么？
        // 查看 BlogManagementPage, category 似乎被用来显示，但数据可能是 'blog'
        // 实际上数据库里 category 是 String，不是 enum
        // 我们暂时设为 'general' 或 'blog' 如果是博客类型
        formData.set('category', 'blog')
      }
    }
    
    await action(formData)
    setLoading(false)
  }

  return (
    <form action={handleSubmit} className="space-y-8 max-w-5xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Resource Link Input - First for resources */}
        {(type === POST_TYPES.RESOURCE || defaultType === POST_TYPES.RESOURCE) && (
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-slate-700">资源链接</label>
              <div className="flex gap-2">
                <input
                  name="link"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  className="flex-1 px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="粘贴 YouTube 视频链接或其他 URL"
                />
                <button
                  type="button"
                  onClick={parseUrl}
                  disabled={parsing || !link}
                  className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 font-medium disabled:opacity-50 flex items-center gap-2"
                >
                  {parsing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                  解析
                </button>
              </div>
              <p className="text-xs text-slate-500">点击解析可自动获取标题和描述</p>
            </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">标题 {type !== POST_TYPES.RESOURCE && '(可自动生成)'}</label>
          <input
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="输入标题或粘贴正文自动生成"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700 flex items-center justify-between">
            <span>Slug (URL 路径)</span>
            <button 
              type="button" 
              onClick={generateSlug}
              className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" /> 随机生成
            </button>
          </label>
          <input
            name="slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="留空则自动生成随机 ID"
          />
        </div>

        {/* Hidden fields for fixed types/categories if provided */}
        {defaultType && <input type="hidden" name="type" value={defaultType} />}
        {defaultCategory && <input type="hidden" name="category" value={defaultCategory} />}
        {defaultResourceType && <input type="hidden" name="resourceType" value={defaultResourceType} />}

        {!defaultType && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">类型</label>
            <select
              name="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value={POST_TYPES.BLOG}>博客 (Blog)</option>
              <option value={POST_TYPES.RESOURCE}>资源 (Resource)</option>
            </select>
          </div>
        )}

        {!defaultCategory && type !== POST_TYPES.BLOG && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">分类</label>
            <select
              name="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value={CATEGORIES.AI}>AI 学习资源 (AI)</option>
              <option value={CATEGORIES.CONTENT_CREATION}>内容创作与 IP (Content & IP)</option>
            </select>
          </div>
        )}

        {/* Resource Specific Fields */}
        {(type === POST_TYPES.RESOURCE || defaultType === POST_TYPES.RESOURCE) && (
          <>
            {!defaultResourceType && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">资源类型</label>
              <select
                name="resourceType"
                value={resourceType}
                onChange={(e) => setResourceType(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value={RESOURCE_TYPES.ARTICLE}>精选文章 (Article)</option>
                <option value={RESOURCE_TYPES.VIDEO}>视频链接 (Video)</option>
                <option value={RESOURCE_TYPES.PODCAST}>精选播客 (Podcast)</option>
                <option value={RESOURCE_TYPES.TOOL}>AI 产品/工具 (Tool)</option>
              </select>
            </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">外部链接 (可选)</label>
              <input
                name="link_display_only"
                value={link}
                disabled
                className="w-full px-4 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-500 focus:outline-none"
                placeholder="请在上方解析处输入"
              />
            </div>
          </>
        )}

        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium text-slate-700">描述 (可自动生成)</label>
          <textarea
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="简短描述，用于 SEO 和卡片展示 (粘贴正文可自动生成)"
          />
        </div>
        
        <div className="space-y-2 md:col-span-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-slate-700">标签</label>
            <TagManager 
              contextKey={contextKey} 
              onTagsChange={setSuggestions} 
            />
          </div>
          <TagInput 
            initialTags={tags}
            onChange={setTags}
            category={category}
            suggestions={suggestions.length > 0 ? suggestions : undefined}
          />
        </div>

        {/* Author Field for Resources */}
        {(type === 'resource' || defaultType === 'resource') && (
          <div className="flex gap-4">
            <div className="space-y-2 flex-1">
              <label className="text-sm font-medium text-slate-700">原作者/来源</label>
              <input
                name="author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="例如: YouTube Channel Name"
              />
            </div>
            {resourceType === RESOURCE_TYPES.VIDEO && (
              <div className="space-y-2 w-1/3">
                <label className="text-sm font-medium text-slate-700">视频时长</label>
                <input
                  name="duration"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="例如: 12:34"
                />
              </div>
            )}
          </div>
        )}

        {/* Cover Image for Resources - Hidden Input but Preview Shown */}
        {(type === 'resource' || defaultType === 'resource') && (
            <div className="space-y-2">
              <div className="flex gap-4 items-start">
                <input
                  type="hidden"
                  name="coverImage"
                  value={coverImage}
                />
                {coverImage && (
                  <div className="w-full h-40 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0 border border-slate-200 relative group">
                    <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
                    <button
                        type="button"
                        onClick={() => setCoverImage('')}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Remove Cover"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                  </div>
                )}
              </div>
            </div>
        )}
      </div>

      {type !== POST_TYPES.RESOURCE && defaultType !== POST_TYPES.RESOURCE && (
      <div className="space-y-2 prose prose-slate max-w-none">
        <label className="text-sm font-medium text-slate-700 block">
          正文 (Markdown)
        </label>
        <SimpleMDE value={content} onChange={setContent} />
      </div>
      )}

      <div className="flex justify-end gap-4 pt-4 border-t border-slate-100">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="px-6 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium"
        >
          取消
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800 font-medium disabled:opacity-50 flex items-center"
        >
          {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {isEditing ? '更新' : '创建'}
        </button>
      </div>
    </form>
  )
}
