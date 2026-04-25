// ─── Primitives ──────────────────────────────────────────────────────────────

export type SkillLevel = "expert" | "proficient" | "familiar";
export type ProjectStatus = "production" | "wip" | "archived";
export type EmploymentType = "full-time" | "contract" | "part-time";
export type Locale = "en" | "ar";

// ─── Skill ───────────────────────────────────────────────────────────────────

export interface Skill {
  name_en: string;
  name_ar: string;
  /** Resolved for active locale — set by the service layer */
  name: string;
  level: SkillLevel;
  category_en: string;
  category_ar: string;
  /** Resolved for active locale — set by the service layer */
  category: string;
}

// ─── Project ─────────────────────────────────────────────────────────────────

export interface Project {
  id: string;
  title_en: string;
  title_ar: string;
  /** Resolved for active locale */
  title: string;
  description_en: string;
  description_ar: string;
  /** Resolved for active locale */
  description: string;
  highlights: string[];
  techStack: string[];
  status: ProjectStatus;
  /** Project category e.g. "Backend", "Frontend", "Mobile", "UI/UX" */
  category?: string;
  /** Public URL for the project's thumbnail / cover image */
  imageUrl?: string;
  liveUrl?: string;
  repoUrl?: string;
  startedAt: string;
}

// ─── Experience ──────────────────────────────────────────────────────────────

export interface WorkExperience {
  company_en: string;
  company_ar: string;
  /** Resolved for active locale */
  company: string;
  position_en: string;
  position_ar: string;
  /** Resolved for active locale */
  position: string;
  companyUrl?: string;
  employmentType: EmploymentType;
  location: string;
  startDate: string;
  endDate: string | "Present";
  description_en: string;
  description_ar: string;
  /** Resolved for active locale */
  description: string;
  responsibilities: string[];
  techStack: string[];
}

// ─── Education ───────────────────────────────────────────────────────────────

export interface Education {
  institution: string;
  degree: string;
  field: string;
  graduationYear: number;
  honors?: string;
}

// ─── Social / Contact ─────────────────────────────────────────────────────────

export interface SocialLink {
  platform: "github" | "linkedin" | "twitter" | "website" | "email";
  url: string;
  label: string;
}

// ─── Root Profile ─────────────────────────────────────────────────────────────

export interface ProfileData {
  full_name_en: string;
  full_name_ar: string;
  /** Resolved for active locale */
  name: string;
  role_en: string;
  role_ar: string;
  /** Resolved for active locale */
  role: string;
  tagline_en: string;
  tagline_ar: string;
  /** Resolved for active locale */
  tagline: string;
  bio_en: string;
  bio_ar: string;
  /** Resolved for active locale */
  bio: string;
  avatarUrl: string;
  location_en: string;
  location_ar: string;
  /** Resolved for active locale */
  location: string;
  openToWork: boolean;
  social: SocialLink[];
  skills: Skill[];
  experience: WorkExperience[];
  education: Education[];
  projects: Project[];
}
