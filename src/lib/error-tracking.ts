import { logger } from './logger'

// Error tracking interface
interface ErrorEvent {
  id: string
  timestamp: number
  error: Error
  context: {
    url?: string
    method?: string
    userAgent?: string
    userId?: string
    requestId?: string
    environment: string
    version: string
  }
  severity: 'low' | 'medium' | 'high' | 'critical'
  tags?: Record<string, string>
}

// Error tracking class
class ErrorTracker {
  private errors: ErrorEvent[] = []
  private isEnabled: boolean

  constructor() {
    this.isEnabled = process.env.NODE_ENV !== 'test'
  }

  // Track an error
  trackError(
    error: Error,
    context: Partial<ErrorEvent['context']> = {},
    severity: ErrorEvent['severity'] = 'medium',
    tags?: Record<string, string>
  ): string {
    if (!this.isEnabled) return ''

    const errorEvent: ErrorEvent = {
      id: this.generateErrorId(),
      timestamp: Date.now(),
      error,
      context: {
        environment: process.env.NODE_ENV || 'development',
        version: process.env.npm_package_version || '0.1.0',
        ...context,
      },
      severity,
      tags,
    }

    this.errors.push(errorEvent)
    
    // Keep only last 1000 errors to prevent memory leaks
    if (this.errors.length > 1000) {
      this.errors = this.errors.slice(-500)
    }

    // Log the error
    logger.error('Error tracked', {
      id: errorEvent.id,
      message: error.message,
      stack: error.stack,
      severity,
      context: errorEvent.context,
      tags,
    })

    // In production, send to error tracking service
    if (process.env.NODE_ENV === 'production') {
      this.sendToErrorService(errorEvent)
    }

    return errorEvent.id
  }

  // Track API error
  trackApiError(
    error: Error,
    request: Request,
    response?: Response,
    userId?: string
  ): string {
    return this.trackError(error, {
      url: request.url,
      method: request.method,
      userAgent: request.headers.get('user-agent') || undefined,
      userId,
      requestId: request.headers.get('x-request-id') || undefined,
    }, this.getSeverityFromError(error))
  }

  // Track client-side error
  trackClientError(
    error: Error,
    url?: string,
    userId?: string
  ): string {
    return this.trackError(error, {
      url,
      userId,
    }, this.getSeverityFromError(error))
  }

  // Get severity from error
  private getSeverityFromError(error: Error): ErrorEvent['severity'] {
    const message = error.message.toLowerCase()
    
    if (message.includes('unauthorized') || message.includes('forbidden')) {
      return 'medium'
    }
    
    if (message.includes('not found') || message.includes('404')) {
      return 'low'
    }
    
    if (message.includes('timeout') || message.includes('connection')) {
      return 'high'
    }
    
    if (message.includes('database') || message.includes('sql')) {
      return 'critical'
    }
    
    return 'medium'
  }

  // Generate error ID
  private generateErrorId(): string {
    return `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  // Get error by ID
  getError(id: string): ErrorEvent | undefined {
    return this.errors.find(error => error.id === id)
  }

  // Get all errors
  getErrors(): ErrorEvent[] {
    return [...this.errors]
  }

  // Get errors by severity
  getErrorsBySeverity(severity: ErrorEvent['severity']): ErrorEvent[] {
    return this.errors.filter(error => error.severity === severity)
  }

  // Get errors by time range
  getErrorsByTimeRange(startTime: number, endTime: number): ErrorEvent[] {
    return this.errors.filter(error => 
      error.timestamp >= startTime && error.timestamp <= endTime
    )
  }

  // Get error statistics
  getErrorStats(): Record<string, any> {
    const total = this.errors.length
    const bySeverity = this.errors.reduce((acc, error) => {
      acc[error.severity] = (acc[error.severity] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const byType = this.errors.reduce((acc, error) => {
      const type = error.error.constructor.name
      acc[type] = (acc[type] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const recentErrors = this.errors
      .filter(error => error.timestamp > Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
      .length

    return {
      total,
      bySeverity,
      byType,
      recentErrors,
      averagePerHour: total / (24 * 60 * 60 * 1000) * 60 * 60,
    }
  }

  // Clear errors
  clearErrors(): void {
    this.errors = []
  }

  // Send to error tracking service
  private sendToErrorService(errorEvent: ErrorEvent): void {
    // In production, send to services like Sentry, LogRocket, etc.
    console.log('Sending error to tracking service:', {
      id: errorEvent.id,
      message: errorEvent.error.message,
      severity: errorEvent.severity,
    })
  }

  // Generate error report
  generateErrorReport(): Record<string, any> {
    const stats = this.getErrorStats()
    const recentErrors = this.errors
      .filter(error => error.timestamp > Date.now() - 60 * 60 * 1000) // Last hour
      .slice(-10) // Last 10 errors

    return {
      timestamp: new Date().toISOString(),
      stats,
      recentErrors: recentErrors.map(error => ({
        id: error.id,
        message: error.error.message,
        severity: error.severity,
        timestamp: new Date(error.timestamp).toISOString(),
        context: error.context,
      })),
    }
  }
}

// Global error tracker instance
export const errorTracker = new ErrorTracker()

// Error tracking decorator
export function trackErrors() {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value

    descriptor.value = async function (...args: any[]) {
      try {
        const result = await originalMethod.apply(this, args)
        return result
      } catch (error) {
        errorTracker.trackError(
          error instanceof Error ? error : new Error(String(error)),
          {
            method: propertyKey,
            className: target.constructor.name,
          }
        )
        throw error
      }
    }

    return descriptor
  }
}

// Error tracking wrapper
export function withErrorTracking<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  context?: Partial<ErrorEvent['context']>
): T {
  return (async (...args: Parameters<T>): Promise<ReturnType<T>> => {
    try {
      const result = await fn(...args)
      return result
    } catch (error) {
      errorTracker.trackError(
        error instanceof Error ? error : new Error(String(error)),
        context
      )
      throw error
    }
  }) as T
}

// Error boundary for React components
export function withErrorBoundary<T extends React.ComponentType<any>>(
  Component: T,
  fallback?: React.ComponentType<{ error: Error; reset: () => void }>
): T {
  return class ErrorBoundary extends React.Component<
    React.ComponentProps<T>,
    { hasError: boolean; error: Error | null }
  > {
    constructor(props: React.ComponentProps<T>) {
      super(props)
      this.state = { hasError: false, error: null }
    }

    static getDerivedStateFromError(error: Error) {
      return { hasError: true, error }
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
      errorTracker.trackClientError(error, window.location.href)
    }

    render() {
      if (this.state.hasError) {
        if (fallback) {
          return React.createElement(fallback, {
            error: this.state.error!,
            reset: () => this.setState({ hasError: false, error: null }),
          })
        }
        
        return (
          <div className="error-boundary">
            <h2>Something went wrong</h2>
            <button onClick={() => this.setState({ hasError: false, error: null })}>
              Try again
            </button>
          </div>
        )
      }

      return React.createElement(Component, this.props)
    }
  } as T
}

// Export error tracking utilities
export const errorTracking = {
  tracker: errorTracker,
  track: trackErrors,
  wrap: withErrorTracking,
  boundary: withErrorBoundary,
}
