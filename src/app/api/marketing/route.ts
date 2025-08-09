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
    const type = searchParams.get('type'); // campaigns, contacts, analytics
    
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

    // Get data based on type
    let data;
    switch (type) {
      case 'campaigns':
        data = await getCampaigns(workspaceId);
        break;
      case 'contacts':
        data = await getContacts(workspaceId);
        break;
      case 'analytics':
        data = await getMarketingAnalytics(workspaceId);
        break;
      default:
        // Return all marketing data
        const [campaigns, contacts, analytics] = await Promise.all([
          getCampaigns(workspaceId),
          getContacts(workspaceId),
          getMarketingAnalytics(workspaceId)
        ]);
        data = { campaigns, contacts, analytics };
    }

    return NextResponse.json(data);

  } catch (error) {
    console.error('Marketing API Error:', error);
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
    const { workspace_id, action, data: requestData } = body;

    if (!workspace_id || !action) {
      return NextResponse.json({ 
        error: 'workspace_id and action are required' 
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

    // Handle different actions
    let result;
    switch (action) {
      case 'create_campaign':
        result = await createCampaign(workspace_id, requestData);
        break;
      case 'create_contact':
        result = await createContact(workspace_id, requestData);
        break;
      case 'send_campaign':
        result = await sendCampaign(workspace_id, requestData);
        break;
      case 'generate_recommendations':
        result = await generateAIRecommendations(workspace_id, requestData);
        break;
      default:
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
    }

    return NextResponse.json(result);

  } catch (error) {
    console.error('Marketing API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper functions
async function getCampaigns(workspaceId: string) {
  // Mock campaigns data - in real implementation, this would come from database
  return [
    {
      id: '1',
      name: 'Summer Special Campaign',
      type: 'email',
      status: 'active',
      created_at: '2024-01-15',
      sent_count: 1250,
      open_rate: 0.68,
      click_rate: 0.12,
      conversion_rate: 0.08,
      subject: 'Summer Specials - 20% Off!',
      content: 'Discover our refreshing summer menu...',
      target_audience: 'returning_customers',
      budget: 500,
      spent: 320
    },
    {
      id: '2',
      name: 'New Menu Launch',
      type: 'social',
      status: 'draft',
      created_at: '2024-01-20',
      sent_count: 0,
      open_rate: 0,
      click_rate: 0,
      conversion_rate: 0,
      subject: 'Exciting New Dishes!',
      content: 'We\'re thrilled to introduce our new seasonal menu...',
      target_audience: 'all_customers',
      budget: 300,
      spent: 0
    },
    {
      id: '3',
      name: 'QR Menu Promotion',
      type: 'qr',
      status: 'active',
      created_at: '2024-01-10',
      sent_count: 850,
      open_rate: 0.85,
      click_rate: 0.45,
      conversion_rate: 0.25,
      subject: 'Scan & Order - No Wait!',
      content: 'Try our new QR menu system...',
      target_audience: 'new_customers',
      budget: 200,
      spent: 180
    }
  ];
}

async function getContacts(workspaceId: string) {
  // Mock contacts data
  return [
    {
      id: '1',
      email: 'john.doe@email.com',
      name: 'John Doe',
      phone: '+421 901 234 567',
      segment: 'vip',
      status: 'active',
      created_at: '2024-01-01',
      last_visit: '2024-01-15',
      total_orders: 15,
      total_spent: 450,
      preferences: ['italian', 'wine'],
      tags: ['returning', 'high_value']
    },
    {
      id: '2',
      email: 'jane.smith@email.com',
      name: 'Jane Smith',
      phone: '+421 902 345 678',
      segment: 'regular',
      status: 'active',
      created_at: '2024-01-05',
      last_visit: '2024-01-18',
      total_orders: 8,
      total_spent: 280,
      preferences: ['vegetarian', 'cocktails'],
      tags: ['returning', 'vegetarian']
    },
    {
      id: '3',
      email: 'mike.wilson@email.com',
      name: 'Mike Wilson',
      phone: '+421 903 456 789',
      segment: 'new',
      status: 'active',
      created_at: '2024-01-20',
      last_visit: '2024-01-20',
      total_orders: 1,
      total_spent: 35,
      preferences: ['pizza', 'beer'],
      tags: ['new_customer']
    }
  ];
}

async function getMarketingAnalytics(workspaceId: string) {
  // Mock analytics data
  return {
    overview: {
      total_campaigns: 3,
      active_campaigns: 2,
      total_contacts: 1250,
      active_contacts: 1180,
      total_revenue: 45000,
      marketing_revenue: 8500,
      roi: 2.8
    },
    campaigns_performance: [
      {
        name: 'Summer Special Campaign',
        impressions: 2500,
        clicks: 300,
        conversions: 45,
        revenue: 1800,
        cost: 320,
        roi: 5.6
      },
      {
        name: 'QR Menu Promotion',
        impressions: 1700,
        clicks: 765,
        conversions: 212,
        revenue: 3200,
        cost: 180,
        roi: 17.8
      }
    ],
    audience_segments: [
      {
        name: 'VIP Customers',
        count: 45,
        avg_order_value: 85,
        retention_rate: 0.92,
        lifetime_value: 1200
      },
      {
        name: 'Regular Customers',
        count: 180,
        avg_order_value: 45,
        retention_rate: 0.78,
        lifetime_value: 450
      },
      {
        name: 'New Customers',
        count: 955,
        avg_order_value: 25,
        retention_rate: 0.35,
        lifetime_value: 120
      }
    ],
    channels_performance: [
      {
        channel: 'Email',
        reach: 1250,
        engagement: 0.68,
        conversion: 0.08,
        revenue: 4500
      },
      {
        channel: 'QR Menu',
        reach: 850,
        engagement: 0.85,
        conversion: 0.25,
        revenue: 3200
      },
      {
        channel: 'Social Media',
        reach: 2200,
        engagement: 0.45,
        conversion: 0.05,
        revenue: 800
      }
    ]
  };
}

async function createCampaign(workspaceId: string, data: any) {
  const { name, type, subject, content, target_audience, budget } = data;
  
  // Mock campaign creation
  const campaign = {
    id: Date.now().toString(),
    name,
    type,
    status: 'draft',
    created_at: new Date().toISOString().split('T')[0],
    sent_count: 0,
    open_rate: 0,
    click_rate: 0,
    conversion_rate: 0,
    subject,
    content,
    target_audience,
    budget,
    spent: 0
  };

  return {
    message: 'Campaign created successfully',
    campaign
  };
}

async function createContact(workspaceId: string, data: any) {
  const { email, name, phone, segment, preferences } = data;
  
  // Mock contact creation
  const contact = {
    id: Date.now().toString(),
    email,
    name,
    phone,
    segment,
    status: 'active',
    created_at: new Date().toISOString().split('T')[0],
    last_visit: null,
    total_orders: 0,
    total_spent: 0,
    preferences: preferences || [],
    tags: ['new_contact']
  };

  return {
    message: 'Contact created successfully',
    contact
  };
}

async function sendCampaign(workspaceId: string, data: any) {
  const { campaign_id, target_segments } = data;
  
  // Mock campaign sending
  const sentCount = Math.floor(Math.random() * 500) + 100;
  
  return {
    message: 'Campaign sent successfully',
    sent_count: sentCount,
    estimated_reach: sentCount * 0.85,
    estimated_cost: sentCount * 0.25
  };
}

async function generateAIRecommendations(workspaceId: string, data: any) {
  const { type, context } = data;
  
  // Mock AI recommendations based on type
  const recommendations = {
    campaign_ideas: [
      {
        title: 'Seasonal Menu Launch',
        description: 'Promote new seasonal dishes with limited-time offers',
        target_audience: 'returning_customers',
        estimated_reach: 800,
        estimated_revenue: 2400,
        channels: ['email', 'social']
      },
      {
        title: 'Loyalty Program',
        description: 'Introduce a points-based loyalty system',
        target_audience: 'all_customers',
        estimated_reach: 1200,
        estimated_revenue: 3600,
        channels: ['email', 'qr_menu']
      },
      {
        title: 'Weekend Special',
        description: 'Weekend-only discounts to increase traffic',
        target_audience: 'new_customers',
        estimated_reach: 600,
        estimated_revenue: 1800,
        channels: ['social', 'qr_menu']
      }
    ],
    content_suggestions: [
      {
        type: 'email_subject',
        suggestions: [
          '🍕 New Pizza Specials - Try Before They\'re Gone!',
          '🎉 Exclusive VIP Offer - 25% Off This Week',
          '🌟 Fresh from Our Kitchen - New Dishes Await!'
        ]
      },
      {
        type: 'social_post',
        suggestions: [
          'Behind the scenes: Our chef preparing today\'s special! 👨‍🍳 #FreshFood #LocalRestaurant',
          'New seasonal menu is here! What\'s your favorite dish? 🍽️ #NewMenu #Foodie',
          'QR menu makes ordering so easy! No more waiting in line 📱 #QRMenu #Convenience'
        ]
      }
    ],
    optimization_tips: [
      {
        category: 'Email Marketing',
        tip: 'Send emails on Tuesday and Thursday for highest open rates',
        impact: 'high'
      },
      {
        category: 'QR Menu',
        tip: 'Add photos to QR menu items to increase order value by 15%',
        impact: 'medium'
      },
      {
        category: 'Social Media',
        tip: 'Post during lunch hours (12-2 PM) for maximum engagement',
        impact: 'medium'
      }
    ]
  };

  return {
    message: 'AI recommendations generated successfully',
    recommendations
  };
}
