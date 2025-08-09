import pino from 'pino'

// Logger configuration
const logLevel = process.env.LOG_LEVEL || 'info'

// Create logger instance
export const logger = pino({
  level: logLevel,
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      ignore: 'pid,hostname',
      translateTime: 'HH:MM:ss Z',
    },
  },
  base: {
    env: process.env.NODE_ENV,
    version: process.env.npm_package_version || '0.1.0',
  },
})

// Request logger with correlation ID
export function createRequestLogger(requestId: string) {
  return logger.child({ requestId })
}

// Performance logger
export const performanceLogger = logger.child({ component: 'performance' })

// API logger
export const apiLogger = logger.child({ component: 'api' })

// Database logger
export const dbLogger = logger.child({ component: 'database' })

// Cache logger
export const cacheLogger = logger.child({ component: 'cache' })

// Error logger
export const errorLogger = logger.child({ component: 'error' })

// Metrics logger
export const metricsLogger = logger.child({ component: 'metrics' })

// Helper functions
export function logError(error: Error, context?: Record<string, any>) {
  errorLogger.error({
    message: error.message,
    stack: error.stack,
    ...context,
  })
}

export function logPerformance(operation: string, duration: number, context?: Record<string, any>) {
  performanceLogger.info({
    operation,
    duration,
    ...context,
  })
}

export function logApiRequest(method: string, url: string, statusCode: number, duration: number) {
  apiLogger.info({
    method,
    url,
    statusCode,
    duration,
  })
}

export function logDatabaseQuery(query: string, duration: number, context?: Record<string, any>) {
  dbLogger.info({
    query,
    duration,
    ...context,
  })
}

export function logCacheOperation(operation: 'get' | 'set' | 'delete', key: string, hit: boolean, duration?: number) {
  cacheLogger.info({
    operation,
    key,
    hit,
    duration,
  })
}
