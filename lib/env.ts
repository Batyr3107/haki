/**
 * Environment variables validation
 * This runs at build time and runtime to ensure all required env vars are set
 */

const requiredEnvVars = [
  'DATABASE_URL',
  'NEXTAUTH_SECRET',
  'NEXTAUTH_URL',
] as const

const optionalEnvVars = [
  'NODE_ENV',
] as const

/**
 * Validate required environment variables
 */
export function validateEnv() {
  const missing: string[] = []

  requiredEnvVars.forEach((envVar) => {
    if (!process.env[envVar]) {
      missing.push(envVar)
    }
  })

  if (missing.length > 0) {
    throw new Error(
      `❌ Missing required environment variables:\n${missing.map(v => `  - ${v}`).join('\n')}\n\nPlease check your .env file.`
    )
  }

  // Security warnings for production
  if (process.env.NODE_ENV === 'production') {
    if (process.env.NEXTAUTH_SECRET === 'your-secret-key-change-in-production') {
      console.error('⚠️  SECURITY WARNING: Change NEXTAUTH_SECRET in production!')
      console.error('   Generate a secure secret with: openssl rand -base64 32')
    }

    if (process.env.DATABASE_URL?.includes('file:')) {
      console.warn('⚠️  WARNING: Using SQLite in production. Consider PostgreSQL or MySQL for better performance.')
    }
  }

  // Log environment info
  console.log('✅ Environment variables validated')
  console.log(`   NODE_ENV: ${process.env.NODE_ENV || 'development'}`)
  console.log(`   Database: ${process.env.DATABASE_URL?.split('://')[0] || 'unknown'}`)
}

/**
 * Get environment variable with type safety
 */
export function getEnv(key: string, defaultValue?: string): string {
  const value = process.env[key]

  if (!value) {
    if (defaultValue !== undefined) {
      return defaultValue
    }
    throw new Error(`Environment variable ${key} is not set`)
  }

  return value
}

/**
 * Check if running in production
 */
export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production'
}

/**
 * Check if running in development
 */
export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development'
}

// Validate on module load
if (typeof window === 'undefined') {
  // Only validate on server side
  validateEnv()
}
