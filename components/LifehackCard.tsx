'use client'

import { memo } from 'react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { ru } from 'date-fns/locale'
import FavoriteButton from './FavoriteButton'

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
    views?: number
    isFavorited?: boolean
    tags?: Array<{ tag: { name: string; slug: string } }>
  }
  showFavorite?: boolean
}

function LifehackCard({ lifehack, showFavorite = true }: LifehackCardProps) {
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
    <div className="relative">
      <Link href={`/lifehack/${lifehack.id}`}>
        <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow p-6 cursor-pointer border border-gray-200">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-xl font-bold text-gray-900 flex-1 pr-2">{lifehack.title}</h3>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(lifehack.category)}`}>
              {lifehack.category}
            </span>
          </div>

          <p className="text-gray-600 mb-3 line-clamp-2">{lifehack.description}</p>

          {lifehack.tags && lifehack.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3" onClick={(e) => e.stopPropagation()}>
              {lifehack.tags.slice(0, 3).map((tagRelation) => (
                <Link
                  key={tagRelation.tag.slug}
                  href={`/tags?tag=${tagRelation.tag.slug}`}
                  className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded hover:bg-blue-100 hover:text-blue-700 transition"
                  onClick={(e) => e.stopPropagation()}
                >
                  #{tagRelation.tag.name}
                </Link>
              ))}
              {lifehack.tags.length > 3 && (
                <span className="text-xs px-2 py-1 text-gray-500">
                  +{lifehack.tags.length - 3}
                </span>
              )}
            </div>
          )}

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
              {lifehack.views !== undefined && (
                <span>👁️ {lifehack.views}</span>
              )}
            </div>
          </div>
        </div>
      </Link>

      {showFavorite && (
        <div className="absolute top-2 right-2 z-10">
          <FavoriteButton
            lifehackId={lifehack.id}
            initialFavorited={lifehack.isFavorited}
            size="sm"
          />
        </div>
      )}
    </div>
  )
}

export default memo(LifehackCard)
