import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Get current user from session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Get menu item with all related data
    const { data: menuItem, error: menuError } = await supabase
      .from('menu_items')
      .select(`
        *,
        menu_categories(name),
        menu_item_tags(tag_name),
        menu_item_manuals(manual_type, content)
      `)
      .eq('id', id)
      .single();

    if (menuError || !menuItem) {
      return NextResponse.json({ error: 'Menu item not found' }, { status: 404 });
    }

    // Verify user has access to this menu item's workspace
    const { data: workspace, error: workspaceError } = await supabase
      .from('workspaces')
      .select('id')
      .eq('id', menuItem.workspace_id)
      .eq('user_id', session.user.id)
      .single();

    if (workspaceError || !workspace) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    return NextResponse.json({ menu_item: menuItem });

  } catch (error) {
    console.error('Menu Item API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Get current user from session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { tags = [], manuals = [], ...updateData } = body;

    // First, verify user has access to this menu item
    const { data: existingItem, error: fetchError } = await supabase
      .from('menu_items')
      .select('workspace_id')
      .eq('id', id)
      .single();

    if (fetchError || !existingItem) {
      return NextResponse.json({ error: 'Menu item not found' }, { status: 404 });
    }

    // Verify user has access to this workspace
    const { data: workspace, error: workspaceError } = await supabase
      .from('workspaces')
      .select('id')
      .eq('id', existingItem.workspace_id)
      .eq('user_id', session.user.id)
      .single();

    if (workspaceError || !workspace) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Update menu item
    const { data: updatedItem, error: updateError } = await supabase
      .from('menu_items')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating menu item:', updateError);
      return NextResponse.json({ error: 'Failed to update menu item' }, { status: 500 });
    }

    // Update tags if provided
    if (tags.length >= 0) {
      // Delete existing tags
      await supabase
        .from('menu_item_tags')
        .delete()
        .eq('menu_item_id', id);

      // Insert new tags
      if (tags.length > 0) {
        const tagData = tags.map((tag: string) => ({
          menu_item_id: id,
          tag_name: tag
        }));

        const { error: tagsError } = await supabase
          .from('menu_item_tags')
          .insert(tagData);

        if (tagsError) {
          console.error('Error updating tags:', tagsError);
        }
      }
    }

    // Update manuals if provided
    if (manuals.length > 0) {
      for (const manual of manuals) {
        const { error: manualError } = await supabase
          .from('menu_item_manuals')
          .upsert({
            menu_item_id: id,
            manual_type: manual.type,
            content: manual.content
          });

        if (manualError) {
          console.error('Error updating manual:', manualError);
        }
      }
    }

    return NextResponse.json({ 
      menu_item: updatedItem,
      message: 'Menu item updated successfully'
    });

  } catch (error) {
    console.error('Menu Item API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Get current user from session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // First, verify user has access to this menu item
    const { data: existingItem, error: fetchError } = await supabase
      .from('menu_items')
      .select('workspace_id')
      .eq('id', id)
      .single();

    if (fetchError || !existingItem) {
      return NextResponse.json({ error: 'Menu item not found' }, { status: 404 });
    }

    // Verify user has access to this workspace
    const { data: workspace, error: workspaceError } = await supabase
      .from('workspaces')
      .select('id')
      .eq('id', existingItem.workspace_id)
      .eq('user_id', session.user.id)
      .single();

    if (workspaceError || !workspace) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Soft delete - set is_active to false
    const { error: deleteError } = await supabase
      .from('menu_items')
      .update({ is_active: false })
      .eq('id', id);

    if (deleteError) {
      console.error('Error deleting menu item:', deleteError);
      return NextResponse.json({ error: 'Failed to delete menu item' }, { status: 500 });
    }

    return NextResponse.json({ 
      message: 'Menu item deleted successfully'
    });

  } catch (error) {
    console.error('Menu Item API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
