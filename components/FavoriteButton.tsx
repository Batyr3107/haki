'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

interface FavoriteButtonProps {
  lifehackId: string
  initialFavorited?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export default function FavoriteButton({
  lifehackId,
  initialFavorited = false,
  size = 'md'
}: FavoriteButtonProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const [favorited, setFavorited] = useState(initialFavorited)
  const [loading, setLoading] = useState(false)

  const sizeClasses = {
    sm: 'p-1 text-lg',
    md: 'p-2 text-xl',
    lg: 'p-3 text-2xl'
  }

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!session) {
      router.push('/login')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ lifehackId }),
      })

      if (response.ok) {
        const data = await response.json()
        setFavorited(data.favorited)
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!session) {
    return null
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`${sizeClasses[size]} rounded-full transition-all hover:scale-110 ${
        favorited
          ? 'text-yellow-500 hover:text-yellow-600'
          : 'text-gray-400 hover:text-yellow-500'
      } disabled:opacity-50`}
      aria-label={favorited ? 'Убрать из избранного' : 'Добавить в избранное'}
      title={favorited ? 'Убрать из избранного' : 'Добавить в избранное'}
    >
      {favorited ? '⭐' : '☆'}
    </button>
  )
}
