import { Pool, PoolClient } from 'pg'
import { logger } from './logger'
import { getRedisUrl } from './env'

// Database connection pool
let pool: Pool | null = null

// Initialize database pool
export function initDatabase() {
  if (pool) {
    return pool
  }

  const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL

  if (!connectionString) {
    logger.warn('No database connection string provided, using Supabase only')
    return null
  }

  try {
    pool = new Pool({
      connectionString,
      max: 20, // Maximum number of clients in the pool
      idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
      connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    })

    // Test the connection
    pool.on('connect', (client) => {
      logger.info('Database client connected')
    })

    pool.on('error', (err, client) => {
      logger.error('Unexpected error on idle client', err)
    })

    logger.info('Database pool initialized')
    return pool
  } catch (error) {
    logger.error('Failed to initialize database pool:', error)
    return null
  }
}

// Get database client
export async function getDbClient(): Promise<PoolClient | null> {
  if (!pool) {
    pool = initDatabase()
  }

  if (!pool) {
    return null
  }

  try {
    const client = await pool.connect()
    return client
  } catch (error) {
    logger.error('Failed to get database client:', error)
    return null
  }
}

// Execute query with connection management
export async function executeQuery<T = any>(
  query: string,
  params?: any[]
): Promise<T[]> {
  const client = await getDbClient()
  
  if (!client) {
    throw new Error('Database connection not available')
  }

  try {
    const result = await client.query(query, params)
    return result.rows
  } catch (error) {
    logger.error('Database query error:', { query, params, error })
    throw error
  } finally {
    client.release()
  }
}

// Execute transaction
export async function executeTransaction<T>(
  callback: (client: PoolClient) => Promise<T>
): Promise<T> {
  const client = await getDbClient()
  
  if (!client) {
    throw new Error('Database connection not available')
  }

  try {
    await client.query('BEGIN')
    const result = await callback(client)
    await client.query('COMMIT')
    return result
  } catch (error) {
    await client.query('ROLLBACK')
    logger.error('Transaction error:', error)
    throw error
  } finally {
    client.release()
  }
}

// Health check for database
export async function checkDatabaseHealth(): Promise<{
  status: 'healthy' | 'unhealthy'
  details?: Record<string, any>
}> {
  try {
    const client = await getDbClient()
    
    if (!client) {
      return {
        status: 'unhealthy',
        details: { error: 'Database connection not available' }
      }
    }

    const result = await client.query('SELECT NOW() as current_time, version() as db_version')
    client.release()

    return {
      status: 'healthy',
      details: {
        currentTime: result.rows[0].current_time,
        version: result.rows[0].db_version,
      }
    }
  } catch (error) {
    logger.error('Database health check failed:', error)
    return {
      status: 'unhealthy',
      details: { error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }
}

// Close database pool
export async function closeDatabase() {
  if (pool) {
    await pool.end()
    pool = null
    logger.info('Database pool closed')
  }
}

// Database utilities
export const db = {
  query: executeQuery,
  transaction: executeTransaction,
  health: checkDatabaseHealth,
  close: closeDatabase,
}

// Graceful shutdown
process.on('SIGINT', async () => {
  logger.info('Shutting down database connections...')
  await closeDatabase()
  process.exit(0)
})

process.on('SIGTERM', async () => {
  logger.info('Shutting down database connections...')
  await closeDatabase()
  process.exit(0)
})
