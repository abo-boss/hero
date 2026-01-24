import { Play } from 'lucide-react'
import { Post } from '@/lib/mdx'
import { useState } from 'react'

interface VideoCardProps {
  post: Post
}

export function VideoCard({ post }: VideoCardProps) {
  const [isPlaying, setIsPlaying] = useState(false)

  // 辅助函数：处理视频 URL
  const getEmbedUrl = (url: string) => {
    if (!url) return "//player.bilibili.com/player.html?aid=1126955726&bvid=BV19A4m1E7tq&cid=1455294628&p=1" // 默认演示视频
    
    // 处理 YouTube 链接
    // 支持格式: https://www.youtube.com/watch?v=VIDEO_ID 或 https://youtu.be/VIDEO_ID
    const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
    const match = url.match(youtubeRegex)
    
    if (match && match[1]) {
      return `https://www.youtube.com/embed/${match[1]}?autoplay=1`
    }

    // 尝试提取 watch?v= 后的 ID（即使长度不为 11）
    if (url.includes('youtube.com/watch')) {
      const urlObj = new URL(url);
      const v = urlObj.searchParams.get('v');
      if (v) return `https://www.youtube.com/embed/${v}?autoplay=1`;
    }
    
    // 如果已经是 embed 链接或者其他格式（如 Bilibili），直接返回并尝试追加 autoplay
    return url.includes('?') ? `${url}&autoplay=1` : `${url}?autoplay=1`
  }

  const getPlatformName = (url: string | undefined) => {
    if (!url) return 'Unknown'
    if (url.includes('youtube.com') || url.includes('youtu.be')) return 'YouTube'
    if (url.includes('bilibili.com')) return 'Bilibili'
    if (url.includes('vimeo.com')) return 'Vimeo'
    return 'Web'
  }

  const videoSrc = getEmbedUrl(post.link)
  const platform = getPlatformName(post.link)
  
  const [imgSrc, setImgSrc] = useState(post.coverImage || `https://picsum.photos/seed/${post.slug}/640/360`)

  // Fallback logic for YouTube thumbnails
  const handleError = () => {
    if (imgSrc.includes('maxresdefault')) {
      setImgSrc(imgSrc.replace('maxresdefault', 'hqdefault'))
    }
  }

  return (
    <div className="group flex flex-col rounded-2xl border border-slate-100 bg-white shadow-sm transition-all hover:shadow-md hover:border-slate-200 overflow-hidden">
      {/* Video Area */}
      <div className="relative aspect-video w-full bg-slate-900 overflow-hidden">
        {isPlaying ? (
          <iframe 
            src={videoSrc}
            className="w-full h-full"
            scrolling="no" 
            style={{ border: 0 }}
            allowFullScreen={true} 
            allow="autoplay; encrypted-media; gyroscope; picture-in-picture"
          ></iframe>
        ) : (
          <div 
            className="w-full h-full relative cursor-pointer group-hover:scale-105 transition-transform duration-500"
            onClick={() => setIsPlaying(true)}
          >
             {/* Cover Image Placeholder - In real app use post.coverImage */}
             <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent z-10"></div>
             
             {/* Title Overlay (Top Left) */}
            <div className="absolute top-4 left-4 z-30 max-w-[80%]">
              <h3 className="text-white font-bold text-lg drop-shadow-md leading-tight line-clamp-2">
                {post.title}
              </h3>
            </div>

             <img 
               src={imgSrc} 
               onError={handleError}
               alt={post.title}
               className={`w-full h-full object-cover ${imgSrc.includes('hqdefault') ? 'scale-135' : ''}`}
             />
             
             {/* Play Button */}
             <div className="absolute inset-0 flex items-center justify-center z-20">
               <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/30 transition-colors">
                 <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-lg pl-1">
                   <Play className="w-5 h-5 text-slate-900 fill-slate-900" />
                 </div>
               </div>
             </div>

             {/* Duration Badge (Bottom Right) */}
             <div className="absolute bottom-3 right-3 z-20 px-2 py-1 rounded bg-black/80 text-white text-xs font-bold flex items-center backdrop-blur-sm">
               {post.duration || (
                 <span className="flex items-center gap-1">
                   <Play className="w-3 h-3" />
                   {platform}
                 </span>
               )}
             </div>
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-start justify-between mb-3">
          <div className="flex gap-2">
            {(post.tags || []).slice(0, 2).map(tag => (
              <span key={tag} className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <a 
          href={post.link || "#"} 
          target="_blank" 
          rel="noopener noreferrer"
          className="group/title block"
        >
          <h3 className="text-lg font-bold text-slate-900 mb-2 leading-tight group-hover/title:text-blue-600 transition-colors line-clamp-2">
            {post.title}
          </h3>
        </a>
        
        <p className="text-slate-500 text-sm leading-relaxed line-clamp-2 mb-4 flex-1">
          {post.description}
        </p>

        {/* Footer info if needed */}
        <div className="mt-auto pt-4 border-t border-slate-50 flex justify-between items-center text-xs text-slate-400">
           {/* 左下角显示来源平台 */}
           <span className="font-medium text-slate-500">{platform}</span>
           {/* 优先显示 post.author (原作者)，如果没有则不显示任何名字，或者显示默认值 */}
           {post.author && <span>{post.author}</span>}
        </div>
      </div>
    </div>
  )
}
