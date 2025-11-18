'use client'

import { useEffect, useState, useMemo } from 'react'
import LifehackCard from '@/components/LifehackCard'
import ErrorMessage from '@/components/ErrorMessage'
import { SkeletonGrid } from '@/components/SkeletonCard'

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

type SortOption = 'newest' | 'top-rated' | 'most-commented'

const ITEMS_PER_PAGE = 9

export default function Home() {
  const [lifehacks, setLifehacks] = useState<Lifehack[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<SortOption>('newest')
  const [currentPage, setCurrentPage] = useState(1)

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
      setError(null)
      const url = selectedCategory === 'all'
        ? '/api/lifehacks'
        : `/api/lifehacks?category=${selectedCategory}`

      const response = await fetch(url)

      if (!response.ok) {
        throw new Error('Не удалось загрузить лайфхаки')
      }

      const data = await response.json()
      setLifehacks(data)
      setCurrentPage(1) // Reset to first page when filters change
    } catch (error) {
      console.error('Error fetching lifehacks:', error)
      setError(error instanceof Error ? error.message : 'Произошла неизвестная ошибка')
    } finally {
      setLoading(false)
    }
  }

  // Filter and sort lifehacks
  const filteredAndSortedLifehacks = useMemo(() => {
    let result = [...lifehacks]

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (lifehack) =>
          lifehack.title.toLowerCase().includes(query) ||
          lifehack.description.toLowerCase().includes(query) ||
          lifehack.author.username.toLowerCase().includes(query) ||
          lifehack.author.name?.toLowerCase().includes(query)
      )
    }

    // Sort
    switch (sortBy) {
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      case 'top-rated':
        result.sort((a, b) => {
          // Sort by average rating, then by number of ratings
          if (b.averageRating !== a.averageRating) {
            return b.averageRating - a.averageRating
          }
          return b.ratingsCount - a.ratingsCount
        })
        break
      case 'most-commented':
        result.sort((a, b) => b.commentsCount - a.commentsCount)
        break
    }

    return result
  }, [lifehacks, searchQuery, sortBy])

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedLifehacks.length / ITEMS_PER_PAGE)
  const paginatedLifehacks = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE
    return filteredAndSortedLifehacks.slice(startIndex, endIndex)
  }, [filteredAndSortedLifehacks, currentPage])

  // Reset to page 1 when search or filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, sortBy])

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

      {/* Search and Sort */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        {/* Search bar */}
        <div className="flex-1">
          <input
            type="text"
            placeholder="🔍 Поиск лайфхаков..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Sort dropdown */}
        <div className="md:w-64">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          >
            <option value="newest">📅 Сначала новые</option>
            <option value="top-rated">⭐ Лучшие по рейтингу</option>
            <option value="most-commented">💬 Самые обсуждаемые</option>
          </select>
        </div>
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
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-100 shadow'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      {!loading && (
        <div className="mb-4 text-gray-600">
          Найдено лайфхаков: <span className="font-semibold">{filteredAndSortedLifehacks.length}</span>
          {searchQuery && (
            <span className="ml-2">
              (по запросу "{searchQuery}")
            </span>
          )}
        </div>
      )}

      {/* Lifehacks grid */}
      {loading ? (
        <SkeletonGrid count={9} />
      ) : error ? (
        <ErrorMessage message={error} onRetry={fetchLifehacks} />
      ) : paginatedLifehacks.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedLifehacks.map((lifehack) => (
              <LifehackCard key={lifehack.id} lifehack={lifehack} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-12 flex justify-center items-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                ← Назад
              </button>

              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                  // Show first page, last page, current page, and pages around current
                  if (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-4 py-2 rounded-lg transition ${
                          currentPage === page
                            ? 'bg-blue-600 text-white'
                            : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    )
                  } else if (page === currentPage - 2 || page === currentPage + 2) {
                    return (
                      <span key={page} className="px-2 py-2">
                        ...
                      </span>
                    )
                  }
                  return null
                })}
              </div>

              <button
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Вперед →
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-600 text-lg">
            {searchQuery
              ? `По запросу "${searchQuery}" ничего не найдено. Попробуйте другой запрос.`
              : 'Пока нет лайфхаков в этой категории. Будьте первым!'}
          </p>
        </div>
      )}
    </div>
  )
}
