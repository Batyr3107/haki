'use client'

import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { ru } from 'date-fns/locale'

interface LifehackCardProps {
  lifehack: {
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
  }
}

export default function LifehackCard({ lifehack }: LifehackCardProps) {
  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'технологии': 'bg-blue-100 text-blue-800',
      'кухня': 'bg-green-100 text-green-800',
      'здоровье': 'bg-red-100 text-red-800',
      'финансы': 'bg-yellow-100 text-yellow-800',
      'дом': 'bg-purple-100 text-purple-800',
      'автомобиль': 'bg-gray-100 text-gray-800',
      'другое': 'bg-pink-100 text-pink-800',
    }
    return colors[category.toLowerCase()] || colors['другое']
  }

  return (
    <Link href={`/lifehack/${lifehack.id}`}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow p-6 cursor-pointer border border-gray-200">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-bold text-gray-900 flex-1">{lifehack.title}</h3>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(lifehack.category)}`}>
            {lifehack.category}
          </span>
        </div>

        <p className="text-gray-600 mb-4 line-clamp-2">{lifehack.description}</p>

        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-4">
            <span className="font-medium">👤 {lifehack.author.name || lifehack.author.username}</span>
            <span>{formatDistanceToNow(new Date(lifehack.createdAt), { addSuffix: true, locale: ru })}</span>
          </div>

          <div className="flex items-center gap-3">
            {lifehack.averageRating !== undefined && lifehack.ratingsCount !== undefined && (
              <span className="flex items-center gap-1">
                ⭐ {lifehack.averageRating.toFixed(1)} ({lifehack.ratingsCount})
              </span>
            )}
            {lifehack.commentsCount !== undefined && (
              <span>💬 {lifehack.commentsCount}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
