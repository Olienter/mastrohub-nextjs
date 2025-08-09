import { NextRequest, NextResponse } from 'next/server';
import { enterpriseService } from '@/lib/enterprise';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const tenantId = searchParams.get('tenant_id') || 'default';

    switch (type) {
      case 'tenant':
        const tenant = await enterpriseService.getTenant(tenantId);
        return NextResponse.json({ tenant });

      case 'audit_logs':
        const filters = {
          userId: searchParams.get('user_id'),
          action: searchParams.get('action'),
          resource: searchParams.get('resource'),
          startDate: searchParams.get('start_date'),
          endDate: searchParams.get('end_date'),
          limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined,
        };
        const auditLogs = await enterpriseService.getAuditLogs(tenantId, filters);
        return NextResponse.json({ audit_logs: auditLogs });

      case 'compliance_report':
        const reportType = searchParams.get('report_type') as 'gdpr' | 'security' | 'data_retention' | 'access_logs';
        if (!reportType) {
          return NextResponse.json({ error: 'Report type is required' }, { status: 400 });
        }
        const report = await enterpriseService.generateComplianceReport(tenantId, reportType);
        return NextResponse.json({ report });

      case 'analytics':
        const period = searchParams.get('period') as 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly' || 'monthly';
        const analytics = await enterpriseService.getEnterpriseAnalytics(tenantId, period);
        return NextResponse.json({ analytics });

      case 'subscription_plans':
        const plans = await enterpriseService.getSubscriptionPlans();
        return NextResponse.json({ plans });

      case 'white_label_config':
        const config = await enterpriseService.generateWhiteLabelConfig(tenantId);
        return NextResponse.json({ config });

      case 'advanced_report':
        const reportType2 = searchParams.get('report_type') as 'financial' | 'operational' | 'marketing' | 'comprehensive';
        const startDate = searchParams.get('start_date');
        const endDate = searchParams.get('end_date');
        
        if (!reportType2 || !startDate || !endDate) {
          return NextResponse.json({ error: 'Report type, start date, and end date are required' }, { status: 400 });
        }
        
        const advancedReport = await enterpriseService.generateAdvancedReport(tenantId, reportType2, {
          start: startDate,
          end: endDate,
        });
        return NextResponse.json({ report: advancedReport });

      default:
        // Return overview of enterprise features
        const tenant = await enterpriseService.getTenant(tenantId);
        const analytics = await enterpriseService.getEnterpriseAnalytics(tenantId, 'monthly');
        const plans = await enterpriseService.getSubscriptionPlans();
        
        return NextResponse.json({
          tenant,
          analytics,
          available_plans: plans,
          features: {
            multi_tenant: true,
            audit_logging: true,
            compliance_reports: true,
            advanced_analytics: true,
            white_label: tenant?.settings.features.white_label || false,
            custom_integrations: tenant?.settings.features.custom_integrations || false,
          },
        });
    }
  } catch (error) {
    console.error('Enterprise API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { action, tenant_id = 'default', ...data } = body;

    switch (action) {
      case 'create_tenant':
        const newTenant = await enterpriseService.createTenant(data);
        return NextResponse.json({ tenant: newTenant });

      case 'update_tenant':
        const updatedTenant = await enterpriseService.updateTenant(tenant_id, data);
        return NextResponse.json({ tenant: updatedTenant });

      case 'log_audit_event':
        const { user_id, action: auditAction, resource, details, ip_address, user_agent } = data;
        const auditLog = await enterpriseService.logAuditEvent(
          tenant_id,
          user_id,
          auditAction,
          resource,
          details,
          ip_address,
          user_agent
        );
        return NextResponse.json({ audit_log: auditLog });

      case 'generate_compliance_report':
        const { report_type } = data;
        const report = await enterpriseService.generateComplianceReport(tenant_id, report_type);
        return NextResponse.json({ report });

      case 'generate_advanced_report':
        const { report_type: advancedReportType, date_range } = data;
        const advancedReport = await enterpriseService.generateAdvancedReport(
          tenant_id,
          advancedReportType,
          date_range
        );
        return NextResponse.json({ report: advancedReport });

      case 'get_white_label_config':
        const config = await enterpriseService.generateWhiteLabelConfig(tenant_id);
        return NextResponse.json({ config });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Enterprise API POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
