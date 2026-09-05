'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  Bell,
  Flame,
  Settings,
  MoreVertical,
  ChevronRight,
  Play,
  MessageSquare,
  Mic,
  Paperclip,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  Circle,
  Lightbulb,
  Map,
  FolderGit2 as Github,
  BrainCircuit,
  GraduationCap,
  FileText,
  Code2,
  ArrowRight,
  Activity,
  Compass,
  Sparkles,
  Layers,
  Bot,
  Award,
  BookOpen,
  TrendingUp,
  Clock,
  Calendar,
  Zap,
  ShieldCheck,
  AlertCircle,
  User
} from 'lucide-react';

export default function ProjectOverviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const [project, setProject] = useState<Record<string, unknown> | null>(null);
  useEffect(() => {
    fetch(`/api/projects/${id}`).then(r => r.json()).then(d => setProject(d.project));
  }, [id]);
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  // Simulated data to match the image exactly
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (!project) {
    return <div className="flex-1 flex items-center justify-center"><div className="animate-spin h-8 w-8 border-2 border-indigo-500 border-t-transparent rounded-full"></div></div>;
  }

  return (
    <div className="flex-1 w-full bg-[#090B14] p-4 sm:p-6 space-y-6 text-white min-h-screen">
      
      {/* Top Section: Hero & Health */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Cinematic Hero */}
        <div className="lg:col-span-3 rounded-2xl relative overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 border border-slate-800/50 p-8 min-h-[280px] flex flex-col justify-between">
          {/* Abstract mountain/path background simulation */}
          <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=2094&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#090B14] via-transparent to-transparent opacity-80"></div>
          
          <div className="relative z-10">
            <p className="text-slate-300 text-sm mb-2">Good Morning, Alex! 👋</p>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white mb-2 leading-tight">
              {project.title.split(' ').slice(0, 2).join(' ')}<br />{project.title.split(' ').slice(2).join(' ')} <span className="text-cyan-400">Project.</span>
            </h1>
            <p className="text-slate-300 text-sm max-w-md">Plan smarter. Build better. Graduate with confidence.</p>
          </div>
          
          <div className="relative z-10 flex gap-4 mt-8">
            <button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-6 py-2.5 rounded-xl font-medium text-sm flex items-center gap-2 transition-all">
              <span className="text-lg">🚀</span> Continue Building
            </button>
            <button className="bg-slate-900/60 border border-slate-700 hover:bg-slate-800 text-white px-6 py-2.5 rounded-xl font-medium text-sm flex items-center gap-2 backdrop-blur-md transition-all">
              <Play className="w-4 h-4" /> Watch Progress
            </button>
          </div>
          
          {/* Simulated curved roadmap overlay in the hero */}
          <div className="hidden md:block absolute right-10 bottom-10 top-10 w-1/2 pointer-events-none">
            <svg className="w-full h-full" viewBox="0 0 400 200" fill="none">
              <path d="M50,150 C150,150 150,50 250,50 C300,50 350,100 350,100" stroke="url(#paint0_linear)" strokeWidth="4" strokeLinecap="round" strokeDasharray="8 8" />
              <defs>
                <linearGradient id="paint0_linear" x1="50" y1="150" x2="350" y2="50" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#38bdf8" />
                  <stop offset="1" stopColor="#818cf8" />
                </linearGradient>
              </defs>
              <circle cx="50" cy="150" r="6" fill="#fef08a" className="animate-pulse" />
              <circle cx="250" cy="50" r="6" fill="#38bdf8" />
              <circle cx="350" cy="100" r="6" fill="#a78bfa" />
            </svg>
          </div>
        </div>

        {/* Project Health Card */}
        <div className="rounded-2xl bg-[#0F1322] border border-slate-800/60 p-6 flex flex-col relative">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <span className="text-slate-300 text-sm font-medium">Project Health</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-emerald-500 text-xs font-medium">Live</span>
            </div>
          </div>
          
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="relative w-32 h-32 flex items-center justify-center">
              <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                <circle cx="64" cy="64" r="56" stroke="#1E293B" strokeWidth="8" fill="none" />
                <circle cx="64" cy="64" r="56" stroke="#06b6d4" strokeWidth="8" fill="none" strokeDasharray="351.8" strokeDashoffset={351.8 - (351.8 * 0.88)} className="drop-shadow-[0_0_10px_rgba(6,182,212,0.5)] transition-all duration-1000" strokeLinecap="round" />
              </svg>
              <div className="text-center">
                <span className="text-4xl font-bold text-white">88</span>
                <span className="block text-xs text-slate-500 mt-1">/100</span>
              </div>
            </div>
          </div>
          
          <div className="mt-6 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <ArrowUpRight className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400 font-medium">Optimal</span>
              </div>
              <span className="text-slate-400 text-xs">+12% from last week</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>On track for submission</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-300">
              <div className="w-4 h-4 flex items-center justify-center rounded-full bg-rose-500/20 text-rose-500 text-[10px] font-bold border border-rose-500/30">5</div>
              <span>5 risks detected</span>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Section: Active Project & AI Mentor */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Active Project Detail */}
        <div className="lg:col-span-2 rounded-2xl bg-[#0F1322] border border-slate-800/60 p-6 flex flex-col md:flex-row gap-6">
          <div className="w-24 h-32 rounded-xl bg-gradient-to-br from-indigo-900 to-blue-900 border border-indigo-500/30 flex-shrink-0 flex items-center justify-center shadow-lg relative overflow-hidden">
            {/* Fake document preview */}
            <div className="w-14 h-20 bg-blue-500/20 rounded border border-blue-400/30 p-2 transform -rotate-6">
              <div className="h-1.5 w-8 bg-blue-400/50 rounded-full mb-2"></div>
              <div className="space-y-1">
                <div className="h-1 w-full bg-blue-400/30 rounded-full"></div>
                <div className="h-1 w-full bg-blue-400/30 rounded-full"></div>
                <div className="h-1 w-3/4 bg-blue-400/30 rounded-full"></div>
              </div>
            </div>
          </div>
          
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-xl font-bold text-white tracking-tight">{project.title}</h2>
                    <span className="px-2 py-0.5 rounded text-[10px] font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-1">
                      Active <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                  <p className="text-sm text-slate-400 mb-4">{project.shortDescription}</p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {['Next.js', 'FastAPI', 'PostgreSQL', 'LLM'].map(tech => (
                  <span key={tech} className="px-3 py-1 rounded-full text-xs font-medium text-indigo-300 bg-indigo-900/30 border border-indigo-500/20">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="flex items-end justify-between border-t border-slate-800/50 pt-4">
              <div className="flex items-center gap-3 text-slate-300">
                <div className="p-2 rounded-lg bg-slate-800">
                  <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium">Deadline</p>
                  <p className="text-sm font-semibold">Dec 15, 2025</p>
                </div>
              </div>
              
              <div className="text-right">
                <p className="text-xl font-bold text-white">45 <span className="text-sm font-medium text-slate-400">days left</span></p>
                <div className="w-48 mt-2">
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-cyan-400 rounded-full" style={{ width: '72%' }}></div>
                  </div>
                  <p className="text-right text-[10px] text-slate-500 mt-1">72% complete</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Mentor Chat Snippet */}
        <div className="rounded-2xl bg-[#0F1322] border border-slate-800/60 p-5 flex flex-col relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-bl-full pointer-events-none"></div>
          
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 p-[1px]">
                  <div className="w-full h-full rounded-full bg-[#0F1322] flex items-center justify-center">
                    <span className="text-lg">🤖</span>
                  </div>
                </div>
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[#0F1322]"></div>
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">AI Mentor</h3>
                <p className="text-xs text-slate-400">Your personal project mentor</p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> Online
            </span>
          </div>
          
          <div className="flex-1 space-y-3">
            <p className="text-sm text-slate-300">How can I help you today?</p>
            
            <div className="grid grid-cols-2 gap-2">
              <button className="text-left px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-xs text-slate-300 hover:bg-slate-800 transition-colors flex items-center gap-2">
                <Code2 className="w-3.5 h-3.5 text-indigo-400" /> Explain this code
              </button>
              <button className="text-left px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-xs text-slate-300 hover:bg-slate-800 transition-colors flex items-center gap-2">
                <Lightbulb className="w-3.5 h-3.5 text-amber-400" /> Suggest improvements
              </button>
              <button className="text-left px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-xs text-slate-300 hover:bg-slate-800 transition-colors flex items-center gap-2">
                <Map className="w-3.5 h-3.5 text-cyan-400" /> Help with roadmap
              </button>
              <button className="text-left px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-xs text-slate-300 hover:bg-slate-800 transition-colors flex items-center gap-2">
                <GraduationCap className="w-3.5 h-3.5 text-purple-400" /> Prepare viva questions
              </button>
            </div>
          </div>
          
          <div className="mt-4 relative">
            <input 
              type="text" 
              placeholder="Ask anything about your project..." 
              className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 pl-4 pr-12 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <button className="p-1.5 rounded-lg text-slate-400 hover:text-white transition-colors">
                <Paperclip className="w-4 h-4" />
              </button>
              <button className="p-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 transition-colors">
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics Row */}
      <div className="rounded-2xl bg-[#0F1322] border border-slate-800/60 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-semibold text-white">Key Metrics</h3>
          </div>
          <button className="text-xs text-indigo-400 hover:text-indigo-300 font-medium">View All</button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {[
            { label: 'Development', value: 72, color: '#06b6d4', trend: '+5%', up: true },
            { label: 'Documentation', value: 64, color: '#8b5cf6', trend: '-4%', up: false },
            { label: 'Testing', value: 82, color: '#f59e0b', trend: '+30%', up: true },
            { label: 'Code Quality', value: 88, color: '#3b82f6', trend: '+8%', up: true },
            { label: 'Innovation', value: 86, color: '#d946ef', trend: '+6%', up: true },
            { label: 'Deadline Health', value: 70, color: '#f43f5e', trend: '-3%', up: false },
          ].map((metric, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="relative w-20 h-20 mb-3 flex items-center justify-center">
                <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                  <circle cx="40" cy="40" r="34" stroke="#1E293B" strokeWidth="6" fill="none" />
                  <circle cx="40" cy="40" r="34" stroke={metric.color} strokeWidth="6" fill="none" strokeDasharray="213.6" strokeDashoffset={213.6 - (213.6 * metric.value) / 100} strokeLinecap="round" className="drop-shadow-[0_0_5px_rgba(255,255,255,0.1)]" />
                </svg>
                <span className="text-lg font-bold text-white">{metric.value}%</span>
              </div>
              <span className="text-xs text-slate-300 font-medium mb-1 text-center">{metric.label}</span>
              <span className={`text-[10px] font-semibold flex items-center gap-0.5 ${metric.up ? 'text-emerald-400' : 'text-rose-400'}`}>
                {metric.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />} {metric.trend}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Third Row: Roadmap, Activity, Team */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Roadmap Progress */}
        <div className="rounded-2xl bg-[#0F1322] border border-slate-800/60 p-6 flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <Map className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-semibold text-white">Roadmap Progress</h3>
            </div>
            <span className="text-xs text-slate-400 font-medium">7/12 Weeks</span>
          </div>
          
          <div className="flex justify-between relative px-2 mb-8 mt-2">
            <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-slate-800 -translate-y-1/2 z-0"></div>
            <div className="absolute top-1/2 left-4 h-0.5 bg-indigo-500 -translate-y-1/2 z-0" style={{ width: '55%' }}></div>
            
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="relative z-10 flex flex-col items-center gap-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] border-2 ${
                  i < 6 ? 'bg-emerald-500 border-emerald-500 text-white' : 
                  i === 6 ? 'bg-indigo-600 border-indigo-400 text-white shadow-[0_0_10px_rgba(99,102,241,0.5)]' : 
                  'bg-[#0F1322] border-slate-700 text-slate-500'
                }`}>
                  {i < 6 ? <CheckCircle2 className="w-3.5 h-3.5" /> : null}
                </div>
                <span className="text-[10px] font-medium text-slate-400">W{i+1}</span>
              </div>
            ))}
          </div>
          
          <div className="mt-auto">
            <p className="text-xs font-bold text-indigo-400 mb-2">Week 7: AI Model Integration</p>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-cyan-400 to-indigo-500 rounded-full" style={{ width: '70%' }}></div>
              </div>
              <span className="text-xs font-bold text-white">70%</span>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="rounded-2xl bg-[#0F1322] border border-slate-800/60 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-semibold text-white">Recent Activity</h3>
            </div>
            <button className="text-xs text-indigo-400 hover:text-indigo-300 font-medium">View All</button>
          </div>
          
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="mt-0.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /></div>
              <div>
                <p className="text-sm font-medium text-slate-200">Updated model preprocessing</p>
                <p className="text-xs text-slate-500">2 hours ago</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="mt-0.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /></div>
              <div>
                <p className="text-sm font-medium text-slate-200">Completed database schema</p>
                <p className="text-xs text-slate-500">5 hours ago</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="mt-0.5"><MessageSquare className="w-4 h-4 text-indigo-400" /></div>
              <div>
                <p className="text-sm font-medium text-slate-200">Asked AI: &quot;How to improve accuracy?&quot;</p>
                <p className="text-xs text-slate-500">8 hours ago</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="mt-0.5"><Github className="w-4 h-4 text-slate-400" /></div>
              <div>
                <p className="text-sm font-medium text-slate-200">Pushed 12 commits to GitHub</p>
                <p className="text-xs text-slate-500">1 day ago</p>
              </div>
            </div>
          </div>
        </div>

        {/* Team Contribution */}
        <div className="rounded-2xl bg-[#0F1322] border border-slate-800/60 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-semibold text-white">Team Contribution</h3>
            </div>
            <button className="text-xs text-indigo-400 hover:text-indigo-300 font-medium">View Details</button>
          </div>
          
          <div className="space-y-4">
            {[
              { init: 'AR', name: 'Alex Rivera', val: 34, color: 'bg-indigo-500', barCol: 'from-indigo-500 to-purple-500' },
              { init: 'SC', name: 'Sam Carter', val: 29, color: 'bg-cyan-500', barCol: 'from-cyan-400 to-blue-500' },
              { init: 'PP', name: 'Priya Patel', val: 24, color: 'bg-emerald-500', barCol: 'from-emerald-400 to-teal-500' },
              { init: 'KD', name: 'Karan Desai', val: 13, color: 'bg-amber-500', barCol: 'from-amber-400 to-orange-500' },
            ].map((member, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full ${member.color} flex items-center justify-center text-xs font-bold text-white shrink-0`}>
                  {member.init}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-slate-200">{member.name}</span>
                    <span className="text-xs font-bold text-white">{member.val}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className={`h-full bg-gradient-to-r ${member.barCol} rounded-full`} style={{ width: `${member.val}%` }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <p className="text-[10px] text-slate-500 mt-4 text-center">Contribution estimate based on project activity.</p>
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        {[
          { title: 'Generate Ideas', subtitle: 'Get personalized project ideas', icon: Lightbulb, color: 'text-amber-400', bg: 'bg-amber-500/10' },
          { title: 'Interactive Roadmap', subtitle: 'Visualize and track milestones', icon: Map, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
          { title: 'GitHub Analysis', subtitle: 'Analyze code & get insights', icon: Github, color: 'text-white', bg: 'bg-slate-700/30' },
          { title: 'What-If Simulator', subtitle: 'Simulate changes and see impact', icon: BrainCircuit, color: 'text-purple-400', bg: 'bg-purple-500/10' },
          { title: 'Evaluation & Viva', subtitle: 'AI evaluation & practice exams', icon: GraduationCap, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
          { title: 'Project Report', subtitle: 'Generate report, resume & README', icon: FileText, color: 'text-blue-400', bg: 'bg-blue-500/10' },
        ].map((card, i) => (
          <Link key={i} href="#" className="rounded-xl bg-gradient-to-br from-[#121629] to-[#0a0d18] border border-slate-800/60 p-4 hover:border-indigo-500/40 transition-colors flex flex-col justify-between h-32 group">
            <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center mb-2`}>
              <card.icon className={`w-5 h-5 ${card.color}`} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white mb-0.5">{card.title}</h4>
              <p className="text-[10px] text-slate-400 leading-tight">{card.subtitle}</p>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-500 absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
          </Link>
        ))}
      </div>

    </div>
  );
}


