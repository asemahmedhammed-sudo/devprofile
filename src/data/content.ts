import type { ProfileData } from "@/types";

/**
 * Fallback mock data — only used when Supabase is unavailable (e.g. build-time preview).
 * All fields conform to the bilingual schema after migration 02.
 * The service layer resolves _en / _ar into the active locale at request time.
 */
export const profile: ProfileData = {
  // ── Bilingual scalars ──────────────────────────────────────────────────────
  full_name_en: "Asem Ahmed",
  full_name_ar: "عاصم أحمد",
  name: "Asem Ahmed",

  role_en: "Senior Software Engineer",
  role_ar: "مهندس برمجيات أول",
  role: "Senior Software Engineer",

  tagline_en: "Building scalable systems that ship.",
  tagline_ar: "أبني أنظمة تقنية قابلة للتوسع وقادرة على الإنجاز.",
  tagline: "Building scalable systems that ship.",

  bio_en: `I'm a full-stack engineer with 8+ years of experience designing and shipping
production-grade software at scale. I thrive at the intersection of system design,
developer experience, and product impact.`,
  bio_ar: "مهندس برمجيات متكامل لديه أكثر من 8 سنوات من الخبرة في تصميم وإطلاق برمجيات على مستوى الإنتاج.",
  bio: `I'm a full-stack engineer with 8+ years of experience designing and shipping production-grade software at scale.`,

  avatarUrl: "/images/avatar.jpg",

  location_en: "Jeddah, Saudi Arabia",
  location_ar: "جدة، المملكة العربية السعودية",
  location: "Jeddah, Saudi Arabia",

  openToWork: true,

  // ── Social ─────────────────────────────────────────────────────────────────
  social: [
    { platform: "github",   url: "https://github.com/asem-ahmed",      label: "GitHub"   },
    { platform: "linkedin", url: "https://linkedin.com/in/asem-ahmed",  label: "LinkedIn" },
    { platform: "email",    url: "mailto:asem@example.com",             label: "asem@example.com" },
  ],

  // ── Skills — bilingual ─────────────────────────────────────────────────────
  skills: [
    { name_en: "TypeScript",         name_ar: "تايب سكريبت",   name: "TypeScript",         level: "expert",     category_en: "Frontend",        category_ar: "الواجهة الأمامية",   category: "Frontend"        },
    { name_en: "React / Next.js",    name_ar: "ريآكت / نكست",  name: "React / Next.js",    level: "expert",     category_en: "Frontend",        category_ar: "الواجهة الأمامية",   category: "Frontend"        },
    { name_en: "Tailwind CSS",       name_ar: "تيلويند",       name: "Tailwind CSS",       level: "expert",     category_en: "Frontend",        category_ar: "الواجهة الأمامية",   category: "Frontend"        },
    { name_en: "Node.js",            name_ar: "نود جي إس",     name: "Node.js",            level: "expert",     category_en: "Backend",         category_ar: "الخلفية",             category: "Backend"         },
    { name_en: "PostgreSQL",         name_ar: "بوستجري إس كيو", name: "PostgreSQL",        level: "expert",     category_en: "Backend",         category_ar: "الخلفية",             category: "Backend"         },
    { name_en: "AWS",                name_ar: "أمازون ويب",    name: "AWS",                level: "expert",     category_en: "Infrastructure",  category_ar: "البنية التحتية",      category: "Infrastructure"  },
    { name_en: "Docker / Kubernetes",name_ar: "دوكر / كوبرنيتيز", name: "Docker / Kubernetes", level: "proficient", category_en: "Infrastructure", category_ar: "البنية التحتية",   category: "Infrastructure"  },
  ],

  // ── Experience — bilingual ─────────────────────────────────────────────────
  experience: [
    {
      company_en: "Veritas Systems",
      company_ar: "فيريتاس سيستمز",
      company:    "Veritas Systems",
      position_en: "Senior Software Engineer",
      position_ar: "مهندس برمجيات أول",
      position:    "Senior Software Engineer",
      employmentType: "full-time",
      location: "Hybrid",
      startDate: "2022-01",
      endDate: "Present",
      description_en: "Led architectural redesign of the core data pipeline, reducing p99 latency by 68%. Owned the full-stack rewrite of the customer dashboard from Vue 2 → Next.js 14.",
      description_ar: "قيادة إعادة تصميم خط بيانات النظام الأساسي، وتقليل latency p99 بنسبة 68٪.",
      description: "Led architectural redesign of the core data pipeline, reducing p99 latency by 68%.",
      responsibilities: [],
      techStack: ["TypeScript", "Next.js", "Node.js", "PostgreSQL", "AWS"],
    },
    {
      company_en: "Nebula Digital",
      company_ar: "نيبولا ديجيتال",
      company:    "Nebula Digital",
      position_en: "Full-Stack Engineer",
      position_ar: "مهندس متكامل",
      position:    "Full-Stack Engineer",
      employmentType: "full-time",
      location: "Remote",
      startDate: "2019-03",
      endDate: "2021-12",
      description_en: "Built and maintained a multi-tenant SaaS platform serving 120K+ monthly active users.",
      description_ar: "بناء وصيانة منصة SaaS متعددة المستأجرين تخدم أكثر من 120,000 مستخدم نشط شهريًا.",
      description: "Built and maintained a multi-tenant SaaS platform serving 120K+ monthly active users.",
      responsibilities: [],
      techStack: ["React", "Node.js", "Redis", "PostgreSQL", "GraphQL", "AWS"],
    },
  ],

  // ── Education ─────────────────────────────────────────────────────────────
  education: [
    {
      institution: "Cairo University",
      degree: "Bachelor of Science",
      field: "Computer Science",
      graduationYear: 2017,
      honors: "Graduated with High Distinction",
    },
  ],

  // ── Projects — bilingual ──────────────────────────────────────────────────
  projects: [
    {
      id: "core-care",
      title_en: "Core Care",
      title_ar: "كور كير",
      title: "Core Care",
      description_en: "A premium cosmetics e-commerce platform built for a high-end skincare brand.",
      description_ar: "منصة تجارة إلكترونية لمنتجات العناية بالبشرة الفاخرة.",
      description: "A premium cosmetics e-commerce platform built for a high-end skincare brand.",
      highlights: [],
      techStack: ["Next.js 14", "TypeScript", "Supabase", "Stripe", "Tailwind CSS"],
      status: "production",
      liveUrl: "https://corecare.beauty",
      startedAt: "2023-06-01",
    },
    {
      id: "smart-sight",
      title_en: "Smart Sight",
      title_ar: "سمارت سايت",
      title: "Smart Sight",
      description_en: "An AI-powered smart navigation assistant for visually impaired users.",
      description_ar: "مساعد ملاحة ذكي مدعوم بالذكاء الاصطناعي للمستخدمين ضعاف البصر.",
      description: "An AI-powered smart navigation assistant for visually impaired users.",
      highlights: [],
      techStack: ["Flutter", "TensorFlow Lite", "Python", "FastAPI"],
      status: "production",
      startedAt: "2023-03-01",
    },
  ],
};
