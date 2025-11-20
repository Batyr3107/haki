'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import LifehackCard from '@/components/LifehackCard'
import { SkeletonGrid } from '@/components/SkeletonCard'
import ErrorMessage from '@/components/ErrorMessage'

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
  views?: number
  tags?: Array<{ tag: { name: string; slug: string } }>
  isFavorited?: boolean
}

export default function FavoritesPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [favorites, setFavorites] = useState<Lifehack[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
      return
    }

    if (status === 'authenticated') {
      fetchFavorites()
    }
  }, [status, router])

  const fetchFavorites = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/favorites')

      if (!response.ok) {
        throw new Error('Failed to fetch favorites')
      }

      const data = await response.json()
      setFavorites(data)
    } catch (error) {
      console.error('Error fetching favorites:', error)
      setError('Не удалось загрузить избранное')
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          ⭐ Избранное
        </h1>
        <SkeletonGrid count={6} />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          ⭐ Избранное
        </h1>
        <ErrorMessage message={error} onRetry={fetchFavorites} />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          ⭐ Избранное
        </h1>
        <p className="text-gray-600 text-lg">
          Ваши сохраненные лайфхаки
        </p>
      </div>

      {favorites.length > 0 ? (
        <>
          <div className="mb-4 text-gray-600">
            Всего сохранено: <span className="font-semibold">{favorites.length}</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((lifehack) => (
              <LifehackCard key={lifehack.id} lifehack={lifehack} />
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <div className="text-6xl mb-4">📌</div>
          <p className="text-gray-600 text-lg mb-4">
            У вас пока нет сохраненных лайфхаков
          </p>
          <button
            onClick={() => router.push('/')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
          >
            Посмотреть лайфхаки
          </button>
        </div>
      )}
    </div>
  )
}
