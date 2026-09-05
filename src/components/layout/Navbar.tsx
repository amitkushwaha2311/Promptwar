'use client';

import { usePathname } from 'next/navigation';
import {
  Search,
  Bell,
  Sun,
  Flame,
  ChevronDown,
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const isLandingOrAuth = pathname === '/' || pathname === '/login' || pathname === '/register' || pathname === '/onboarding';

  if (isLandingOrAuth) return null;

  return (
    <header className="sticky top-0 z-50 w-full bg-[#090B14] border-b border-slate-800/50 h-20">
      <div className="flex h-full items-center justify-between px-6 lg:px-8">
        
        {/* Left: Search Bar */}
        <div className="flex-1 max-w-2xl">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400 group-focus-within:text-indigo-400 transition-colors" />
            </div>
            <input
              type="text"
              className="block w-full bg-[#121629] border border-slate-800/80 rounded-xl py-2.5 pl-10 pr-16 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-inner"
              placeholder="Search anything... (e.g. generate ideas, check roadmap, ask AI)"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-[10px] font-bold text-slate-400 bg-slate-800/60 border border-slate-700/50 px-2 py-1 rounded-md">Ctrl K</span>
            </div>
          </div>
        </div>

        {/* Right: Actions & Profile */}
        <div className="flex items-center justify-end gap-5 ml-4">
          
          {/* Icons */}
          <div className="flex items-center gap-4">
            <button className="text-slate-400 hover:text-white transition-colors">
              <Sun className="h-5 w-5" />
            </button>
            <div className="relative">
              <button className="text-slate-400 hover:text-white transition-colors">
                <Bell className="h-5 w-5" />
              </button>
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-rose-500 ring-2 ring-[#090B14]"></span>
            </div>
          </div>

          {/* Divider */}
          <div className="h-8 w-px bg-slate-800/80"></div>

          {/* Streak Indicator */}
          <div className="hidden sm:flex items-center gap-3 bg-[#121629] border border-slate-800/80 px-3 py-1.5 rounded-xl">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500/20 to-orange-500/20 flex items-center justify-center">
              <Flame className="h-4 w-4 text-orange-500" />
            </div>
            <div>
              <p className="text-xs font-bold text-white leading-tight">12 Day Streak</p>
              <p className="text-[10px] text-slate-400 leading-tight">Keep going!</p>
            </div>
          </div>

          {/* User Profile */}
          <button className="flex items-center gap-3 bg-[#121629] border border-slate-800/80 px-2.5 py-1.5 rounded-xl hover:bg-slate-800/50 transition-colors">
            <div className="h-9 w-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
              AR
            </div>
            <div className="hidden md:block text-left mr-2">
              <p className="text-sm font-semibold text-white leading-tight">Alex Rivera</p>
              <p className="text-[10px] text-slate-400 leading-tight">Computer Science</p>
            </div>
          </button>
          
        </div>
      </div>
    </header>
  );
}
