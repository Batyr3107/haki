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

    // Report error to Sentry using dynamic import helper
    import('../lib/sentry')
      .then(({ captureException }) => captureException(error))
      .catch((err) => {
        console.error('Failed to capture exception:', err)
      })
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
