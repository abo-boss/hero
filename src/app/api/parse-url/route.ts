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

    // Initialize variables
    let title = ''
    let description = ''
    let author = ''
    let duration = ''
    let coverImage = ''
    let keywords: string[] = []
    let tags: string[] = []

    // Common headers for requests
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept-Language': 'en-US,en;q=0.9',
    }

    // Strategy 1: oEmbed (Best for Title, Author, Thumbnail on supported platforms)
    // Works for YouTube, Vimeo, etc.
    try {
      let oembedUrl = ''
      if (url.includes('youtube.com') || url.includes('youtu.be')) {
        oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`
      } else if (url.includes('vimeo.com')) {
        oembedUrl = `https://vimeo.com/api/oembed.json?url=${encodeURIComponent(url)}`
      }

      if (oembedUrl) {
        const oembedRes = await fetch(oembedUrl)
        if (oembedRes.ok) {
          const data = await oembedRes.json()
          if (data.title) title = data.title
          if (data.author_name) author = data.author_name
          if (data.thumbnail_url) coverImage = data.thumbnail_url
        }
      }
    } catch (e) {
      console.error('oEmbed failed:', e)
    }

    // Strategy 2: Direct Page Parsing (Required for Duration, Description, and fallback)
    try {
      // For YouTube, we might need to fetch the watch page even if oEmbed worked, 
      // because oEmbed doesn't give duration or full description.
      
      const response = await fetch(url, { headers })
      
      if (response.ok) {
        const html = await response.text()
        const root = parse(html)

        // 1. Title (Fallback)
        if (!title) {
          title = root.querySelector('title')?.text || 
                  root.querySelector('meta[property="og:title"]')?.getAttribute('content') || 
                  root.querySelector('meta[name="twitter:title"]')?.getAttribute('content') || ''
          title = he.decode(title).trim()
          // Cleanup
          if (url.includes('youtube.com') || url.includes('youtu.be')) {
            title = title.replace(/ - YouTube$/, '')
          } else if (url.includes('bilibili.com')) {
            title = title.replace(/_哔哩哔哩_bilibili$/, '')
          }
        }

        // 2. Description
        // Try meta tags first
        if (!description) {
            description = root.querySelector('meta[name="description"]')?.getAttribute('content') || 
                          root.querySelector('meta[property="og:description"]')?.getAttribute('content') || 
                          root.querySelector('meta[name="twitter:description"]')?.getAttribute('content') || ''
            description = he.decode(description).trim()

            // Check for generic YouTube description and clear it if found
            const genericDescriptions = [
                "Enjoy the videos and music you love, upload original content, and share it all with friends, family, and the world on YouTube.",
                "欣赏您喜爱的视频和音乐，上传原创内容，并在 YouTube 上与朋友、家人和全世界分享。",
                "YouTube"
            ]
            if (genericDescriptions.includes(description)) {
                description = ''
            }
        }

        // 3. Author (Fallback)
        if (!author) {
            author = root.querySelector('meta[name="author"]')?.getAttribute('content') || 
                     root.querySelector('meta[property="article:author"]')?.getAttribute('content') || 
                     root.querySelector('link[itemprop="name"]')?.getAttribute('content') || 
                     root.querySelector('meta[itemprop="author"]')?.getAttribute('content') || ''
            
            if (!author && url.includes('bilibili.com')) {
                author = root.querySelector('.up-name')?.text.trim() || 
                         root.querySelector('.username')?.text.trim() || ''
            }
            author = he.decode(author).trim()
        }

        // 3.5. Keywords (Fallback)
        if (keywords.length === 0) {
            const metaKeywords = root.querySelector('meta[name="keywords"]')?.getAttribute('content')
            if (metaKeywords) {
                keywords = metaKeywords.split(',').map(k => k.trim()).filter(k => k)
            }
        }

        // 4. Cover Image (Fallback & High Res Upgrade)
        if (!coverImage || (url.includes('youtube.com') || url.includes('youtu.be'))) {
            // Check meta tags
            const metaImage = root.querySelector('meta[property="og:image"]')?.getAttribute('content') || 
                              root.querySelector('meta[name="twitter:image"]')?.getAttribute('content')
            
            if (metaImage) {
                coverImage = metaImage
            }

            // For YouTube, try to get maxresdefault if we have the ID
            if (url.includes('youtube.com') || url.includes('youtu.be')) {
                 const videoIdMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)
                 if (videoIdMatch && videoIdMatch[1]) {
                    // keep og:image
                 }
            }
          
          if (!coverImage) {
            const iconHref = root.querySelector('link[rel="icon"]')?.getAttribute('href') ||
                             root.querySelector('link[rel="shortcut icon"]')?.getAttribute('href') ||
                             root.querySelector('link[rel="apple-touch-icon"]')?.getAttribute('href') ||
                             ''
            if (iconHref) {
              try {
                const u = new URL(url)
                const iconUrl = iconHref.startsWith('http') ? iconHref : `${u.protocol}//${u.host}${iconHref.startsWith('/') ? iconHref : `/${iconHref}`}`
                coverImage = iconUrl
              } catch {}
            } else {
              try {
                const u = new URL(url)
                coverImage = `https://www.google.com/s2/favicons?sz=128&domain=${u.hostname}`
              } catch {}
            }
          }
        }

        // 5. Duration (The tricky part)
        if (!duration) {
            // Method A: Meta tag (ISO 8601)
            const durationMeta = root.querySelector('meta[itemprop="duration"]')?.getAttribute('content')
            if (durationMeta) {
                const match = durationMeta.match(/PT(\d+H)?(\d+M)?(\d+S)?/)
                if (match) {
                    let hours = parseInt((match[1] || '').replace('H', '') || '0')
                    let minutes = parseInt((match[2] || '').replace('M', '') || '0')
                    let seconds = parseInt((match[3] || '').replace('S', '') || '0')
                    
                    const s = seconds.toString().padStart(2, '0')
                    const m = minutes.toString().padStart(2, '0')
                    
                    if (hours > 0) duration = `${hours}:${m}:${s}`
                    else duration = `${minutes}:${s}`
                }
            }

            // Method B: YouTube JSON Data (ytInitialPlayerResponse)
            if (!duration && (url.includes('youtube.com') || url.includes('youtu.be'))) {
                const jsonMatch = html.match(/ytInitialPlayerResponse\s*=\s*({.+?});/)
                if (jsonMatch) {
                    try {
                        const playerData = JSON.parse(jsonMatch[1])
                        const details = playerData.videoDetails
                        
                        // While we are here, get other details if missing
                        if (details) {
                            if (!title) title = details.title
                            if (!author) author = details.author
                            if (!description && details.shortDescription) description = details.shortDescription
                            if (details.keywords) keywords = details.keywords

                            if (details.lengthSeconds) {
                                const secondsTotal = parseInt(details.lengthSeconds)
                                const hours = Math.floor(secondsTotal / 3600)
                                const minutes = Math.floor((secondsTotal % 3600) / 60)
                                const seconds = secondsTotal % 60
                                
                                const s = seconds.toString().padStart(2, '0')
                                const m = minutes.toString().padStart(2, '0')
                                
                                if (hours > 0) duration = `${hours}:${m}:${s}`
                                else duration = `${minutes}:${s}`
                            }
                        }
                    } catch (e) {
                        console.error('Failed to parse ytInitialPlayerResponse:', e)
                    }
                }
            }

            // Method C: YouTube Search Page Fallback (Most robust for Duration & Description)
            if ((!duration || !description) && (url.includes('youtube.com') || url.includes('youtu.be'))) {
                try {
                    const videoIdMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)
                    const videoId = videoIdMatch ? videoIdMatch[1] : null

                    if (videoId) {
                        const searchUrl = `https://www.youtube.com/results?search_query=${videoId}&sp=EgIQAQ%253D%253D` // sp=EgIQAQ%253D%253D filters for video only
                        const searchRes = await fetch(searchUrl, { 
                            headers: {
                                ...headers,
                                // Use a slightly different User-Agent for search to avoid strict bot detection
                                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
                            } 
                        })
                        const searchHtml = await searchRes.text()
                        
                        const dataMatch = searchHtml.match(/var ytInitialData\s*=\s*({.+?});/)
                        if (dataMatch) {
                            const ytData = JSON.parse(dataMatch[1])
                            const contents = ytData.contents?.twoColumnSearchResultsRenderer?.primaryContents?.sectionListRenderer?.contents
                            
                            if (contents) {
                                // Find the itemSectionRenderer
                                for (const section of contents) {
                                    if (section.itemSectionRenderer?.contents) {
                                        const videoItems = section.itemSectionRenderer.contents
                                        for (const item of videoItems) {
                                            if (item.videoRenderer && item.videoRenderer.videoId === videoId) {
                                                const vid = item.videoRenderer
                                                
                                                // Duration (simpleText usually "MM:SS" or "H:MM:SS")
                                                if (!duration && vid.lengthText) {
                                                    const timeStr = vid.lengthText.simpleText || vid.lengthText.accessibility?.accessibilityData?.label
                                                    if (timeStr) {
                                                        // If it's already in format like "12:34", use it. 
                                                        // Accessibility label might be "12 minutes, 34 seconds", so prefer simpleText
                                                        if (vid.lengthText.simpleText) {
                                                            duration = vid.lengthText.simpleText
                                                        }
                                                    }
                                                }
                                                
                                                // Description
                                                if (!description && vid.detailedMetadataSnippets?.[0]?.snippetText?.runs) {
                                                     description = vid.detailedMetadataSnippets[0].snippetText.runs.map((r: any) => r.text).join('')
                                                } else if (!description && vid.descriptionSnippet?.runs) {
                                                     description = vid.descriptionSnippet.runs.map((r: any) => r.text).join('')
                                                }

                                                // Title fallback
                                                if (!title && vid.title?.runs?.[0]?.text) {
                                                    title = vid.title.runs[0].text
                                                }
                                                
                                                break
                                            }
                                        }
                                    }
                                    if (duration && description) break
                                }
                            }
                        }
                    }
                } catch (e) {
                    console.error('Search page fallback failed:', e)
                }
            }
        }
      }
    } catch (e) {
      console.error('Direct parsing failed:', e)
    }

    // 6. Generate Summary if Description is Empty
    if (!description && title) {
        // Try to construct a summary from available metadata
        const parts = []
        parts.push(`视频标题：${title}`)
        if (author) parts.push(`作者：${author}`)
        if (keywords && keywords.length > 0) {
            parts.push(`关键词：${keywords.slice(0, 10).join('、')}`) // Limit to 10 keywords
        }
        
        if (parts.length > 1) {
             description = `【自动生成摘要】\n${parts.join('\n')}`
        }
    }

    // 7. Product tagging and brand detection
    try {
      const u = new URL(url)
      const host = u.hostname
      const parts = host.split('.')
      const base = parts.length >= 2 ? parts[parts.length - 2] : parts[0]
      let brand = base.charAt(0).toUpperCase() + base.slice(1)
      if (host.includes('google.com')) brand = 'Google'
      if (host.includes('openai.com')) brand = 'OpenAI'
      if (host.includes('perplexity.ai')) brand = 'Perplexity'
      if (host.includes('cursor.sh')) brand = 'Cursor'
      tags = ['AI产品', brand]
      if (!author) author = brand
      if (host.includes('google.com') && parts[0] && parts[0].toLowerCase() === 'notebooklm') {
        if (!title || /登录|Sign in|Login/i.test(title)) {
          title = 'NotebookLM'
        }
        if (!description || /登录|Sign in|Login/i.test(description)) {
          description = 'Google 推出的个性化 AI 笔记本，可以上传文档生成问答、摘要和音频概览。'
        }
      }
    } catch {}

    // 8. Translation
    try {
        const isVideo = url.includes('youtube.com') || url.includes('youtu.be') || url.includes('vimeo.com')
        if (isVideo && title) {
          const res = await translate(title, { to: 'zh-CN' })
          if (res.text && res.text !== title) {
              title = `${res.text} (${title})`
          }
        }
        if (description) {
             const res = await translate(description, { to: 'zh-CN' })
             if (res.text) {
                 description = res.text
             }
        }
    } catch (translateError) {
        console.warn('Translation failed, using original text:', translateError)
    }

    return NextResponse.json({
      title: title || '',
      description: description || '',
      author: author || '',
      duration: duration || '',
      coverImage: coverImage || '',
      tags
    })

  } catch (error) {
    console.error('Parse URL error:', error)
    return NextResponse.json({ error: 'Failed to parse URL' }, { status: 500 })
  }
}
