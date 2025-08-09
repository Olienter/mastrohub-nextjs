import { NextRequest, NextResponse } from 'next/server';

// Mock data for supply chain management
const mockSupplyChainData = {
  suppliers: [
    {
      id: '1',
      name: 'Fresh Market Supplies',
      category: 'Produce',
      contact: {
        name: 'John Smith',
        email: 'john@freshmarket.com',
        phone: '+1-555-0123'
      },
      rating: 4.8,
      reliability: 95,
      deliveryTime: '2-3 days',
      lastOrder: '2024-01-15',
      totalSpent: 12500,
      status: 'active'
    },
    {
      id: '2',
      name: 'Premium Meat Co.',
      category: 'Meat & Poultry',
      contact: {
        name: 'Sarah Johnson',
        email: 'sarah@premiummeat.com',
        phone: '+1-555-0456'
      },
      rating: 4.6,
      reliability: 92,
      deliveryTime: '1-2 days',
      lastOrder: '2024-01-14',
      totalSpent: 8900,
      status: 'active'
    },
    {
      id: '3',
      name: 'Dairy Delights',
      category: 'Dairy',
      contact: {
        name: 'Mike Wilson',
        email: 'mike@dairydelights.com',
        phone: '+1-555-0789'
      },
      rating: 4.9,
      reliability: 98,
      deliveryTime: '1 day',
      lastOrder: '2024-01-16',
      totalSpent: 6700,
      status: 'active'
    },
    {
      id: '4',
      name: 'Bakery Essentials',
      category: 'Bakery',
      contact: {
        name: 'Lisa Brown',
        email: 'lisa@bakeryessentials.com',
        phone: '+1-555-0321'
      },
      rating: 4.4,
      reliability: 88,
      deliveryTime: '2-4 days',
      lastOrder: '2024-01-12',
      totalSpent: 4200,
      status: 'active'
    }
  ],
  inventory: [
    {
      id: '1',
      name: 'Fresh Tomatoes',
      category: 'Produce',
      currentStock: 45,
      minStock: 20,
      maxStock: 100,
      unit: 'kg',
      costPerUnit: 2.50,
      supplier: 'Fresh Market Supplies',
      lastUpdated: '2024-01-16',
      status: 'normal'
    },
    {
      id: '2',
      name: 'Chicken Breast',
      category: 'Meat',
      currentStock: 15,
      minStock: 25,
      maxStock: 80,
      unit: 'kg',
      costPerUnit: 8.75,
      supplier: 'Premium Meat Co.',
      lastUpdated: '2024-01-16',
      status: 'low'
    },
    {
      id: '3',
      name: 'Milk',
      category: 'Dairy',
      currentStock: 30,
      minStock: 15,
      maxStock: 60,
      unit: 'liters',
      costPerUnit: 1.20,
      supplier: 'Dairy Delights',
      lastUpdated: '2024-01-16',
      status: 'normal'
    },
    {
      id: '4',
      name: 'Flour',
      category: 'Bakery',
      currentStock: 8,
      minStock: 10,
      maxStock: 50,
      unit: 'kg',
      costPerUnit: 1.80,
      supplier: 'Bakery Essentials',
      lastUpdated: '2024-01-16',
      status: 'low'
    },
    {
      id: '5',
      name: 'Olive Oil',
      category: 'Pantry',
      currentStock: 12,
      minStock: 5,
      maxStock: 25,
      unit: 'liters',
      costPerUnit: 15.00,
      supplier: 'Premium Pantry Co.',
      lastUpdated: '2024-01-16',
      status: 'normal'
    }
  ],
  orders: [
    {
      id: 'ORD-001',
      supplier: 'Fresh Market Supplies',
      items: [
        { name: 'Fresh Tomatoes', quantity: 30, unit: 'kg', cost: 75.00 },
        { name: 'Lettuce', quantity: 15, unit: 'kg', cost: 45.00 }
      ],
      totalCost: 120.00,
      orderDate: '2024-01-15',
      expectedDelivery: '2024-01-18',
      status: 'confirmed',
      priority: 'normal'
    },
    {
      id: 'ORD-002',
      supplier: 'Premium Meat Co.',
      items: [
        { name: 'Chicken Breast', quantity: 25, unit: 'kg', cost: 218.75 },
        { name: 'Beef Tenderloin', quantity: 10, unit: 'kg', cost: 150.00 }
      ],
      totalCost: 368.75,
      orderDate: '2024-01-14',
      expectedDelivery: '2024-01-16',
      status: 'in-transit',
      priority: 'high'
    },
    {
      id: 'ORD-003',
      supplier: 'Dairy Delights',
      items: [
        { name: 'Milk', quantity: 40, unit: 'liters', cost: 48.00 },
        { name: 'Cheese', quantity: 8, unit: 'kg', cost: 96.00 }
      ],
      totalCost: 144.00,
      orderDate: '2024-01-16',
      expectedDelivery: '2024-01-17',
      status: 'confirmed',
      priority: 'normal'
    }
  ],
  analytics: {
    totalSpent: 32300,
    monthlySpending: 8500,
    topSuppliers: [
      { name: 'Fresh Market Supplies', spent: 12500, percentage: 38.7 },
      { name: 'Premium Meat Co.', spent: 8900, percentage: 27.6 },
      { name: 'Dairy Delights', spent: 6700, percentage: 20.7 },
      { name: 'Bakery Essentials', spent: 4200, percentage: 13.0 }
    ],
    inventoryValue: 2840,
    lowStockItems: 2,
    pendingOrders: 3,
    averageDeliveryTime: 2.3,
    costSavings: 1250
  }
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    switch (action) {
      case 'suppliers':
        return NextResponse.json({ success: true, data: mockSupplyChainData.suppliers });
      case 'inventory':
        return NextResponse.json({ success: true, data: mockSupplyChainData.inventory });
      case 'orders':
        return NextResponse.json({ success: true, data: mockSupplyChainData.orders });
      case 'analytics':
        return NextResponse.json({ success: true, data: mockSupplyChainData.analytics });
      case 'all':
        return NextResponse.json({ success: true, data: mockSupplyChainData });
      default:
        return NextResponse.json({ success: false, error: 'Invalid action parameter' }, { status: 400 });
    }
  } catch (error) {
    console.error('Supply Chain API Error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, data } = body;

    // Mock response for supply chain operations
    const mockResponse = {
      success: true,
      message: 'Operation completed successfully',
      data: {
        orderId: 'ORD-004',
        supplier: data?.supplier || 'Mock Supplier',
        status: 'confirmed',
        estimatedDelivery: '2024-01-20'
      }
    };

    return NextResponse.json(mockResponse);
  } catch (error) {
    console.error('Supply Chain POST Error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
