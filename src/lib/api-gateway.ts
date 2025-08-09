import { NextRequest } from 'next/server';

// Rate limiting configuration
interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  message: string;
}

// Webhook configuration
interface WebhookConfig {
  url: string;
  events: string[];
  secret: string;
  retries: number;
}

// Third-party integration configuration
interface IntegrationConfig {
  name: string;
  apiKey: string;
  baseUrl: string;
  enabled: boolean;
}

export class APIGateway {
  private rateLimitStore: Map<string, { count: number; resetTime: number }> = new Map();
  private webhooks: Map<string, WebhookConfig> = new Map();
  private integrations: Map<string, IntegrationConfig> = new Map();

  constructor() {
    this.initializeIntegrations();
    this.initializeWebhooks();
  }

  // Rate Limiting
  async checkRateLimit(identifier: string, config: RateLimitConfig): Promise<boolean> {
    const now = Date.now();
    const key = `rate_limit:${identifier}`;
    const current = this.rateLimitStore.get(key);

    if (!current || now > current.resetTime) {
      this.rateLimitStore.set(key, {
        count: 1,
        resetTime: now + config.windowMs
      });
      return true;
    }

    if (current.count >= config.maxRequests) {
      return false;
    }

    current.count++;
    this.rateLimitStore.set(key, current);
    return true;
  }

  // Webhook Management
  async registerWebhook(id: string, config: WebhookConfig): Promise<void> {
    this.webhooks.set(id, config);
  }

  async triggerWebhook(event: string, data: any): Promise<void> {
    const relevantWebhooks = Array.from(this.webhooks.values())
      .filter(webhook => webhook.events.includes(event));

    for (const webhook of relevantWebhooks) {
      try {
        await this.sendWebhook(webhook, event, data);
      } catch (error) {
        console.error(`Webhook delivery failed for ${webhook.url}:`, error);
        await this.retryWebhook(webhook, event, data);
      }
    }
  }

  private async sendWebhook(webhook: WebhookConfig, event: string, data: any): Promise<void> {
    const response = await fetch(webhook.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Webhook-Secret': webhook.secret,
        'X-Event-Type': event
      },
      body: JSON.stringify({
        event,
        data,
        timestamp: new Date().toISOString()
      })
    });

    if (!response.ok) {
      throw new Error(`Webhook delivery failed: ${response.status}`);
    }
  }

  private async retryWebhook(webhook: WebhookConfig, event: string, data: any): Promise<void> {
    for (let i = 0; i < webhook.retries; i++) {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
        await this.sendWebhook(webhook, event, data);
        return;
      } catch (error) {
        console.error(`Webhook retry ${i + 1} failed:`, error);
      }
    }
  }

  // Third-party Integrations
  private initializeIntegrations(): void {
    // Payment Gateway Integration
    this.integrations.set('stripe', {
      name: 'Stripe',
      apiKey: process.env.STRIPE_API_KEY || '',
      baseUrl: 'https://api.stripe.com/v1',
      enabled: !!process.env.STRIPE_API_KEY
    });

    // Email Service Integration
    this.integrations.set('sendgrid', {
      name: 'SendGrid',
      apiKey: process.env.SENDGRID_API_KEY || '',
      baseUrl: 'https://api.sendgrid.com/v3',
      enabled: !!process.env.SENDGRID_API_KEY
    });

    // SMS Service Integration
    this.integrations.set('twilio', {
      name: 'Twilio',
      apiKey: process.env.TWILIO_API_KEY || '',
      baseUrl: 'https://api.twilio.com/2010-04-01',
      enabled: !!process.env.TWILIO_API_KEY
    });

    // Analytics Integration
    this.integrations.set('google_analytics', {
      name: 'Google Analytics',
      apiKey: process.env.GOOGLE_ANALYTICS_API_KEY || '',
      baseUrl: 'https://analytics.googleapis.com/analytics/v3',
      enabled: !!process.env.GOOGLE_ANALYTICS_API_KEY
    });
  }

  private initializeWebhooks(): void {
    // Order webhooks
    this.registerWebhook('order_created', {
      url: process.env.ORDER_WEBHOOK_URL || '',
      events: ['order.created', 'order.updated'],
      secret: process.env.WEBHOOK_SECRET || '',
      retries: 3
    });

    // Payment webhooks
    this.registerWebhook('payment_processed', {
      url: process.env.PAYMENT_WEBHOOK_URL || '',
      events: ['payment.succeeded', 'payment.failed'],
      secret: process.env.WEBHOOK_SECRET || '',
      retries: 3
    });
  }

  // API Request Handler
  async handleAPIRequest(
    request: NextRequest,
    handler: (req: NextRequest) => Promise<Response>,
    rateLimitConfig?: RateLimitConfig
  ): Promise<Response> {
    try {
      // Rate limiting check
      if (rateLimitConfig) {
        const clientIP = request.ip || 'unknown';
        const isAllowed = await this.checkRateLimit(clientIP, rateLimitConfig);
        
        if (!isAllowed) {
          return new Response(
            JSON.stringify({ error: 'Rate limit exceeded' }),
            { 
              status: 429,
              headers: { 'Content-Type': 'application/json' }
            }
          );
        }
      }

      // Process request
      const response = await handler(request);

      // Add API Gateway headers
      const headers = new Headers(response.headers);
      headers.set('X-API-Gateway', 'MastroHub');
      headers.set('X-Request-ID', this.generateRequestId());

      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers
      });

    } catch (error) {
      console.error('API Gateway error:', error);
      return new Response(
        JSON.stringify({ error: 'Internal server error' }),
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
  }

  // Integration Methods
  async callIntegration(integrationName: string, endpoint: string, options: RequestInit = {}): Promise<any> {
    const integration = this.integrations.get(integrationName);
    
    if (!integration || !integration.enabled) {
      throw new Error(`Integration ${integrationName} not available`);
    }

    const url = `${integration.baseUrl}${endpoint}`;
    const headers = {
      'Authorization': `Bearer ${integration.apiKey}`,
      'Content-Type': 'application/json',
      ...options.headers
    };

    const response = await fetch(url, {
      ...options,
      headers
    });

    if (!response.ok) {
      throw new Error(`Integration ${integrationName} request failed: ${response.status}`);
    }

    return response.json();
  }

  // Utility Methods
  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Get integration status
  getIntegrationStatus(): Record<string, { enabled: boolean; name: string }> {
    const status: Record<string, { enabled: boolean; name: string }> = {};
    
    for (const [key, integration] of this.integrations) {
      status[key] = {
        enabled: integration.enabled,
        name: integration.name
      };
    }

    return status;
  }

  // Get webhook status
  getWebhookStatus(): Record<string, { url: string; events: string[] }> {
    const status: Record<string, { url: string; events: string[] }> = {};
    
    for (const [key, webhook] of this.webhooks) {
      status[key] = {
        url: webhook.url,
        events: webhook.events
      };
    }

    return status;
  }
}

// Default rate limit configurations
export const DEFAULT_RATE_LIMITS = {
  strict: { windowMs: 60000, maxRequests: 10, message: 'Too many requests' },
  normal: { windowMs: 60000, maxRequests: 100, message: 'Rate limit exceeded' },
  lenient: { windowMs: 60000, maxRequests: 1000, message: 'Rate limit exceeded' }
};

// Export singleton instance
export const apiGateway = new APIGateway();
