import { NextRequest, NextResponse } from 'next/server'
import { z, ZodSchema } from 'zod'
import { logger } from './logger'

// Error types
export class ValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ValidationError'
  }
}

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'NotFoundError'
  }
}

export class UnauthorizedError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'UnauthorizedError'
  }
}

// Error boundary wrapper
export function withErrorBoundary<T extends any[], R>(
  handler: (...args: T) => Promise<R>
) {
  return async (...args: T): Promise<R> => {
    try {
      return await handler(...args)
    } catch (error) {
      logger.error('API Error:', {
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        handler: handler.name,
      })

      if (error instanceof ValidationError) {
        return NextResponse.json(
          { error: error.message },
          { status: 400 }
        ) as R
      }

      if (error instanceof NotFoundError) {
        return NextResponse.json(
          { error: error.message },
          { status: 404 }
        ) as R
      }

      if (error instanceof UnauthorizedError) {
        return NextResponse.json(
          { error: error.message },
          { status: 401 }
        ) as R
      }

      // Default error response
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      ) as R
    }
  }
}

// Request body validation
export async function validateBody<T>(
  request: NextRequest,
  schema: ZodSchema<T>
): Promise<T> {
  try {
    const body = await request.json()
    return schema.parse(body)
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ValidationError(
        `Validation failed: ${error.errors.map(e => e.message).join(', ')}`
      )
    }
    throw new ValidationError('Invalid JSON body')
  }
}

// Query parameters validation
export function validateQuery<T>(
  request: NextRequest,
  schema: ZodSchema<T>
): T {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = Object.fromEntries(searchParams.entries())
    return schema.parse(query)
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ValidationError(
        `Query validation failed: ${error.errors.map(e => e.message).join(', ')}`
      )
    }
    throw new ValidationError('Invalid query parameters')
  }
}

// Common response helpers
export function successResponse<T>(data: T, status = 200) {
  return NextResponse.json({ data, success: true }, { status })
}

export function errorResponse(message: string, status = 400) {
  return NextResponse.json({ error: message, success: false }, { status })
}

// Request ID middleware
export function getRequestId(request: NextRequest): string {
  return request.headers.get('x-request-id') || 
         request.headers.get('x-correlation-id') || 
         crypto.randomUUID()
}

// Common schemas
export const paginationSchema = z.object({
  page: z.string().optional().transform(val => parseInt(val || '1')),
  limit: z.string().optional().transform(val => parseInt(val || '10')),
})

export const idSchema = z.object({
  id: z.string().uuid(),
})

export const searchSchema = z.object({
  q: z.string().optional(),
  category: z.string().optional(),
  status: z.string().optional(),
})
