'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

export function AnalyticsTracker() {
  const pathname = usePathname()
  const lastTrackedPath = useRef<string | null>(null)

  useEffect(() => {
    // 避免重复追踪相同的路径（在某些开发模式下可能触发两次）
    if (lastTrackedPath.current === pathname) return
    
    // 排除管理员后台和 API 路由
    if (pathname.startsWith('/admin') || pathname.startsWith('/api')) return

    const trackVisit = async () => {
      try {
        await fetch('/api/analytics/track', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            path: pathname,
            referer: document.referrer,
          }),
        })
        lastTrackedPath.current = pathname
      } catch (error) {
        // 静默失败，不影响用户体验
        console.warn('Analytics tracking failed')
      }
    }

    // 使用 requestIdleCallback 在浏览器空闲时发送，或者直接发送
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(() => trackVisit())
    } else {
      setTimeout(trackVisit, 1000)
    }
  }, [pathname])

  return null // 此组件不渲染任何内容
}
