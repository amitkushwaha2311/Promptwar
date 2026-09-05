'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Scale,
  ArrowLeft,
  CheckCircle2,
  TrendingUp,
  Award,
  Zap,
  ArrowRight,
  Shield,
  Clock,
  Sparkles,
} from 'lucide-react';
import { GeneratedIdea } from '@/lib/ai/types';

function CompareContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [ideas, setIdeas] = useState<GeneratedIdea[]>([]);
  const [loading, setLoading] = useState(true);
  const [startingTitle, setStartingTitle] = useState<string | null>(null);

  useEffect(() => {
    async function loadIdeas() {
      try {
        const res = await fetch('/api/ideas');
        if (res.ok) {
          const data = await res.json();
          if (data.ideas) {
            const rawItems = searchParams.get('items');
            if (rawItems) {
              const titles: string[] = JSON.parse(decodeURIComponent(rawItems));
              const filtered = data.ideas.filter((i: GeneratedIdea) => titles.includes(i.title));
              setIdeas(filtered.length > 0 ? filtered : data.ideas.slice(0, 3));
            } else {
              setIdeas(data.ideas.slice(0, 3));
            }
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadIdeas();
  }, [searchParams]);

  const handleStartProject = async (idea: GeneratedIdea) => {
    setStartingTitle(idea.title);
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: idea.title,
          shortDescription: idea.shortDescription,
          problemStatement: idea.problemStatement,
          proposedSolution: idea.proposedSolution,
          targetUsers: idea.targetUsers,
          domain: idea.domain || 'AI/ML',
          projectType: idea.type || 'Web Application',
          difficulty: idea.difficulty,
          estimatedDuration: idea.estimatedDuration,
          teamSize: 3,
          coreFeatures: idea.coreFeatures,
          optionalFeatures: idea.optionalFeatures,
          recommendedTechStack: idea.recommendedTechStack,
        }),
      });
      const data = await res.json();
      if (data.projectId) {
        router.push(`/project/${data.projectId}`);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setStartingTitle(null);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center space-y-3">
        <p className="text-xs text-indigo-400 font-semibold animate-pulse">Loading comparison data...</p>
      </div>
    );
  }

  if (ideas.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center space-y-4">
        <Scale className="mx-auto h-10 w-10 text-slate-500" />
        <h2 className="text-xl font-bold text-white">No Ideas Selected for Comparison</h2>
        <p className="text-xs text-slate-400">
          Return to the Idea Generator and select 2 or 3 ideas to view their side-by-side technical matrix.
        </p>
        <Link
          href="/generate"
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-xs font-bold text-white hover:bg-indigo-500"
        >
          <ArrowLeft className="h-4 w-4" /> Go to Idea Generator
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/generate"
            className="p-2 rounded-xl border border-slate-800 bg-slate-900 text-slate-400 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <Scale className="h-5 w-5 text-violet-400" />
              Project Ideas Comparison Matrix
            </h1>
            <p className="text-xs text-slate-400">
              Evaluate tradeoffs in technical complexity, recruiter value, and execution timeline
            </p>
          </div>
        </div>
      </div>

      {/* Comparison Grid */}
      <div className={`grid grid-cols-1 md:grid-cols-${Math.min(ideas.length, 3)} gap-6`}>
        {ideas.map((idea) => {
          const isStarting = startingTitle === idea.title;

          return (
            <div
              key={idea.title}
              className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 flex flex-col justify-between backdrop-blur-xl shadow-xl space-y-5"
            >
              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="rounded-md bg-indigo-500/20 px-2 py-0.5 text-[10px] font-bold text-indigo-400 border border-indigo-500/30">
                    {idea.difficulty} • {idea.estimatedDuration}
                  </span>
                  <h3 className="text-base font-bold text-white leading-tight mt-1">{idea.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{idea.shortDescription}</p>
                </div>

                {/* Score Cards */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800">
                  <div className="rounded-lg bg-slate-950/80 p-2 text-center border border-slate-800">
                    <p className="text-[10px] text-slate-500">Innovation</p>
                    <p className="text-sm font-bold text-amber-400">{idea.innovationScore}/10</p>
                  </div>
                  <div className="rounded-lg bg-slate-950/80 p-2 text-center border border-slate-800">
                    <p className="text-[10px] text-slate-500">Practicality</p>
                    <p className="text-sm font-bold text-emerald-400">{idea.practicalityScore}/10</p>
                  </div>
                  <div className="rounded-lg bg-slate-950/80 p-2 text-center border border-slate-800">
                    <p className="text-[10px] text-slate-500">Resume Value</p>
                    <p className="text-sm font-bold text-indigo-400">{idea.resumeValue}/10</p>
                  </div>
                </div>

                {/* Core Features */}
                <div className="pt-2 border-t border-slate-800 space-y-1.5">
                  <p className="text-[11px] font-bold text-slate-300">Core MVP Features:</p>
                  <ul className="space-y-1 text-slate-400 text-[11px]">
                    {idea.coreFeatures.slice(0, 3).map((f, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <CheckCircle2 className="h-3 w-3 text-indigo-400 shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Recommended Tech Stack */}
                <div className="pt-2 border-t border-slate-800 space-y-1.5">
                  <p className="text-[11px] font-bold text-slate-300">Recommended Tech:</p>
                  <div className="flex flex-wrap gap-1">
                    {idea.recommendedTechStack.map((tech) => (
                      <span
                        key={tech}
                        className="rounded border border-slate-800 bg-slate-950 px-1.5 py-0.5 text-[10px] text-slate-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Start Project CTA */}
              <div className="pt-4 border-t border-slate-800">
                <button
                  onClick={() => handleStartProject(idea)}
                  disabled={isStarting}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 transition-all cursor-pointer"
                >
                  <Zap className="h-3.5 w-3.5" />
                  {isStarting ? 'Setting Up Project...' : 'Select & Build This Project'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-slate-400">Loading comparison...</div>}>
      <CompareContent />
    </Suspense>
  );
}
