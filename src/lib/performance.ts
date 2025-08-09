// Performance optimization and monitoring for production launch
export class PerformanceManager {
  private static instance: PerformanceManager;
  private metrics: PerformanceMetric[] = [];
  private observers: Map<string, PerformanceObserver> = new Map();

  static getInstance(): PerformanceManager {
    if (!PerformanceManager.instance) {
      PerformanceManager.instance = new PerformanceManager();
    }
    return PerformanceManager.instance;
  }

  // Initialize performance monitoring
  init(): void {
    if (typeof window !== 'undefined') {
      this.setupPerformanceObservers();
      this.setupResourceTiming();
      this.setupUserTiming();
    }
  }

  // Setup performance observers
  private setupPerformanceObservers(): void {
    // Navigation timing
    if ('PerformanceObserver' in window) {
      const navigationObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          this.recordMetric('navigation', entry);
        });
      });
      navigationObserver.observe({ entryTypes: ['navigation'] });
      this.observers.set('navigation', navigationObserver);

      // Resource timing
      const resourceObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          this.recordMetric('resource', entry);
        });
      });
      resourceObserver.observe({ entryTypes: ['resource'] });
      this.observers.set('resource', resourceObserver);

      // Long tasks
      const longTaskObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          this.recordMetric('longtask', entry);
        });
      });
      longTaskObserver.observe({ entryTypes: ['longtask'] });
      this.observers.set('longtask', longTaskObserver);

      // Layout shifts
      const layoutShiftObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          this.recordMetric('layout-shift', entry);
        });
      });
      layoutShiftObserver.observe({ entryTypes: ['layout-shift'] });
      this.observers.set('layout-shift', layoutShiftObserver);

      // First Input Delay
      const firstInputObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          this.recordMetric('first-input', entry);
        });
      });
      firstInputObserver.observe({ entryTypes: ['first-input'] });
      this.observers.set('first-input', firstInputObserver);
    }
  }

  // Setup resource timing
  private setupResourceTiming(): void {
    if ('getEntriesByType' in performance) {
      const resources = performance.getEntriesByType('resource');
      resources.forEach((resource) => {
        this.recordMetric('resource', resource);
      });
    }
  }

  // Setup user timing
  private setupUserTiming(): void {
    if ('getEntriesByType' in performance) {
      const userTimings = performance.getEntriesByType('measure');
      userTimings.forEach((measure) => {
        this.recordMetric('measure', measure);
      });
    }
  }

  // Record performance metric
  private recordMetric(type: string, entry: PerformanceEntry): void {
    const metric: PerformanceMetric = {
      timestamp: Date.now(),
      type,
      name: entry.name,
      duration: entry.duration,
      startTime: entry.startTime,
      entryType: entry.entryType,
      details: this.extractEntryDetails(entry)
    };

    this.metrics.push(metric);
    this.analyzeMetric(metric);
  }

  // Extract entry details
  private extractEntryDetails(entry: PerformanceEntry): any {
    if (entry instanceof PerformanceNavigationTiming) {
      return {
        domContentLoaded: entry.domContentLoadedEventEnd - entry.domContentLoadedEventStart,
        loadComplete: entry.loadEventEnd - entry.loadEventStart,
        domInteractive: entry.domInteractive,
        firstPaint: entry.domContentLoadedEventEnd
      };
    }

    if (entry instanceof PerformanceResourceTiming) {
      return {
        transferSize: entry.transferSize,
        encodedBodySize: entry.encodedBodySize,
        decodedBodySize: entry.decodedBodySize,
        initiatorType: entry.initiatorType
      };
    }

    if (entry instanceof PerformanceLongTaskTiming) {
      return {
        duration: entry.duration,
        startTime: entry.startTime
      };
    }

    return {};
  }

  // Analyze metric for performance issues
  private analyzeMetric(metric: PerformanceMetric): void {
    // Check for slow resources
    if (metric.type === 'resource' && metric.duration > 3000) {
      this.reportPerformanceIssue('SLOW_RESOURCE', {
        name: metric.name,
        duration: metric.duration
      });
    }

    // Check for long tasks
    if (metric.type === 'longtask' && metric.duration > 50) {
      this.reportPerformanceIssue('LONG_TASK', {
        duration: metric.duration,
        startTime: metric.startTime
      });
    }

    // Check for layout shifts
    if (metric.type === 'layout-shift' && metric.details?.value > 0.1) {
      this.reportPerformanceIssue('LAYOUT_SHIFT', {
        value: metric.details.value,
        sources: metric.details.sources
      });
    }
  }

  // Report performance issue
  private reportPerformanceIssue(type: string, details: any): void {
    console.warn(`Performance Issue: ${type}`, details);
    
    // In production, send to monitoring service
    if (process.env.NODE_ENV === 'production') {
      this.sendToMonitoringService({
        type: 'PERFORMANCE_ISSUE',
        issueType: type,
        details,
        timestamp: Date.now()
      });
    }
  }

  // Measure custom performance
  measure(name: string, fn: () => void): void {
    const start = performance.now();
    fn();
    const duration = performance.now() - start;
    
    this.recordMetric('custom', {
      name,
      duration,
      startTime: start,
      entryType: 'measure'
    } as PerformanceEntry);
  }

  // Async measurement
  async measureAsync<T>(name: string, fn: () => Promise<T>): Promise<T> {
    const start = performance.now();
    const result = await fn();
    const duration = performance.now() - start;
    
    this.recordMetric('custom', {
      name,
      duration,
      startTime: start,
      entryType: 'measure'
    } as PerformanceEntry);
    
    return result;
  }

  // Get performance metrics
  getMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }

  // Get performance summary
  getPerformanceSummary(): PerformanceSummary {
    const navigationMetrics = this.metrics.filter(m => m.type === 'navigation');
    const resourceMetrics = this.metrics.filter(m => m.type === 'resource');
    const longTaskMetrics = this.metrics.filter(m => m.type === 'longtask');

    return {
      totalMetrics: this.metrics.length,
      navigationCount: navigationMetrics.length,
      resourceCount: resourceMetrics.length,
      longTaskCount: longTaskMetrics.length,
      averageResourceLoadTime: this.calculateAverage(resourceMetrics, 'duration'),
      slowestResource: this.findSlowestResource(),
      performanceScore: this.calculatePerformanceScore()
    };
  }

  // Calculate average
  private calculateAverage(metrics: PerformanceMetric[], field: keyof PerformanceMetric): number {
    if (metrics.length === 0) return 0;
    const sum = metrics.reduce((acc, metric) => acc + (metric[field] as number), 0);
    return sum / metrics.length;
  }

  // Find slowest resource
  private findSlowestResource(): PerformanceMetric | null {
    const resourceMetrics = this.metrics.filter(m => m.type === 'resource');
    if (resourceMetrics.length === 0) return null;
    
    return resourceMetrics.reduce((slowest, current) => 
      current.duration > slowest.duration ? current : slowest
    );
  }

  // Calculate performance score
  private calculatePerformanceScore(): number {
    const navigationMetrics = this.metrics.filter(m => m.type === 'navigation');
    if (navigationMetrics.length === 0) return 100;

    const latestNavigation = navigationMetrics[navigationMetrics.length - 1];
    const loadTime = latestNavigation.duration;

    // Score based on load time (lower is better)
    if (loadTime < 1000) return 100;
    if (loadTime < 2000) return 90;
    if (loadTime < 3000) return 80;
    if (loadTime < 5000) return 60;
    return 40;
  }

  // Optimize images
  optimizeImages(): void {
    if (typeof window !== 'undefined') {
      const images = document.querySelectorAll('img');
      images.forEach(img => {
        // Add loading="lazy" for images below the fold
        if (!img.loading) {
          img.loading = 'lazy';
        }
        
        // Add fetchpriority for critical images
        if (img.src.includes('hero') || img.src.includes('logo')) {
          img.setAttribute('fetchpriority', 'high');
        }
      });
    }
  }

  // Preload critical resources
  preloadCriticalResources(): void {
    if (typeof window !== 'undefined') {
      const criticalResources = [
        '/api/menu',
        '/api/categories',
        '/api/user'
      ];

      criticalResources.forEach(resource => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = resource;
        link.as = 'fetch';
        link.crossOrigin = 'anonymous';
        document.head.appendChild(link);
      });
    }
  }

  // Optimize fonts
  optimizeFonts(): void {
    if (typeof window !== 'undefined') {
      // Preload critical fonts
      const criticalFonts = [
        '/fonts/inter-var.woff2'
      ];

      criticalFonts.forEach(font => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = font;
        link.as = 'font';
        link.type = 'font/woff2';
        link.crossOrigin = 'anonymous';
        document.head.appendChild(link);
      });
    }
  }

  // Enable service worker caching
  enableServiceWorkerCaching(): void {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('Service Worker registered:', registration);
        })
        .catch(error => {
          console.error('Service Worker registration failed:', error);
        });
    }
  }

  // Send to monitoring service
  private sendToMonitoringService(data: any): void {
    // In production, send to monitoring service
    console.log('Performance Data:', data);
  }

  // Cleanup
  destroy(): void {
    this.observers.forEach(observer => {
      observer.disconnect();
    });
    this.observers.clear();
    this.metrics = [];
  }
}

// Types
export interface PerformanceMetric {
  timestamp: number;
  type: string;
  name: string;
  duration: number;
  startTime: number;
  entryType: string;
  details: any;
}

export interface PerformanceSummary {
  totalMetrics: number;
  navigationCount: number;
  resourceCount: number;
  longTaskCount: number;
  averageResourceLoadTime: number;
  slowestResource: PerformanceMetric | null;
  performanceScore: number;
}

// Performance optimization utilities
export const performanceUtils = {
  // Debounce function
  debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  },

  // Throttle function
  throttle<T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): (...args: Parameters<T>) => void {
    let inThrottle: boolean;
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  // Memoize function
  memoize<T extends (...args: any[]) => any>(
    func: T,
    resolver?: (...args: Parameters<T>) => string
  ): T {
    const cache = new Map();
    return ((...args: Parameters<T>) => {
      const key = resolver ? resolver(...args) : JSON.stringify(args);
      if (cache.has(key)) {
        return cache.get(key);
      }
      const result = func(...args);
      cache.set(key, result);
      return result;
    }) as T;
  }
}; 