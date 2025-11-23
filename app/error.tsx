'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import * as Sentry from '@sentry/nextjs'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Error:', error)
    // Report error to Sentry
    Sentry.captureException(error)
  }, [error])

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-2xl">
        <div className="text-6xl mb-6">⚠️</div>
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Что-то пошло не так
        </h1>
        <p className="text-gray-600 mb-2">
          Произошла непредвиденная ошибка при загрузке страницы.
        </p>
        {error.message && (
          <p className="text-sm text-gray-500 mb-8 font-mono bg-gray-100 p-3 rounded">
            {error.message}
          </p>
        )}
        <div className="flex gap-4 justify-center">
          <button
            onClick={reset}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
          >
            Попробовать снова
          </button>
          <Link
            href="/"
            className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition font-semibold"
          >
            На главную
          </Link>
        </div>
      </div>
    </div>
  )
}
