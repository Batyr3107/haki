'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { ru } from 'date-fns/locale'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import RatingStars from '@/components/RatingStars'
import ShareButtons from '@/components/ShareButtons'
import FavoriteButton from '@/components/FavoriteButton'
import RelatedLifehacks from '@/components/RelatedLifehacks'
import Breadcrumbs from '@/components/Breadcrumbs'

interface Lifehack {
  id: string
  title: string
  description: string
  content: string
  category: string
  createdAt: string
  author: {
    id: string
    username: string
    name?: string | null
    bio?: string | null
  }
  averageRating: number
  ratingsCount: number
  commentsCount: number
  isFavorited?: boolean
  ratings: Array<{
    id: string
    value: number
    user: {
      id: string
      username: string
    }
  }>
  comments: Array<{
    id: string
    content: string
    createdAt: string
    user: {
      id: string
      username: string
      name?: string | null
    }
  }>
}

export default function LifehackPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { data: session } = useSession()
  const [lifehack, setLifehack] = useState<Lifehack | null>(null)
  const [loading, setLoading] = useState(true)
  const [commentText, setCommentText] = useState('')
  const [submittingComment, setSubmittingComment] = useState(false)
  const [userRating, setUserRating] = useState<number>(0)

  useEffect(() => {
    fetchLifehack()
  }, [params.id])

  const fetchLifehack = async () => {
    try {
      const response = await fetch(`/api/lifehacks/${params.id}`)
      if (!response.ok) {
        throw new Error('Lifehack not found')
      }
      const data = await response.json()
      setLifehack(data)

      // Find user's rating
      if (session?.user?.id) {
        const rating = data.ratings.find((r: any) => r.user.id === session.user.id)
        if (rating) {
          setUserRating(rating.value)
        }
      }
    } catch (error) {
      console.error('Error fetching lifehack:', error)
      router.push('/')
    } finally {
      setLoading(false)
    }
  }

  const handleRate = async (rating: number) => {
    if (!session) {
      router.push('/login')
      return
    }

    try {
      const response = await fetch('/api/ratings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lifehackId: params.id,
          value: rating,
        }),
      })

      if (response.ok) {
        setUserRating(rating)
        fetchLifehack() // Refresh to get updated ratings
      }
    } catch (error) {
      console.error('Error submitting rating:', error)
    }
  }

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!session) {
      router.push('/login')
      return
    }

    if (!commentText.trim()) return

    setSubmittingComment(true)

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lifehackId: params.id,
          content: commentText,
        }),
      })

      if (response.ok) {
        setCommentText('')
        fetchLifehack() // Refresh to get updated comments
      }
    } catch (error) {
      console.error('Error submitting comment:', error)
    } finally {
      setSubmittingComment(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!lifehack) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs items={[{ label: lifehack.title, href: `/lifehack/${lifehack.id}` }]} />

      <div className="max-w-4xl mx-auto">
        {/* Lifehack content */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <div className="mb-4">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
              {lifehack.category}
            </span>
          </div>

          <div className="flex justify-between items-start mb-4">
            <h1 className="text-4xl font-bold text-gray-900 flex-1">
              {lifehack.title}
            </h1>
            <div className="flex items-center gap-2">
              <FavoriteButton
                lifehackId={lifehack.id}
                initialFavorited={lifehack.isFavorited}
                size="lg"
              />
              {session?.user?.id === lifehack.author.id && (
                <div className="flex gap-2">
                  <button
                    onClick={() => router.push(`/lifehack/${lifehack.id}/edit`)}
                    className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-sm"
                  >
                    ✏️ Редактировать
                  </button>
                  <button
                    onClick={async () => {
                      if (confirm('Вы уверены, что хотите удалить этот лайфхак?')) {
                        try {
                          const response = await fetch(`/api/lifehacks/${lifehack.id}/edit`, {
                            method: 'DELETE',
                          })
                          if (response.ok) {
                            router.push('/')
                          }
                        } catch (error) {
                          console.error('Error deleting lifehack:', error)
                        }
                      }
                    }}
                    className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm"
                  >
                    🗑️ Удалить
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4 text-gray-600 mb-6">
            <Link
              href={`/profile/${lifehack.author.username}`}
              className="font-medium hover:text-blue-600"
            >
              👤 {lifehack.author.name || lifehack.author.username}
            </Link>
            <span>
              {formatDistanceToNow(new Date(lifehack.createdAt), {
                addSuffix: true,
                locale: ru,
              })}
            </span>
          </div>

          <p className="text-lg text-gray-700 mb-6">{lifehack.description}</p>

          <div className="prose prose-blue max-w-none mb-8 text-gray-800">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ node, ...props }) => <h1 className="text-3xl font-bold mt-6 mb-4" {...props} />,
                h2: ({ node, ...props }) => <h2 className="text-2xl font-bold mt-5 mb-3" {...props} />,
                h3: ({ node, ...props }) => <h3 className="text-xl font-bold mt-4 mb-2" {...props} />,
                p: ({ node, ...props }) => <p className="mb-4 leading-7" {...props} />,
                ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-4 space-y-2" {...props} />,
                ol: ({ node, ...props }) => <ol className="list-decimal list-inside mb-4 space-y-2" {...props} />,
                li: ({ node, ...props }) => <li className="ml-4" {...props} />,
                code: ({ node, className, children, ...props }) => {
                  const inline = !className
                  return inline ? (
                    <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono text-red-600" {...props}>
                      {children}
                    </code>
                  ) : (
                    <code className="block bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm font-mono" {...props}>
                      {children}
                    </code>
                  )
                },
                blockquote: ({ node, ...props }) => (
                  <blockquote className="border-l-4 border-blue-500 pl-4 italic my-4 text-gray-700" {...props} />
                ),
                a: ({ node, ...props }) => (
                  <a className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer" {...props} />
                ),
              }}
            >
              {lifehack.content}
            </ReactMarkdown>
          </div>

          {/* Rating section */}
          <div className="border-t pt-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Оценка</h3>
                <div className="flex items-center gap-4">
                  <RatingStars
                    initialRating={lifehack.averageRating}
                    readonly
                    size="lg"
                  />
                  <span className="text-gray-600">
                    {lifehack.averageRating.toFixed(1)} ({lifehack.ratingsCount}{' '}
                    {lifehack.ratingsCount === 1 ? 'оценка' : 'оценок'})
                  </span>
                </div>
              </div>

              {session && (
                <div>
                  <p className="text-sm text-gray-600 mb-2">Ваша оценка:</p>
                  <RatingStars
                    initialRating={userRating}
                    onRate={handleRate}
                    size="lg"
                  />
                </div>
              )}
            </div>

            {!session && (
              <p className="text-sm text-gray-600">
                <Link href="/login" className="text-blue-600 hover:underline">
                  Войдите
                </Link>
                , чтобы оценить этот лайфхак
              </p>
            )}
          </div>

          {/* Share section */}
          <div className="border-t pt-6 mt-6">
            <ShareButtons
              url={typeof window !== 'undefined' ? window.location.href : ''}
              title={lifehack.title}
              description={lifehack.description}
            />
          </div>
        </div>

        {/* Comments section */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6">
            Комментарии ({lifehack.commentsCount})
          </h2>

          {/* Comment form */}
          {session ? (
            <form onSubmit={handleSubmitComment} className="mb-8">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Напишите комментарий..."
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-2"
              />
              <button
                type="submit"
                disabled={submittingComment || !commentText.trim()}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submittingComment ? 'Отправка...' : 'Отправить'}
              </button>
            </form>
          ) : (
            <p className="mb-8 text-gray-600">
              <Link href="/login" className="text-blue-600 hover:underline">
                Войдите
              </Link>
              , чтобы оставить комментарий
            </p>
          )}

          {/* Comments list */}
          <div className="space-y-4">
            {lifehack.comments.map((comment) => (
              <div key={comment.id} className="border-b pb-4 last:border-b-0">
                <div className="flex items-center gap-2 mb-2">
                  <Link
                    href={`/profile/${comment.user.username}`}
                    className="font-semibold hover:text-blue-600"
                  >
                    {comment.user.name || comment.user.username}
                  </Link>
                  <span className="text-sm text-gray-500">
                    {formatDistanceToNow(new Date(comment.createdAt), {
                      addSuffix: true,
                      locale: ru,
                    })}
                  </span>
                </div>
                <p className="text-gray-700">{comment.content}</p>
              </div>
            ))}

            {lifehack.comments.length === 0 && (
              <p className="text-gray-500 text-center py-4">
                Пока нет комментариев. Будьте первым!
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Related lifehacks */}
      <div className="mt-12">
        <RelatedLifehacks
          category={lifehack.category}
          currentLifehackId={lifehack.id}
        />
      </div>
    </div>
  )
}
