import { z } from 'zod'

// Environment schema
const envSchema = z.object({
  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  
  // Redis
  REDIS_URL: z.string().url().optional(),
  
  // Site
  NEXT_PUBLIC_SITE_URL: z.string().url().optional(),
  
  // AI Providers (optional)
  AI_PROVIDER: z.enum(['openai', 'anthropic', 'ollama']).optional(),
  OPENAI_API_KEY: z.string().optional(),
  ANTHROPIC_API_KEY: z.string().optional(),
  OLLAMA_BASE_URL: z.string().url().optional(),
  
  // Analytics (optional)
  NEXT_PUBLIC_GA_ID: z.string().optional(),
  
  // NextAuth (optional)
  NEXTAUTH_URL: z.string().url().optional(),
  NEXTAUTH_SECRET: z.string().optional(),
  
  // Monitoring (optional)
  PROMETHEUS_ENABLED: z.string().transform(val => val === 'true').optional(),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).optional(),
})

// Validate environment variables
export function validateEnv() {
  try {
    const env = envSchema.parse(process.env)
    return { success: true, env }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors.map(err => err.path.join('.'))
      console.error('❌ Missing or invalid environment variables:', missingVars)
      return { success: false, errors: missingVars }
    }
    return { success: false, errors: ['Unknown validation error'] }
  }
}

// Get validated environment variables
export function getEnv() {
  const result = validateEnv()
  if (!result.success) {
    throw new Error(`Environment validation failed: ${result.errors?.join(', ')}`)
  }
  return result.env
}

// Check if we're in development
export const isDev = process.env.NODE_ENV === 'development'

// Check if we're in production
export const isProd = process.env.NODE_ENV === 'production'

// Check if we're in test environment
export const isTest = process.env.NODE_ENV === 'test'

// Get log level
export const getLogLevel = () => {
  return process.env.LOG_LEVEL || (isDev ? 'debug' : 'info')
}

// Get Redis URL with fallback
export const getRedisUrl = () => {
  return process.env.REDIS_URL || 'redis://localhost:6379'
}

// Get site URL with fallback
export const getSiteUrl = () => {
  return process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
}

// Check if AI is enabled
export const isAiEnabled = () => {
  return !!process.env.AI_PROVIDER && !!process.env.OPENAI_API_KEY
}

// Check if monitoring is enabled
export const isMonitoringEnabled = () => {
  return process.env.PROMETHEUS_ENABLED === 'true'
}
