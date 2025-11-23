'use client'

import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Global Error:', error)

    // Report error to Sentry only if configured (dynamic import to reduce bundle)
    if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
      import('@sentry/nextjs')
        .then((Sentry) => {
          Sentry.captureException(error)
        })
        .catch((err) => {
          console.error('Failed to load Sentry:', err)
        })
    }
  }, [error])

  return (
    <html lang="ru">
      <body>
        <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
          <div className="text-center max-w-2xl">
            <div className="text-6xl mb-6">⚠️</div>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Критическая ошибка
            </h1>
            <p className="text-gray-600 mb-8">
              Произошла критическая ошибка приложения. Пожалуйста, попробуйте обновить страницу.
            </p>
            <button
              onClick={reset}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
            >
              Попробовать снова
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}
