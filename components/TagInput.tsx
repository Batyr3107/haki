'use client'

import { useState, KeyboardEvent } from 'react'

interface TagInputProps {
  tags: string[]
  onChange: (tags: string[]) => void
  maxTags?: number
}

export default function TagInput({ tags, onChange, maxTags = 5 }: TagInputProps) {
  const [input, setInput] = useState('')

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addTag()
    } else if (e.key === 'Backspace' && input === '' && tags.length > 0) {
      removeTag(tags.length - 1)
    }
  }

  const addTag = () => {
    const tag = input.trim().toLowerCase()

    if (!tag) return
    if (tags.length >= maxTags) {
      alert(`Максимум ${maxTags} тегов`)
      return
    }
    if (tags.includes(tag)) {
      alert('Этот тег уже добавлен')
      return
    }
    if (tag.length > 20) {
      alert('Тег не должен превышать 20 символов')
      return
    }

    onChange([...tags, tag])
    setInput('')
  }

  const removeTag = (index: number) => {
    onChange(tags.filter((_, i) => i !== index))
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Теги
      </label>
      <div className="flex flex-wrap gap-2 p-3 border border-gray-300 rounded-lg min-h-[50px] focus-within:ring-2 focus-within:ring-blue-500">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
          >
            #{tag}
            <button
              type="button"
              onClick={() => removeTag(index)}
              className="ml-1 hover:text-blue-900 focus:outline-none"
            >
              ×
            </button>
          </span>
        ))}
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={addTag}
          placeholder={tags.length === 0 ? "Добавьте теги (нажмите Enter)" : ""}
          className="flex-1 min-w-[120px] outline-none bg-transparent"
          disabled={tags.length >= maxTags}
        />
      </div>
      <p className="text-xs text-gray-500 mt-1">
        {tags.length}/{maxTags} тегов. Нажмите Enter или запятую для добавления.
      </p>
    </div>
  )
}
