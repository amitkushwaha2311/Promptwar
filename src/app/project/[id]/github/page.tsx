'use client';

import { use, useState, useEffect } from 'react';
import {
  FolderGit2,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  FileCode,
  FileText,
  Shield,
  Activity,
  GitBranch,
  Star,
  GitFork,
  ExternalLink,
} from 'lucide-react';
import { GitHubAnalysisResult, GitHubRepoDetails } from '@/lib/github/analyzer';

export default function GitHubAnalyzerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [repoUrl, setRepoUrl] = useState('https://github.com/alexrivera/ai-resume-analyzer');
  const [project, setProject] = useState<Record<string, unknown> | null>(null);
  const [analysis, setAnalysis] = useState<GitHubAnalysisResult | null>(null);
  const [repoDetails, setRepoDetails] = useState<Record<string, unknown> | null>(null);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const [projRes, gitRes] = await Promise.all([
          fetch(`/api/projects/${id}`),
          fetch(`/api/projects/${id}/github`),
        ]);

        if (projRes.ok) {
          const data = await projRes.json();
          if (data.project) setProject(data.project);
        }

        if (gitRes.ok) {
          const gitData = await gitRes.json();
          if (gitData.analysis) {
            setAnalysis(gitData.analysis);
            setRepoDetails(gitData.repository);
            if (gitData.repository?.repoUrl) {
              setRepoUrl(gitData.repository.repoUrl);
            }
          }
        }
      } catch (e) {
        console.error(e);
      }
    }
    loadData();
  }, [id]);

  const handleScan = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!repoUrl) return;

    setError('');
    setScanning(true);

    try {
      const res = await fetch(`/api/projects/${id}/github`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repoUrl }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to scan repository');
      } else {
        setAnalysis(data.analysis);
        setRepoDetails(data.repository);
      }
    } catch {
      setError('GitHub analysis is temporarily unavailable. Please try again later.');
    } finally {
      setScanning(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row">
      
      <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto">
        {/* Header Title */}
        <div className="space-y-1 border-b border-slate-800 pb-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-violet-400 bg-violet-950/60 px-2 py-0.5 rounded border border-violet-800/40">
            Module 6: GitHub Project Analyzer
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
            GitHub Code & Repository Quality Audit
          </h1>
          <p className="text-xs text-slate-400 max-w-3xl">
            Evaluate repository structure, README clarity, automated tests, and activity against academic and industry standards.
          </p>
        </div>

        {/* URL Input Form */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-xl shadow-lg space-y-3">
          <form onSubmit={handleScan} className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <FolderGit2 className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input
                type="url"
                required
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                placeholder="https://github.com/username/project-repository"
                className="w-full rounded-xl border border-slate-800 bg-slate-950/80 py-2.5 pl-10 pr-3 text-xs text-white placeholder-slate-500 focus:border-violet-500 focus:outline-none transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={scanning}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-violet-600/30 hover:bg-violet-500 transition-all cursor-pointer shrink-0"
            >
              <Sparkles className="h-4 w-4" />
              {scanning ? 'Scanning Repository...' : 'Run Repository Audit'}
            </button>
          </form>

          {error && (
            <div className="flex items-center gap-2 rounded-lg border border-rose-800/80 bg-rose-950/40 p-3 text-xs text-rose-300">
              <AlertTriangle className="h-4 w-4 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Results Showcase */}
        {analysis && (
          <div className="space-y-6">
            {/* Overall Score Header */}
            <div className="rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-violet-950/30 to-slate-900 p-6 backdrop-blur-xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="space-y-2 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <FolderGit2 className="h-5 w-5 text-violet-400" />
                  <h2 className="text-lg font-bold text-white">
                    GitHub Quality Assessment: {repoDetails?.repoName || 'Project'}
                  </h2>
                </div>
                <p className="text-xs text-slate-400 max-w-xl">
                  Evaluated using GitHub REST API data across repository hierarchy, test coverage, documentation completeness, and developer velocity.
                </p>
              </div>

              <div className="rounded-2xl border border-violet-500/30 bg-violet-950/50 p-4 text-center shrink-0 min-w-[140px]">
                <span className="text-4xl font-black text-white">{analysis.overallScore}</span>
                <span className="text-sm font-semibold text-slate-400">/100</span>
                <p className="text-[11px] text-violet-400 font-bold mt-1">Repository Grade: B+</p>
              </div>
            </div>

            {/* 5 Dimension Progress Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
              {[
                { label: 'Code Organization', score: analysis.codeOrgScore, color: 'from-blue-500 to-indigo-500', desc: 'Folder structure & separation' },
                { label: 'Documentation', score: analysis.docScore, color: 'from-amber-500 to-orange-500', desc: 'README & setup guide' },
                { label: 'Testing Suite', score: analysis.testingScore, color: 'from-rose-500 to-pink-500', desc: 'Unit tests & test files' },
                { label: 'Repository Quality', score: analysis.repoQualityScore, color: 'from-emerald-500 to-teal-500', desc: 'License, CI, gitignore' },
                { label: 'Project Activity', score: analysis.activityScore, color: 'from-violet-500 to-purple-500', desc: 'Commit history & velocity' },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-2 backdrop-blur-xl"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-300 text-[11px]">{item.label}</span>
                    <span className="font-bold text-white text-xs">{item.score}/100</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${item.color}`}
                      style={{ width: `${item.score}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-slate-500">{item.desc}</p>
                </div>
              ))}
            </div>

            {/* AI Improvement Suggestions */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-xl shadow-lg space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-violet-400" />
                  Prioritized AI Improvement Recommendations
                </h3>
                <span className="text-[11px] text-slate-400">
                  {analysis.improvements.length} actions required before submission
                </span>
              </div>

              <div className="space-y-3">
                {analysis.improvements.map((imp) => (
                  <div
                    key={imp.priority}
                    className="p-4 rounded-xl border border-slate-800 bg-slate-950/70 text-xs space-y-2 hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="rounded-md bg-violet-500/20 px-2 py-0.5 text-[10px] font-bold text-violet-400 border border-violet-500/30">
                          Priority {imp.priority}
                        </span>
                        <h4 className="font-bold text-white text-sm">{imp.title}</h4>
                      </div>
                      <span
                        className={`text-[9px] font-bold px-2 py-0.5 rounded border ${
                          imp.impact === 'HIGH'
                            ? 'text-rose-400 bg-rose-950/40 border-rose-800/50'
                            : 'text-amber-400 bg-amber-950/40 border-amber-800/50'
                        }`}
                      >
                        {imp.impact} IMPACT
                      </span>
                    </div>

                    <p className="text-slate-400 text-xs leading-relaxed">{imp.description}</p>

                    <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 text-[11px]">
                      <span className="font-semibold text-violet-300">Action Step: </span>
                      <span className="text-slate-300 font-mono">{imp.actionableStep}</span>
                    </div>
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
