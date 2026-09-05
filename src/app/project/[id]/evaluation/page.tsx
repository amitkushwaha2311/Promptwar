'use client';

import { use, useState, useEffect } from 'react';
import {
  Award,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  RefreshCw,
  FileCheck,
  Zap,
} from 'lucide-react';

interface EvaluationData {
  id?: string;
  innovationScore: number;
  technicalDepthScore: number;
  practicalValueScore: number;
  uiUxScore: number;
  codeQualityScore: number;
  testingScore: number;
  docScore: number;
  overallScore: number;
  whatIsGood: string[];
  whatNeedsImprovement: string[];
  topImprovements: string[];
}

export default function EvaluationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [project, setProject] = useState<Record<string, unknown> | null>(null);
  const [evaluation, setEvaluation] = useState<EvaluationData | null>(null);
  const [evaluating, setEvaluating] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [projRes, evalRes] = await Promise.all([
          fetch(`/api/projects/${id}`),
          fetch(`/api/projects/${id}/evaluation`),
        ]);

        if (projRes.ok) {
          const data = await projRes.json();
          if (data.project) setProject(data.project);
        }

        if (evalRes.ok) {
          const evalData = await evalRes.json();
          if (evalData.evaluation) setEvaluation(evalData.evaluation);
        }
      } catch (e) {
        console.error(e);
      }
    }
    loadData();
  }, [id]);

  const handleRunEvaluation = async () => {
    setEvaluating(true);
    try {
      const res = await fetch(`/api/projects/${id}/evaluation`, {
        method: 'POST',
      });
      const data = await res.json();
      if (data.evaluation) {
        setEvaluation(data.evaluation);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setEvaluating(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row">
      
      <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto">
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
              Module 7: Final Project Evaluation
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
              Final Project Evaluation & Scoring
            </h1>
            <p className="text-xs text-slate-400 max-w-2xl">
              Comprehensive academic evaluation across 7 technical dimensions with actionable submission readiness guidance.
            </p>
          </div>

          <button
            onClick={handleRunEvaluation}
            disabled={evaluating}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-600/30 hover:bg-emerald-500 transition-all cursor-pointer shrink-0"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${evaluating ? 'animate-spin' : ''}`} />
            {evaluating ? 'Evaluating Project...' : 'Re-Run Evaluation'}
          </button>
        </div>

        {evaluation && (
          <div className="space-y-6">
            {/* Overall Score Header Card */}
            <div className="rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-emerald-950/30 to-slate-900 p-6 backdrop-blur-xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="space-y-2 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <Award className="h-5 w-5 text-emerald-400" />
                  <h2 className="text-lg font-bold text-white">FINAL PROJECT SCORE</h2>
                </div>
                <p className="text-xs text-slate-400 max-w-xl">
                  Aggregated evaluation combining problem relevance, technical complexity, code quality, test suites, and documentation completeness.
                </p>
              </div>

              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/50 p-4 text-center shrink-0 min-w-[140px]">
                <span className="text-4xl font-black text-white">{evaluation.overallScore}</span>
                <span className="text-sm font-semibold text-slate-400">/10</span>
                <p className="text-[11px] text-emerald-400 font-bold mt-1">First Class with Distinction</p>
              </div>
            </div>

            {/* 7 Dimensions Bar Chart */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-xl shadow-lg space-y-4">
              <h3 className="text-sm font-bold text-white">Evaluation Dimensions (1 - 10 Scale)</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                {[
                  { label: 'Innovation', score: evaluation.innovationScore, color: 'from-amber-500 to-orange-500' },
                  { label: 'Technical Depth', score: evaluation.technicalDepthScore, color: 'from-blue-500 to-indigo-500' },
                  { label: 'Practical Value', score: evaluation.practicalValueScore, color: 'from-emerald-500 to-teal-500' },
                  { label: 'UI / UX Design', score: evaluation.uiUxScore, color: 'from-violet-500 to-purple-500' },
                  { label: 'Code Quality', score: evaluation.codeQualityScore, color: 'from-cyan-500 to-blue-500' },
                  { label: 'Testing Coverage', score: evaluation.testingScore, color: 'from-rose-500 to-pink-500' },
                  { label: 'Documentation', score: evaluation.docScore, color: 'from-amber-400 to-yellow-500' },
                ].map((dim) => (
                  <div key={dim.label} className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/70 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-300 text-[11px]">{dim.label}</span>
                      <span className="font-bold text-white text-xs">{dim.score}/10</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${dim.color}`}
                        style={{ width: `${dim.score * 10}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* What is Good & What Needs Improvement */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* What is good */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-xl shadow-lg space-y-3">
                <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" /> What is Good
                </h3>
                <ul className="space-y-2 text-xs text-slate-300">
                  {evaluation.whatIsGood.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* What needs improvement */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-xl shadow-lg space-y-3">
                <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" /> What Needs Improvement
                </h3>
                <ul className="space-y-2 text-xs text-slate-300">
                  {evaluation.whatNeedsImprovement.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Top 5 Improvements Before Final Submission */}
            <div className="rounded-2xl border border-indigo-500/40 bg-indigo-950/20 p-6 backdrop-blur-xl shadow-xl space-y-4">
              <h3 className="text-sm font-bold text-indigo-300 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-indigo-400" />
                Top 5 Improvements Before Final Submission
              </h3>

              <div className="space-y-2 text-xs">
                {evaluation.topImprovements.map((imp, index) => (
                  <div
                    key={index}
                    className="p-3.5 rounded-xl border border-indigo-500/30 bg-slate-950/80 flex items-center gap-3"
                  >
                    <span className="h-6 w-6 rounded-full bg-indigo-600/30 text-indigo-400 flex items-center justify-center font-bold text-xs shrink-0 border border-indigo-500/40">
                      {index + 1}
                    </span>
                    <span className="text-slate-200">{imp}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
