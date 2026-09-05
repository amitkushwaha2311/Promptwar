'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Settings,
  Key,
  Shield,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  FolderGit2,
  Zap,
  Lock,
} from 'lucide-react';

export default function SettingsPage() {
  const router = useRouter();
  const [geminiKey, setGeminiKey] = useState(() =>
    typeof window !== 'undefined' ? localStorage.getItem('projectpilot_gemini_key') || '' : ''
  );
  const [openaiKey, setOpenaiKey] = useState(() =>
    typeof window !== 'undefined' ? localStorage.getItem('projectpilot_openai_key') || '' : ''
  );
  const [githubToken, setGithubToken] = useState(() =>
    typeof window !== 'undefined' ? localStorage.getItem('projectpilot_github_token') || '' : ''
  );
  const [saved, setSaved] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [seedSuccess, setSeedSuccess] = useState(false);

  const handleSaveKeys = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('projectpilot_gemini_key', geminiKey.trim());
    localStorage.setItem('projectpilot_openai_key', openaiKey.trim());
    localStorage.setItem('projectpilot_github_token', githubToken.trim());
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleResetDemoData = async () => {
    setSeeding(true);
    try {
      const res = await fetch('/api/demo/seed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ autoLogin: true }),
      });
      const data = await res.json();
      if (data.success) {
        setSeedSuccess(true);
        setTimeout(() => {
          setSeedSuccess(false);
          router.push('/dashboard');
        }, 1500);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 space-y-6">
      <div className="border-b border-slate-800 pb-4">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
          Preferences
        </span>
        <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
          Settings & Provider Configuration
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Configure optional custom LLM API keys, GitHub tokens, and demo data presets.
        </p>
      </div>

      {saved && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-950/30 p-3.5 text-xs text-emerald-300">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>API keys saved securely in browser storage.</span>
        </div>
      )}

      {seedSuccess && (
        <div className="flex items-center gap-2 rounded-xl border border-indigo-500/40 bg-indigo-950/30 p-3.5 text-xs text-indigo-300">
          <Zap className="h-4 w-4 text-indigo-400 shrink-0 animate-pulse" />
          <span>Demo project successfully re-seeded! Redirecting to dashboard...</span>
        </div>
      )}

      {/* AI Provider Settings */}
      <form onSubmit={handleSaveKeys} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 backdrop-blur-xl shadow-xl space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Key className="h-4 w-4 text-indigo-400" />
            Live AI Provider Keys (Optional)
          </h2>
          <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-950/40 border border-emerald-800/50 px-2 py-0.5 rounded">
            Heuristic Engine Active by Default
          </span>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          ProjectPilot AI includes a built-in intelligent offline heuristic engine that generates realistic final-year projects without requiring any external keys. If you want to connect live models, provide your keys below.
        </p>

        <div className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-slate-300 block mb-1.5 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
              Google Gemini API Key
            </label>
            <input
              type="password"
              value={geminiKey}
              onChange={(e) => setGeminiKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full rounded-xl border border-slate-800 bg-slate-950/80 p-2.5 font-mono text-white placeholder-slate-600 focus:border-indigo-500 focus:outline-none"
            />
            <p className="text-[10px] text-slate-500 mt-1">Used for live Gemini 1.5 Flash generation.</p>
          </div>

          <div>
            <label className="font-semibold text-slate-300 block mb-1.5 flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5 text-slate-400" />
              OpenAI API Key
            </label>
            <input
              type="password"
              value={openaiKey}
              onChange={(e) => setOpenaiKey(e.target.value)}
              placeholder="sk-proj-..."
              className="w-full rounded-xl border border-slate-800 bg-slate-950/80 p-2.5 font-mono text-white placeholder-slate-600 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-300 block mb-1.5 flex items-center gap-1.5">
              <FolderGit2 className="h-3.5 w-3.5 text-slate-400" />
              GitHub Personal Access Token (PAT)
            </label>
            <input
              type="password"
              value={githubToken}
              onChange={(e) => setGithubToken(e.target.value)}
              placeholder="ghp_..."
              className="w-full rounded-xl border border-slate-800 bg-slate-950/80 p-2.5 font-mono text-white placeholder-slate-600 focus:border-indigo-500 focus:outline-none"
            />
            <p className="text-[10px] text-slate-500 mt-1">Raises GitHub REST API rate limits from 60 to 5,000 requests/hour.</p>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="rounded-xl bg-indigo-600 px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 transition-all cursor-pointer"
          >
            Save Keys
          </button>
        </div>
      </form>

      {/* Demo Preset Re-seeder */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 backdrop-blur-xl shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <RotateCcw className="h-4 w-4 text-amber-400" />
            Demo Project Management
          </h2>
          <span className="text-[10px] text-slate-400">One-Click Setup</span>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          Need to test the complete platform or reset the database? This action resets the ready-made <strong>AI Resume Analyzer</strong> demo project with its 78% health score, 72% progress, live mentor chat, GitHub analysis, and viva mock questions.
        </p>

        <button
          onClick={handleResetDemoData}
          disabled={seeding}
          className="inline-flex items-center gap-2 rounded-xl border border-amber-500/40 bg-amber-950/30 px-5 py-2.5 text-xs font-bold text-amber-300 hover:bg-amber-900/40 transition-colors cursor-pointer"
        >
          <Zap className="h-3.5 w-3.5 text-amber-400" />
          {seeding ? 'Re-seeding Demo Project...' : 'Reload Demo Project & Login'}
        </button>
      </div>
    </div>
  );
}
