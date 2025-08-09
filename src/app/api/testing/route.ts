import { NextRequest, NextResponse } from 'next/server';
import { testUtils, TestingFramework, createUnitTestSuite, createIntegrationTestSuite, createE2ETestSuite, createPerformanceTestSuite } from '@/lib/testing';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const testType = searchParams.get('test_type');

    switch (type) {
      case 'run_all':
        const framework = TestingFramework.getInstance();
        const report = await framework.runAllTests();
        return NextResponse.json({ report });

      case 'run_suite':
        if (!testType) {
          return NextResponse.json({ error: 'Test type required' }, { status: 400 });
        }

        let results;
        const testingFramework = TestingFramework.getInstance();
        
        switch (testType) {
          case 'unit':
            const unitSuite = createUnitTestSuite();
            results = await testingFramework.runTestSuite(unitSuite);
            break;
          case 'integration':
            const integrationSuite = createIntegrationTestSuite();
            results = await testingFramework.runTestSuite(integrationSuite);
            break;
          case 'e2e':
            const e2eSuite = createE2ETestSuite();
            results = await testingFramework.runTestSuite(e2eSuite);
            break;
          case 'performance':
            const performanceSuite = createPerformanceTestSuite();
            results = await testingFramework.runTestSuite(performanceSuite);
            break;
          default:
            return NextResponse.json({ error: 'Invalid test type' }, { status: 400 });
        }

        return NextResponse.json({ results });

      case 'status':
        // Return test status and available test types
        return NextResponse.json({
          available_tests: ['unit', 'integration', 'e2e', 'performance'],
          last_run: null, // Would be stored in database
          coverage: 0
        });

      default:
        return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 });
    }
  } catch (error) {
    console.error('Testing API error:', error);
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
    const { action, test_type, options } = body;

    switch (action) {
      case 'run_tests':
        const framework = TestingFramework.getInstance();
        let testResults;

        switch (test_type) {
          case 'unit':
            const unitSuite = createUnitTestSuite();
            testResults = await framework.runTestSuite(unitSuite);
            break;
          case 'integration':
            const integrationSuite = createIntegrationTestSuite();
            testResults = await framework.runTestSuite(integrationSuite);
            break;
          case 'e2e':
            const e2eSuite = createE2ETestSuite();
            testResults = await framework.runTestSuite(e2eSuite);
            break;
          case 'performance':
            const performanceSuite = createPerformanceTestSuite();
            testResults = await framework.runTestSuite(performanceSuite);
            break;
          case 'all':
            const report = await TestUtils.runAllTests();
            return NextResponse.json({ report });
          default:
            return NextResponse.json({ error: 'Invalid test type' }, { status: 400 });
        }

        return NextResponse.json({ results: testResults });

      case 'generate_report':
        const report = await TestUtils.runAllTests();
        const reportText = TestUtils.generateTestReport(report);
        return NextResponse.json({ 
          report,
          report_text: reportText
        });

      case 'save_results':
        // Save test results to database (would be implemented)
        return NextResponse.json({ 
          success: true, 
          message: 'Test results saved' 
        });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Testing API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
