import { NextResponse } from 'next/server';
import { createSSRSupabase } from '@/lib/supabase/server';

// TEMPORARY — remove after diagnosis
export async function GET() {
  try {
    const supabase = await createSSRSupabase();

    const profileResult  = await supabase.from('profiles').select('count').single();
    const projectsResult = await supabase.from('projects').select('count').single();
    const skillsResult   = await supabase.from('skills').select('count').single();

    return NextResponse.json({
      env: {
        url:  process.env.NEXT_PUBLIC_SUPABASE_URL  ? '✅ set' : '❌ missing',
        anon: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ set' : '❌ missing',
      },
      profiles:  { error: profileResult.error,  data: profileResult.data },
      projects:  { error: projectsResult.error, data: projectsResult.data },
      skills:    { error: skillsResult.error,   data: skillsResult.data },
    });
  } catch (err) {
    return NextResponse.json({ fatal: String(err) }, { status: 500 });
  }
}
