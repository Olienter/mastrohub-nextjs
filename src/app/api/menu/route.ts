import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Mock menu data for development
const mockMenuData = {
  menu_items: [
    {
      id: '1',
      name: 'Margherita Pizza',
      description: 'Classic tomato sauce with mozzarella and fresh basil',
      price: 12.99,
      category_id: '1',
      category_name: 'Pizza',
      image_url: '/images/margherita.jpg',
      is_vegetarian: true,
      is_vegan: false,
      is_gluten_free: false,
      allergens: ['gluten', 'dairy'],
      preparation_time: 15,
      sort_order: 1,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      tags: ['popular', 'classic'],
      manuals: {
        chef: { instructions: 'Preheat oven to 450°F, bake for 12-15 minutes' },
        waiter: { serving: 'Serve hot with fresh basil garnish' },
        marketing: { description: 'Our signature pizza' },
        analytics: { profit_margin: 0.65 },
        supply_chain: { ingredients: ['dough', 'tomato sauce', 'mozzarella', 'basil'] },
        financial: { cost: 4.55 },
        sustainability: { local_ingredients: true }
      }
    },
    {
      id: '2',
      name: 'Caesar Salad',
      description: 'Fresh romaine lettuce with Caesar dressing and croutons',
      price: 8.99,
      category_id: '2',
      category_name: 'Salads',
      image_url: '/images/caesar.jpg',
      is_vegetarian: false,
      is_vegan: false,
      is_gluten_free: false,
      allergens: ['gluten', 'dairy', 'eggs'],
      preparation_time: 8,
      sort_order: 2,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      tags: ['healthy', 'fresh'],
      manuals: {
        chef: { instructions: 'Toss lettuce with dressing, add croutons and parmesan' },
        waiter: { serving: 'Serve immediately to maintain crispness' },
        marketing: { description: 'Fresh and healthy choice' },
        analytics: { profit_margin: 0.70 },
        supply_chain: { ingredients: ['romaine', 'dressing', 'croutons', 'parmesan'] },
        financial: { cost: 2.70 },
        sustainability: { organic_lettuce: true }
      }
    },
    {
      id: '3',
      name: 'Spaghetti Carbonara',
      description: 'Pasta with eggs, cheese, pancetta, and black pepper',
      price: 14.99,
      category_id: '3',
      category_name: 'Pasta',
      image_url: '/images/carbonara.jpg',
      is_vegetarian: false,
      is_vegan: false,
      is_gluten_free: false,
      allergens: ['gluten', 'dairy', 'eggs'],
      preparation_time: 20,
      sort_order: 3,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      tags: ['traditional', 'rich'],
      manuals: {
        chef: { instructions: 'Cook pasta al dente, mix with egg mixture and pancetta' },
        waiter: { serving: 'Serve immediately while hot' },
        marketing: { description: 'Traditional Italian favorite' },
        analytics: { profit_margin: 0.60 },
        supply_chain: { ingredients: ['spaghetti', 'eggs', 'pecorino', 'pancetta'] },
        financial: { cost: 6.00 },
        sustainability: { local_eggs: true }
      }
    }
  ],
  categories: [
    {
      id: '1',
      name: 'Pizza',
      description: 'Authentic Italian pizzas',
      sort_order: 1,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '2',
      name: 'Salads',
      description: 'Fresh and healthy salads',
      sort_order: 2,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '3',
      name: 'Pasta',
      description: 'Traditional Italian pasta dishes',
      sort_order: 3,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ]
};

export async function GET(request: NextRequest) {
  try {
    // Get current user from session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    // If no session or error, return mock data for development
    if (sessionError || !session?.user) {
      console.log('No authenticated user, returning mock menu data');
      return NextResponse.json(mockMenuData);
    }

    // Get workspace_id from query params
    const { searchParams } = new URL(request.url);
    const workspaceId = searchParams.get('workspace_id');
    
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
      // Return mock data if workspace not found
      return NextResponse.json(mockMenuData);
    }

    // Get menu items with categories and tags
    const { data: menuItems, error: menuError } = await supabase
      .from('menu_items')
      .select(`
        *,
        menu_categories(name),
        menu_item_tags(tag_name)
      `)
      .eq('workspace_id', workspaceId)
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (menuError) {
      console.error('Error fetching menu items:', menuError);
      // Return mock data if database error occurs
      return NextResponse.json(mockMenuData);
    }

    // Get categories
    const { data: categories, error: categoriesError } = await supabase
      .from('menu_categories')
      .select('*')
      .eq('workspace_id', workspaceId)
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (categoriesError) {
      console.error('Error fetching categories:', categoriesError);
      // Return mock data if database error occurs
      return NextResponse.json(mockMenuData);
    }

    return NextResponse.json({
      menu_items: menuItems || mockMenuData.menu_items,
      categories: categories || mockMenuData.categories
    });

  } catch (error) {
    console.error('Menu API Error:', error);
    // Return mock data on any error
    return NextResponse.json(mockMenuData);
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
    const { 
      workspace_id, 
      name, 
      description, 
      price, 
      category_id, 
      tags = [],
      ...otherFields 
    } = body;

    if (!workspace_id || !name || !price) {
      return NextResponse.json({ 
        error: 'workspace_id, name, and price are required' 
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

    // Insert menu item
    const { data: menuItem, error: insertError } = await supabase
      .from('menu_items')
      .insert({
        workspace_id,
        category_id,
        name,
        description,
        price,
        ...otherFields
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error inserting menu item:', insertError);
      return NextResponse.json({ error: 'Failed to create menu item' }, { status: 500 });
    }

    // Insert tags if provided
    if (tags.length > 0) {
      const tagData = tags.map((tag: string) => ({
        menu_item_id: menuItem.id,
        tag_name: tag
      }));

      const { error: tagsError } = await supabase
        .from('menu_item_tags')
        .insert(tagData);

      if (tagsError) {
        console.error('Error inserting tags:', tagsError);
        // Don't fail the request, just log the error
      }
    }

    return NextResponse.json({ 
      menu_item: menuItem,
      message: 'Menu item created successfully'
    });

  } catch (error) {
    console.error('Menu API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
