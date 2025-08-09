import { NextResponse } from 'next/server'
import { withErrorBoundary } from '@/lib/http'
import { logger } from '@/lib/logger'

// Simple Prometheus metrics
const metrics = {
  app_up: 1,
  http_requests_total: 0,
  http_request_duration_seconds: 0,
  cache_hits_total: 0,
  cache_misses_total: 0,
  database_connections: 0,
  memory_usage_bytes: 0,
  cpu_usage_percent: 0,
}

// Update metrics
export function updateMetrics(type: string, value: number) {
  if (type === 'request') {
    metrics.http_requests_total += 1
  } else if (type === 'duration') {
    metrics.http_request_duration_seconds = value
  } else if (type === 'cache_hit') {
    metrics.cache_hits_total += 1
  } else if (type === 'cache_miss') {
    metrics.cache_misses_total += 1
  }
}

// Format metrics for Prometheus
function formatMetrics(): string {
  const timestamp = Date.now()
  
  return `# HELP app_up Application status
# TYPE app_up gauge
app_up ${metrics.app_up}

# HELP http_requests_total Total HTTP requests
# TYPE http_requests_total counter
http_requests_total ${metrics.http_requests_total}

# HELP http_request_duration_seconds HTTP request duration
# TYPE http_request_duration_seconds histogram
http_request_duration_seconds ${metrics.http_request_duration_seconds}

# HELP cache_hits_total Total cache hits
# TYPE cache_hits_total counter
cache_hits_total ${metrics.cache_hits_total}

# HELP cache_misses_total Total cache misses
# TYPE cache_misses_total counter
cache_misses_total ${metrics.cache_misses_total}

# HELP database_connections Database connections
# TYPE database_connections gauge
database_connections ${metrics.database_connections}

# HELP memory_usage_bytes Memory usage in bytes
# TYPE memory_usage_bytes gauge
memory_usage_bytes ${metrics.memory_usage_bytes}

# HELP cpu_usage_percent CPU usage percentage
# TYPE cpu_usage_percent gauge
cpu_usage_percent ${metrics.cpu_usage_percent}
`
}

async function handleMetrics() {
  const start = Date.now()
  
  try {
    // Update request metrics
    updateMetrics('request', 1)
    
    // Get system metrics
    const memUsage = process.memoryUsage()
    metrics.memory_usage_bytes = memUsage.heapUsed
    
    // Format response
    const metricsData = formatMetrics()
    
    const duration = (Date.now() - start) / 1000
    updateMetrics('duration', duration)
    
    logger.info('Metrics endpoint called', { duration })
    
    return new NextResponse(metricsData, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; version=0.0.4; charset=utf-8',
        'Cache-Control': 'no-cache',
      },
    })
  } catch (error) {
    logger.error('Metrics error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export const GET = withErrorBoundary(handleMetrics)
