export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Initialize Sentry for server-side (dynamic import)
    const { initSentryServer } = await import('./lib/sentry')
    await initSentryServer()
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    // Edge runtime - initialize Sentry if needed
    const dsn = process.env.SENTRY_DSN
    if (dsn) {
      const Sentry = await import('@sentry/nextjs')
      const isProduction = process.env.NODE_ENV === 'production'

      Sentry.init({
        dsn,
        tracesSampleRate: isProduction ? 0.1 : 1.0,
        debug: !isProduction,
        environment: process.env.NODE_ENV,
      })
    }
  }
}

export const onRequestError = async (
  err: Error,
  request: {
    path: string
  },
) => {
  // Use our dynamic Sentry helper
  const { captureException } = await import('./lib/sentry')
  await captureException(err)
}
