import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    // Get current user from session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get workspace_id from query params
    const { searchParams } = new URL(request.url);
    const workspaceId = searchParams.get('workspace_id');
    const period = searchParams.get('period') || '30'; // days
    
    if (!workspaceId) {
      return NextResponse.json({ error: 'workspace_id is required' }, { status: 400 });
    }

    // Verify user has access to this workspace
    const { data: workspace, error: workspaceError } = await supabase
      .from('workspaces')
      .select('id')
      .eq('id', workspaceId)
      .eq('user_id', session.user.id)
      .single();

    if (workspaceError || !workspace) {
      return NextResponse.json({ error: 'Workspace not found or access denied' }, { status: 403 });
    }

    // Get historical sales data (mock data for now)
    const historicalData = await generateHistoricalData(workspaceId, parseInt(period));
    
    // Generate forecast predictions
    const forecastData = await generateForecast(historicalData, parseInt(period));

    return NextResponse.json({
      historical: historicalData,
      forecast: forecastData,
      period: parseInt(period)
    });

  } catch (error) {
    console.error('Forecast API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get current user from session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { workspace_id, forecast_type, parameters } = body;

    if (!workspace_id || !forecast_type) {
      return NextResponse.json({ 
        error: 'workspace_id and forecast_type are required' 
      }, { status: 400 });
    }

    // Verify user has access to this workspace
    const { data: workspace, error: workspaceError } = await supabase
      .from('workspaces')
      .select('id')
      .eq('id', workspace_id)
      .eq('user_id', session.user.id)
      .single();

    if (workspaceError || !workspace) {
      return NextResponse.json({ error: 'Workspace not found or access denied' }, { status: 403 });
    }

    // Generate custom forecast based on type
    const customForecast = await generateCustomForecast(forecast_type, parameters, workspace_id);

    return NextResponse.json({ 
      forecast: customForecast,
      type: forecast_type,
      message: 'Custom forecast generated successfully'
    });

  } catch (error) {
    console.error('Forecast API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper functions for generating forecast data
async function generateHistoricalData(workspaceId: string, days: number) {
  // Mock historical data - in real implementation, this would come from sales database
  const data = [];
  const now = new Date();
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    data.push({
      date: date.toISOString().split('T')[0],
      revenue: Math.floor(Math.random() * 2000) + 500,
      orders: Math.floor(Math.random() * 50) + 10,
      customers: Math.floor(Math.random() * 30) + 5,
      average_order: Math.floor(Math.random() * 20) + 15,
      popular_items: ['Pizza Margherita', 'Caesar Salad', 'Tiramisu'].slice(0, Math.floor(Math.random() * 3) + 1)
    });
  }
  
  return data;
}

async function generateForecast(historicalData: any[], days: number) {
  // Simple forecasting algorithm - in real implementation, this would use ML/AI
  const recentData = historicalData.slice(-7); // Last 7 days
  const avgRevenue = recentData.reduce((sum, day) => sum + day.revenue, 0) / recentData.length;
  const avgOrders = recentData.reduce((sum, day) => sum + day.orders, 0) / recentData.length;
  
  const forecast = [];
  const now = new Date();
  
  for (let i = 1; i <= days; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() + i);
    
    // Add some seasonality and randomness
    const dayOfWeek = date.getDay();
    const weekendMultiplier = (dayOfWeek === 0 || dayOfWeek === 6) ? 1.3 : 1.0;
    const randomFactor = 0.8 + Math.random() * 0.4; // 0.8 to 1.2
    
    forecast.push({
      date: date.toISOString().split('T')[0],
      predicted_revenue: Math.floor(avgRevenue * weekendMultiplier * randomFactor),
      predicted_orders: Math.floor(avgOrders * weekendMultiplier * randomFactor),
      confidence: 0.7 + Math.random() * 0.2, // 0.7 to 0.9
      factors: {
        seasonality: weekendMultiplier,
        trend: randomFactor,
        historical_average: avgRevenue
      }
    });
  }
  
  return forecast;
}

async function generateCustomForecast(type: string, parameters: any, workspaceId: string) {
  // Generate different types of forecasts based on the type
  switch (type) {
    case 'demand':
      return await generateDemandForecast(parameters);
    case 'revenue':
      return await generateRevenueForecast(parameters);
    case 'seasonal':
      return await generateSeasonalForecast(parameters);
    case 'menu_item':
      return await generateMenuItemForecast(parameters, workspaceId);
    default:
      throw new Error(`Unknown forecast type: ${type}`);
  }
}

async function generateDemandForecast(parameters: any) {
  const { days = 30, item_id, category } = parameters;
  
  // Mock demand forecast
  const forecast = [];
  for (let i = 1; i <= days; i++) {
    forecast.push({
      date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      predicted_demand: Math.floor(Math.random() * 50) + 10,
      confidence: 0.75 + Math.random() * 0.15
    });
  }
  
  return {
    type: 'demand',
    forecast,
    parameters
  };
}

async function generateRevenueForecast(parameters: any) {
  const { days = 30, growth_rate = 0.05 } = parameters;
  
  const baseRevenue = 1500;
  const forecast = [];
  
  for (let i = 1; i <= days; i++) {
    const growth = Math.pow(1 + growth_rate, i);
    forecast.push({
      date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      predicted_revenue: Math.floor(baseRevenue * growth * (0.9 + Math.random() * 0.2)),
      growth_rate: growth_rate,
      confidence: 0.8 + Math.random() * 0.1
    });
  }
  
  return {
    type: 'revenue',
    forecast,
    parameters
  };
}

async function generateSeasonalForecast(parameters: any) {
  const { days = 90, season = 'summer' } = parameters;
  
  const seasonalFactors = {
    summer: { base: 1200, peak: 1800 },
    winter: { base: 1000, peak: 1400 },
    spring: { base: 1100, peak: 1600 },
    autumn: { base: 1150, peak: 1700 }
  };
  
  const factors = seasonalFactors[season as keyof typeof seasonalFactors] || seasonalFactors.summer;
  const forecast = [];
  
  for (let i = 1; i <= days; i++) {
    const seasonalFactor = 1 + 0.3 * Math.sin((i / days) * Math.PI * 2);
    forecast.push({
      date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      predicted_revenue: Math.floor(factors.base + (factors.peak - factors.base) * seasonalFactor),
      seasonal_factor: seasonalFactor,
      confidence: 0.85 + Math.random() * 0.1
    });
  }
  
  return {
    type: 'seasonal',
    forecast,
    parameters
  };
}

async function generateMenuItemForecast(parameters: any, workspaceId: string) {
  const { item_id, days = 30 } = parameters;
  
  // Get menu item data
  const { data: menuItem } = await supabase
    .from('menu_items')
    .select('*')
    .eq('id', item_id)
    .eq('workspace_id', workspaceId)
    .single();
  
  if (!menuItem) {
    throw new Error('Menu item not found');
  }
  
  const forecast = [];
  const baseDemand = Math.floor(Math.random() * 20) + 5;
  
  for (let i = 1; i <= days; i++) {
    const dayOfWeek = new Date(Date.now() + i * 24 * 60 * 60 * 1000).getDay();
    const weekendMultiplier = (dayOfWeek === 0 || dayOfWeek === 6) ? 1.4 : 1.0;
    
    forecast.push({
      date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      predicted_demand: Math.floor(baseDemand * weekendMultiplier * (0.8 + Math.random() * 0.4)),
      item_name: menuItem.name,
      price: menuItem.price,
      confidence: 0.7 + Math.random() * 0.2
    });
  }
  
  return {
    type: 'menu_item',
    forecast,
    item: menuItem,
    parameters
  };
}
