import { NextRequest, NextResponse } from 'next/server';
import { qualityAssuranceService, qualityMonitor } from '@/lib/quality-assurance';
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
      case 'dashboard':
        const dashboardData = await qualityMonitor.generateDashboardData();
        return NextResponse.json({ dashboard: dashboardData });

      case 'security_scan':
        const securityScan = await qualityAssuranceService.performSecurityScan();
        return NextResponse.json({ security: securityScan });

      case 'quality_trends':
        const trends = qualityMonitor.getQualityTrends();
        return NextResponse.json({ trends });

      case 'dependencies':
        const dependencies = await qualityAssuranceService.analyzeDependencies();
        return NextResponse.json({ dependencies });

      case 'performance':
        const mockCode = `// Mock code for performance analysis
        const items = [1, 2, 3, 4, 5];
        for (let i = 0; i < items.length; i++) {
          console.log(items[i]);
        }`;
        const performanceAnalysis = await qualityAssuranceService.analyzePerformance(mockCode);
        return NextResponse.json({ performance: performanceAnalysis });

      default:
        return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 });
    }
  } catch (error) {
    console.error('Quality API error:', error);
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
    const { action, code, file_path, context, files } = body;

    switch (action) {
      case 'analyze_code':
        if (!code) {
          return NextResponse.json({ error: 'Code is required' }, { status: 400 });
        }

        const qualityMetrics = await qualityAssuranceService.analyzeCodeQuality(code);
        const lintingResult = await qualityAssuranceService.analyzeLinting(code, file_path || 'unknown');
        const performanceAnalysis = await qualityAssuranceService.analyzePerformance(code);

        return NextResponse.json({
          quality: qualityMetrics,
          linting: lintingResult,
          performance: performanceAnalysis
        });

      case 'code_review':
        if (!code) {
          return NextResponse.json({ error: 'Code is required' }, { status: 400 });
        }

        const codeReview = await qualityAssuranceService.performCodeReview(code, context || '');
        return NextResponse.json({ review: codeReview });

      case 'generate_report':
        if (!files || !Array.isArray(files)) {
          return NextResponse.json({ error: 'Files array is required' }, { status: 400 });
        }

        const qualityReport = await qualityAssuranceService.generateQualityReport(files);
        return NextResponse.json({ report: qualityReport });

      case 'track_metrics':
        if (!code || !file_path) {
          return NextResponse.json({ error: 'Code and file_path are required' }, { status: 400 });
        }

        await qualityMonitor.trackQualityMetrics(file_path, code);
        return NextResponse.json({ success: true, message: 'Metrics tracked successfully' });

      case 'security_scan':
        const securityScan = await qualityAssuranceService.performSecurityScan();
        return NextResponse.json({ security: securityScan });

      case 'analyze_dependencies':
        const dependencies = await qualityAssuranceService.analyzeDependencies();
        return NextResponse.json({ dependencies });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Quality API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
