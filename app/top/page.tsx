'use client'

import { useEffect, useState } from 'react'
import LifehackCard from '@/components/LifehackCard'
import Loading from '@/components/Loading'
import Breadcrumbs from '@/components/Breadcrumbs'

interface Lifehack {
  id: string
  title: string
  description: string
  category: string
  createdAt: string
  views: number
  author: {
    username: string
    name?: string | null
  }
  averageRating?: number
  ratingsCount?: number
  commentsCount?: number
  tags?: Array<{ tag: { name: string; slug: string } }>
  isFavorited?: boolean
}

export default function TopPage() {
  const [lifehacks, setLifehacks] = useState<Lifehack[]>([])
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState<'week' | 'month' | 'all'>('all')

  useEffect(() => {
    fetchTop()
  }, [period])

  const fetchTop = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/lifehacks')
      if (response.ok) {
        const data: Lifehack[] = await response.json()

        // Filter by period
        const now = new Date()
        let filtered = data

        if (period === 'week') {
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          filtered = data.filter((lh) => new Date(lh.createdAt) >= weekAgo)
        } else if (period === 'month') {
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
          filtered = data.filter((lh) => new Date(lh.createdAt) >= monthAgo)
        }

        // Sort by rating * ratings count (popularity score)
        const sorted = filtered.sort((a, b) => {
          const scoreA = (a.averageRating || 0) * (a.ratingsCount || 0)
          const scoreB = (b.averageRating || 0) * (b.ratingsCount || 0)
          return scoreB - scoreA
        })

        setLifehacks(sorted.slice(0, 20)) // Top 20
      }
    } catch (error) {
      console.error('Error fetching top lifehacks:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs items={[{ label: 'Топ лайфхаки', href: '/top' }]} />

      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">🏆 Топ лайфхаки</h1>
        <p className="text-gray-600">
          Самые популярные и высоко оцененные лайфхаки сообщества
        </p>
      </div>

      {/* Period selector */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setPeriod('week')}
          className={`px-4 py-2 rounded-lg font-semibold transition ${
            period === 'week'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          За неделю
        </button>
        <button
          onClick={() => setPeriod('month')}
          className={`px-4 py-2 rounded-lg font-semibold transition ${
            period === 'month'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          За месяц
        </button>
        <button
          onClick={() => setPeriod('all')}
          className={`px-4 py-2 rounded-lg font-semibold transition ${
            period === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          За все время
        </button>
      </div>

      {loading ? (
        <Loading />
      ) : lifehacks.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">
            Пока нет лайфхаков за выбранный период
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lifehacks.map((lifehack, index) => (
            <div key={lifehack.id} className="relative">
              {index < 3 && (
                <div className="absolute -top-2 -left-2 z-10 w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-white font-bold shadow-lg">
                  {index + 1}
                </div>
              )}
              <LifehackCard lifehack={lifehack} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
