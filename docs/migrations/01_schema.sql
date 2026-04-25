-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- PROFILES TABLE
CREATE TABLE profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT NOT NULL,
    bio TEXT,
    role TEXT,
    avatar_url TEXT,
    social_links JSONB DEFAULT '[]'::jsonb
);

-- PROJECTS TABLE
CREATE TABLE projects (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    tech_stack TEXT[] DEFAULT '{}',
    image_url TEXT,
    live_link TEXT,
    github_link TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- EXPERIENCE TABLE
CREATE TABLE experience (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    company TEXT NOT NULL,
    position TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    description TEXT
);

-- SKILLS TABLE
CREATE TABLE skills (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    proficiency_level TEXT
);

-- ENABLE ROW LEVEL SECURITY
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;

-- PUBLIC READ PERMISSIONS
CREATE POLICY "Public profiles are viewable by everyone." ON profiles FOR SELECT USING (true);
CREATE POLICY "Public projects are viewable by everyone." ON projects FOR SELECT USING (true);
CREATE POLICY "Public experience is viewable by everyone." ON experience FOR SELECT USING (true);
CREATE POLICY "Public skills are viewable by everyone." ON skills FOR SELECT USING (true);

-- ADMIN AUTHENTICATED MUTATION POLICIES
-- NOTE: In a single-user portfolio scenario where public signups are disabled in Supabase, 
-- we allow the authenticated role to mutate data. If multiple users existed, we would restrict by user ID.
CREATE POLICY "Auth users can mutate profiles." ON profiles FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth users can mutate projects." ON projects FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth users can mutate experience." ON experience FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth users can mutate skills." ON skills FOR ALL USING (auth.role() = 'authenticated');
