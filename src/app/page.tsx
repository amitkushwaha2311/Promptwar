'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  Sparkles,
  Compass,
  ArrowRight,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Code2,
  FolderGit2,
  Award,
  Layers,
  Bot,
  BookOpen,
  Activity,
  Cpu,
  GraduationCap,
  Users,
} from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();
  const [loadingDemo, setLoadingDemo] = useState(false);

  const handleLaunchDemo = async () => {
    setLoadingDemo(true);
    try {
      const res = await fetch('/api/demo/seed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ autoLogin: true }),
      });
      const data = await res.json();
      if (data.success) {
        router.push('/dashboard');
      } else {
        router.push('/login');
      }
    } catch {
      router.push('/dashboard');
    } finally {
      setLoadingDemo(false);
    }
  };

  const workflowSteps = [
    { number: '01', title: 'Profile & Skills', desc: 'Input your branch, languages, frameworks, and duration' },
    { number: '02', title: 'AI Idea Engine', desc: 'Receive 5-10 customized, non-generic final-year project ideas' },
    { number: '03', title: 'Feasibility Check', desc: 'Score technical complexity, data availability, and trim MVP scope' },
    { number: '04', title: 'Smart Roadmap', desc: 'Follow a week-by-week timeline with tasks and dependency tracking' },
    { number: '05', title: 'AI Mentor Chat', desc: 'Solve bugs, debug 500 errors, and optimize architectures 24/7' },
    { number: '06', title: 'GitHub Audit', desc: 'Scan code structure, documentation, test suites, and activity' },
    { number: '07', title: 'Viva Simulator', desc: 'Rehearse project defense questions with instant AI scoring' },
  ];

  const featureCards = [
    {
      icon: Sparkles,
      title: 'AI Project Ideas Generator',
      desc: 'Avoid repetitive and trivial topics. Generate personalized projects aligned to your skills, team size, and recruiter appeal.',
      badge: 'Module 2',
      color: 'from-indigo-500 to-violet-500',
    },
    {
      icon: ShieldCheck,
      title: 'Feasibility & Scope Optimizer',
      desc: 'Prevent project failure from over-scoping. Partition features into MVP, Recommended, and Future Scope.',
      badge: 'Module 3',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Layers,
      title: 'Tech Stack & Dynamic Roadmap',
      desc: 'Get curated tech recommendations with pros/cons and a week-by-week interactive tracker that updates your health score.',
      badge: 'Module 4',
      color: 'from-violet-500 to-purple-500',
    },
    {
      icon: Bot,
      title: 'Context-Aware AI Mentor',
      desc: 'Dedicated mentor trained on your exact codebase, roadmap phase, and student skills. Practical answers, not generic talk.',
      badge: 'Module 5',
      color: 'from-emerald-500 to-teal-500',
    },
    {
      icon: FolderGit2,
      title: 'GitHub Project Analyzer',
      desc: 'Connect your public GitHub repository to audit code organization, README quality, test coverage, and commit frequency.',
      badge: 'Module 6',
      color: 'from-amber-500 to-orange-500',
    },
    {
      icon: BookOpen,
      title: 'AI Viva Simulator & Evaluator',
      desc: 'Practice Basic, Technical, Architecture, and Advanced viva questions with instant scoring and model answers before submission.',
      badge: 'Module 7',
      color: 'from-rose-500 to-pink-500',
    },
  ];

  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="relative w-full overflow-hidden pt-20 pb-24 md:pt-28 md:pb-32 px-4 sm:px-6 lg:px-8 border-b border-slate-800/60">
        {/* Background Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-600/20 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[300px] h-[300px] bg-violet-600/15 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative max-w-5xl mx-auto text-center space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold text-indigo-300 backdrop-blur-md shadow-inner">
            <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
            <span>AI-Powered Final-Year Project Journey</span>
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-tight">
            Turn Your Project Idea Into a{' '}
            <span className="gradient-text">Final-Year Success.</span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl mx-auto text-base sm:text-lg md:text-xl text-slate-300 font-normal leading-relaxed">
            ProjectPilot AI helps engineering students choose, plan, build, evaluate, and prepare for their final-year projects with personalized AI guidance.
          </p>

          {/* CTA Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/generate"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-7 py-3.5 text-sm font-bold text-white shadow-xl shadow-indigo-600/30 hover:bg-indigo-500 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Sparkles className="h-4 w-4" />
              Generate My Project
              <ArrowRight className="h-4 w-4" />
            </Link>

            <button
              onClick={handleLaunchDemo}
              disabled={loadingDemo}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900/80 px-7 py-3.5 text-sm font-semibold text-slate-200 hover:border-indigo-500 hover:bg-slate-800 transition-all cursor-pointer backdrop-blur-sm"
            >
              <Zap className="h-4 w-4 text-indigo-400" />
              {loadingDemo ? 'Launching Demo...' : 'See How It Works (Demo Project)'}
            </button>
          </div>

          {/* Target Audience Pill Tags */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400">
            <span className="font-medium text-slate-500">Built for:</span>
            {['B.Tech', 'B.E.', 'BCA / MCA', 'Computer Science', 'Information Tech', 'Data Science & AI'].map((tag) => (
              <span
                key={tag}
                className="rounded-md border border-slate-800 bg-slate-900/70 px-2.5 py-1 text-slate-300 text-[11px]"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Live Metrics Showcase Card */}
        <div className="relative max-w-4xl mx-auto mt-16 rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl backdrop-blur-xl">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5">
            <div className="flex items-center gap-3">
              <div className="h-3 w-3 rounded-full bg-rose-500/80" />
              <div className="h-3 w-3 rounded-full bg-amber-500/80" />
              <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
              <span className="text-xs font-semibold text-slate-400 ml-2">ProjectPilot Command Center</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-emerald-500/20 px-2 py-0.5 text-xs font-semibold text-emerald-400 border border-emerald-500/30">
                Active Demo: AI Resume Analyzer
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
            <div className="rounded-xl border border-slate-800/80 bg-slate-950/60 p-4">
              <p className="text-xs text-slate-400">Project Health</p>
              <p className="text-2xl font-black text-white mt-1">78<span className="text-xs text-slate-500 font-normal">/100</span></p>
              <div className="h-1.5 w-full rounded-full bg-slate-800 mt-2 overflow-hidden">
                <div className="h-full bg-emerald-400 rounded-full w-[78%]" />
              </div>
            </div>

            <div className="rounded-xl border border-slate-800/80 bg-slate-950/60 p-4">
              <p className="text-xs text-slate-400">Roadmap Progress</p>
              <p className="text-2xl font-black text-indigo-400 mt-1">72<span className="text-xs text-slate-500 font-normal">%</span></p>
              <div className="h-1.5 w-full rounded-full bg-slate-800 mt-2 overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full w-[72%]" />
              </div>
            </div>

            <div className="rounded-xl border border-slate-800/80 bg-slate-950/60 p-4">
              <p className="text-xs text-slate-400">GitHub Score</p>
              <p className="text-2xl font-black text-violet-400 mt-1">73<span className="text-xs text-slate-500 font-normal">/100</span></p>
              <div className="h-1.5 w-full rounded-full bg-slate-800 mt-2 overflow-hidden">
                <div className="h-full bg-violet-500 rounded-full w-[73%]" />
              </div>
            </div>

            <div className="rounded-xl border border-slate-800/80 bg-slate-950/60 p-4">
              <p className="text-xs text-slate-400">Mock Viva Score</p>
              <p className="text-2xl font-black text-amber-400 mt-1">8.3<span className="text-xs text-slate-500 font-normal">/10</span></p>
              <div className="h-1.5 w-full rounded-full bg-slate-800 mt-2 overflow-hidden">
                <div className="h-full bg-amber-400 rounded-full w-[83%]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7-Step Student Journey Workflow */}
      <section className="w-full py-20 px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <p className="text-xs font-bold uppercase tracking-wider text-indigo-400">Complete Journey</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            From Blank Slate to University Submission Ready
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Never wonder what to do next. ProjectPilot AI structures the entire 4-month lifecycle step-by-step.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {workflowSteps.map((step, idx) => (
            <div
              key={step.number}
              className="relative rounded-xl border border-slate-800 bg-slate-900/40 p-5 hover:border-indigo-500/50 transition-colors"
            >
              <span className="text-3xl font-black text-slate-800">{step.number}</span>
              <h3 className="text-base font-bold text-white mt-2">{step.title}</h3>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">{step.desc}</p>
            </div>
          ))}
          {/* Final Viva Badge */}
          <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/20 p-5 flex flex-col justify-between">
            <div>
              <span className="text-3xl font-black text-emerald-600/40">DONE</span>
              <h3 className="text-base font-bold text-emerald-300 mt-2">Submission & Viva Grade: A+</h3>
              <p className="text-xs text-emerald-400/80 mt-1.5">
                Walk into your external evaluation with complete confidence and flawless technical defense.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
              <Award className="h-4 w-4" /> Ready for Recruiters
            </div>
          </div>
        </div>
      </section>

      {/* 7 Core Modules Feature Grid */}
      <section className="w-full py-20 px-4 sm:px-6 lg:px-8 max-w-7xl border-t border-slate-800/60">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <p className="text-xs font-bold uppercase tracking-wider text-violet-400">Platform Modules</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Everything You Need to Build a Real Working Product
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Not just a static UI demo. Every tool performs real actions, API calls, and calculations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featureCards.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.title}
                className="group relative rounded-2xl border border-slate-800 bg-slate-900/50 p-6 hover:border-slate-700 hover:bg-slate-900/80 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-tr ${feat.color} text-white shadow-lg`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800/80 border border-slate-700/60">
                      {feat.badge}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">{feat.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="w-full py-20 px-4 sm:px-6 lg:px-8 max-w-5xl text-center">
        <div className="rounded-3xl border border-indigo-500/30 bg-gradient-to-b from-indigo-950/40 via-slate-900/60 to-slate-950 p-8 sm:p-12 backdrop-blur-xl relative overflow-hidden">
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Ready to Build an Award-Winning Final-Year Project?
          </h2>
          <p className="max-w-xl mx-auto text-slate-300 text-sm sm:text-base mt-3">
            Start right now. Choose your domain, generate personalized project ideas, and start tracking your development roadmap today.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/generate"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-8 py-3.5 text-sm font-bold text-white shadow-xl shadow-indigo-600/30 hover:bg-indigo-500 transition-all"
            >
              <Sparkles className="h-4 w-4" />
              Generate My Project Ideas
            </Link>
            <Link
              href="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-8 py-3.5 text-sm font-semibold text-slate-200 hover:border-slate-500 transition-all"
            >
              Create Student Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
