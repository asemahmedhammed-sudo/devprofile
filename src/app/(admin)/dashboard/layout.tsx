import Link from "next/link";
import React from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const labels = {
    title: 'Admin Dashboard',
    overview: 'Overview',
    profile: 'Profile',
    projects: 'Projects',
    skills: 'Skills',
    experience: 'Experience',
    backToSite: '← Back to Site',
    back: 'Back',
  };

  return (
    <div
      className="min-h-screen bg-[#08080C] text-gray-200 flex flex-col md:flex-row font-sans"
    >
      {/* ── Sidebar ── */}
      <aside className="w-full md:w-64 border-e border-white/10 bg-white/5 backdrop-blur-lg hidden md:flex flex-col shrink-0">
        <div className="p-6 border-b border-white/10">
          <h1 className="text-xl font-medium tracking-wide text-white">
            {labels.title}
          </h1>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {[
            { href: '/dashboard',             label: labels.overview   },
            { href: '/dashboard/profile',     label: labels.profile    },
            { href: '/dashboard/projects',    label: labels.projects   },
            { href: '/dashboard/skills',      label: labels.skills     },
            { href: '/dashboard/experience',  label: labels.experience },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block px-4 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              {item.label}
            </Link>
          ))}

          {/* ── Shared Resources ── */}
          <div className="pt-3 pb-1">
            <p className="px-4 text-[10px] uppercase tracking-widest text-gray-600 font-medium">Shared</p>
          </div>
          <Link
            href="/dashboard/categories"
            className="block px-4 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            Categories
          </Link>
        </nav>

        <div className="p-6 border-t border-white/10">
          <Link
            href="/"
            className="text-sm tracking-wide text-gray-500 hover:text-white transition-colors"
          >
            {labels.backToSite}
          </Link>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="flex-1 overflow-y-auto min-w-0">
        {/* Mobile header */}
        <div className="md:hidden flex items-center justify-between p-4 border-b border-white/10 bg-white/5">
          <h1 className="text-lg font-medium tracking-wide text-white">{labels.title}</h1>
          <Link href="/" className="text-sm text-gray-400">
            {labels.back}
          </Link>
        </div>

        <div className="p-6 md:p-12 max-w-5xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
