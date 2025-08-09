import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import QRCode from 'qrcode';

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

    // Get QR codes for this workspace
    const { data: qrCodes, error: qrError } = await supabase
      .from('qr_codes')
      .select(`
        *,
        menu_items(name, description, price)
      `)
      .eq('workspace_id', workspaceId)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (qrError) {
      console.error('Error fetching QR codes:', qrError);
      return NextResponse.json({ error: 'Failed to fetch QR codes' }, { status: 500 });
    }

    return NextResponse.json({
      qr_codes: qrCodes || []
    });

  } catch (error) {
    console.error('QR Codes API Error:', error);
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
      menu_item_id, 
      name, 
      qr_data, 
      settings = {} 
    } = body;

    if (!workspace_id || !name || !qr_data) {
      return NextResponse.json({ 
        error: 'workspace_id, name, and qr_data are required' 
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

    // Generate QR code image
    let qrImageUrl = null;
    try {
      const qrImageDataUrl = await QRCode.toDataURL(qr_data, {
        width: 300,
        margin: 2,
        color: {
          dark: settings.darkColor || '#000000',
          light: settings.lightColor || '#FFFFFF'
        }
      });
      
      // Convert data URL to base64 for storage
      qrImageUrl = qrImageDataUrl;
    } catch (qrError) {
      console.error('Error generating QR code:', qrError);
      return NextResponse.json({ error: 'Failed to generate QR code' }, { status: 500 });
    }

    // Insert QR code record
    const { data: qrCode, error: insertError } = await supabase
      .from('qr_codes')
      .insert({
        workspace_id,
        menu_item_id,
        name,
        qr_data,
        qr_image_url: qrImageUrl,
        settings
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error inserting QR code:', insertError);
      return NextResponse.json({ error: 'Failed to create QR code' }, { status: 500 });
    }

    return NextResponse.json({ 
      qr_code: qrCode,
      message: 'QR code created successfully'
    });

  } catch (error) {
    console.error('QR Codes API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
