'use client'

import { useEffect, useState } from 'react'

interface Stats {
  totalLifehacks: number
  totalUsers: number
  totalComments: number
  totalRatings: number
  totalViews: number
}

export default function PlatformStats() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading || !stats) {
    return null
  }

  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-xl p-8 text-white">
      <h2 className="text-2xl font-bold text-center mb-8">
        📊 Статистика платформы
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
        <div className="text-center">
          <div className="text-4xl font-bold mb-2">
            {stats.totalLifehacks}
          </div>
          <div className="text-blue-100 text-sm">Лайфхаков</div>
        </div>
        <div className="text-center">
          <div className="text-4xl font-bold mb-2">
            {stats.totalUsers}
          </div>
          <div className="text-blue-100 text-sm">Пользователей</div>
        </div>
        <div className="text-center">
          <div className="text-4xl font-bold mb-2">
            {stats.totalViews}
          </div>
          <div className="text-blue-100 text-sm">Просмотров</div>
        </div>
        <div className="text-center">
          <div className="text-4xl font-bold mb-2">
            {stats.totalRatings}
          </div>
          <div className="text-blue-100 text-sm">Оценок</div>
        </div>
        <div className="text-center">
          <div className="text-4xl font-bold mb-2">
            {stats.totalComments}
          </div>
          <div className="text-blue-100 text-sm">Комментариев</div>
        </div>
      </div>
    </div>
  )
}
