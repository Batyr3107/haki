import * as Sentry from '@sentry/nextjs'

const SENTRY_DSN = process.env.SENTRY_DSN

if (SENTRY_DSN) {
  const isProduction = process.env.NODE_ENV === 'production'

  Sentry.init({
    dsn: SENTRY_DSN,

    // Lower sample rate in production to reduce costs
    tracesSampleRate: isProduction ? 0.1 : 1.0,

    // Debug mode only in development
    debug: !isProduction,

    // Environment
    environment: process.env.NODE_ENV,
  })
}
