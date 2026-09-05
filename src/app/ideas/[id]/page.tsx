'use client';

import { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  TrendingUp,
  Award,
  Zap,
  ArrowRight,
  Shield,
  Clock,
  Layers,
  Users,
  AlertTriangle,
} from 'lucide-react';

export default function SingleIdeaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [idea, setIdea] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    async function loadIdea() {
      try {
        const res = await fetch(`/api/ideas/${id}`);
        if (res.ok) {
          const data = await res.json();
          if (data.idea) setIdea(data.idea);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadIdea();
  }, [id]);

  const handleStartProject = async () => {
    if (!idea) return;
    setStarting(true);
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
          domain: 'AI/ML',
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
      setStarting(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center text-xs text-slate-400">
        Loading idea blueprint...
      </div>
    );
  }

  if (!idea) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Project Idea Not Found</h2>
        <p className="text-xs text-slate-400">The requested idea may have expired or was not saved.</p>
        <Link
          href="/generate"
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2 text-xs font-bold text-white hover:bg-indigo-500"
        >
          <ArrowLeft className="h-4 w-4" /> Return to Idea Generator
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <Link
          href="/generate"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Generated Ideas
        </Link>

        <button
          onClick={handleStartProject}
          disabled={starting}
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 transition-all cursor-pointer"
        >
          <Zap className="h-3.5 w-3.5" />
          {starting ? 'Building Project...' : 'Start This Project'}
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Idea Overview Card */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 backdrop-blur-xl shadow-xl space-y-6">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-md bg-indigo-500/20 px-2.5 py-0.5 text-[10px] font-bold text-indigo-400 border border-indigo-500/30">
              {idea.difficulty} Difficulty
            </span>
            <span className="rounded-md bg-slate-800 px-2.5 py-0.5 text-[10px] font-medium text-slate-300">
              {idea.estimatedDuration} Duration
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {idea.title}
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            {idea.shortDescription}
          </p>
        </div>

        {/* 3 Metric Scores */}
        <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-800 text-center">
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
            <p className="text-[10px] text-slate-400">Innovation Score</p>
            <p className="text-lg font-bold text-amber-400 mt-0.5">{idea.innovationScore}/10</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
            <p className="text-[10px] text-slate-400">Practicality Score</p>
            <p className="text-lg font-bold text-emerald-400 mt-0.5">{idea.practicalityScore}/10</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
            <p className="text-[10px] text-slate-400">Resume / Industry Value</p>
            <p className="text-lg font-bold text-indigo-400 mt-0.5">{idea.resumeValue}/10</p>
          </div>
        </div>

        {/* Problem Statement & Proposed Solution */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 space-y-1.5">
            <h3 className="font-bold text-rose-400 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-400" />
              Problem Statement
            </h3>
            <p className="text-slate-300 text-xs leading-relaxed">{idea.problemStatement}</p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 space-y-1.5">
            <h3 className="font-bold text-emerald-400 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Proposed Solution
            </h3>
            <p className="text-slate-300 text-xs leading-relaxed">{idea.proposedSolution}</p>
          </div>
        </div>

        {/* Core & Optional Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 space-y-2">
            <h3 className="font-bold text-indigo-300">Core Features (MVP)</h3>
            <ul className="space-y-1.5 text-slate-300 text-xs">
              {idea.coreFeatures.map((f: string, i: number) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-indigo-400 shrink-0 mt-0.5" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 space-y-2">
            <h3 className="font-bold text-violet-300">Advanced / Optional Features</h3>
            <ul className="space-y-1.5 text-slate-300 text-xs">
              {idea.optionalFeatures.map((f: string, i: number) => (
                <li key={i} className="flex items-start gap-2">
                  <Sparkles className="h-3.5 w-3.5 text-violet-400 shrink-0 mt-0.5" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Recommended Tech Stack */}
        <div className="pt-2 border-t border-slate-800 space-y-2">
          <h3 className="text-xs font-bold text-slate-300">Recommended Technology Stack:</h3>
          <div className="flex flex-wrap gap-2">
            {idea.recommendedTechStack.map((tech: string) => (
              <span
                key={tech}
                className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-1 text-xs font-medium text-slate-200"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Future Scope & Potential Challenges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="font-bold text-slate-300 block mb-1">Target Users:</span>
            <span className="text-slate-400">{idea.targetUsers}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="font-bold text-amber-300 block mb-1">Potential Challenges:</span>
            <span className="text-slate-400">{idea.potentialChallenges.join('; ')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
