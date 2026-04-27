import { NextResponse } from 'next/server';
import { createSSRSupabase } from '@/lib/supabase/server';

// TEMPORARY — remove after diagnosis
export async function GET() {
  const url  = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

  const envStatus = {
    NEXT_PUBLIC_SUPABASE_URL:       url  ? `"${url.substring(0, 30)}..."` : '❌ MISSING',
    NEXT_PUBLIC_SUPABASE_ANON_KEY:  anon ? `"${anon.substring(0, 20)}..."` : '❌ MISSING',
    SUPABASE_SERVICE_ROLE_KEY:      process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ set' : '❌ MISSING',
  };

  if (!url || !anon) {
    return NextResponse.json({ diagnosis: 'ENV VARS MISSING', envStatus }, { status: 500 });
  }

  try {
    const supabase = await createSSRSupabase();
    const profileResult = await supabase.from('profiles').select('count').single();

    return NextResponse.json({
      diagnosis: 'ENV VARS OK — checking DB',
      envStatus,
      profiles: { error: profileResult.error, data: profileResult.data },
    });
  } catch (err) {
    return NextResponse.json({ diagnosis: 'RUNTIME ERROR', envStatus, fatal: String(err) }, { status: 500 });
  }
}
