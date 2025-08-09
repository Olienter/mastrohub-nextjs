import { NextRequest, NextResponse } from 'next/server';
import { advancedAI } from '@/lib/advanced-ai';
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
      case 'sales-predictions':
        const historicalData = await getHistoricalSalesData();
        const predictions = await advancedAI.predictSales(historicalData, 30);
        return NextResponse.json({ predictions });

      case 'customer-behavior':
        const customerData = await getCustomerData();
        const behavior = await advancedAI.analyzeCustomerBehavior(customerData);
        return NextResponse.json({ behavior });

      case 'menu-optimization':
        const [menuItems, salesData] = await Promise.all([
          getMenuItems(),
          getSalesData()
        ]);
        const optimization = await advancedAI.optimizeMenuPricing(menuItems, salesData);
        return NextResponse.json({ optimization });

      case 'marketing-campaigns':
        const [segments, goals] = await Promise.all([
          getCustomerSegments(),
          getSalesGoals()
        ]);
        const campaigns = await advancedAI.generateMarketingCampaigns(segments, goals);
        return NextResponse.json({ campaigns });

      case 'inventory-optimization':
        const [menuItems2, salesHistory, supplierData] = await Promise.all([
          getMenuItems(),
          getSalesHistory(),
          getSupplierData()
        ]);
        const inventory = await advancedAI.optimizeInventory(menuItems2, salesHistory, supplierData);
        return NextResponse.json({ inventory });

      case 'customer-segmentation':
        const customerData2 = await getCustomerData();
        const segmentation = await advancedAI.segmentCustomers(customerData2);
        return NextResponse.json({ segmentation });

      default:
        return NextResponse.json({
          features: [
            'sales-predictions',
            'customer-behavior',
            'menu-optimization',
            'marketing-campaigns',
            'inventory-optimization',
            'customer-segmentation'
          ]
        });
    }
  } catch (error) {
    console.error('Advanced AI API error:', error);
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
      case 'predict_sales':
        const predictions = await advancedAI.predictSales(data.historicalData, data.days);
        return NextResponse.json({ success: true, predictions });

      case 'analyze_behavior':
        const behavior = await advancedAI.analyzeCustomerBehavior(data.customerData);
        return NextResponse.json({ success: true, behavior });

      case 'optimize_menu':
        const optimization = await advancedAI.optimizeMenuPricing(data.menuItems, data.salesData);
        return NextResponse.json({ success: true, optimization });

      case 'suggest_menu_changes':
        const suggestions = await advancedAI.suggestMenuChanges(
          data.currentMenu,
          data.salesData,
          data.customerFeedback
        );
        return NextResponse.json({ success: true, suggestions });

      case 'dynamic_pricing':
        const pricing = await advancedAI.generateDynamicPricing(
          data.itemId,
          data.demandData,
          data.competitorPrices
        );
        return NextResponse.json({ success: true, pricing });

      case 'generate_campaigns':
        const campaigns = await advancedAI.generateMarketingCampaigns(
          data.customerSegments,
          data.salesGoals
        );
        return NextResponse.json({ success: true, campaigns });

      case 'optimize_inventory':
        const inventory = await advancedAI.optimizeInventory(
          data.menuItems,
          data.salesHistory,
          data.supplierData
        );
        return NextResponse.json({ success: true, inventory });

      case 'segment_customers':
        const segmentation = await advancedAI.segmentCustomers(data.customerData);
        return NextResponse.json({ success: true, segmentation });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Advanced AI API POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Mock data functions
async function getHistoricalSalesData(): Promise<any[]> {
  return Array.from({ length: 90 }, (_, i) => ({
    date: new Date(Date.now() - (90 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    sales: Math.random() * 1000 + 500,
    orders: Math.floor(Math.random() * 50) + 20,
    averageOrder: Math.random() * 30 + 15
  }));
}

async function getCustomerData(): Promise<any[]> {
  return Array.from({ length: 50 }, (_, i) => ({
    id: `customer_${i + 1}`,
    name: `Customer ${i + 1}`,
    email: `customer${i + 1}@example.com`,
    totalSpent: Math.random() * 2000 + 500,
    visitCount: Math.floor(Math.random() * 20) + 1,
    lastVisit: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    favoriteItems: ['Pizza Margherita', 'Pasta Carbonara', 'Tiramisu'],
    preferences: ['Italian', 'Seafood', 'Vegetarian']
  }));
}

async function getMenuItems(): Promise<any[]> {
  return [
    { id: 'item_1', name: 'Pizza Margherita', price: 15.99, category: 'Pizza' },
    { id: 'item_2', name: 'Pasta Carbonara', price: 18.99, category: 'Pasta' },
    { id: 'item_3', name: 'Tiramisu', price: 8.99, category: 'Dessert' },
    { id: 'item_4', name: 'Caesar Salad', price: 12.99, category: 'Salad' },
    { id: 'item_5', name: 'Bruschetta', price: 9.99, category: 'Appetizer' }
  ];
}

async function getSalesData(): Promise<any[]> {
  return Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (30 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    itemId: `item_${Math.floor(Math.random() * 5) + 1}`,
    quantity: Math.floor(Math.random() * 20) + 1,
    revenue: Math.random() * 500 + 100
  }));
}

async function getCustomerSegments(): Promise<any[]> {
  return [
    {
      name: 'High-Value Loyalists',
      customers: ['customer_1', 'customer_2', 'customer_3'],
      characteristics: ['High spending', 'Frequent visits'],
      value: 2500
    },
    {
      name: 'Occasional Visitors',
      customers: ['customer_4', 'customer_5', 'customer_6'],
      characteristics: ['Moderate spending', 'Infrequent visits'],
      value: 800
    }
  ];
}

async function getSalesGoals(): Promise<any> {
  return {
    monthlyTarget: 50000,
    customerAcquisition: 100,
    averageOrderValue: 25,
    retentionRate: 0.8
  };
}

async function getSalesHistory(): Promise<any[]> {
  return Array.from({ length: 60 }, (_, i) => ({
    date: new Date(Date.now() - (60 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    itemId: `item_${Math.floor(Math.random() * 5) + 1}`,
    quantity: Math.floor(Math.random() * 50) + 10,
    cost: Math.random() * 200 + 50
  }));
}

async function getSupplierData(): Promise<any[]> {
  return [
    {
      supplier: 'Fresh Foods Co',
      items: ['tomatoes', 'basil', 'mozzarella'],
      leadTime: 2,
      reliability: 0.95
    },
    {
      supplier: 'Pasta Masters',
      items: ['pasta', 'flour', 'eggs'],
      leadTime: 3,
      reliability: 0.9
    }
  ];
}
