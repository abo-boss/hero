export const runtime = 'nodejs'
import { NextResponse } from 'next/server'
import { parse } from 'node-html-parser'
import he from 'he'
import { translate } from 'google-translate-api-x'

export async function POST(request: Request) {
  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 })
    }

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8'
      }
    })

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch URL' }, { status: 400 })
    }

    const html = await response.text()
    const root = parse(html)

    // 1. Get Title
    let title = root.querySelector('title')?.text || 
                root.querySelector('meta[property="og:title"]')?.getAttribute('content') || 
                root.querySelector('meta[name="twitter:title"]')?.getAttribute('content') || ''
    
    // Decode & Clean up title
    title = he.decode(title).trim()
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      title = title.replace(/ - YouTube$/, '')
    } else if (url.includes('bilibili.com')) {
      title = title.replace(/_哔哩哔哩_bilibili$/, '')
    }

    // 2. Get Description
    let description = root.querySelector('meta[name="description"]')?.getAttribute('content') || 
                      root.querySelector('meta[property="og:description"]')?.getAttribute('content') || 
                      root.querySelector('meta[name="twitter:description"]')?.getAttribute('content') || ''
    
    // Decode & Clean up description
    description = he.decode(description).trim()

    // 3. Get Author
    let author = ''
    
    // Strategy 1: Standard Meta Tags
    author = root.querySelector('meta[name="author"]')?.getAttribute('content') || 
             root.querySelector('meta[property="article:author"]')?.getAttribute('content') || 
             root.querySelector('meta[name="twitter:creator"]')?.getAttribute('content') || ''

    // Strategy 2: Platform Specific
    if (!author) {
      if (url.includes('youtube.com') || url.includes('youtu.be')) {
        // YouTube: <link itemprop="name" content="...">
        author = root.querySelector('link[itemprop="name"]')?.getAttribute('content') || 
                 root.querySelector('meta[itemprop="author"]')?.getAttribute('content') || ''
      } else if (url.includes('bilibili.com')) {
        // Bilibili: <meta name="author" content="..."> works usually
        // fallback to finding text content if SSR
        // node-html-parser doesn't support complex CSS selectors like :contains, so stick to basic classes
        if (!author) {
            // Try to find common Bilibili author classes
            // Note: Bilibili HTML is often dynamically rendered, so static fetch might miss some details
            // But usually meta tags are present in initial HTML
            author = root.querySelector('.up-name')?.text.trim() || 
                     root.querySelector('.username')?.text.trim() || ''
        }
      } else if (url.includes('mp.weixin.qq.com')) {
        // WeChat Articles
        author = root.querySelector('meta[name="author"]')?.getAttribute('content') || 
                 root.querySelector('.profile_nickname')?.text.trim() || 
                 root.querySelector('#js_name')?.text.trim() || ''
      }
    }
    
    // Final cleanup
    author = he.decode(author).trim()

    // 4. Get Duration (YouTube only)
    let duration = ''
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      // Try to find duration in meta tags
      // <meta itemprop="duration" content="PT12M34S">
      const durationMeta = root.querySelector('meta[itemprop="duration"]')?.getAttribute('content')
      if (durationMeta) {
        // Convert ISO 8601 duration (PT12M34S) to HH:MM:SS or MM:SS
        const match = durationMeta.match(/PT(\d+H)?(\d+M)?(\d+S)?/)
        if (match) {
          let hours = parseInt((match[1] || '').replace('H', '') || '0')
          let minutes = parseInt((match[2] || '').replace('M', '') || '0')
          let seconds = parseInt((match[3] || '').replace('S', '') || '0')
          
          // Normalize (e.g. 131 minutes -> 2 hours 11 minutes)
          if (seconds >= 60) {
            minutes += Math.floor(seconds / 60)
            seconds = seconds % 60
          }
          if (minutes >= 60) {
            hours += Math.floor(minutes / 60)
            minutes = minutes % 60
          }
          
          const s = seconds.toString().padStart(2, '0')
          const m = minutes.toString().padStart(2, '0')
          
          if (hours > 0) {
            duration = `${hours}:${m}:${s}`
          } else {
             duration = `${minutes}:${s}`
          }
        }
      }
    }

    // 5. Get Cover Image (YouTube only)
    let coverImage = ''
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      // Extract Video ID
      const videoIdMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)
      if (videoIdMatch && videoIdMatch[1]) {
        const videoId = videoIdMatch[1]
        // Prefer maxresdefault
        coverImage = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
      }
    }

    // 6. Translate to Chinese (Simplified)
    // Only translate description, KEEP title original -> Changed: Translate Title as "Chinese (English)"
    try {
        if (title) {
            const res = await translate(title, { to: 'zh-CN' })
            // Only append original if translation is different
            if (res.text !== title) {
                title = `${res.text} (${title})`
            }
        }
        if (description) {
             const res = await translate(description, { to: 'zh-CN' })
             description = res.text
        }
    } catch (translateError) {
        console.warn('Translation failed, using original text:', translateError)
        // Fallback to original text is automatic since we modify the variables
    }

    return NextResponse.json({
      title: title || '',
      description: description || '',
      author: author || '',
      duration: duration || '',
      coverImage: coverImage || ''
    })

  } catch (error) {
    console.error('Parse URL error:', error)
    return NextResponse.json({ error: 'Failed to parse URL' }, { status: 500 })
  }
}
