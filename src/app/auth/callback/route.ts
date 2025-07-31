import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') || '/';

  if (code) {
    try {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);
      
      if (error) {
        console.error('Auth callback error:', error);
        return NextResponse.redirect(new URL('/login?error=auth_callback_failed', request.url));
      }

      // Create profile if user doesn't exist
      if (data.user) {
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', data.user.id)
          .single();

        if (!existingProfile) {
          const { error: profileError } = await supabase
            .from('profiles')
            .insert({
              id: data.user.id,
              email: data.user.email,
              full_name: data.user.user_metadata?.full_name,
              avatar_url: data.user.user_metadata?.avatar_url,
              role: 'reader',
              subscription_status: 'free'
            });

          if (profileError) {
            console.error('Profile creation error:', profileError);
          }
        }
      }

      return NextResponse.redirect(new URL(next, request.url));
    } catch (error) {
      console.error('Auth callback error:', error);
      return NextResponse.redirect(new URL('/login?error=auth_callback_failed', request.url));
    }
  }

  return NextResponse.redirect(new URL('/login', request.url));
} 