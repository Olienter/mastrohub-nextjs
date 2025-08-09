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
      return NextResponse.json({ error: 'Failed to fetch menu items' }, { status: 500 });
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
      return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
    }

    return NextResponse.json({
      menu_items: menuItems || [],
      categories: categories || []
    });

  } catch (error) {
    console.error('Menu API Error:', error);
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
