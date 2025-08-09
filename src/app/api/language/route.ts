import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { SUPPORTED_LANGUAGES, SupportedLanguage } from '@/lib/i18n';

// GET /api/language - Get user's language preference
export async function GET(request: NextRequest) {
  try {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    switch (type) {
      case 'preference':
        // Get user's language preference from database
        const { data: userPrefs, error: prefsError } = await supabase
          .from('user_preferences')
          .select('language')
          .eq('user_id', session.user.id)
          .single();

        if (prefsError && prefsError.code !== 'PGRST116') {
          return NextResponse.json({ error: 'Failed to fetch language preference' }, { status: 500 });
        }

        const language = userPrefs?.language || 'en';
        return NextResponse.json({ language });

      case 'supported':
        // Get list of supported languages
        return NextResponse.json({ 
          languages: SUPPORTED_LANGUAGES,
          default: 'en'
        });

      case 'translations':
        // Get translations for a specific language
        const lang = searchParams.get('lang') as SupportedLanguage;
        if (!lang || !SUPPORTED_LANGUAGES[lang]) {
          return NextResponse.json({ error: 'Invalid language' }, { status: 400 });
        }

        // Import translations dynamically
        const { translations } = await import('@/lib/i18n');
        return NextResponse.json({ 
          language: lang,
          translations: translations[lang]
        });

      default:
        return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 });
    }
  } catch (error) {
    console.error('Language API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/language - Update user's language preference
export async function POST(request: NextRequest) {
  try {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { language } = body;

    if (!language || !SUPPORTED_LANGUAGES[language as SupportedLanguage]) {
      return NextResponse.json({ error: 'Invalid language' }, { status: 400 });
    }

    // Upsert user preference
    const { data: preference, error: upsertError } = await supabase
      .from('user_preferences')
      .upsert({
        user_id: session.user.id,
        language: language as SupportedLanguage,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (upsertError) {
      console.error('Upsert error:', upsertError);
      return NextResponse.json({ error: 'Failed to update language preference' }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      language: preference.language 
    });
  } catch (error) {
    console.error('Language API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/language - Reset user's language preference to default
export async function DELETE(request: NextRequest) {
  try {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Delete user preference (will fall back to default)
    const { error: deleteError } = await supabase
      .from('user_preferences')
      .delete()
      .eq('user_id', session.user.id);

    if (deleteError) {
      console.error('Delete error:', deleteError);
      return NextResponse.json({ error: 'Failed to reset language preference' }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      language: 'sk' // Default language
    });
  } catch (error) {
    console.error('Language API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
