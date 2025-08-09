import { NextRequest, NextResponse } from 'next/server';
import { cacheManager } from '@/lib/cache-manager';
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
      case 'metrics':
        const metrics = await cacheManager.getPerformanceMetrics();
        return NextResponse.json(metrics);

      case 'analytics':
        const analytics = await cacheManager.getCacheAnalytics();
        return NextResponse.json(analytics);

      case 'queries':
        const metrics2 = await cacheManager.getPerformanceMetrics();
        return NextResponse.json({
          queries: metrics2.queries,
          total: metrics2.queries.length,
          slowQueries: metrics2.queries.filter(q => q.executionTime > 1000).length,
          averageTime: metrics2.queries.reduce((sum, q) => sum + q.executionTime, 0) / metrics2.queries.length || 0
        });

      default:
        const [metrics3, analytics2] = await Promise.all([
          cacheManager.getPerformanceMetrics(),
          cacheManager.getCacheAnalytics()
        ]);

        return NextResponse.json({
          performance: {
            cache: metrics3.cache,
            queries: metrics3.queries,
            recommendations: metrics3.recommendations,
            analytics: analytics2
          }
        });
    }
  } catch (error) {
    console.error('Performance API error:', error);
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
      case 'optimize_query':
        const optimization = await cacheManager.optimizeQuery(data.query, data.executionTime);
        return NextResponse.json({ success: true, optimization });

      case 'cache_data':
        await cacheManager.set(data.key, data.value, data.ttl);
        return NextResponse.json({ success: true, message: 'Data cached successfully' });

      case 'warm_cache':
        await cacheManager.warmCache(data.keys, data.dataFetcher);
        return NextResponse.json({ success: true, message: 'Cache warmed successfully' });

      case 'evict_expired':
        const evictedCount = await cacheManager.evictExpired();
        return NextResponse.json({ 
          success: true, 
          message: `${evictedCount} expired entries evicted` 
        });

      case 'evict_lru':
        const lruEvicted = await cacheManager.evictLRU(data.maxEntries);
        return NextResponse.json({ 
          success: true, 
          message: `${lruEvicted} LRU entries evicted` 
        });

      case 'clear_cache':
        await cacheManager.clear();
        return NextResponse.json({ success: true, message: 'Cache cleared successfully' });

      case 'optimize_image':
        const optimizedUrl = await cacheManager.optimizeImage(data.imageUrl, data.options);
        return NextResponse.json({ success: true, optimizedUrl });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Performance API POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
