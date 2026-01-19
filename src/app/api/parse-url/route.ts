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
                     // We can't verify if maxres exists without checking, but hqdefault is safe. 
                     // Or we can blindly trust maxresdefault if we want high quality.
                     // The previous logic used maxresdefault, let's stick to it or rely on og:image which is usually high res for YT.
                     // og:image is usually https://i.ytimg.com/vi/ID/maxresdefault.jpg
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
        }
      }
    } catch (e) {
      console.error('Direct parsing failed:', e)
    }

    // 6. Translation
    try {
        // Translate Title: "Chinese (Original)"
        if (title) {
            const res = await translate(title, { to: 'zh-CN' })
            if (res.text && res.text !== title) {
                title = `${res.text} (${title})`
            }
        }
        // Translate Description: "Chinese"
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
      coverImage: coverImage || ''
    })

  } catch (error) {
    console.error('Parse URL error:', error)
    return NextResponse.json({ error: 'Failed to parse URL' }, { status: 500 })
  }
}
