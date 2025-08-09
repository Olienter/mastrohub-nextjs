import { NextRequest, NextResponse } from 'next/server';
import { AIAgent } from '@/lib/ai-agent';

// Mock data for smart recommendations
const mockRecommendations = [
  {
    id: '1',
    type: 'revenue',
    title: 'Implement Dynamic Pricing',
    description: 'Adjust prices based on demand and time of day to maximize revenue during peak hours.',
    impact: 'high',
    effort: 'medium',
    priority: 1,
    estimatedValue: 15000,
    implementationTime: '2-3 weeks',
    tags: ['pricing', 'revenue', 'optimization']
  },
  {
    id: '2',
    type: 'menu',
    title: 'Add Seasonal Menu Items',
    description: 'Introduce 3-4 seasonal dishes to attract customers and increase average order value.',
    impact: 'medium',
    effort: 'low',
    priority: 2,
    estimatedValue: 8000,
    implementationTime: '1-2 weeks',
    tags: ['seasonal', 'menu', 'innovation']
  },
  {
    id: '3',
    type: 'marketing',
    title: 'Launch Social Media Campaign',
    description: 'Create engaging content and run targeted ads to increase brand awareness.',
    impact: 'high',
    effort: 'medium',
    priority: 3,
    estimatedValue: 12000,
    implementationTime: '3-4 weeks',
    tags: ['marketing', 'social media', 'branding']
  },
  {
    id: '4',
    type: 'operations',
    title: 'Optimize Staff Scheduling',
    description: 'Use data-driven scheduling to reduce labor costs while maintaining service quality.',
    impact: 'medium',
    effort: 'low',
    priority: 4,
    estimatedValue: 6000,
    implementationTime: '1 week',
    tags: ['operations', 'staffing', 'efficiency']
  },
  {
    id: '5',
    type: 'customer',
    title: 'Implement Loyalty Program',
    description: 'Create a customer loyalty program to increase repeat visits and average spend.',
    impact: 'high',
    effort: 'medium',
    priority: 5,
    estimatedValue: 10000,
    implementationTime: '2-3 weeks',
    tags: ['loyalty', 'retention', 'customer']
  }
];

// Mock restaurant context
const mockRestaurantContext = {
  menuItems: [
    {
      id: '1',
      name: 'Truffle Pasta Carbonara',
      description: 'Creamy pasta with truffle oil and parmesan cheese',
      price: 24.99,
      category_name: 'Main Course',
      preparation_time: 15,
      tags: ['pasta', 'truffle', 'premium']
    },
    {
      id: '2',
      name: 'Grilled Salmon',
      description: 'Fresh salmon grilled to perfection with herbs',
      price: 28.99,
      category_name: 'Main Course',
      preparation_time: 20,
      tags: ['fish', 'healthy', 'grilled']
    },
    {
      id: '3',
      name: 'Caesar Salad',
      description: 'Classic Caesar salad with romaine lettuce and croutons',
      price: 12.99,
      category_name: 'Appetizer',
      preparation_time: 8,
      tags: ['salad', 'vegetarian', 'fresh']
    }
  ],
  restaurantName: 'MastroHub Restaurant',
  cuisine: 'International',
  location: 'City Center',
  targetAudience: ['Business professionals', 'Food enthusiasts'],
  priceRange: 'premium' as const,
  totalRevenue: 50000,
  averageOrderValue: 25,
  customerCount: 2000,
  popularItems: ['Truffle Pasta Carbonara', 'Grilled Salmon'],
  seasonalTrends: ['Summer salads', 'Winter comfort food'],
  availableTools: ['Menu Maker', 'QR Menu', 'Analytics', 'Marketing'],
  qrMenuEnabled: true,
  analyticsEnabled: true,
  marketingEnabled: true
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    switch (action) {
      case 'recommendations':
        return NextResponse.json({
          success: true,
          data: mockRecommendations
        });

      case 'insights':
        return NextResponse.json({
          success: true,
          data: {
            revenueGrowth: 15,
            customerSatisfaction: 8,
            waitTimeImprovement: -12,
            keyInsights: [
              'Peak hours are 7-9 PM, consider dynamic pricing',
              'Most popular dish: Truffle Pasta Carbonara',
              'Staff productivity could be improved by 20%'
            ]
          }
        });

      default:
        return NextResponse.json({
          success: true,
          data: {
            message: 'AI Assistant API is ready',
            availableActions: ['recommendations', 'insights', 'chat']
          }
        });
    }
  } catch (error) {
    console.error('AI Assistant API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, message, context } = body;

    switch (action) {
      case 'chat':
        // Initialize AI Agent with restaurant context
        const aiAgent = new AIAgent({}, mockRestaurantContext);
        
        // Get AI response
        const response = await aiAgent.askRestaurantAssistant(message);
        
        return NextResponse.json({
          success: true,
          data: response
        });

      case 'analyze_menu':
        const menuAgent = new AIAgent({}, mockRestaurantContext);
        const menuAnalysis = await menuAgent.analyzeMenu();
        
        return NextResponse.json({
          success: true,
          data: menuAnalysis
        });

      case 'business_recommendations':
        const businessAgent = new AIAgent({}, mockRestaurantContext);
        const businessRecs = await businessAgent.getBusinessRecommendations();
        
        return NextResponse.json({
          success: true,
          data: businessRecs
        });

      case 'optimize_menu':
        const optimizeAgent = new AIAgent({}, mockRestaurantContext);
        const menuOptimization = await optimizeAgent.optimizeMenu();
        
        return NextResponse.json({
          success: true,
          data: menuOptimization
        });

      case 'marketing_strategy':
        const marketingAgent = new AIAgent({}, mockRestaurantContext);
        const marketingStrategy = await marketingAgent.generateMarketingStrategy();
        
        return NextResponse.json({
          success: true,
          data: marketingStrategy
        });

      case 'financial_analysis':
        const financialAgent = new AIAgent({}, mockRestaurantContext);
        const financialAnalysis = await financialAgent.analyzeFinances();
        
        return NextResponse.json({
          success: true,
          data: financialAnalysis
        });

      case 'supply_chain_optimization':
        const supplyAgent = new AIAgent({}, mockRestaurantContext);
        const supplyChainOpt = await supplyAgent.optimizeSupplyChain();
        
        return NextResponse.json({
          success: true,
          data: supplyChainOpt
        });

      case 'customer_insights':
        const customerAgent = new AIAgent({}, mockRestaurantContext);
        const customerInsights = await customerAgent.analyzeCustomerBehavior();
        
        return NextResponse.json({
          success: true,
          data: customerInsights
        });

      case 'predict_trends':
        const predictAgent = new AIAgent({}, mockRestaurantContext);
        const trendPredictions = await predictAgent.predictTrends();
        
        return NextResponse.json({
          success: true,
          data: trendPredictions
        });

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('AI Assistant POST Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
