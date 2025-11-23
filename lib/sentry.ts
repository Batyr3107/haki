/**
 * Sentry configuration and initialization
 * This file provides dynamic Sentry initialization to avoid bundle bloat
 */

export interface SentryConfig {
  dsn: string
  environment: string
  tracesSampleRate: number
  debug: boolean
  replaysOnErrorSampleRate?: number
  replaysSessionSampleRate?: number
}

/**
 * Initialize Sentry for client-side
 * Only loads Sentry if DSN is configured
 */
export async function initSentryClient() {
  const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN

  if (!dsn) {
    return null
  }

  const isProduction = process.env.NODE_ENV === 'production'

  try {
    const Sentry = await import('@sentry/nextjs')

    Sentry.init({
      dsn,
      tracesSampleRate: isProduction ? 0.1 : 1.0,
      debug: !isProduction,
      replaysOnErrorSampleRate: 1.0,
      replaysSessionSampleRate: isProduction ? 0.1 : 1.0,
      environment: process.env.NODE_ENV,

      integrations: [
        Sentry.replayIntegration({
          maskAllText: true,
          blockAllMedia: true,
        }),
      ],

      // Filter out common browser extension errors
      ignoreErrors: [
        'top.GLOBALS',
        'originalCreateNotification',
        'canvas.contentDocument',
        'MyApp_RemoveAllHighlights',
        "Can't find variable: ZiteReader",
        'jigsaw is not defined',
        'ComboSearch is not defined',
        'atomicFindClose',
        'fb_xd_fragment',
        'bmi_SafeAddOnload',
        'EBCallBackMessageReceived',
        'conduitPage',
        'Script error.',
      ],

      denyUrls: [
        /extensions\//i,
        /^chrome:\/\//i,
        /127\.0\.0\.1:4001\/isrunning/i,
        /webappstoolbarba\.texthelp\.com\//i,
        /metrics\.itunes\.apple\.com\.edgesuite\.net\//i,
      ],
    })

    return Sentry
  } catch (error) {
    console.error('Failed to initialize Sentry:', error)
    return null
  }
}

/**
 * Initialize Sentry for server-side
 * Only loads Sentry if DSN is configured
 */
export async function initSentryServer() {
  const dsn = process.env.SENTRY_DSN

  if (!dsn) {
    return null
  }

  const isProduction = process.env.NODE_ENV === 'production'

  try {
    const Sentry = await import('@sentry/nextjs')

    Sentry.init({
      dsn,
      tracesSampleRate: isProduction ? 0.1 : 1.0,
      debug: !isProduction,
      environment: process.env.NODE_ENV,
    })

    return Sentry
  } catch (error) {
    console.error('Failed to initialize Sentry:', error)
    return null
  }
}

/**
 * Capture exception with dynamic Sentry import
 */
export async function captureException(error: Error) {
  const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN || process.env.SENTRY_DSN

  if (!dsn) {
    return
  }

  try {
    const Sentry = await import('@sentry/nextjs')
    Sentry.captureException(error)
  } catch (err) {
    console.error('Failed to capture exception:', err)
  }
}
