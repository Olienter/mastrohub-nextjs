import { createClient } from 'redis'
import { logger } from './logger'

// Redis client configuration
let redisClient: ReturnType<typeof createClient> | null = null

// Initialize Redis client
export async function getRedisClient() {
  if (!redisClient) {
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379'
    
    redisClient = createClient({
      url: redisUrl,
      socket: {
        reconnectStrategy: (retries) => Math.min(retries * 50, 500),
      },
    })

    redisClient.on('error', (err) => {
      logger.error('Redis Client Error:', err)
    })

    redisClient.on('connect', () => {
      logger.info('Redis Client Connected')
    })

    await redisClient.connect()
  }

  return redisClient
}

// Cache helper functions
export async function getCache<T>(key: string): Promise<T | null> {
  try {
    const client = await getRedisClient()
    const start = Date.now()
    
    const value = await client.get(key)
    const duration = Date.now() - start
    
    if (value) {
      logger.info('Cache hit', { key, duration })
      return JSON.parse(value) as T
    }
    
    logger.info('Cache miss', { key, duration })
    return null
  } catch (error) {
    logger.error('Cache get error:', { key, error })
    return null
  }
}

export async function setCache<T>(
  key: string, 
  value: T, 
  ttlSeconds = 3600
): Promise<void> {
  try {
    const client = await getRedisClient()
    const start = Date.now()
    
    await client.setEx(key, ttlSeconds, JSON.stringify(value))
    const duration = Date.now() - start
    
    logger.info('Cache set', { key, ttlSeconds, duration })
  } catch (error) {
    logger.error('Cache set error:', { key, error })
  }
}

export async function deleteCache(key: string): Promise<void> {
  try {
    const client = await getRedisClient()
    const start = Date.now()
    
    await client.del(key)
    const duration = Date.now() - start
    
    logger.info('Cache delete', { key, duration })
  } catch (error) {
    logger.error('Cache delete error:', { key, error })
  }
}

export async function clearCache(pattern = '*'): Promise<void> {
  try {
    const client = await getRedisClient()
    const start = Date.now()
    
    const keys = await client.keys(pattern)
    if (keys.length > 0) {
      await client.del(keys)
    }
    const duration = Date.now() - start
    
    logger.info('Cache clear', { pattern, keysCount: keys.length, duration })
  } catch (error) {
    logger.error('Cache clear error:', { pattern, error })
  }
}

// Cache decorator for functions
export function withCache<T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  keyGenerator: (...args: T) => string,
  ttlSeconds = 3600
) {
  return async (...args: T): Promise<R> => {
    const key = keyGenerator(...args)
    const cached = await getCache<R>(key)
    
    if (cached !== null) {
      return cached
    }
    
    const result = await fn(...args)
    await setCache(key, result, ttlSeconds)
    
    return result
  }
}

// Cache patterns
export const cacheKeys = {
  menu: (id: string) => `menu:${id}`,
  menuItems: (menuId: string) => `menu:${menuId}:items`,
  user: (id: string) => `user:${id}`,
  categories: () => 'categories:all',
  ingredients: () => 'ingredients:all',
  orders: (userId: string) => `orders:${userId}`,
  analytics: (type: string, period: string) => `analytics:${type}:${period}`,
}

// Cache invalidation helpers
export async function invalidateMenuCache(menuId: string): Promise<void> {
  await Promise.all([
    deleteCache(cacheKeys.menu(menuId)),
    deleteCache(cacheKeys.menuItems(menuId)),
  ])
}

export async function invalidateUserCache(userId: string): Promise<void> {
  await Promise.all([
    deleteCache(cacheKeys.user(userId)),
    deleteCache(cacheKeys.orders(userId)),
  ])
}

export async function invalidateGlobalCache(): Promise<void> {
  await Promise.all([
    deleteCache(cacheKeys.categories()),
    deleteCache(cacheKeys.ingredients()),
  ])
}
