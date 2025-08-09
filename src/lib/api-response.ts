import { NextResponse } from 'next/server'
import { logger } from './logger'

// Standard API response interface
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
  timestamp: string
  requestId?: string
}

// Success response helper
export function successResponse<T>(
  data: T,
  status: number = 200,
  message?: string,
  requestId?: string
): NextResponse<ApiResponse<T>> {
  const response: ApiResponse<T> = {
    success: true,
    data,
    message,
    timestamp: new Date().toISOString(),
    requestId,
  }

  logger.info('API Success', { 
    status, 
    message, 
    requestId,
    dataSize: JSON.stringify(data).length 
  })

  return NextResponse.json(response, { status })
}

// Error response helper
export function errorResponse(
  error: string | Error,
  status: number = 500,
  requestId?: string
): NextResponse<ApiResponse> {
  const errorMessage = error instanceof Error ? error.message : error
  
  const response: ApiResponse = {
    success: false,
    error: errorMessage,
    timestamp: new Date().toISOString(),
    requestId,
  }

  logger.error('API Error', { 
    status, 
    error: errorMessage, 
    requestId 
  })

  return NextResponse.json(response, { status })
}

// Validation error response
export function validationErrorResponse(
  errors: string[],
  requestId?: string
): NextResponse<ApiResponse> {
  return errorResponse(
    `Validation failed: ${errors.join(', ')}`,
    400,
    requestId
  )
}

// Not found response
export function notFoundResponse(
  resource: string,
  requestId?: string
): NextResponse<ApiResponse> {
  return errorResponse(
    `${resource} not found`,
    404,
    requestId
  )
}

// Unauthorized response
export function unauthorizedResponse(
  message: string = 'Unauthorized',
  requestId?: string
): NextResponse<ApiResponse> {
  return errorResponse(
    message,
    401,
    requestId
  )
}

// Forbidden response
export function forbiddenResponse(
  message: string = 'Forbidden',
  requestId?: string
): NextResponse<ApiResponse> {
  return errorResponse(
    message,
    403,
    requestId
  )
}

// Rate limit response
export function rateLimitResponse(
  message: string = 'Too many requests',
  requestId?: string
): NextResponse<ApiResponse> {
  const response = errorResponse(
    message,
    429,
    requestId
  )
  
  // Add rate limit headers
  response.headers.set('Retry-After', '60')
  response.headers.set('X-RateLimit-Limit', '100')
  response.headers.set('X-RateLimit-Remaining', '0')
  response.headers.set('X-RateLimit-Reset', Math.floor(Date.now() / 1000 + 3600).toString())
  
  return response
}

// Pagination helper
export interface PaginationMeta {
  page: number
  limit: number
  total: number
  pages: number
  hasNext: boolean
  hasPrev: boolean
}

export function paginatedResponse<T>(
  data: T[],
  pagination: PaginationMeta,
  status: number = 200,
  requestId?: string
): NextResponse<ApiResponse<{ data: T[], pagination: PaginationMeta }>> {
  return successResponse(
    { data, pagination },
    status,
    undefined,
    requestId
  )
}

// Health check response
export function healthResponse(
  status: 'healthy' | 'unhealthy',
  details?: Record<string, any>,
  requestId?: string
): NextResponse<ApiResponse> {
  const response: ApiResponse = {
    success: status === 'healthy',
    data: {
      status,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV,
      version: process.env.npm_package_version || '0.1.0',
      ...details,
    },
    timestamp: new Date().toISOString(),
    requestId,
  }

  const httpStatus = status === 'healthy' ? 200 : 503

  logger.info('Health Check', { 
    status, 
    details, 
    requestId 
  })

  return NextResponse.json(response, { status: httpStatus })
}

// Metrics response
export function metricsResponse(
  metrics: Record<string, number | string>,
  requestId?: string
): NextResponse<string> {
  const timestamp = Date.now()
  
  const prometheusMetrics = Object.entries(metrics)
    .map(([key, value]) => `# HELP ${key} ${key}\n# TYPE ${key} gauge\n${key} ${value}`)
    .join('\n\n')

  logger.info('Metrics Response', { 
    metricsCount: Object.keys(metrics).length,
    requestId 
  })

  return new NextResponse(prometheusMetrics, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; version=0.0.4; charset=utf-8',
      'Cache-Control': 'no-cache',
    },
  })
}
