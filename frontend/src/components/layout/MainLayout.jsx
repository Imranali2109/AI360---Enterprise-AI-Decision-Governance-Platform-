import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Lightbulb, FlaskConical, Calculator,
  TrendingUp, Shield, BookOpen, FileText, LogOut,
  Settings, BrainCircuit, Search, Bell, ChevronRight, Zap
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const navItems = [
  { path: '/',                    label: 'Dashboard',          icon: LayoutDashboard },
  { path: '/use-cases',           label: 'AI Use Cases',       icon: Lightbulb },
  { path: '/llm-comparison',      label: 'LLM Comparison',     icon: FlaskConical },
  { path: '/cost-calculator',     label: 'Cost Calculator',    icon: Calculator },
  { path: '/roi-calculator',      label: 'ROI Calculator',     icon: TrendingUp },
  { path: '/risk-governance',     label: 'Risk & Governance',  icon: Shield },
  { path: '/knowledge-assistant', label: 'Knowledge Assistant', icon: BookOpen },
  { path: '/reports',             label: 'Reports',            icon: FileText },
];

const pageTitles = {
  '/':                    'Dashboard',
  '/use-cases':           'AI Use Cases',
  '/use-cases/new':       'New Use Case',
  '/llm-comparison':      'LLM Comparison',
  '/cost-calculator':     'Cost Calculator',
  '/roi-calculator':      'ROI Calculator',
  '/risk-governance':     'Risk & Governance',
  '/knowledge-assistant': 'Knowledge Assistant',
  '/reports':             'Reports',
};

export default function MainLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const getPageTitle = () => {
    const match = Object.keys(pageTitles)
      .sort((a, b) => b.length - a.length)
      .find(p => location.pathname === p || (p !== '/' && location.pathname.startsWith(p)));
    return pageTitles[match] || 'AI360';
  };

  const getBreadcrumb = () => {
    const parts = location.pathname.split('/').filter(Boolean);
    if (!parts.length) return ['Dashboard'];
    return ['Home', ...parts.map(p => p.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()))];
  };

  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'AU';

  return (
    <div className="flex h-screen overflow-hidden bg-[#0C0C0E]">

      {/* ── Sidebar ──────────────────────────────────── */}
      <aside className="w-[220px] flex flex-col bg-[#0E0E12] border-r border-[#1E1E28] flex-shrink-0 py-5">

        {/* Logo */}
        <div className="flex items-center gap-2.5 px-5 mb-8">
          <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center shadow-glow-orange-sm flex-shrink-0">
            <BrainCircuit className="w-4.5 h-4.5 text-white w-[18px] h-[18px]" />
          </div>
          <div>
            <span className="text-base font-bold text-white tracking-tight">AI360</span>
            <p className="text-[9px] text-[#555570] uppercase tracking-widest -mt-0.5">Enterprise</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 space-y-0.5">
          <p className="text-[10px] font-semibold text-[#444460] uppercase tracking-widest px-3 mb-2">Menu</p>
          {navItems.map(({ path, label, icon: Icon }) => {
            const isActive = path === '/'
              ? location.pathname === '/'
              : location.pathname.startsWith(path);
            return (
              <NavLink
                key={path}
                to={path}
                className={`nav-item ${isActive ? 'active' : ''}`}
              >
                <Icon className={`w-4 h-4 flex-shrink-0 nav-icon ${isActive ? 'text-brand-500' : 'text-[#555570]'}`} strokeWidth={isActive ? 2.5 : 1.8} />
                <span>{label}</span>
                {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-500" />}
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="px-3 space-y-0.5 mt-4 pt-4 border-t border-[#1E1E28]">
          <button className="nav-item w-full">
            <Settings className="w-4 h-4 text-[#555570]" strokeWidth={1.8} />
            <span>Settings</span>
          </button>
          <button onClick={logout} className="nav-item w-full hover:text-red-400 hover:bg-red-500/5">
            <LogOut className="w-4 h-4 text-[#555570]" strokeWidth={1.8} />
            <span>Logout</span>
          </button>

          {/* User */}
          <div className="flex items-center gap-2.5 px-3 py-2.5 mt-2 rounded-xl bg-white/[0.03] border border-[#1E1E28]">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-400 to-brand-700 flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-white truncate">{user?.name || 'User'}</p>
              <p className="text-[10px] text-[#555570] capitalize">{user?.role || 'user'}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main ─────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">

        {/* Topbar */}
        <header className="h-14 flex items-center px-6 gap-4 border-b border-[#1A1A22] bg-[#0C0C0E]/80 backdrop-blur-sm flex-shrink-0 z-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-xs text-[#555570]">
            {getBreadcrumb().map((c, i, arr) => (
              <React.Fragment key={i}>
                <span className={i === arr.length - 1 ? 'text-white font-medium' : ''}>{c}</span>
                {i < arr.length - 1 && <ChevronRight className="w-3 h-3" />}
              </React.Fragment>
            ))}
          </div>

          {/* Search */}
          <div className="flex-1 max-w-xs ml-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#444460]" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#141418] border border-[#222230]
                           rounded-lg text-white placeholder-[#444460] focus:outline-none
                           focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/20 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 ml-auto">
            {/* Bell */}
            <button className="relative w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/5 text-[#555570] hover:text-white transition-colors">
              <Bell className="w-4 h-4" strokeWidth={1.8} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-brand-500 rounded-full shadow-glow-orange-sm" />
            </button>

            <div className="w-px h-5 bg-[#1E1E28]" />

            {/* Avatar */}
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-400 to-brand-700 flex items-center justify-center text-[10px] font-bold text-white shadow-glow-orange-sm">
                {initials}
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-medium text-white leading-none">{user?.name}</p>
                <p className="text-[10px] text-[#555570] mt-0.5 capitalize">{user?.role}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
