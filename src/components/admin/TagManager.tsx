
'use client'

import { useState, useEffect } from 'react'
import { Plus, X, ArrowUp, ArrowDown, Loader2, Settings2 } from 'lucide-react'
import { getTagPresets, updateTagPresets } from '@/app/actions/tags'

interface TagManagerProps {
  contextKey: string
  onTagsChange?: (tags: string[]) => void
}

export function TagManager({ contextKey, onTagsChange }: TagManagerProps) {
  const [tags, setTags] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [input, setInput] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  // Fetch tags on mount or when key changes
  useEffect(() => {
    let mounted = true
    setLoading(true)
    getTagPresets(contextKey).then(fetchedTags => {
      if (mounted) {
        setTags(fetchedTags)
        setLoading(false)
        onTagsChange?.(fetchedTags)
      }
    })
    return () => { mounted = false }
  }, [contextKey, onTagsChange])

  const handleSave = async (newTags: string[]) => {
    setSaving(true)
    try {
      await updateTagPresets(contextKey, newTags)
      onTagsChange?.(newTags)
    } catch (error) {
      console.error('Failed to save tags', error)
      alert('保存标签失败')
    } finally {
      setSaving(false)
    }
  }

  const addTag = async () => {
    const trimmed = input.trim()
    if (trimmed && !tags.includes(trimmed)) {
      const newTags = [...tags, trimmed]
      setTags(newTags)
      setInput('')
      await handleSave(newTags)
    }
  }

  const removeTag = async (tagToRemove: string) => {
    if (!confirm(`确定要从预设中删除标签 "${tagToRemove}" 吗？`)) return
    const newTags = tags.filter(t => t !== tagToRemove)
    setTags(newTags)
    await handleSave(newTags)
  }

  const moveTag = async (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return
    if (direction === 'down' && index === tags.length - 1) return

    const newTags = [...tags]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    const temp = newTags[index]
    newTags[index] = newTags[targetIndex]
    newTags[targetIndex] = temp
    
    setTags(newTags)
    await handleSave(newTags)
  }

  if (loading) return <div className="text-sm text-slate-400 flex items-center gap-2"><Loader2 className="w-3 h-3 animate-spin" /> 加载标签配置...</div>

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="text-xs flex items-center gap-1 text-slate-500 hover:text-blue-600 mb-2 transition-colors"
      >
        <Settings2 className="w-3 h-3" />
        {isOpen ? '收起标签管理' : '管理预设标签 (排序/添加/删除)'}
      </button>

      {isOpen && (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-4 animate-in slide-in-from-top-2 duration-200">
          <div className="flex gap-2 mb-4">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
              placeholder="输入新标签..."
              className="flex-1 px-3 py-1.5 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={addTag}
              disabled={saving || !input.trim()}
              className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              添加
            </button>
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto">
            {tags.map((tag, index) => (
              <div key={tag} className="flex items-center justify-between bg-white p-2 rounded-lg border border-slate-100 shadow-sm group">
                <span className="text-sm font-medium text-slate-700">{tag}</span>
                <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={() => moveTag(index, 'up')}
                    disabled={index === 0 || saving}
                    className="p-1 hover:bg-slate-100 rounded text-slate-500 disabled:opacity-30"
                    title="上移"
                  >
                    <ArrowUp className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveTag(index, 'down')}
                    disabled={index === tags.length - 1 || saving}
                    className="p-1 hover:bg-slate-100 rounded text-slate-500 disabled:opacity-30"
                    title="下移"
                  >
                    <ArrowDown className="w-3 h-3" />
                  </button>
                  <div className="w-px h-3 bg-slate-200 mx-1"></div>
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    disabled={saving}
                    className="p-1 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded transition-colors"
                    title="删除"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
            {tags.length === 0 && (
              <div className="text-center text-xs text-slate-400 py-4">
                暂无预设标签
              </div>
            )}
          </div>
          {saving && <div className="text-xs text-blue-600 mt-2 flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin" /> 保存中...</div>}
        </div>
      )}
    </div>
  )
}
