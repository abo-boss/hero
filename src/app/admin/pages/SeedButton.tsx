'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { RefreshCw, Loader2 } from 'lucide-react'

export function SeedButton() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSeed = async () => {
    try {
      setIsLoading(true)
      const res = await fetch('/api/seed-page-content')
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to seed content')
      }

      alert('初始化成功！页面将刷新。')
      router.refresh()
    } catch (error: any) {
      console.error('Seeding failed:', error)
      alert(`初始化失败: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button 
      onClick={handleSeed}
      disabled={isLoading}
      className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isLoading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <RefreshCw className="w-5 h-5" />
      )}
      {isLoading ? '初始化中...' : '初始化默认配置'}
    </button>
  )
}
