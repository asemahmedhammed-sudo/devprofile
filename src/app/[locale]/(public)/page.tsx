import Navbar from "@/components/ui/Navbar";
import Hero from "@/components/ui/Hero";
import TechStack from "@/components/ui/TechStack";
import Experience from "@/components/ui/Experience";
import ProjectsGrid from "@/components/ui/ProjectsGrid";
import Footer from "@/components/ui/Footer";
import {
  getProfile,
  getProjects,
  getExperience,
  getSkills,
  getSectionCategories,
} from "@/services/database.service";
import type { Locale } from "@/types";

export const dynamic = 'force-dynamic';

function SectionDivider() {
  return (
    <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-24">
      <div className="h-px bg-gradient-to-r from-transparent via-black/[0.06] to-transparent dark:via-white/[0.06]" />
    </div>
  );
}

export default async function HomePage({
  params,
}: {
  params: { locale: string };
}) {
  const locale = params.locale as Locale;

  let profileData = null;
  let projects: Awaited<ReturnType<typeof getProjects>> = [];
  let experience: Awaited<ReturnType<typeof getExperience>> = [];
  let skills: Awaited<ReturnType<typeof getSkills>> = [];
  let skillCategories: string[] = [];

  try {
    [profileData, projects, experience, skills, skillCategories] = await Promise.all([
      getProfile(locale),
      getProjects(locale),
      getExperience(locale),
      getSkills(locale),
      getSectionCategories(locale, 'skill'),
    ]);
  } catch (err) {
    console.error('[HomePage] Failed to fetch data from Supabase:', err);
  }


  if (!profileData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#08080C] text-white">
        <h1 className="text-2xl font-light mb-2">
          {locale === 'ar' ? 'الملف الشخصي غير متاح' : 'Profile Unavailable'}
        </h1>
        <p className="text-gray-400">
          {locale === 'ar'
            ? 'قاعدة البيانات توشك أن تكون جاهزة. يرجى تسجيل الدخول إلى بوابة الإدارة.'
            : 'Database setup pending. Please sign in to the Admin gateway.'}
        </p>
      </div>
    );
  }

  const profile = { ...profileData, projects, experience, skills };
  const emailLink = profile.social.find((s) => s.platform === "email");

  const NAV_LINKS =
    locale === 'ar'
      ? [
          { label: "الرئيسية", href: "#home" },
          { label: "الخبرات",  href: "#experience" },
          { label: "المشاريع", href: "#projects" },
          { label: "التواصل",  href: "#contact" },
        ]
      : [
          { label: "Home",       href: "#home" },
          { label: "Experience", href: "#experience" },
          { label: "Projects",   href: "#projects" },
          { label: "Contact",    href: "#contact" },
        ];

  return (
    <main className="relative min-h-screen bg-base">
      <Navbar
        logoText={profile.name.substring(0, 2).toUpperCase()}
        links={NAV_LINKS}
        locale={locale}
      />

      <Hero profile={profile} />

      <SectionDivider />
      {skills.length > 0 && <TechStack skills={profile.skills} categoryOrder={skillCategories} />}

      <SectionDivider />
      {experience.length > 0 && <Experience experience={profile.experience} />}

      <SectionDivider />
      {projects.length > 0 && <ProjectsGrid projects={profile.projects} />}

      <Footer
        name={profile.name}
        email={emailLink?.url.replace("mailto:", "") ?? ""}
        social={profile.social}
      />
    </main>
  );
}
