// Datadog RUM (Real User Monitoring) configuration
// Install with: npm install @datadog/browser-rum

export const datadogConfig = {
  applicationId: process.env.NEXT_PUBLIC_DATADOG_APPLICATION_ID || '',
  clientToken: process.env.NEXT_PUBLIC_DATADOG_CLIENT_TOKEN || '',
  site: process.env.NEXT_PUBLIC_DATADOG_SITE || 'datadoghq.com',
  service: 'lifehacks',
  env: process.env.NODE_ENV,
  version: '1.0.0',
  sessionSampleRate: 100,
  sessionReplaySampleRate: 20,
  trackUserInteractions: true,
  trackResources: true,
  trackLongTasks: true,
  defaultPrivacyLevel: 'mask-user-input' as const,
}

export function initDatadog() {
  // Only initialize if configuration is provided
  if (!datadogConfig.applicationId || !datadogConfig.clientToken) {
    console.log('Datadog RUM not configured - skipping initialization')
    return
  }

  // This will be initialized in the DatadogRUM component
  // which uses dynamic import to avoid build-time issues
}
