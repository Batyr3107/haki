'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

interface FollowButtonProps {
  userId: string
  initialFollowing?: boolean
  showCount?: boolean
  followersCount?: number
}

export default function FollowButton({
  userId,
  initialFollowing = false,
  showCount = false,
  followersCount = 0,
}: FollowButtonProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const [following, setFollowing] = useState(initialFollowing)
  const [loading, setLoading] = useState(false)
  const [count, setCount] = useState(followersCount)

  useEffect(() => {
    if (session?.user?.id && session.user.id !== userId) {
      checkFollowStatus()
    }
  }, [session, userId])

  const checkFollowStatus = async () => {
    try {
      const response = await fetch(`/api/follow?userId=${userId}`)
      if (response.ok) {
        const data = await response.json()
        setFollowing(data.following)
      }
    } catch (error) {
      console.error('Error checking follow status:', error)
    }
  }

  const handleToggle = async () => {
    if (!session) {
      router.push('/login')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/follow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      })

      if (response.ok) {
        const data = await response.json()
        setFollowing(data.following)
        setCount(prev => data.following ? prev + 1 : prev - 1)
      }
    } catch (error) {
      console.error('Error toggling follow:', error)
    } finally {
      setLoading(false)
    }
  }

  // Don't show button for own profile
  if (session?.user?.id === userId) {
    return null
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleToggle}
        disabled={loading}
        className={`px-4 py-2 rounded-lg font-semibold transition disabled:opacity-50 ${
          following
            ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}
        aria-label={following ? 'Отписаться от пользователя' : 'Подписаться на пользователя'}
      >
        {loading ? '...' : following ? 'Отписаться' : 'Подписаться'}
      </button>
      {showCount && (
        <span className="text-sm text-gray-600">
          {count} {count === 1 ? 'подписчик' : 'подписчиков'}
        </span>
      )}
    </div>
  )
}
