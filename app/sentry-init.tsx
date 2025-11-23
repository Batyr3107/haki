'use client'

import { useEffect } from 'react'

/**
 * Initialize Sentry on client-side
 * This component should be included once in the app layout
 */
export default function SentryInit() {
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
      import('../lib/sentry')
        .then(({ initSentryClient }) => initSentryClient())
        .catch((err) => {
          console.error('Failed to initialize Sentry:', err)
        })
    }
  }, [])

  return null
}
