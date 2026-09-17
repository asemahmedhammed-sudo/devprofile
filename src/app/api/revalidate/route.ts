import { revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';

export async function GET() {
  const tags = [
    'profile-en', 'profile-ar',
    'projects-en', 'projects-ar',
    'experience-en', 'experience-ar',
    'skills-en', 'skills-ar',
    'categories-en-skill', 'categories-ar-skill',
    'categories-en-project', 'categories-ar-project',
    'categories-en-experience', 'categories-ar-experience'
  ];
  
  for (const tag of tags) {
    revalidateTag(tag);
  }
  
  return NextResponse.json({ revalidated: true, now: Date.now() });
}
