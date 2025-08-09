import { NextRequest, NextResponse } from 'next/server';
import { apiGateway, DEFAULT_RATE_LIMITS } from '@/lib/api-gateway';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    switch (type) {
      case 'integrations':
        return NextResponse.json({
          integrations: apiGateway.getIntegrationStatus()
        });

      case 'webhooks':
        return NextResponse.json({
          webhooks: apiGateway.getWebhookStatus()
        });

      case 'rate-limits':
        return NextResponse.json({
          rateLimits: DEFAULT_RATE_LIMITS
        });

      default:
        return NextResponse.json({
          gateway: {
            name: 'MastroHub API Gateway',
            version: '1.0.0',
            status: 'active',
            integrations: apiGateway.getIntegrationStatus(),
            webhooks: apiGateway.getWebhookStatus(),
            rateLimits: DEFAULT_RATE_LIMITS
          }
        });
    }
  } catch (error) {
    console.error('Gateway API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { action, data } = body;

    switch (action) {
      case 'register_webhook':
        await apiGateway.registerWebhook(data.id, data.config);
        return NextResponse.json({ success: true, message: 'Webhook registered' });

      case 'trigger_webhook':
        await apiGateway.triggerWebhook(data.event, data.payload);
        return NextResponse.json({ success: true, message: 'Webhook triggered' });

      case 'test_integration':
        try {
          const result = await apiGateway.callIntegration(data.integration, data.endpoint, data.options);
          return NextResponse.json({ success: true, result });
        } catch (error) {
          return NextResponse.json({ 
            success: false, 
            error: error instanceof Error ? error.message : 'Integration test failed' 
          });
        }

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Gateway API POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
