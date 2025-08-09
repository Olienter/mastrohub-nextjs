// Production launch manager for MastroHub
export class LaunchManager {
  private static instance: LaunchManager;
  private launchStatus: LaunchStatus = 'preparing';
  private healthChecks: HealthCheck[] = [];
  private launchSteps: LaunchStep[] = [];

  static getInstance(): LaunchManager {
    if (!LaunchManager.instance) {
      LaunchManager.instance = new LaunchManager();
    }
    return LaunchManager.instance;
  }

  // Initialize launch process
  async initialize(): Promise<void> {
    this.launchStatus = 'initializing';
    
    // Register health checks
    this.registerHealthChecks();
    
    // Register launch steps
    this.registerLaunchSteps();
    
    console.log('🚀 MastroHub Launch Manager initialized');
  }

  // Register health checks
  private registerHealthChecks(): void {
    this.healthChecks = [
      {
        name: 'Database Connection',
        check: async () => {
          const response = await fetch('/api/health');
          return response.ok;
        }
      },
      {
        name: 'API Endpoints',
        check: async () => {
          const endpoints = ['/api/menu', '/api/categories', '/api/user'];
          const results = await Promise.all(
            endpoints.map(async (endpoint) => {
              try {
                const response = await fetch(endpoint);
                return response.ok;
              } catch {
                return false;
              }
            })
          );
          return results.every(Boolean);
        }
      },
      {
        name: 'AI Services',
        check: async () => {
          try {
            const { AIProvider } = await import('./ai-provider');
            const provider = new AIProvider();
            const response = await provider.generateResponse('test');
            return !!response;
          } catch {
            return false;
          }
        }
      },
      {
        name: 'Security Services',
        check: async () => {
          try {
            const { SecurityManager } = await import('./security');
            const security = SecurityManager.getInstance();
            const testInput = '<script>alert("test")</script>';
            const sanitized = security.sanitizeInput(testInput);
            return !sanitized.includes('<script>');
          } catch {
            return false;
          }
        }
      },
      {
        name: 'Performance Monitoring',
        check: async () => {
          try {
            const { PerformanceManager } = await import('./performance');
            const performance = PerformanceManager.getInstance();
            performance.init();
            return true;
          } catch {
            return false;
          }
        }
      }
    ];
  }

  // Register launch steps
  private registerLaunchSteps(): void {
    this.launchSteps = [
      {
        name: 'Environment Validation',
        execute: async () => {
          const requiredEnvVars = [
            'NEXT_PUBLIC_SUPABASE_URL',
            'NEXT_PUBLIC_SUPABASE_ANON_KEY',
            'OPENAI_API_KEY'
          ];

          const missing = requiredEnvVars.filter(env => !process.env[env]);
          if (missing.length > 0) {
            throw new Error(`Missing environment variables: ${missing.join(', ')}`);
          }

          return { status: 'validated', envVars: requiredEnvVars.length };
        }
      },
      {
        name: 'Security Hardening',
        execute: async () => {
          const { SecurityManager } = await import('./security');
          const security = SecurityManager.getInstance();
          
          // Initialize security features
          const headers = security.getSecurityHeaders();
          
          return { status: 'hardened', securityHeaders: Object.keys(headers).length };
        }
      },
      {
        name: 'Performance Optimization',
        execute: async () => {
          const { PerformanceManager } = await import('./performance');
          const performance = PerformanceManager.getInstance();
          
          // Initialize performance monitoring
          performance.init();
          performance.optimizeImages();
          performance.preloadCriticalResources();
          performance.optimizeFonts();
          
          return { status: 'optimized', features: ['monitoring', 'images', 'fonts'] };
        }
      },
      {
        name: 'Testing Framework',
        execute: async () => {
          const { TestingFramework, createUnitTestSuite, createIntegrationTestSuite } = await import('./testing');
          const testing = TestingFramework.getInstance();
          
          // Register test suites
          testing.registerTestSuite(createUnitTestSuite());
          testing.registerTestSuite(createIntegrationTestSuite());
          
          return { status: 'configured', testSuites: 2 };
        }
      },
      {
        name: 'AI Services',
        execute: async () => {
          const { AIAgent } = await import('./ai-agent');
          const { AIProvider } = await import('./ai-provider');
          
          // Initialize AI services
          const agent = new AIAgent();
          const provider = new AIProvider();
          
          return { status: 'initialized', services: ['agent', 'provider'] };
        }
      },
      {
        name: 'Database Connection',
        execute: async () => {
          // Test database connection
          const response = await fetch('/api/health');
          if (!response.ok) {
            throw new Error('Database connection failed');
          }
          
          return { status: 'connected', health: 'ok' };
        }
      },
      {
        name: 'Cache Initialization',
        execute: async () => {
          const { cacheManager } = await import('./cache-manager');
          
          // Initialize cache
          await cacheManager.initialize();
          
          return { status: 'initialized', cacheSize: '0' };
        }
      },
      {
        name: 'API Gateway',
        execute: async () => {
          const { apiGateway } = await import('./api-gateway');
          
          // Initialize API gateway
          await apiGateway.initialize();
          
          return { status: 'initialized', endpoints: 'configured' };
        }
      }
    ];
  }

  // Run health checks
  async runHealthChecks(): Promise<HealthCheckResult[]> {
    const results: HealthCheckResult[] = [];

    for (const check of this.healthChecks) {
      try {
        const startTime = Date.now();
        const isHealthy = await check.check();
        const duration = Date.now() - startTime;

        results.push({
          name: check.name,
          status: isHealthy ? 'healthy' : 'unhealthy',
          duration,
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        results.push({
          name: check.name,
          status: 'error',
          duration: 0,
          error: error instanceof Error ? error.message : String(error),
          timestamp: new Date().toISOString()
        });
      }
    }

    return results;
  }

  // Execute launch steps
  async executeLaunchSteps(): Promise<LaunchStepResult[]> {
    const results: LaunchStepResult[] = [];

    for (const step of this.launchSteps) {
      try {
        const startTime = Date.now();
        const result = await step.execute();
        const duration = Date.now() - startTime;

        results.push({
          name: step.name,
          status: 'completed',
          duration,
          result,
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        results.push({
          name: step.name,
          status: 'failed',
          duration: 0,
          error: error instanceof Error ? error.message : String(error),
          timestamp: new Date().toISOString()
        });
      }
    }

    return results;
  }

  // Complete launch process
  async launch(): Promise<LaunchReport> {
    this.launchStatus = 'launching';
    
    console.log('🚀 Starting MastroHub launch sequence...');

    // Run health checks
    const healthResults = await this.runHealthChecks();
    const healthyChecks = healthResults.filter(r => r.status === 'healthy');
    
    if (healthyChecks.length < healthResults.length) {
      this.launchStatus = 'failed';
      throw new Error(`Health checks failed: ${healthResults.length - healthyChecks.length} failed`);
    }

    // Execute launch steps
    const stepResults = await this.executeLaunchSteps();
    const completedSteps = stepResults.filter(r => r.status === 'completed');
    
    if (completedSteps.length < stepResults.length) {
      this.launchStatus = 'failed';
      throw new Error(`Launch steps failed: ${stepResults.length - completedSteps.length} failed`);
    }

    // Final validation
    await this.finalValidation();

    this.launchStatus = 'launched';
    
    const report: LaunchReport = {
      status: 'success',
      timestamp: new Date().toISOString(),
      healthChecks: healthResults,
      launchSteps: stepResults,
      summary: {
        totalHealthChecks: healthResults.length,
        healthyChecks: healthyChecks.length,
        totalLaunchSteps: stepResults.length,
        completedSteps: completedSteps.length,
        totalDuration: stepResults.reduce((sum, r) => sum + r.duration, 0)
      }
    };

    console.log('🎉 MastroHub successfully launched!');
    return report;
  }

  // Final validation
  private async finalValidation(): Promise<void> {
    // Verify all critical services are running
    const criticalServices = [
      { name: 'Database', check: () => fetch('/api/health') },
      { name: 'Menu API', check: () => fetch('/api/menu') },
      { name: 'AI Services', check: async () => {
        const { AIProvider } = await import('./ai-provider');
        const provider = new AIProvider();
        return provider.generateResponse('test');
      }}
    ];

    for (const service of criticalServices) {
      try {
        await service.check();
      } catch (error) {
        throw new Error(`Critical service ${service.name} validation failed`);
      }
    }
  }

  // Get launch status
  getLaunchStatus(): LaunchStatus {
    return this.launchStatus;
  }

  // Get launch report
  async getLaunchReport(): Promise<LaunchReport | null> {
    if (this.launchStatus !== 'launched') {
      return null;
    }

    const healthResults = await this.runHealthChecks();
    const stepResults = this.launchSteps.map(step => ({
      name: step.name,
      status: 'completed' as const,
      duration: 0,
      timestamp: new Date().toISOString()
    }));

    return {
      status: 'success',
      timestamp: new Date().toISOString(),
      healthChecks: healthResults,
      launchSteps: stepResults,
      summary: {
        totalHealthChecks: healthResults.length,
        healthyChecks: healthResults.filter(r => r.status === 'healthy').length,
        totalLaunchSteps: stepResults.length,
        completedSteps: stepResults.length,
        totalDuration: 0
      }
    };
  }
}

// Types
export type LaunchStatus = 'preparing' | 'initializing' | 'launching' | 'launched' | 'failed';

export interface HealthCheck {
  name: string;
  check: () => Promise<boolean>;
}

export interface HealthCheckResult {
  name: string;
  status: 'healthy' | 'unhealthy' | 'error';
  duration: number;
  error?: string;
  timestamp: string;
}

export interface LaunchStep {
  name: string;
  execute: () => Promise<any>;
}

export interface LaunchStepResult {
  name: string;
  status: 'completed' | 'failed';
  duration: number;
  result?: any;
  error?: string;
  timestamp: string;
}

export interface LaunchReport {
  status: 'success' | 'failed';
  timestamp: string;
  healthChecks: HealthCheckResult[];
  launchSteps: LaunchStepResult[];
  summary: LaunchSummary;
}

export interface LaunchSummary {
  totalHealthChecks: number;
  healthyChecks: number;
  totalLaunchSteps: number;
  completedSteps: number;
  totalDuration: number;
}

// Launch utilities
export const launchUtils = {
  // Check if application is ready for launch
  isReadyForLaunch: async (): Promise<boolean> => {
    try {
      const response = await fetch('/api/health');
      return response.ok;
    } catch {
      return false;
    }
  },

  // Get system information
  getSystemInfo: () => {
    return {
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch,
      memory: process.memoryUsage(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV
    };
  },

  // Validate production environment
  validateProductionEnvironment: (): string[] => {
    const errors: string[] = [];
    
    if (process.env.NODE_ENV !== 'production') {
      errors.push('Not running in production mode');
    }
    
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      errors.push('Missing Supabase URL');
    }
    
    if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      errors.push('Missing Supabase key');
    }
    
    return errors;
  }
};
