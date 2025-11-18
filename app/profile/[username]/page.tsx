'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { formatDistanceToNow } from 'date-fns'
import { ru } from 'date-fns/locale'
import LifehackCard from '@/components/LifehackCard'

interface UserProfile {
  user: {
    id: string
    username: string
    name?: string | null
    bio?: string | null
    createdAt: string
  }
  stats: {
    totalLifehacks: number
    totalRatingsGiven: number
    totalRatingsReceived: number
    averageRatingReceived: number
  }
  lifehacks: Array<{
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
  }>
}

export default function ProfilePage({ params }: { params: { username: string } }) {
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProfile()
  }, [params.username])

  const fetchProfile = async () => {
    try {
      const response = await fetch(`/api/users/${params.username}`)
      if (!response.ok) {
        throw new Error('User not found')
      }
      const data = await response.json()
      setProfile(data)
    } catch (error) {
      console.error('Error fetching profile:', error)
      router.push('/')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!profile) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Profile header */}
      <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
        <div className="flex items-start gap-6">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-4xl font-bold">
            {profile.user.name?.[0]?.toUpperCase() || profile.user.username[0].toUpperCase()}
          </div>

          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {profile.user.name || profile.user.username}
            </h1>
            <p className="text-gray-600 mb-2">@{profile.user.username}</p>
            {profile.user.bio && (
              <p className="text-gray-700 mb-4">{profile.user.bio}</p>
            )}
            <p className="text-sm text-gray-500">
              Участник с{' '}
              {formatDistanceToNow(new Date(profile.user.createdAt), {
                addSuffix: true,
                locale: ru,
              })}
            </p>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">
              {profile.stats.totalLifehacks}
            </div>
            <div className="text-sm text-gray-600">Лайфхаков</div>
          </div>

          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">
              {profile.stats.averageRatingReceived.toFixed(1)}⭐
            </div>
            <div className="text-sm text-gray-600">Средняя оценка</div>
          </div>

          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">
              {profile.stats.totalRatingsReceived}
            </div>
            <div className="text-sm text-gray-600">Получено оценок</div>
          </div>

          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600">
              {profile.stats.totalRatingsGiven}
            </div>
            <div className="text-sm text-gray-600">Оценок поставлено</div>
          </div>
        </div>
      </div>

      {/* User's lifehacks */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Лайфхаки от {profile.user.name || profile.user.username}
        </h2>

        {profile.lifehacks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {profile.lifehacks.map((lifehack) => (
              <LifehackCard key={lifehack.id} lifehack={lifehack} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-600 text-lg">
              Пользователь пока не создал ни одного лайфхака
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
