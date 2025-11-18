'use client'

import { useEffect, useState } from 'react'
import LifehackCard from '@/components/LifehackCard'

interface Lifehack {
  id: string
  title: string
  description: string
  category: string
  createdAt: string
  author: {
    username: string
    name?: string | null
  }
  averageRating: number
  ratingsCount: number
  commentsCount: number
}

export default function Home() {
  const [lifehacks, setLifehacks] = useState<Lifehack[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const categories = [
    { value: 'all', label: 'Все' },
    { value: 'технологии', label: 'Технологии' },
    { value: 'кухня', label: 'Кухня' },
    { value: 'здоровье', label: 'Здоровье' },
    { value: 'финансы', label: 'Финансы' },
    { value: 'дом', label: 'Дом' },
    { value: 'автомобиль', label: 'Автомобиль' },
    { value: 'другое', label: 'Другое' },
  ]

  useEffect(() => {
    fetchLifehacks()
  }, [selectedCategory])

  const fetchLifehacks = async () => {
    try {
      setLoading(true)
      const url = selectedCategory === 'all'
        ? '/api/lifehacks'
        : `/api/lifehacks?category=${selectedCategory}`

      const response = await fetch(url)
      const data = await response.json()
      setLifehacks(data)
    } catch (error) {
      console.error('Error fetching lifehacks:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          💡 Полезные лайфхаки для парней
        </h1>
        <p className="text-gray-600 text-lg">
          Делитесь полезными советами и оценивайте лучшие идеи
        </p>
      </div>

      {/* Category filter */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.value}
              onClick={() => setSelectedCategory(category.value)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                selectedCategory === category.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {/* Lifehacks grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Загрузка лайфхаков...</p>
        </div>
      ) : lifehacks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lifehacks.map((lifehack) => (
            <LifehackCard key={lifehack.id} lifehack={lifehack} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-600 text-lg">
            Пока нет лайфхаков в этой категории. Будьте первым!
          </p>
        </div>
      )}
    </div>
  )
}
