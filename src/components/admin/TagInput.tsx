'use client'

import { useState, KeyboardEvent, useEffect } from 'react'
import { X, Plus } from 'lucide-react'

interface TagInputProps {
  initialTags?: string
  onChange: (tags: string) => void
  category?: string
  suggestions?: string[]
}

const COMMON_TAGS: Record<string, string[]> = {
  'ai': ['AI', 'ChatGPT', 'LLM', 'Tutorial', 'News', 'Review', 'Productivity', 'Coding', 'Midjourney', 'Stable Diffusion'],
  'content-creation': ['Writing', 'YouTube', 'Podcast', 'Marketing', 'Social Media', 'Branding', 'Storytelling'],
  'blog': ['Tech', 'Life', 'Thoughts', 'Coding', 'Guide'],
  'default': ['Update', 'News', 'Featured', 'Guide']
}

export function TagInput({ initialTags = '', onChange, category = 'default', suggestions: customSuggestions }: TagInputProps) {
  const [tags, setTags] = useState<string[]>([])
  const [input, setInput] = useState('')
  
  // Get suggestions: use custom if provided, else based on category
  const suggestions = customSuggestions || COMMON_TAGS[category] || COMMON_TAGS['default']

  useEffect(() => {
    if (initialTags) {
      setTags(initialTags.split(',').map(t => t.trim()).filter(Boolean))
    }
  }, [initialTags])

  const addTag = (tag: string) => {
    const trimmed = tag.trim()
    if (trimmed && !tags.includes(trimmed)) {
      const newTags = [...tags, trimmed]
      setTags(newTags)
      onChange(newTags.join(','))
    }
    setInput('')
  }

  const removeTag = (tagToRemove: string) => {
    const newTags = tags.filter(tag => tag !== tagToRemove)
    setTags(newTags)
    onChange(newTags.join(','))
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTag(input)
    } else if (e.key === 'Backspace' && !input && tags.length > 0) {
      removeTag(tags[tags.length - 1])
    }
  }

  return (
    <div className="w-full space-y-3">
      {/* Active Tags & Input Area */}
      <div className="flex flex-wrap gap-2 p-3 rounded-xl border border-slate-200 bg-white focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all min-h-[46px]">
        {tags.map((tag) => (
          <span
            key={tag}
            className="flex items-center gap-1.5 px-2.5 py-1 text-sm font-medium bg-blue-50 text-blue-700 rounded-lg group animate-in fade-in zoom-in duration-200"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="text-blue-400 hover:text-blue-600 hover:bg-blue-100 rounded-full p-0.5 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </span>
        ))}
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => input && addTag(input)}
          className="flex-1 min-w-[120px] outline-none bg-transparent text-sm py-1.5 px-1 placeholder:text-slate-400"
          placeholder={tags.length === 0 ? "输入标签后按回车..." : ""}
        />
      </div>

      {/* Suggested Tags Area */}
      <div>
        <div className="text-xs font-medium text-slate-500 mb-2 px-1">推荐标签 (点击添加):</div>
        <div className="flex flex-wrap gap-2">
          {suggestions.map(tag => {
            const isSelected = tags.includes(tag)
            return (
              <button
                key={tag}
                type="button"
                onClick={() => !isSelected && addTag(tag)}
                disabled={isSelected}
                className={`
                  flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border
                  ${isSelected 
                    ? 'bg-slate-100 text-slate-400 border-slate-100 cursor-default' 
                    : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 cursor-pointer shadow-sm'
                  }
                `}
              >
                {tag}
                {!isSelected && <Plus className="w-3 h-3 opacity-50" />}
              </button>
            )
          })}
        </div>
      </div>
      
      {/* Hidden input to submit the comma-separated string */}
      <input type="hidden" name="tags" value={tags.join(',')} />
    </div>
  )
}
