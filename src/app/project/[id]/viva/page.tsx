'use client';

import { use, useState, useEffect } from 'react';
import {
  Sparkles,
  Send,
  CheckCircle2,
  RefreshCw,
  ChevronRight,
} from 'lucide-react';

function triggerCelebration() {
  if (typeof window === 'undefined') return;
  const count = 30;
  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    el.style.position = 'fixed';
    el.style.left = `${Math.random() * 100}vw`;
    el.style.top = '-10px';
    el.style.width = '8px';
    el.style.height = '8px';
    el.style.backgroundColor = ['#6366F1', '#10B981', '#F59E0B', '#EC4899', '#8B5CF6'][Math.floor(Math.random() * 5)];
    el.style.borderRadius = '50%';
    el.style.zIndex = '9999';
    el.style.pointerEvents = 'none';
    el.style.transition = `all ${1 + Math.random() * 2}s cubic-bezier(0.25, 1, 0.5, 1)`;
    document.body.appendChild(el);
    setTimeout(() => {
      el.style.transform = `translate(${(Math.random() - 0.5) * 200}px, ${window.innerHeight + 20}px) rotate(${Math.random() * 360}deg)`;
      el.style.opacity = '0';
    }, 20);
    setTimeout(() => el.remove(), 3000);
  }
}

interface VivaAnswer {
  id: string;
  studentAnswer: string;
  understandingScore: number;
  accuracyScore: number;
  completenessScore: number;
  overallScore: number;
  aiFeedback: string;
  improvedAnswer: string;
}

interface VivaQuestion {
  id: string;
  category: string;
  questionText: string;
  idealAnswer: string;
  orderIndex: number;
  answers: VivaAnswer[];
}

interface VivaSessionData {
  id: string;
  title: string;
  overallScore: number | null;
  questions: VivaQuestion[];
}

export default function VivaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [project, setProject] = useState<Record<string, unknown> | null>(null);
  const [session, setSession] = useState<VivaSessionData | null>(null);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [studentAnswer, setStudentAnswer] = useState('');
  const [evaluating, setEvaluating] = useState(false);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [projRes, vivaRes] = await Promise.all([
          fetch(`/api/projects/${id}`),
          fetch(`/api/projects/${id}/viva`),
        ]);

        if (projRes.ok) {
          const data = await projRes.json();
          if (data.project) setProject(data.project);
        }

        if (vivaRes.ok) {
          const vivaData = await vivaRes.json();
          if (vivaData.session) setSession(vivaData.session);
        }
      } catch (e) {
        console.error(e);
      }
    }
    loadData();
  }, [id]);

  const handleGenerateQuestions = async () => {
    setGenerating(true);
    try {
      const res = await fetch(`/api/projects/${id}/viva`, { method: 'POST' });
      const data = await res.json();
      if (data.session) {
        setSession(data.session);
        setActiveQuestionIndex(0);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setGenerating(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!session || !session.questions[activeQuestionIndex]) return;
    const currentQ = session.questions[activeQuestionIndex];
    if (!studentAnswer.trim()) return;

    setEvaluating(true);
    try {
      const res = await fetch(`/api/projects/${id}/viva`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionId: currentQ.id,
          studentAnswer,
        }),
      });

      const data = await res.json();
      if (data.answer) {
        // Trigger celebration for high score!
        if (data.answer.overallScore >= 8.5) {
          triggerCelebration();
        }

        // Update local state
        setSession((prev) => {
          if (!prev) return prev;
          const updatedQuestions = prev.questions.map((q, idx) =>
            idx === activeQuestionIndex ? { ...q, answers: [data.answer] } : q
          );
          return { ...prev, questions: updatedQuestions };
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setEvaluating(false);
    }
  };

  const currentQuestion = session?.questions?.[activeQuestionIndex];
  const latestAnswer = currentQuestion?.answers?.[0];

  return (
    <div className="flex-1 flex flex-col md:flex-row">
      
      <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto">
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/40">
              Module 11: AI Viva Simulator
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
              Project Defense & Mock Viva Examination
            </h1>
            <p className="text-xs text-slate-400 max-w-2xl">
              Simulate rigorous university external examiner viva sessions with real-time scoring and improved model answers.
            </p>
          </div>

          <button
            onClick={handleGenerateQuestions}
            disabled={generating}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 transition-all cursor-pointer shrink-0"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${generating ? 'animate-spin' : ''}`} />
            {generating ? 'Synthesizing...' : 'Regenerate Questions'}
          </button>
        </div>

        {/* Question Selector Carousel / Tabs */}
        {session && session.questions.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-2 border-b border-slate-800/60">
            {session.questions.map((q, idx) => {
              const isAnswered = q.answers && q.answers.length > 0;
              const isActive = idx === activeQuestionIndex;

              return (
                <button
                  key={q.id}
                  onClick={() => {
                    setActiveQuestionIndex(idx);
                    setStudentAnswer(q.answers?.[0]?.studentAnswer || '');
                  }}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold shrink-0 transition-all flex items-center gap-2 border cursor-pointer ${
                    isActive
                      ? 'bg-amber-600/20 text-amber-300 border-amber-500 shadow-sm'
                      : isAnswered
                      ? 'bg-emerald-950/30 text-emerald-300 border-emerald-800/50'
                      : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <span className="text-[10px] font-bold">Q{idx + 1}</span>
                  <span className="text-[10px] uppercase font-bold text-slate-500">[{q.category}]</span>
                  {isAnswered && <CheckCircle2 className="h-3 w-3 text-emerald-400" />}
                </button>
              );
            })}
          </div>
        )}

        {/* Active Question Box */}
        {currentQuestion && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 backdrop-blur-xl shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="rounded-md bg-amber-500/20 px-2.5 py-0.5 text-[10px] font-bold text-amber-400 border border-amber-500/30 uppercase tracking-wider">
                  Category: {currentQuestion.category} Question
                </span>
                <span className="text-xs text-slate-400 font-semibold">
                  Question {activeQuestionIndex + 1} of {session?.questions.length}
                </span>
              </div>

              <h2 className="text-base sm:text-lg font-bold text-white leading-relaxed">
              &quot;{currentQuestion.questionText}&quot;
              </h2>

              {/* Student Answer Input Box */}
              <div className="space-y-2 pt-2">
                <label className="block text-xs font-semibold text-slate-300">
                  Your Answer (Explain as you would to your External Examiner):
                </label>
                <textarea
                  rows={4}
                  value={studentAnswer}
                  onChange={(e) => setStudentAnswer(e.target.value)}
                  placeholder="Explain your technical justification, architectural choices, and algorithms used..."
                  className="w-full rounded-xl border border-slate-800 bg-slate-950/80 p-3.5 text-xs text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none transition-colors leading-relaxed shadow-inner"
                />

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-slate-500">
                    Use clear technical terminology (e.g. ACID, latency, validation, encryption).
                  </span>
                  <button
                    onClick={handleSubmitAnswer}
                    disabled={evaluating || !studentAnswer.trim()}
                    className="inline-flex items-center gap-2 rounded-xl bg-amber-600 px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-amber-600/30 hover:bg-amber-500 disabled:opacity-50 transition-all cursor-pointer"
                  >
                    <Send className="h-3.5 w-3.5" />
                    {evaluating ? 'Evaluating Answer...' : 'Submit Answer for AI Scoring'}
                  </button>
                </div>
              </div>
            </div>

            {/* AI Evaluation & Feedback Card */}
            {latestAnswer && (
              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/10 p-6 backdrop-blur-xl shadow-xl space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-500/20 pb-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                      Examiner Evaluation Feedback
                    </span>
                    <h3 className="text-base font-bold text-white mt-0.5">
                      VIVA SCORE: {latestAnswer.overallScore}/10
                    </h3>
                  </div>

                  {/* 3 Metric Scores */}
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-slate-950/80 p-2 text-center border border-slate-800">
                      <p className="text-[10px] text-slate-400">Understanding</p>
                      <p className="text-xs font-bold text-emerald-400">{latestAnswer.understandingScore}/10</p>
                    </div>
                    <div className="rounded-lg bg-slate-950/80 p-2 text-center border border-slate-800">
                      <p className="text-[10px] text-slate-400">Accuracy</p>
                      <p className="text-xs font-bold text-emerald-400">{latestAnswer.accuracyScore}/10</p>
                    </div>
                    <div className="rounded-lg bg-slate-950/80 p-2 text-center border border-slate-800">
                      <p className="text-[10px] text-slate-400">Completeness</p>
                      <p className="text-xs font-bold text-emerald-400">{latestAnswer.completenessScore}/10</p>
                    </div>
                  </div>
                </div>

                {/* AI Examiner Comment */}
                <div className="space-y-1 text-xs">
                  <p className="font-bold text-slate-300">Examiner Feedback:</p>
                  <p className="text-slate-400 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                    {latestAnswer.aiFeedback}
                  </p>
                </div>

                {/* Improved Model Answer */}
                <div className="space-y-1 text-xs">
                  <p className="font-bold text-amber-300 flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                    Model Exemplary Answer (Memorize for Viva):
                  </p>
                  <p className="text-slate-300 leading-relaxed bg-amber-950/20 p-3.5 rounded-xl border border-amber-800/30 italic">
                    &quot;{latestAnswer.improvedAnswer}&quot;
                  </p>
                </div>

                {/* Next Question Shortcut */}
                {activeQuestionIndex < session.questions.length - 1 && (
                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => {
                        const nextIdx = activeQuestionIndex + 1;
                        setActiveQuestionIndex(nextIdx);
                        setStudentAnswer(session.questions[nextIdx]?.answers?.[0]?.studentAnswer || '');
                      }}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-400 hover:text-indigo-300 cursor-pointer"
                    >
                      Next Question (Q{activeQuestionIndex + 2}) <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
