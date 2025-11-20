'use client'

import { useEffect, useState } from 'react'
import LifehackCard from './LifehackCard'

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
  averageRating?: number
  ratingsCount?: number
  commentsCount?: number
  isFavorited?: boolean
}

interface RelatedLifehacksProps {
  category: string
  currentLifehackId: string
  limit?: number
}

export default function RelatedLifehacks({
  category,
  currentLifehackId,
  limit = 3,
}: RelatedLifehacksProps) {
  const [lifehacks, setLifehacks] = useState<Lifehack[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRelated()
  }, [category, currentLifehackId])

  const fetchRelated = async () => {
    try {
      const response = await fetch(`/api/lifehacks?category=${category}`)
      if (response.ok) {
        const data = await response.json()
        // Filter out current lifehack and limit results
        const filtered = data
          .filter((lh: Lifehack) => lh.id !== currentLifehackId)
          .sort(() => Math.random() - 0.5) // Random order
          .slice(0, limit)
        setLifehacks(filtered)
      }
    } catch (error) {
      console.error('Error fetching related lifehacks:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <h3 className="text-2xl font-bold text-gray-900">Похожие лайфхаки</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse bg-gray-200 h-64 rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  if (lifehacks.length === 0) {
    return null
  }

  return (
    <div className="space-y-4">
      <h3 className="text-2xl font-bold text-gray-900">Похожие лайфхаки</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {lifehacks.map((lifehack) => (
          <LifehackCard key={lifehack.id} lifehack={lifehack} />
        ))}
      </div>
    </div>
  )
}
