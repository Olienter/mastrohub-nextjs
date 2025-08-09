import { NextRequest, NextResponse } from 'next/server';

// Mock data for advanced analytics
const mockAdvancedAnalytics = {
  salesAnalytics: {
    dailySales: [
      { date: '2024-01-01', revenue: 2450, orders: 45, avgOrder: 54.44 },
      { date: '2024-01-02', revenue: 2890, orders: 52, avgOrder: 55.58 },
      { date: '2024-01-03', revenue: 3120, orders: 58, avgOrder: 53.79 },
      { date: '2024-01-04', revenue: 2780, orders: 49, avgOrder: 56.73 },
      { date: '2024-01-05', revenue: 3450, orders: 62, avgOrder: 55.65 },
      { date: '2024-01-06', revenue: 3980, orders: 71, avgOrder: 56.06 },
      { date: '2024-01-07', revenue: 4210, orders: 75, avgOrder: 56.13 }
    ],
    weeklyTrends: [
      { week: 'Week 1', revenue: 16870, orders: 412, growth: 12.5 },
      { week: 'Week 2', revenue: 18230, orders: 445, growth: 8.1 },
      { week: 'Week 3', revenue: 19540, orders: 478, growth: 7.2 },
      { week: 'Week 4', revenue: 20890, orders: 512, growth: 6.9 }
    ],
    monthlyComparison: [
      { month: 'January', revenue: 75630, orders: 1847, avgOrder: 40.95 },
      { month: 'February', revenue: 82340, orders: 2012, avgOrder: 40.92 },
      { month: 'March', revenue: 89120, orders: 2189, avgOrder: 40.69 }
    ]
  },
  customerAnalytics: {
    customerSegments: [
      { segment: 'New Customers', count: 245, revenue: 12890, avgOrder: 52.61 },
      { segment: 'Returning Customers', count: 189, revenue: 15670, avgOrder: 82.91 },
      { segment: 'VIP Customers', count: 67, revenue: 8920, avgOrder: 133.13 },
      { segment: 'Loyal Customers', count: 134, revenue: 11230, avgOrder: 83.81 }
    ],
    customerLifetimeValue: [
      { segment: 'Low Value', count: 156, avgLTV: 45.20, retention: 0.15 },
      { segment: 'Medium Value', count: 203, avgLTV: 89.40, retention: 0.35 },
      { segment: 'High Value', count: 98, avgLTV: 156.80, retention: 0.65 },
      { segment: 'VIP', count: 67, avgLTV: 298.50, retention: 0.85 }
    ],
    customerBehavior: {
      peakHours: [
        { hour: '11:00', orders: 23, revenue: 1245 },
        { hour: '12:00', orders: 45, revenue: 2340 },
        { hour: '13:00', orders: 38, revenue: 1980 },
        { hour: '18:00', orders: 52, revenue: 2890 },
        { hour: '19:00', orders: 67, revenue: 3780 },
        { hour: '20:00', orders: 58, revenue: 3240 },
        { hour: '21:00', orders: 34, revenue: 1890 }
      ],
      popularDays: [
        { day: 'Monday', orders: 89, revenue: 4780 },
        { day: 'Tuesday', orders: 92, revenue: 5120 },
        { day: 'Wednesday', orders: 98, revenue: 5450 },
        { day: 'Thursday', orders: 105, revenue: 5890 },
        { day: 'Friday', orders: 134, revenue: 7450 },
        { day: 'Saturday', orders: 156, revenue: 8920 },
        { day: 'Sunday', orders: 145, revenue: 8230 }
      ]
    }
  },
  menuAnalytics: {
    topPerformers: [
      { item: 'Truffle Pasta Carbonara', sales: 89, revenue: 2136, margin: 0.75 },
      { item: 'Wagyu Beef Burger', sales: 76, revenue: 2280, margin: 0.68 },
      { item: 'Lobster Risotto', sales: 67, revenue: 2345, margin: 0.72 },
      { item: 'Chocolate Lava Cake', sales: 92, revenue: 1104, margin: 0.85 },
      { item: 'Craft Beer Selection', sales: 134, revenue: 1072, margin: 0.78 }
    ],
    categoryPerformance: [
      { category: 'Appetizers', sales: 234, revenue: 4680, margin: 0.72 },
      { category: 'Main Courses', sales: 445, revenue: 17800, margin: 0.68 },
      { category: 'Desserts', sales: 189, revenue: 2268, margin: 0.82 },
      { category: 'Beverages', sales: 567, revenue: 4536, margin: 0.75 },
      { category: 'Wine & Spirits', sales: 123, revenue: 3690, margin: 0.65 }
    ],
    seasonalTrends: [
      { month: 'January', topItem: 'Warm Soups', sales: 156, growth: 23.5 },
      { month: 'February', topItem: 'Comfort Food', sales: 189, growth: 18.2 },
      { month: 'March', topItem: 'Spring Salads', sales: 234, growth: 31.7 }
    ]
  },
  operationalAnalytics: {
    staffPerformance: [
      { name: 'Chef Maria', orders: 156, avgRating: 4.8, efficiency: 0.92 },
      { name: 'Server John', orders: 234, avgRating: 4.6, efficiency: 0.88 },
      { name: 'Bartender Sarah', orders: 189, avgRating: 4.9, efficiency: 0.94 },
      { name: 'Host Lisa', orders: 98, avgRating: 4.7, efficiency: 0.91 }
    ],
    tableTurnover: [
      { table: 'Table 1', avgTime: 85, orders: 12, revenue: 720 },
      { table: 'Table 2', avgTime: 78, orders: 14, revenue: 840 },
      { table: 'Table 3', avgTime: 92, orders: 11, revenue: 660 },
      { table: 'Table 4', avgTime: 88, orders: 13, revenue: 780 },
      { table: 'Table 5', avgTime: 95, orders: 10, revenue: 600 }
    ],
    kitchenEfficiency: {
      avgPrepTime: 18.5,
      avgCookTime: 12.3,
      orderAccuracy: 0.96,
      wastePercentage: 0.08,
      peakEfficiency: '19:00-21:00'
    }
  },
  financialAnalytics: {
    profitMargins: {
      food: 0.68,
      beverages: 0.75,
      desserts: 0.82,
      overall: 0.71
    },
    costAnalysis: [
      { category: 'Ingredients', cost: 15680, percentage: 0.42 },
      { category: 'Labor', cost: 12340, percentage: 0.33 },
      { category: 'Overhead', cost: 5670, percentage: 0.15 },
      { category: 'Marketing', cost: 2340, percentage: 0.06 },
      { category: 'Other', cost: 1560, percentage: 0.04 }
    ],
    revenueStreams: [
      { stream: 'Dine-in', revenue: 45680, percentage: 0.68 },
      { stream: 'Takeaway', revenue: 12340, percentage: 0.18 },
      { stream: 'Delivery', revenue: 8920, percentage: 0.13 },
      { stream: 'Catering', revenue: 560, percentage: 0.01 }
    ]
  },
  predictiveAnalytics: {
    demandForecast: [
      { date: '2024-01-15', predictedOrders: 78, confidence: 0.85 },
      { date: '2024-01-16', predictedOrders: 82, confidence: 0.87 },
      { date: '2024-01-17', predictedOrders: 89, confidence: 0.83 },
      { date: '2024-01-18', predictedOrders: 95, confidence: 0.89 },
      { date: '2024-01-19', predictedOrders: 102, confidence: 0.91 },
      { date: '2024-01-20', predictedOrders: 118, confidence: 0.88 },
      { date: '2024-01-21', predictedOrders: 125, confidence: 0.86 }
    ],
    seasonalPredictions: [
      { season: 'Spring', expectedGrowth: 0.15, topItems: ['Fresh Salads', 'Light Pasta'] },
      { season: 'Summer', expectedGrowth: 0.22, topItems: ['Grilled Seafood', 'Cold Beverages'] },
      { season: 'Fall', expectedGrowth: 0.08, topItems: ['Comfort Food', 'Warm Soups'] },
      { season: 'Winter', expectedGrowth: 0.12, topItems: ['Hearty Dishes', 'Hot Beverages'] }
    ],
    inventoryOptimization: [
      { item: 'Fresh Vegetables', currentStock: 45, recommendedStock: 52, reorderPoint: 15 },
      { item: 'Premium Meat', currentStock: 28, recommendedStock: 32, reorderPoint: 8 },
      { item: 'Dairy Products', currentStock: 38, recommendedStock: 42, reorderPoint: 12 },
      { item: 'Wine Selection', currentStock: 67, recommendedStock: 75, reorderPoint: 20 }
    ]
  }
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    switch (action) {
      case 'sales':
        return NextResponse.json({
          success: true,
          data: mockAdvancedAnalytics.salesAnalytics
        });

      case 'customers':
        return NextResponse.json({
          success: true,
          data: mockAdvancedAnalytics.customerAnalytics
        });

      case 'menu':
        return NextResponse.json({
          success: true,
          data: mockAdvancedAnalytics.menuAnalytics
        });

      case 'operations':
        return NextResponse.json({
          success: true,
          data: mockAdvancedAnalytics.operationalAnalytics
        });

      case 'financial':
        return NextResponse.json({
          success: true,
          data: mockAdvancedAnalytics.financialAnalytics
        });

      case 'predictive':
        return NextResponse.json({
          success: true,
          data: mockAdvancedAnalytics.predictiveAnalytics
        });

      case 'all':
        return NextResponse.json({
          success: true,
          data: mockAdvancedAnalytics
        });

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action parameter'
        }, { status: 400 });
    }
  } catch (error) {
    console.error('Advanced Analytics API Error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, filters, dateRange } = body;

    // Mock response for custom analytics requests
    const mockCustomResponse = {
      success: true,
      data: {
        customReport: {
          title: 'Custom Analytics Report',
          generatedAt: new Date().toISOString(),
          filters: filters || {},
          dateRange: dateRange || {},
          summary: {
            totalRevenue: 45680,
            totalOrders: 892,
            avgOrderValue: 51.21,
            growthRate: 0.15
          }
        }
      }
    };

    return NextResponse.json(mockCustomResponse);
  } catch (error) {
    console.error('Advanced Analytics POST Error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}
