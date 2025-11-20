'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import LifehackCard from '@/components/LifehackCard'
import Breadcrumbs from '@/components/Breadcrumbs'

interface Tag {
  id: string
  name: string
  slug: string
  _count: {
    lifehacks: number
  }
}

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

export default function TagsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const selectedTag = searchParams.get('tag')

  const [tags, setTags] = useState<Tag[]>([])
  const [lifehacks, setLifehacks] = useState<Lifehack[]>([])
  const [loading, setLoading] = useState(true)
  const [lifehacksLoading, setLifehacksLoading] = useState(false)

  useEffect(() => {
    fetchTags()
  }, [])

  useEffect(() => {
    if (selectedTag) {
      fetchLifehacksByTag(selectedTag)
    } else {
      setLifehacks([])
    }
  }, [selectedTag])

  const fetchTags = async () => {
    try {
      const response = await fetch('/api/tags')
      if (response.ok) {
        const data = await response.json()
        setTags(data)
      }
    } catch (error) {
      console.error('Error fetching tags:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchLifehacksByTag = async (tagSlug: string) => {
    setLifehacksLoading(true)
    try {
      const response = await fetch(`/api/lifehacks?tag=${tagSlug}`)
      if (response.ok) {
        const data = await response.json()
        setLifehacks(data)
      }
    } catch (error) {
      console.error('Error fetching lifehacks:', error)
    } finally {
      setLifehacksLoading(false)
    }
  }

  const handleTagClick = (slug: string) => {
    router.push(`/tags?tag=${slug}`)
  }

  const getTagColor = (index: number) => {
    const colors = [
      'bg-blue-100 text-blue-800 hover:bg-blue-200',
      'bg-green-100 text-green-800 hover:bg-green-200',
      'bg-purple-100 text-purple-800 hover:bg-purple-200',
      'bg-pink-100 text-pink-800 hover:bg-pink-200',
      'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
      'bg-indigo-100 text-indigo-800 hover:bg-indigo-200',
      'bg-red-100 text-red-800 hover:bg-red-200',
      'bg-orange-100 text-orange-800 hover:bg-orange-200',
    ]
    return colors[index % colors.length]
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs items={[{ label: 'Теги', href: '/tags' }]} />

      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          🏷️ Поиск по тегам
        </h1>
        <p className="text-gray-600 text-lg">
          Находите лайфхаки по интересующим вас темам
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          {/* Tags Cloud */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Все теги</h2>
            {tags.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {tags.map((tag, index) => (
                  <button
                    key={tag.id}
                    onClick={() => handleTagClick(tag.slug)}
                    className={`px-4 py-2 rounded-lg font-medium transition ${
                      selectedTag === tag.slug
                        ? 'bg-blue-600 text-white shadow-md'
                        : getTagColor(index)
                    }`}
                  >
                    #{tag.name}
                    <span className="ml-2 text-sm opacity-75">
                      ({tag._count.lifehacks})
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">
                Пока нет доступных тегов
              </p>
            )}
          </div>

          {/* Lifehacks by selected tag */}
          {selectedTag && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Лайфхаки с тегом &quot;{tags.find((t) => t.slug === selectedTag)?.name}&quot;
                </h2>
                <Link
                  href="/tags"
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Сбросить фильтр
                </Link>
              </div>

              {lifehacksLoading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              ) : lifehacks.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {lifehacks.map((lifehack) => (
                    <LifehackCard key={lifehack.id} lifehack={lifehack} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white rounded-lg shadow">
                  <p className="text-gray-600 text-lg">
                    Нет лайфхаков с этим тегом
                  </p>
                </div>
              )}
            </div>
          )}

          {!selectedTag && (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <p className="text-gray-600 text-lg">
                Выберите тег, чтобы увидеть лайфхаки
              </p>
            </div>
          )}
        </>
      )}
    </div>
  )
}
