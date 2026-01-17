'use client'

import { Trash2 } from 'lucide-react'

export function DeleteButton() {
  return (
    <button
      type="submit"
      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
      onClick={(e) => {
        if (!confirm('您确定要删除这篇文章吗？')) {
          e.preventDefault()
        }
      }}
    >
      <Trash2 className="w-4 h-4" />
    </button>
  )
}
