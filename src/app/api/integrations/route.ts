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
    const integration = searchParams.get('integration');

    if (integration) {
      // Get specific integration status
      const status = apiGateway.getIntegrationStatus();
      const integrationStatus = status[integration];
      
      if (!integrationStatus) {
        return NextResponse.json({ error: 'Integration not found' }, { status: 404 });
      }

      return NextResponse.json({
        integration,
        ...integrationStatus,
        config: {
          requiresApiKey: true,
          baseUrl: integration === 'stripe' ? 'https://api.stripe.com/v1' :
                   integration === 'sendgrid' ? 'https://api.sendgrid.com/v3' :
                   integration === 'twilio' ? 'https://api.twilio.com/2010-04-01' :
                   integration === 'google_analytics' ? 'https://analytics.googleapis.com/analytics/v3' : '',
          documentation: {
            stripe: 'https://stripe.com/docs/api',
            sendgrid: 'https://sendgrid.com/docs/api-reference/',
            twilio: 'https://www.twilio.com/docs/api',
            google_analytics: 'https://developers.google.com/analytics/devguides/reporting/core/v4'
          }[integration]
        }
      });
    }

    // Get all integrations status
    const status = apiGateway.getIntegrationStatus();
    
    return NextResponse.json({
      integrations: status,
      total: Object.keys(status).length,
      enabled: Object.values(status).filter(s => s.enabled).length,
      disabled: Object.values(status).filter(s => !s.enabled).length
    });

  } catch (error) {
    console.error('Integrations API error:', error);
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
    const { action, integration, endpoint, options } = body;

    switch (action) {
      case 'test_connection':
        try {
          const result = await apiGateway.callIntegration(integration, endpoint || '/', options || {});
          return NextResponse.json({ 
            success: true, 
            message: 'Connection successful',
            result 
          });
        } catch (error) {
          return NextResponse.json({ 
            success: false, 
            error: error instanceof Error ? error.message : 'Connection failed',
            details: {
              integration,
              endpoint,
              timestamp: new Date().toISOString()
            }
          });
        }

      case 'get_balance':
        if (integration === 'stripe') {
          try {
            const result = await apiGateway.callIntegration('stripe', '/balance', { method: 'GET' });
            return NextResponse.json({ 
              success: true, 
              balance: result.available?.[0]?.amount || 0,
              currency: result.available?.[0]?.currency || 'usd'
            });
          } catch (error) {
            return NextResponse.json({ 
              success: false, 
              error: 'Failed to get balance' 
            });
          }
        }
        return NextResponse.json({ error: 'Balance check not supported for this integration' }, { status: 400 });

      case 'send_test_email':
        if (integration === 'sendgrid') {
          try {
            const testEmail = {
              method: 'POST',
              body: JSON.stringify({
                personalizations: [{ to: [{ email: 'test@example.com' }] }],
                from: { email: 'noreply@mastrohub.com' },
                subject: 'Test Email from MastroHub',
                content: [{ type: 'text/plain', value: 'This is a test email from MastroHub API Gateway.' }]
              })
            };
            
            const result = await apiGateway.callIntegration('sendgrid', '/mail/send', testEmail);
            return NextResponse.json({ 
              success: true, 
              message: 'Test email sent successfully',
              messageId: result.id
            });
          } catch (error) {
            return NextResponse.json({ 
              success: false, 
              error: 'Failed to send test email' 
            });
          }
        }
        return NextResponse.json({ error: 'Test email not supported for this integration' }, { status: 400 });

      case 'send_test_sms':
        if (integration === 'twilio') {
          try {
            const testSms = {
              method: 'POST',
              body: new URLSearchParams({
                To: '+1234567890',
                From: process.env.TWILIO_PHONE_NUMBER || '',
                Body: 'Test SMS from MastroHub API Gateway'
              }).toString(),
              headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            };
            
            const result = await apiGateway.callIntegration('twilio', `/Accounts/${process.env.TWILIO_ACCOUNT_SID}/Messages.json`, testSms);
            return NextResponse.json({ 
              success: true, 
              message: 'Test SMS sent successfully',
              messageId: result.sid
            });
          } catch (error) {
            return NextResponse.json({ 
              success: false, 
              error: 'Failed to send test SMS' 
            });
          }
        }
        return NextResponse.json({ error: 'Test SMS not supported for this integration' }, { status: 400 });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Integrations API POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
