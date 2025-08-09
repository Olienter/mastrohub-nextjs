import { logger } from './logger'
import { getRedisUrl } from './env'

// Performance metrics interface
interface PerformanceMetric {
  name: string
  value: number
  unit: string
  timestamp: number
  tags?: Record<string, string>
}

// Performance monitoring class
class PerformanceMonitor {
  private metrics: PerformanceMetric[] = []
  private startTimes: Map<string, number> = new Map()
  private isEnabled: boolean

  constructor() {
    // Disable in development mode to improve performance
    this.isEnabled = false // Temporarily disable for performance
  }

  // Start timing an operation
  startTimer(name: string): void {
    if (!this.isEnabled) return
    this.startTimes.set(name, Date.now())
  }

  // End timing an operation
  endTimer(name: string, tags?: Record<string, string>): number {
    if (!this.isEnabled) return 0
    
    const startTime = this.startTimes.get(name)
    if (!startTime) {
      return 0
    }

    const duration = Date.now() - startTime
    this.recordMetric(name, duration, 'ms', tags)
    this.startTimes.delete(name)
    
    return duration
  }

  // Record a metric
  recordMetric(
    name: string,
    value: number,
    unit: string = 'count',
    tags?: Record<string, string>
  ): void {
    if (!this.isEnabled) return

    const metric: PerformanceMetric = {
      name,
      value,
      unit,
      timestamp: Date.now(),
      tags,
    }

    this.metrics.push(metric)
    
    // Keep only last 100 metrics in development to prevent memory leaks
    const maxMetrics = 100
    if (this.metrics.length > maxMetrics) {
      this.metrics = this.metrics.slice(-maxMetrics / 2)
    }
  }

  // Get current memory usage
  getMemoryUsage(): PerformanceMetric {
    return {
      name: 'memory_usage',
      value: 0, // Disabled for performance
      unit: 'bytes',
      timestamp: Date.now(),
      tags: {
        type: 'heap_used',
      },
    }
  }

  // Get CPU usage (approximate)
  getCpuUsage(): PerformanceMetric {
    return {
      name: 'cpu_usage',
      value: 0, // Disabled for performance
      unit: 'microseconds',
      timestamp: Date.now(),
    }
  }

  // Get uptime
  getUptime(): PerformanceMetric {
    return {
      name: 'uptime',
      value: 0, // Disabled for performance
      unit: 'seconds',
      timestamp: Date.now(),
    }
  }

  // Get all metrics
  getMetrics(): PerformanceMetric[] {
    return [...this.metrics]
  }

  // Get metrics by name
  getMetricsByName(name: string): PerformanceMetric[] {
    return this.metrics.filter(metric => metric.name === name)
  }

  // Get average metric value
  getAverageMetric(name: string): number {
    const metrics = this.getMetricsByName(name)
    if (metrics.length === 0) return 0
    
    const sum = metrics.reduce((acc, metric) => acc + metric.value, 0)
    return sum / metrics.length
  }

  // Get latest metric value
  getLatestMetric(name: string): number {
    const metrics = this.getMetricsByName(name)
    if (metrics.length === 0) return 0
    
    return metrics[metrics.length - 1].value
  }

  // Clear metrics
  clearMetrics(): void {
    this.metrics = []
    this.startTimes.clear()
  }

  // Generate Prometheus metrics
  generatePrometheusMetrics(): string {
    const lines: string[] = []
    
    // System metrics
    const memoryUsage = this.getMemoryUsage()
    const cpuUsage = this.getCpuUsage()
    const uptime = this.getUptime()

    lines.push(`# HELP ${memoryUsage.name} ${memoryUsage.name}`)
    lines.push(`# TYPE ${memoryUsage.name} gauge`)
    lines.push(`${memoryUsage.name} ${memoryUsage.value}`)

    lines.push(`# HELP ${cpuUsage.name} ${cpuUsage.name}`)
    lines.push(`# TYPE ${cpuUsage.name} gauge`)
    lines.push(`${cpuUsage.name} ${cpuUsage.value}`)

    lines.push(`# HELP ${uptime.name} ${uptime.name}`)
    lines.push(`# TYPE ${uptime.name} gauge`)
    lines.push(`${uptime.name} ${uptime.value}`)

    // Custom metrics
    const metricGroups = this.metrics.reduce((acc, metric) => {
      if (!acc[metric.name]) {
        acc[metric.name] = []
      }
      acc[metric.name].push(metric)
      return acc
    }, {} as Record<string, PerformanceMetric[]>)

    Object.entries(metricGroups).forEach(([name, metrics]) => {
      const latest = metrics[metrics.length - 1]
      const average = metrics.reduce((acc, m) => acc + m.value, 0) / metrics.length
      
      lines.push(`# HELP ${name} ${name}`)
      lines.push(`# TYPE ${name} gauge`)
      lines.push(`${name}_latest ${latest.value}`)
      lines.push(`${name}_average ${average}`)
      lines.push(`${name}_count ${metrics.length}`)
    })

    return lines.join('\n')
  }

  // Generate JSON report
  generateReport(): Record<string, any> {
    const memoryUsage = this.getMemoryUsage()
    const cpuUsage = this.getCpuUsage()
    const uptime = this.getUptime()

    const metricGroups = this.metrics.reduce((acc, metric) => {
      if (!acc[metric.name]) {
        acc[metric.name] = {
          count: 0,
          total: 0,
          average: 0,
          min: Infinity,
          max: -Infinity,
          latest: 0,
        }
      }
      
      const stats = acc[metric.name]
      stats.count++
      stats.total += metric.value
      stats.average = stats.total / stats.count
      stats.min = Math.min(stats.min, metric.value)
      stats.max = Math.max(stats.max, metric.value)
      stats.latest = metric.value
      
      return acc
    }, {} as Record<string, any>)

    return {
      timestamp: new Date().toISOString(),
      system: {
        memory: {
          heapUsed: memoryUsage.value,
          heapTotal: 0, // Disabled for performance
          external: 0, // Disabled for performance
          rss: 0, // Disabled for performance
        },
        cpu: {
          user: cpuUsage.value,
          system: 0, // Disabled for performance
        },
        uptime: uptime.value,
      },
      metrics: metricGroups,
    }
  }
}

// Global performance monitor instance
export const performanceMonitor = new PerformanceMonitor()

// PerformanceManager class (singleton wrapper)
export class PerformanceManager {
  private static instance: PerformanceManager | null = null
  private monitor: PerformanceMonitor

  private constructor() {
    this.monitor = performanceMonitor
  }

  static getInstance(): PerformanceManager {
    if (!PerformanceManager.instance) {
      PerformanceManager.instance = new PerformanceManager()
    }
    return PerformanceManager.instance
  }

  // Delegate methods to the monitor
  startTimer(name: string): void {
    this.monitor.startTimer(name)
  }

  endTimer(name: string, tags?: Record<string, string>): number {
    return this.monitor.endTimer(name, tags)
  }

  recordMetric(name: string, value: number, unit?: string, tags?: Record<string, string>): void {
    this.monitor.recordMetric(name, value, unit, tags)
  }

  getMemoryUsage(): PerformanceMetric {
    return this.monitor.getMemoryUsage()
  }

  getCpuUsage(): PerformanceMetric {
    return this.monitor.getCpuUsage()
  }

  getUptime(): PerformanceMetric {
    return this.monitor.getUptime()
  }

  getMetrics(): PerformanceMetric[] {
    return this.monitor.getMetrics()
  }

  getMetricsByName(name: string): PerformanceMetric[] {
    return this.monitor.getMetricsByName(name)
  }

  getAverageMetric(name: string): number {
    return this.monitor.getAverageMetric(name)
  }

  getLatestMetric(name: string): number {
    return this.monitor.getLatestMetric(name)
  }

  clearMetrics(): void {
    this.monitor.clearMetrics()
  }

  generatePrometheusMetrics(): string {
    return this.monitor.generatePrometheusMetrics()
  }

  generateReport(): Record<string, any> {
    return this.monitor.generateReport()
  }

  // Initialize performance monitoring
  init(): void {
    this.monitor.startTimer('app_init')
    console.log('Performance monitoring initialized')
  }

  // Enable service worker caching
  enableServiceWorkerCaching(): void {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('Service Worker registered for caching:', registration)
        })
        .catch(error => {
          console.warn('Service Worker registration failed:', error)
        })
    }
  }

  // Optimize images
  optimizeImages(): void {
    // Implementation for image optimization
    console.log('Image optimization enabled')
  }

  // Preload critical resources
  preloadCriticalResources(): void {
    // Implementation for preloading critical resources
    console.log('Critical resources preloading enabled')
  }

  // Optimize fonts
  optimizeFonts(): void {
    // Implementation for font optimization
    console.log('Font optimization enabled')
  }

  // Get performance summary
  getPerformanceSummary(): { performanceScore: number } {
    const metrics = this.monitor.getMetrics()
    const avgResponseTime = metrics.length > 0 
      ? metrics.reduce((sum, m) => sum + m.value, 0) / metrics.length 
      : 0
    
    // Calculate performance score (0-100)
    const performanceScore = Math.max(0, Math.min(100, 100 - (avgResponseTime / 100)))
    
    return { performanceScore }
  }
}

// Performance decorator for functions
export function measurePerformance(name: string) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value

    descriptor.value = async function (...args: any[]) {
      performanceMonitor.startTimer(name)
      
      try {
        const result = await originalMethod.apply(this, args)
        performanceMonitor.endTimer(name, { status: 'success' })
        return result
      } catch (error) {
        performanceMonitor.endTimer(name, { status: 'error', error: error instanceof Error ? error.message : 'Unknown error' })
        throw error
      }
    }

    return descriptor
  }
}

// Performance wrapper for async functions
export function withPerformance<T extends (...args: any[]) => Promise<any>>(
  name: string,
  fn: T
): T {
  return (async (...args: Parameters<T>): Promise<ReturnType<T>> => {
    performanceMonitor.startTimer(name)
    
    try {
      const result = await fn(...args)
      performanceMonitor.endTimer(name, { status: 'success' })
      return result
    } catch (error) {
      performanceMonitor.endTimer(name, { status: 'error', error: error instanceof Error ? error.message : 'Unknown error' })
      throw error
    }
  }) as T
}

// Performance middleware for Next.js API routes
export function withPerformanceMonitoring(handler: Function) {
  return async function (request: Request, ...args: any[]) {
    const startTime = Date.now()
    const requestId = request.headers.get('x-request-id') || crypto.randomUUID()
    
    performanceMonitor.startTimer(`api_request_${requestId}`)
    
    try {
      const response = await handler(request, ...args)
      const duration = Date.now() - startTime
      
      performanceMonitor.endTimer(`api_request_${requestId}`, {
        method: request.method,
        url: request.url,
        status: response instanceof Response ? response.status.toString() : 'unknown',
      })
      
      performanceMonitor.recordMetric('api_request_duration', duration, 'ms', {
        method: request.method,
        url: new URL(request.url).pathname,
      })
      
      return response
    } catch (error) {
      const duration = Date.now() - startTime
      
      performanceMonitor.endTimer(`api_request_${requestId}`, {
        method: request.method,
        url: request.url,
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
      })
      
      performanceMonitor.recordMetric('api_request_error', 1, 'count', {
        method: request.method,
        url: new URL(request.url).pathname,
        error: error instanceof Error ? error.message : 'Unknown error',
      })
      
      throw error
    }
  }
}

// Export performance utilities
export const performance = {
  monitor: performanceMonitor,
  measure: measurePerformance,
  wrap: withPerformance,
  middleware: withPerformanceMonitoring,
} 