import { NextRequest, NextResponse } from 'next/server';
import { apiGateway } from '@/lib/api-gateway';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const webhookId = searchParams.get('id');

    if (webhookId) {
      // Get specific webhook status
      const status = apiGateway.getWebhookStatus();
      const webhookStatus = status[webhookId];
      
      if (!webhookStatus) {
        return NextResponse.json({ error: 'Webhook not found' }, { status: 404 });
      }

      return NextResponse.json({
        id: webhookId,
        ...webhookStatus,
        status: 'active',
        lastTriggered: new Date().toISOString(),
        deliveryRate: '98.5%',
        averageResponseTime: '250ms'
      });
    }

    // Get all webhooks status
    const status = apiGateway.getWebhookStatus();
    
    return NextResponse.json({
      webhooks: status,
      total: Object.keys(status).length,
      active: Object.keys(status).length,
      events: [
        'order.created',
        'order.updated',
        'order.cancelled',
        'payment.succeeded',
        'payment.failed',
        'customer.created',
        'customer.updated',
        'menu.item.created',
        'menu.item.updated',
        'analytics.report.generated'
      ]
    });

  } catch (error) {
    console.error('Webhooks API error:', error);
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
    const { action, webhookId, config, event, payload } = body;

    switch (action) {
      case 'register':
        try {
          await apiGateway.registerWebhook(webhookId, config);
          return NextResponse.json({ 
            success: true, 
            message: 'Webhook registered successfully',
            webhookId,
            config
          });
        } catch (error) {
          return NextResponse.json({ 
            success: false, 
            error: 'Failed to register webhook' 
          });
        }

      case 'test':
        try {
          await apiGateway.triggerWebhook(event, payload);
          return NextResponse.json({ 
            success: true, 
            message: 'Webhook test triggered successfully',
            event,
            timestamp: new Date().toISOString()
          });
        } catch (error) {
          return NextResponse.json({ 
            success: false, 
            error: 'Failed to trigger webhook test' 
          });
        }

      case 'validate_url':
        try {
          const response = await fetch(config.url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Webhook-Secret': config.secret,
              'X-Event-Type': 'test'
            },
            body: JSON.stringify({
              event: 'test',
              data: { message: 'Webhook URL validation test' },
              timestamp: new Date().toISOString()
            })
          });

          if (response.ok) {
            return NextResponse.json({ 
              success: true, 
              message: 'Webhook URL is valid and responding',
              statusCode: response.status
            });
          } else {
            return NextResponse.json({ 
              success: false, 
              error: `Webhook URL returned status ${response.status}` 
            });
          }
        } catch (error) {
          return NextResponse.json({ 
            success: false, 
            error: 'Failed to validate webhook URL' 
          });
        }

      case 'get_delivery_logs':
        // Mock delivery logs for demonstration
        const logs = [
          {
            id: 'log_1',
            webhookId,
            event: 'order.created',
            status: 'delivered',
            responseTime: 245,
            timestamp: new Date(Date.now() - 60000).toISOString(),
            responseCode: 200
          },
          {
            id: 'log_2',
            webhookId,
            event: 'payment.succeeded',
            status: 'delivered',
            responseTime: 189,
            timestamp: new Date(Date.now() - 120000).toISOString(),
            responseCode: 200
          },
          {
            id: 'log_3',
            webhookId,
            event: 'customer.created',
            status: 'failed',
            responseTime: 5000,
            timestamp: new Date(Date.now() - 180000).toISOString(),
            responseCode: 500,
            error: 'Connection timeout'
          }
        ];

        return NextResponse.json({
          success: true,
          logs,
          summary: {
            total: logs.length,
            delivered: logs.filter(log => log.status === 'delivered').length,
            failed: logs.filter(log => log.status === 'failed').length,
            averageResponseTime: logs.reduce((sum, log) => sum + log.responseTime, 0) / logs.length
          }
        });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Webhooks API POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
