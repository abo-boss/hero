'use client'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Post } from '@/lib/mdx'
import { ResourceCard } from './ResourceCard'
import { VideoCard } from './VideoCard'
import { PodcastCard } from './PodcastCard'
import { ProductCard } from './ProductCard'
import { CATEGORIES, RESOURCE_TYPES, CATEGORY_LABELS } from '@/lib/constants'

export function ResourceFilter({ posts, tagPresets }: { posts: Post[], tagPresets?: Record<string, string[]> }) {
  const searchParams = useSearchParams()
  const initialCategory = searchParams.get('category') || CATEGORIES.AI
  
  const [activeCategory, setActiveCategory] = useState(initialCategory)
  const [activeVideoSubFilter, setActiveVideoSubFilter] = useState('featured')
  const [activeContentVideoSubFilter, setActiveContentVideoSubFilter] = useState('featured')
  
  // 监听 URL 参数变化，更新 activeCategory
  useEffect(() => {
    const category = searchParams.get('category')
    if (category && [CATEGORIES.AI, CATEGORIES.CONTENT_CREATION, CATEGORIES.ALL].includes(category as any)) {
      setActiveCategory(category)
      // 切换分类时，重置子过滤器为精选状态
      setActiveVideoSubFilter('featured')
      setActiveContentVideoSubFilter('featured')
    }
  }, [searchParams])
  
  const categories = [
    { id: CATEGORIES.ALL, label: CATEGORY_LABELS[CATEGORIES.ALL] },
    { id: CATEGORIES.AI, label: CATEGORY_LABELS[CATEGORIES.AI] },
    { id: CATEGORIES.CONTENT_CREATION, label: CATEGORY_LABELS[CATEGORIES.CONTENT_CREATION] }
  ]

  // Helper to convert string array to filter objects
  const tagsToFilters = (tags: string[] = []) => {
    return [
      { id: 'featured', label: '精选' },
      { id: 'all', label: '全部' },
      ...tags.map(t => ({ id: t, label: t }))
    ]
  }

  // 视频分类标签 (从 DB 获取，fallback 到默认)
  const aiVideoTags = tagPresets?.['resource:ai:video'] || [
    '基础知识', '提示词', '实用教程', 'Vibe Coding', 'AI 产品', '创始人访谈'
  ]
  const videoFilters = tagsToFilters(aiVideoTags)

  // 内容创作视频分类标签
  const contentCreationVideoTags = tagPresets?.['resource:content-creation:video'] || [
    '写作', '内容创作', '小而美商业', '轻创业', '个人品牌', '运营策略'
  ]
  const contentVideoFilters = tagsToFilters(contentCreationVideoTags)
  
  // Helper: Select diverse posts based on tags
  const getDiversePosts = (allPosts: Post[], filters: {id: string}[]) => {
    const selectedPosts: Post[] = []
    const usedSlugs = new Set<string>()
    // Skip 'featured' and 'all' when looking for tags
    const tagsToCover = filters.filter(f => f.id !== 'all' && f.id !== 'featured').map(f => f.id)

    // 1. Try to find one post for each tag
    for (const tag of tagsToCover) {
      const post = allPosts.find(p => p.tags?.includes(tag) && !usedSlugs.has(p.slug))
      if (post) {
        selectedPosts.push(post)
        usedSlugs.add(post.slug)
      }
      if (selectedPosts.length >= 6) break
    }

    // 2. If less than 6, fill with remaining posts
    if (selectedPosts.length < 6) {
      for (const post of allPosts) {
        if (!usedSlugs.has(post.slug)) {
          selectedPosts.push(post)
          usedSlugs.add(post.slug)
          if (selectedPosts.length >= 6) break
        }
      }
    }
    
    return selectedPosts
  }

  // 数据源分拣
  const getVideoPosts = () => {
    // 筛选 category='ai' 且 resourceType='video'
    let videos = posts.filter(p => p.category === CATEGORIES.AI && p.resourceType === RESOURCE_TYPES.VIDEO)
    if (activeVideoSubFilter === 'featured') {
      return getDiversePosts(videos, videoFilters)
    }
    if (activeVideoSubFilter === 'all') {
      return videos
    }
    return videos.filter(p => p.tags?.includes(activeVideoSubFilter))
  }

  const getPodcastPosts = () => {
    // 筛选 category='ai' 且 resourceType='podcast'
    return posts.filter(p => p.category === CATEGORIES.AI && p.resourceType === RESOURCE_TYPES.PODCAST)
  }

  const getProductPosts = () => {
    // 筛选 category='ai' 且 resourceType='tool'
    return posts.filter(p => p.category === CATEGORIES.AI && p.resourceType === RESOURCE_TYPES.TOOL)
  }

  // Content & IP Data Sources
  const getContentVideoPosts = () => {
    // 筛选 category='content-creation' 且 resourceType='video'
    let videos = posts.filter(p => p.category === CATEGORIES.CONTENT_CREATION && p.resourceType === RESOURCE_TYPES.VIDEO)
    if (activeContentVideoSubFilter === 'featured') {
      return getDiversePosts(videos, contentVideoFilters)
    }
    if (activeContentVideoSubFilter === 'all') {
      return videos
    }
    return videos.filter(p => p.tags?.includes(activeContentVideoSubFilter))
  }

  const getContentPodcastPosts = () => {
    // 筛选 category='content-creation' 且 resourceType='podcast'
    return posts.filter(p => p.category === CATEGORIES.CONTENT_CREATION && p.resourceType === RESOURCE_TYPES.PODCAST)
  }

  const getContentArticlePosts = () => {
    // 筛选 category='content-creation' 且 resourceType='article'
    return posts.filter(p => p.category === CATEGORIES.CONTENT_CREATION && p.resourceType === RESOURCE_TYPES.ARTICLE)
  }

  const getOtherPosts = () => {
    if (activeCategory === CATEGORIES.ALL) {
      // 全部分类展示所有资源（按时间倒序）
      return posts
    }
    // 其他具体分类
    return posts.filter(p => p.category === activeCategory)
  }

  return (
    <div>
      {/* 一级分类 Tab */}
      <div className="flex flex-wrap gap-3 mb-12">
        {categories.map(cat => (
          <button 
            key={cat.id}
            onClick={() => {
              setActiveCategory(cat.id)
              setActiveVideoSubFilter('featured') 
              setActiveContentVideoSubFilter('featured')
            }}
            className={`px-6 py-3 rounded-2xl text-base font-medium transition-all ${
              activeCategory === cat.id 
                ? 'bg-slate-900 text-white shadow-lg shadow-slate-200' 
                : 'bg-white border border-slate-100 text-slate-500 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* AI 资源视图：包含视频和播客两个大板块 */}
      {activeCategory === CATEGORIES.AI ? (
        <div className="space-y-24 animate-fade-in">
          
          {/* Section 1: 精选视频 */}
          <section>
             <div className="mb-10">
               <h2 className="text-2xl font-bold text-slate-900 mb-2">精选视频</h2>
               <div className="w-12 h-1 bg-blue-600 rounded-full mb-6"></div>
               <p className="text-slate-600 mb-8 leading-relaxed max-w-3xl">
                 这些是我学习AI过程中发现的一些有启发的视频，我挑选的视频，基本都是油管上比较优质的视频，我希望集合下来，供大家一起学习交流。
               </p>
               
               <div className="flex items-center gap-4">
                 <span className="text-sm font-semibold text-slate-900 shrink-0">按标签筛选：</span>
                 <div className="flex flex-wrap gap-2">
                   {videoFilters.map(filter => (
                     <button
                       key={filter.id}
                       onClick={() => setActiveVideoSubFilter(filter.id)}
                       className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                         activeVideoSubFilter === filter.id
                           ? 'bg-slate-900 text-white'
                           : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                       }`}
                     >
                       {filter.label}
                     </button>
                   ))}
                 </div>
               </div>
             </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getVideoPosts().map(post => (
                  <VideoCard key={post.slug} post={post} />
                ))}
             </div>
             {getVideoPosts().length === 0 && (
                <div className="text-center py-12 text-slate-400 text-sm">暂无符合条件的视频</div>
             )}
          </section>

          {/* Section 2: 精选播客 */}
          <section>
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">精选播客</h2>
              <div className="w-12 h-1 bg-purple-600 rounded-full mb-6"></div>
              <div className="text-slate-600 mb-8 leading-relaxed max-w-3xl space-y-4">
                <p>相比音频播客，我更喜欢视频播客，因为视频有产品展示和人物对话的沉浸感。</p>
                <p>视频播客也更容易让我进入思考状态，所以我建议看视频播客。</p>
                <p className="text-sm text-slate-500 bg-slate-50 p-4 rounded-xl">
                  💡 这些是YouTube链接，视频播客版本。音频版本的话，也可以在音频播客应用中输入节目名称收听。
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
               {getPodcastPosts().map(post => (
                 <PodcastCard key={post.slug} post={post} />
               ))}
            </div>
          </section>

          {/* Section 3: AI 产品 */}
          <section>
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">AI 产品</h2>
              <div className="w-12 h-1 bg-green-500 rounded-full mb-6"></div>
              <p className="text-slate-600 mb-8 leading-relaxed max-w-3xl">
                我发现的一些好的 AI 应用。
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
               {getProductPosts().map(post => (
                 <ProductCard key={post.slug} post={post} />
               ))}
            </div>
            {getProductPosts().length === 0 && (
                <div className="text-center py-12 text-slate-400 text-sm">暂无推荐产品</div>
             )}
          </section>

        </div>
      ) : activeCategory === CATEGORIES.CONTENT_CREATION ? (
        <div className="space-y-24 animate-fade-in">
          
          {/* Section 1: 精选视频 (Content & IP) */}
          <section>
             <div className="mb-10">
               <h2 className="text-2xl font-bold text-slate-900 mb-2">精选视频</h2>
               <div className="w-12 h-1 bg-blue-600 rounded-full mb-6"></div>
               <p className="text-slate-600 mb-8 leading-relaxed max-w-3xl">
                 顶级创作者的实战经验分享，从思维模型到具体执行。
               </p>

               <div className="flex items-center gap-4">
                 <span className="text-sm font-semibold text-slate-900 shrink-0">按标签筛选：</span>
                 <div className="flex flex-wrap gap-2">
                   {contentVideoFilters.map(filter => (
                     <button
                       key={filter.id}
                       onClick={() => setActiveContentVideoSubFilter(filter.id)}
                       className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                         activeContentVideoSubFilter === filter.id
                           ? 'bg-slate-900 text-white'
                           : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                       }`}
                     >
                       {filter.label}
                     </button>
                   ))}
                 </div>
               </div>
             </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getContentVideoPosts().map(post => (
                  <VideoCard key={post.slug} post={post} />
                ))}
             </div>
             {getContentVideoPosts().length === 0 && (
                <div className="text-center py-12 text-slate-400 text-sm">暂无精选视频</div>
             )}
          </section>

          {/* Section 2: 精选播客 (Content & IP) */}
          <section>
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">精选播客</h2>
              <div className="w-12 h-1 bg-purple-600 rounded-full mb-6"></div>
              <p className="text-slate-600 mb-8 leading-relaxed max-w-3xl">
                聆听创作者背后的故事与商业思考。
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
               {getContentPodcastPosts().map(post => (
                 <PodcastCard key={post.slug} post={post} />
               ))}
            </div>
            {getContentPodcastPosts().length === 0 && (
               <div className="text-center py-12 text-slate-400 text-sm">暂无精选播客</div>
            )}
          </section>

          {/* Section 3: 精选文章 (Content & IP) */}
          <section>
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">精选文章</h2>
              <div className="w-12 h-1 bg-orange-500 rounded-full mb-6"></div>
              <p className="text-slate-600 mb-8 leading-relaxed max-w-3xl">
                深度好文，关于写作、传播与个人品牌。
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
               {getContentArticlePosts().map(post => (
                 <ResourceCard key={post.slug} post={post} type="resource" />
               ))}
            </div>
            {getContentArticlePosts().length === 0 && (
                <div className="text-center py-12 text-slate-400 text-sm">暂无精选文章</div>
             )}
          </section>

        </div>
      ) : (
        // 其他分类视图 (All)
        <div className="animate-fade-in">
          {getOtherPosts().length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getOtherPosts().map(post => {
                // 视频类型使用 VideoCard
                if (post.resourceType === RESOURCE_TYPES.VIDEO) {
                  return <VideoCard key={post.slug} post={post} />
                }
                // 播客类型使用 PodcastCard
                if (post.resourceType === RESOURCE_TYPES.PODCAST) {
                  return <PodcastCard key={post.slug} post={post} />
                }
                // 工具类型使用 ProductCard
                if (post.resourceType === RESOURCE_TYPES.TOOL) {
                  return <ProductCard key={post.slug} post={post} />
                }
                // 其他保持原样
                return <ResourceCard key={post.slug} post={post} type="resource" />
              })}
            </div>
          ) : (
            <div className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
              <p className="text-slate-500">该分类下暂无资源。</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
