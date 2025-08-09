import { createClient } from 'redis'
import { logger } from './logger'
import { getRedisUrl } from './env'

// Rate limit configuration
interface RateLimitConfig {
  windowMs: number // Time window in milliseconds
  maxRequests: number // Maximum requests per window
  keyPrefix?: string // Redis key prefix
  skipSuccessfulRequests?: boolean // Skip rate limiting for successful requests
  skipFailedRequests?: boolean // Skip rate limiting for failed requests
}

// Rate limit result
interface RateLimitResult {
  success: boolean
  limit: number
  remaining: number
  reset: number
  retryAfter?: number
}

// Default rate limit configurations
export const RATE_LIMITS = {
  // API endpoints
  api: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 100,
    keyPrefix: 'rate_limit:api',
  },
  
  // Authentication endpoints
  auth: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5,
    keyPrefix: 'rate_limit:auth',
  },
  
  // File upload endpoints
  upload: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 10,
    keyPrefix: 'rate_limit:upload',
  },
  
  // General endpoints
  default: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 60,
    keyPrefix: 'rate_limit:default',
  },
} as const

// Redis client
let redisClient: ReturnType<typeof createClient> | null = null

// Initialize Redis client
async function getRedisClient() {
  if (!redisClient) {
    try {
      redisClient = createClient({
        url: getRedisUrl(),
      })
      
      await redisClient.connect()
      logger.info('Redis client connected for rate limiting')
    } catch (error) {
      logger.error('Failed to connect to Redis for rate limiting:', error)
      return null
    }
  }
  
  return redisClient
}

// Check rate limit
export async function checkRateLimit(
  identifier: string,
  config: RateLimitConfig = RATE_LIMITS.default
): Promise<RateLimitResult> {
  const client = await getRedisClient()
  
  if (!client) {
    // If Redis is not available, allow the request
    logger.warn('Redis not available, skipping rate limiting')
    return {
      success: true,
      limit: config.maxRequests,
      remaining: config.maxRequests - 1,
      reset: Date.now() + config.windowMs,
    }
  }

  try {
    const key = `${config.keyPrefix || 'rate_limit'}:${identifier}`
    const now = Date.now()
    const windowStart = now - config.windowMs

    // Get current requests in window
    const requests = await client.zRangeByScore(key, windowStart, '+inf')
    const currentCount = requests.length

    if (currentCount >= config.maxRequests) {
      // Rate limit exceeded
      const oldestRequest = await client.zRange(key, 0, 0, { WITHSCORES: true })
      const resetTime = oldestRequest.length > 0 ? parseInt(oldestRequest[0].score) + config.windowMs : now + config.windowMs
      
      return {
        success: false,
        limit: config.maxRequests,
        remaining: 0,
        reset: resetTime,
        retryAfter: Math.ceil((resetTime - now) / 1000),
      }
    }

    // Add current request to window
    await client.zAdd(key, { score: now, value: now.toString() })
    
    // Set expiration for the key
    await client.expire(key, Math.ceil(config.windowMs / 1000))

    return {
      success: true,
      limit: config.maxRequests,
      remaining: config.maxRequests - currentCount - 1,
      reset: now + config.windowMs,
    }
  } catch (error) {
    logger.error('Rate limit check failed:', error)
    // If rate limiting fails, allow the request
    return {
      success: true,
      limit: config.maxRequests,
      remaining: config.maxRequests - 1,
      reset: Date.now() + config.windowMs,
    }
  }
}

// Get rate limit headers
export function getRateLimitHeaders(result: RateLimitResult): Record<string, string> {
  const headers: Record<string, string> = {
    'X-RateLimit-Limit': result.limit.toString(),
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': result.reset.toString(),
  }

  if (result.retryAfter) {
    headers['Retry-After'] = result.retryAfter.toString()
  }

  return headers
}

// Rate limit middleware for Next.js API routes
export function withRateLimit(
  config: RateLimitConfig = RATE_LIMITS.default
) {
  return function (handler: Function) {
    return async function (request: Request, ...args: any[]) {
      // Get identifier (IP address or user ID)
      const identifier = getIdentifier(request)
      
      // Check rate limit
      const rateLimitResult = await checkRateLimit(identifier, config)
      
      if (!rateLimitResult.success) {
        return new Response(
          JSON.stringify({
            error: 'Too many requests',
            retryAfter: rateLimitResult.retryAfter,
          }),
          {
            status: 429,
            headers: {
              'Content-Type': 'application/json',
              ...getRateLimitHeaders(rateLimitResult),
            },
          }
        )
      }

      // Add rate limit headers to response
      const response = await handler(request, ...args)
      
      if (response instanceof Response) {
        Object.entries(getRateLimitHeaders(rateLimitResult)).forEach(([key, value]) => {
          response.headers.set(key, value)
        })
      }

      return response
    }
  }
}

// Get identifier for rate limiting
function getIdentifier(request: Request): string {
  // Try to get IP address
  const forwarded = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  const ip = forwarded?.split(',')[0] || realIp || 'unknown'
  
  // If we have user authentication, use user ID
  // This would need to be implemented based on your auth system
  const userId = request.headers.get('x-user-id')
  
  return userId || ip
}

// Clean up old rate limit records
export async function cleanupRateLimits(): Promise<void> {
  const client = await getRedisClient()
  
  if (!client) {
    return
  }

  try {
    const now = Date.now()
    const patterns = Object.values(RATE_LIMITS).map(config => `${config.keyPrefix}:*`)
    
    for (const pattern of patterns) {
      const keys = await client.keys(pattern)
      
      for (const key of keys) {
        const windowMs = Object.values(RATE_LIMITS).find(c => c.keyPrefix === key.split(':')[0])?.windowMs || 60000
        const cutoff = now - windowMs
        
        // Remove old entries
        await client.zRemRangeByScore(key, '-inf', cutoff)
        
        // If key is empty, delete it
        const count = await client.zCard(key)
        if (count === 0) {
          await client.del(key)
        }
      }
    }
    
    logger.info('Rate limit cleanup completed')
  } catch (error) {
    logger.error('Rate limit cleanup failed:', error)
  }
}

// Schedule cleanup
setInterval(cleanupRateLimits, 5 * 60 * 1000) // Every 5 minutes

// Close Redis client on shutdown
process.on('SIGINT', async () => {
  if (redisClient) {
    await redisClient.quit()
  }
  process.exit(0)
})

process.on('SIGTERM', async () => {
  if (redisClient) {
    await redisClient.quit()
  }
  process.exit(0)
})
