import { createClient } from '@supabase/supabase-js';
import { profile } from '../data/content';
import dotenv from 'dotenv';
import path from 'path';

// Load .env.local file
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.");
  process.exit(1);
}

// We use the service_role key to bypass RLS while seeding data
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function seed() {
  console.log("Starting data sync...");

  // Note: auth.users needs to exist first for the profile.
  // When running this, make sure an authenticated user is created 
  // in Supabase and capture their UUID to map the profile correctly.
  
  const ADMIN_UUID = "YOUR_ADMIN_AUTH_UUID_HERE"; 
  
  if (ADMIN_UUID === "YOUR_ADMIN_AUTH_UUID_HERE") {
    console.warn("WARNING: Please replace ADMIN_UUID with your actual auth.users UUID to run this seed.");
    return;
  }

  // 1. Seed Profile
  const { error: profileError } = await supabase.from('profiles').upsert({
    id: ADMIN_UUID,
    full_name: profile.name,
    bio: profile.bio,
    role: profile.role,
    avatar_url: profile.avatarUrl,
    social_links: profile.social
  });

  if (profileError) console.error("Profile sync error:", profileError);
  else console.log("Profile synchronized.");

  // 2. Seed Projects
  for (const proj of profile.projects) {
    const { error } = await supabase.from('projects').insert({
      profile_id: ADMIN_UUID,
      title: proj.title,
      description: proj.description,
      tech_stack: proj.techStack,
      image_url: null, // Based on types
      live_link: proj.liveUrl,
      github_link: proj.repoUrl,
    });
    if (error) console.error(`Error inserting project ${proj.title}:`, error);
  }
  console.log("Projects synchronized.");

  // 3. Seed Skills
  for (const skill of profile.skills) {
    const { error } = await supabase.from('skills').insert({
      profile_id: ADMIN_UUID,
      name: skill.name,
      category: skill.category,
      proficiency_level: skill.level
    });
    if (error) console.error(`Error inserting skill ${skill.name}:`, error);
  }
  console.log("Skills synchronized.");

  // 4. Seed Experience
  for (const exp of profile.experience) {
    // For date format translation, converting string e.g. "Jun 2021" to YYYY-MM-DD
    const parseDate = (d: string) => d === "Present" ? null : new Date(d).toISOString().split("T")[0];
    
    const { error } = await supabase.from('experience').insert({
      profile_id: ADMIN_UUID,
      company: exp.company,
      position: exp.position,
      start_date: parseDate(exp.startDate) || '2000-01-01', // Fallback safety
      end_date: parseDate(exp.endDate),
      description: exp.responsibilities.join("\n"),
    });
    if (error) console.error(`Error inserting experience ${exp.company}:`, error);
  }
  console.log("Experience synchronized.");
  console.log("Data sync complete.");
}

seed().catch(console.error);
