import { logger } from './logger'

// Analytics event interface
interface AnalyticsEvent {
  id: string
  timestamp: number
  event: string
  properties: Record<string, any>
  userId?: string
  sessionId?: string
  context: {
    url: string
    userAgent?: string
    referrer?: string
    environment: string
    version: string
  }
}

// Analytics class
class Analytics {
  private events: AnalyticsEvent[] = []
  private sessionId: string
  private isEnabled: boolean

  constructor() {
    this.sessionId = this.generateSessionId()
    this.isEnabled = process.env.NODE_ENV !== 'test'
  }

  // Track an event
  track(
    event: string,
    properties: Record<string, any> = {},
    userId?: string
  ): string {
    if (!this.isEnabled) return ''

    const analyticsEvent: AnalyticsEvent = {
      id: this.generateEventId(),
      timestamp: Date.now(),
      event,
      properties,
      userId,
      sessionId: this.sessionId,
      context: {
        url: typeof window !== 'undefined' ? window.location.href : '',
        userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
        referrer: typeof window !== 'undefined' ? document.referrer : undefined,
        environment: process.env.NODE_ENV || 'development',
        version: process.env.npm_package_version || '0.1.0',
      },
    }

    this.events.push(analyticsEvent)
    
    // Keep only last 1000 events to prevent memory leaks
    if (this.events.length > 1000) {
      this.events = this.events.slice(-500)
    }

    // Log the event
    logger.info('Analytics event tracked', {
      id: analyticsEvent.id,
      event,
      properties,
      userId,
      sessionId: this.sessionId,
    })

    // In production, send to analytics service
    if (process.env.NODE_ENV === 'production') {
      this.sendToAnalyticsService(analyticsEvent)
    }

    return analyticsEvent.id
  }

  // Track page view
  trackPageView(url: string, title?: string, userId?: string): string {
    return this.track('page_view', {
      url,
      title: title || document.title,
      path: new URL(url).pathname,
    }, userId)
  }

  // Track user action
  trackAction(
    action: string,
    element?: string,
    properties: Record<string, any> = {},
    userId?: string
  ): string {
    return this.track('user_action', {
      action,
      element,
      ...properties,
    }, userId)
  }

  // Track form submission
  trackFormSubmission(
    formName: string,
    success: boolean,
    properties: Record<string, any> = {},
    userId?: string
  ): string {
    return this.track('form_submission', {
      form_name: formName,
      success,
      ...properties,
    }, userId)
  }

  // Track API call
  trackApiCall(
    endpoint: string,
    method: string,
    status: number,
    duration: number,
    userId?: string
  ): string {
    return this.track('api_call', {
      endpoint,
      method,
      status,
      duration,
      success: status >= 200 && status < 300,
    }, userId)
  }

  // Track error
  trackError(
    error: Error,
    context: Record<string, any> = {},
    userId?: string
  ): string {
    return this.track('error', {
      message: error.message,
      stack: error.stack,
      type: error.constructor.name,
      ...context,
    }, userId)
  }

  // Track performance
  trackPerformance(
    metric: string,
    value: number,
    unit: string = 'ms',
    userId?: string
  ): string {
    return this.track('performance', {
      metric,
      value,
      unit,
    }, userId)
  }

  // Track conversion
  trackConversion(
    goal: string,
    value?: number,
    properties: Record<string, any> = {},
    userId?: string
  ): string {
    return this.track('conversion', {
      goal,
      value,
      ...properties,
    }, userId)
  }

  // Generate event ID
  private generateEventId(): string {
    return `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  // Generate session ID
  private generateSessionId(): string {
    return `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  // Get event by ID
  getEvent(id: string): AnalyticsEvent | undefined {
    return this.events.find(event => event.id === id)
  }

  // Get all events
  getEvents(): AnalyticsEvent[] {
    return [...this.events]
  }

  // Get events by type
  getEventsByType(eventType: string): AnalyticsEvent[] {
    return this.events.filter(event => event.event === eventType)
  }

  // Get events by user
  getEventsByUser(userId: string): AnalyticsEvent[] {
    return this.events.filter(event => event.userId === userId)
  }

  // Get events by time range
  getEventsByTimeRange(startTime: number, endTime: number): AnalyticsEvent[] {
    return this.events.filter(event => 
      event.timestamp >= startTime && event.timestamp <= endTime
    )
  }

  // Get analytics statistics
  getAnalyticsStats(): Record<string, any> {
    const total = this.events.length
    const byEvent = this.events.reduce((acc, event) => {
      acc[event.event] = (acc[event.event] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const byUser = this.events.reduce((acc, event) => {
      if (event.userId) {
        acc[event.userId] = (acc[event.userId] || 0) + 1
      }
      return acc
    }, {} as Record<string, number>)

    const recentEvents = this.events
      .filter(event => event.timestamp > Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
      .length

    const uniqueUsers = new Set(this.events.map(event => event.userId).filter(Boolean)).size

    return {
      total,
      byEvent,
      byUser,
      recentEvents,
      uniqueUsers,
      averagePerHour: total / (24 * 60 * 60 * 1000) * 60 * 60,
    }
  }

  // Clear events
  clearEvents(): void {
    this.events = []
  }

  // Send to analytics service
  private sendToAnalyticsService(event: AnalyticsEvent): void {
    // In production, send to services like Google Analytics, Mixpanel, etc.
    console.log('Sending analytics event:', {
      id: event.id,
      event: event.event,
      properties: event.properties,
    })
  }

  // Generate analytics report
  generateAnalyticsReport(): Record<string, any> {
    const stats = this.getAnalyticsStats()
    const recentEvents = this.events
      .filter(event => event.timestamp > Date.now() - 60 * 60 * 1000) // Last hour
      .slice(-10) // Last 10 events

    return {
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId,
      stats,
      recentEvents: recentEvents.map(event => ({
        id: event.id,
        event: event.event,
        properties: event.properties,
        timestamp: new Date(event.timestamp).toISOString(),
        userId: event.userId,
      })),
    }
  }
}

// Global analytics instance
export const analytics = new Analytics()

// Analytics decorator
export function trackAnalytics(event: string, properties?: Record<string, any>) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value

    descriptor.value = async function (...args: any[]) {
      const result = await originalMethod.apply(this, args)
      
      analytics.track(event, {
        method: propertyKey,
        className: target.constructor.name,
        ...properties,
      })
      
      return result
    }

    return descriptor
  }
}

// Analytics wrapper
export function withAnalytics<T extends (...args: any[]) => Promise<any>>(
  event: string,
  fn: T,
  properties?: Record<string, any>
): T {
  return (async (...args: Parameters<T>): Promise<ReturnType<T>> => {
    const startTime = Date.now()
    
    try {
      const result = await fn(...args)
      const duration = Date.now() - startTime
      
      analytics.track(event, {
        success: true,
        duration,
        ...properties,
      })
      
      return result
    } catch (error) {
      const duration = Date.now() - startTime
      
      analytics.track(event, {
        success: false,
        duration,
        error: error instanceof Error ? error.message : 'Unknown error',
        ...properties,
      })
      
      throw error
    }
  }) as T
}

// Analytics hook for React components
export function useAnalytics() {
  return {
    track: analytics.track.bind(analytics),
    trackPageView: analytics.trackPageView.bind(analytics),
    trackAction: analytics.trackAction.bind(analytics),
    trackFormSubmission: analytics.trackFormSubmission.bind(analytics),
    trackApiCall: analytics.trackApiCall.bind(analytics),
    trackError: analytics.trackError.bind(analytics),
    trackPerformance: analytics.trackPerformance.bind(analytics),
    trackConversion: analytics.trackConversion.bind(analytics),
  }
}

// Export analytics utilities
export const analyticsUtils = {
  analytics,
  track: trackAnalytics,
  wrap: withAnalytics,
  hook: useAnalytics,
} 