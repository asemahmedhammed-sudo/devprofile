export default function DashboardOverviewPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header>
        <h2 className="text-3xl font-light tracking-wide text-white mb-2">Overview</h2>
        <p className="text-gray-400 leading-relaxed font-light">
          Manage your profile data, projects, and work experience. Select an entity from the sidebar to begin editing.
        </p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Stat Cards - Placeholder */}
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-lg">
          <h3 className="text-sm font-medium text-gray-400 tracking-wide uppercase mb-1">Total Projects</h3>
          <p className="text-4xl font-light text-white">12</p>
        </div>
        
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-lg">
          <h3 className="text-sm font-medium text-gray-400 tracking-wide uppercase mb-1">Active Skills</h3>
          <p className="text-4xl font-light text-white">24</p>
        </div>
        
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-lg">
          <h3 className="text-sm font-medium text-gray-400 tracking-wide uppercase mb-1">Experience</h3>
          <p className="text-4xl font-light text-white">5 yrs</p>
        </div>
      </div>
      
      {/* Quick Actions (Placeholder) */}
      <div className="mt-12">
        <h3 className="text-xl font-light tracking-wide text-white mb-4">Quick Actions</h3>
        <div className="flex gap-4">
          <button className="px-6 py-3 bg-white text-black font-medium rounded-lg hover:bg-gray-200 transition-colors">
            + New Project
          </button>
          <button className="px-6 py-3 bg-white/10 text-white font-medium rounded-lg hover:bg-white/20 transition-colors border border-white/10">
            Export Setup
          </button>
        </div>
      </div>
    </div>
  );
}
