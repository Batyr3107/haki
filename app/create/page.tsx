'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import MarkdownPreview from '@/components/MarkdownPreview'
import TagInput from '@/components/TagInput'

export default function CreateLifehackPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    category: 'технологии',
  })
  const [tags, setTags] = useState<string[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  const categories = [
    'технологии',
    'кухня',
    'здоровье',
    'финансы',
    'дом',
    'автомобиль',
    'другое',
  ]

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!session) {
    router.push('/login')
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/lifehacks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...formData, tags }),
      })

      if (!response.ok) {
        throw new Error('Failed to create lifehack')
      }

      const lifehack = await response.json()
      router.push(`/lifehack/${lifehack.id}`)
    } catch (error) {
      setError('Произошла ошибка при создании лайфхака')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-900">
          Создать новый лайфхак
        </h1>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4" role="alert" aria-live="polite">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Заголовок
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Краткий заголовок лайфхака"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Краткое описание
            </label>
            <textarea
              id="description"
              name="description"
              required
              value={formData.description}
              onChange={handleChange}
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Краткое описание лайфхака в 1-2 предложениях"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                Полное описание
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowPreview(false)}
                  className={`px-3 py-1 text-sm rounded ${
                    !showPreview
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Редактировать
                </button>
                <button
                  type="button"
                  onClick={() => setShowPreview(true)}
                  className={`px-3 py-1 text-sm rounded ${
                    showPreview
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Предварительный просмотр
                </button>
              </div>
            </div>
            {!showPreview ? (
              <textarea
                id="content"
                name="content"
                required
                value={formData.content}
                onChange={handleChange}
                rows={10}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Подробно опишите ваш лайфхак: как это работает, что нужно, пошаговая инструкция...&#10;&#10;Поддерживается Markdown:&#10;# Заголовок&#10;## Подзаголовок&#10;**жирный текст**&#10;*курсив*&#10;- список&#10;1. нумерованный список&#10;`код`&#10;[ссылка](url)"
              />
            ) : (
              <div className="w-full min-h-[250px] px-4 py-2 border border-gray-300 rounded-lg bg-gray-50">
                <MarkdownPreview content={formData.content} />
              </div>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Поддерживается форматирование Markdown
            </p>
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Категория
            </label>
            <select
              id="category"
              name="category"
              required
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <TagInput tags={tags} onChange={setTags} />

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Создание...' : 'Опубликовать лайфхак'}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition"
            >
              Отмена
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
