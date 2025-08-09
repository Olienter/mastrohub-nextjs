import { NextRequest, NextResponse } from 'next/server';
import { securityService } from '@/lib/security';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    switch (type) {
      case 'analytics':
        return NextResponse.json(securityService.getSecurityAnalytics());
      
      case 'policies':
        return NextResponse.json(securityService.getSecurityPolicies());
      
      case 'threats':
        const limit = parseInt(searchParams.get('limit') || '50');
        return NextResponse.json(securityService.getThreatDetections(limit));
      
      case 'compliance':
        return NextResponse.json(securityService.getComplianceStatus());
      
      case 'encryption':
        return NextResponse.json(securityService.getEncryptionStatus());
      
      default:
        return NextResponse.json({
          message: 'Security API endpoint',
          availableTypes: ['analytics', 'policies', 'threats', 'compliance', 'encryption']
        });
    }
  } catch (error) {
    console.error('Security API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, data } = body;

    switch (action) {
      case 'log_event':
        const event = securityService.logSecurityEvent(data);
        return NextResponse.json({ success: true, event });
      
      case 'log_audit':
        const audit = securityService.logAuditEvent(data);
        return NextResponse.json({ success: true, audit });
      
      case 'record_consent':
        const consent = securityService.recordConsent(data);
        return NextResponse.json({ success: true, consent });
      
      case 'create_policy':
        const policy = securityService.createSecurityPolicy(data);
        return NextResponse.json({ success: true, policy });
      
      case 'update_policy':
        const { id, updates } = data;
        const updatedPolicy = securityService.updateSecurityPolicy(id, updates);
        if (!updatedPolicy) {
          return NextResponse.json(
            { error: 'Policy not found' },
            { status: 404 }
          );
        }
        return NextResponse.json({ success: true, policy: updatedPolicy });
      
      case 'detect_threat':
        const threat = securityService.detectThreat(data);
        return NextResponse.json({ success: true, threat });
      
      case 'mitigate_threat':
        const { threatId, action } = data;
        const mitigated = securityService.mitigateThreat(threatId, action);
        return NextResponse.json({ success: mitigated });
      
      case 'encrypt_data':
        const { dataType, content } = data;
        const encryption = securityService.encryptSensitiveData(dataType, content);
        return NextResponse.json({ success: true, encryption });
      
      case 'delete_user_data':
        const { userId } = data;
        const deleted = securityService.deleteUserData(userId);
        return NextResponse.json({ success: deleted });
      
      case 'get_user_consents':
        const { userId: consentUserId } = data;
        const consents = securityService.getUserConsents(consentUserId);
        return NextResponse.json({ success: true, consents });
      
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Security API POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
