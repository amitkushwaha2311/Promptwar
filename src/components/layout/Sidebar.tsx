'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Compass,
  Sparkles,
  FolderOpen,
  Map,
  CheckSquare,
  Bot,
  FolderGit2 as Github,
  BrainCircuit,
  GraduationCap,
  FileText,
  Users,
  Settings,
  Home,
  ArrowRight
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const [projectId, setProjectId] = useState<string | null>(null);

  // Extract projectId from URL if present
  useEffect(() => {
    const match = pathname.match(/^\/project\/([^\/]+)/);
    if (match) {
      setProjectId(match[1]);
    } else {
      // If on dashboard or elsewhere, fetch the first project to use as default
      fetch('/api/projects')
        .then(res => res.json())
        .then(data => {
          if (data.projects && data.projects.length > 0) {
            setProjectId(data.projects[0].id);
          }
        })
        .catch(e => console.error('Failed to fetch project for sidebar', e));
    }
  }, [pathname]);

  const isLandingOrAuth = pathname === '/' || pathname === '/login' || pathname === '/register' || pathname === '/onboarding';

  if (isLandingOrAuth) return null;

  const getHref = (basePath: string) => {
    if (!projectId) return basePath; // Fallback
    if (['/dashboard', '/generate', '/project', '/settings', '/team', '/reports'].includes(basePath)) return basePath;
    return `/project/${projectId}${basePath}`;
  };

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Generate Ideas', href: '/generate', icon: Sparkles },
    { name: 'My Projects', href: '/project', icon: FolderOpen },
    { name: 'Roadmap', href: '/roadmap', icon: Map },
    { name: 'Tasks', href: '/tasks', icon: CheckSquare },
    { name: 'AI Mentor', href: '/mentor', icon: Bot },
    { name: 'GitHub Analysis', href: '/github', icon: Github },
    { name: 'What-If Simulator', href: '/simulator', icon: BrainCircuit },
    { name: 'Evaluation & Viva', href: '/evaluation', icon: GraduationCap },
    { name: 'Reports', href: '/reports', icon: FileText },
    { name: 'Team', href: '/team', icon: Users },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <aside className="w-[260px] shrink-0 hidden md:flex flex-col justify-between bg-[#0B0E17] border-r border-slate-800/50 h-screen overflow-y-auto">
      <div className="flex flex-col p-4">
        
        {/* Brand Logo */}
        <Link href="/dashboard" className="flex items-center gap-3 mb-8 px-2 mt-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 shadow-[0_0_15px_-3px_rgba(99,102,241,0.5)]">
            <Compass className="h-6 w-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[17px] font-bold tracking-tight text-white">ProjectPilot</span>
              <span className="rounded bg-indigo-500/20 px-1 py-0.5 text-[9px] font-bold text-indigo-400">AI</span>
            </div>
            <p className="text-[9px] text-slate-400">From Idea to Viva, Together.</p>
          </div>
        </Link>
        
        {/* Navigation */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const resolvedHref = getHref(item.href);
            const active = pathname === resolvedHref || (item.href !== '/dashboard' && pathname.includes(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={resolvedHref}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-[13px] font-medium transition-all group ${
                  active
                    ? 'bg-gradient-to-r from-indigo-600 to-blue-700 text-white shadow-[0_0_15px_-3px_rgba(99,102,241,0.3)]'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className={`h-4 w-4 shrink-0 transition-colors ${active ? 'text-white' : 'text-slate-400 group-hover:text-slate-300'}`} strokeWidth={active ? 2.5 : 2} />
                <span className="truncate">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* AI Mascot Box */}
      <div className="p-4 mt-auto mb-4">
        <div className="relative rounded-2xl bg-gradient-to-b from-[#161C2D] to-[#0A0D15] border border-slate-800/80 p-5 text-center overflow-hidden">
          {/* Abstract glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-24 bg-indigo-500/20 blur-2xl rounded-full"></div>
          
          <div className="relative z-10">
            {/* Mascot Icon */}
            <div className="w-16 h-16 mx-auto mb-3 flex items-center justify-center drop-shadow-[0_0_15px_rgba(99,102,241,0.4)]">
              <div className="w-12 h-12 bg-white rounded-2xl rotate-12 flex items-center justify-center">
                <Bot className="w-8 h-8 text-indigo-600 -rotate-12" />
              </div>
            </div>
            
            <h4 className="text-sm font-bold text-white mb-1">Your AI Project Co-Pilot</h4>
            <p className="text-[11px] text-slate-400 mb-4 leading-tight">Smarter decisions.<br/>Stronger projects.</p>
            
            <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-[0_0_15px_rgba(79,70,229,0.3)]">
              Ask Anything <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
