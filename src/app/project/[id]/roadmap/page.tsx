'use client';

import { use, useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Layers,
  CheckCircle2,
  Clock,
  Code2,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  Sparkles,
  Calendar,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';

interface Subtask {
  id: string;
  text: string;
  done: boolean;
}

interface RoadmapTask {
  id: string;
  weekNumber: number;
  title: string;
  description: string;
  subtasks: string; // JSON string
  estimatedHours: number;
  dependencies: string; // JSON string
  expectedOutput: string;
  completionCriteria: string;
  status: 'TODO' | 'IN_PROGRESS' | 'COMPLETED';
}

interface ProjectTechnology {
  id: string;
  category: string;
  name: string;
  whyRecommended: string;
  advantages: string; // JSON string
  alternatives: string; // JSON string
}

interface RoadmapData {
  id: string;
  title: string;
  currentPhase: string;
  overallProgress: number;
  healthScore: number;
  technologies: ProjectTechnology[];
  roadmaps: {
    id: string;
    durationWeeks: number;
    tasks: RoadmapTask[];
  }[];
}

export default function RoadmapPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [project, setProject] = useState<RoadmapData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState<'roadmap' | 'techstack'>('roadmap');
  const [updatingTaskId, setUpdatingTaskId] = useState<string | null>(null);
  const [expandedTaskIds, setExpandedTaskIds] = useState<Record<string, boolean>>({});

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch(`/api/projects/${id}`);
        if (res.ok) {
          const data = await res.json();
          if (data.project) setProject(data.project);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  const toggleTaskStatus = async (taskId: string, currentStatus: string) => {
    setUpdatingTaskId(taskId);
    const nextStatus =
      currentStatus === 'TODO'
        ? 'IN_PROGRESS'
        : currentStatus === 'IN_PROGRESS'
        ? 'COMPLETED'
        : 'TODO';

    try {
      const res = await fetch(`/api/projects/${id}/roadmap`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId, status: nextStatus }),
      });
      const data = await res.json();
      if (data.success) {
        // Update local state smoothly
        setProject((prev) => {
          if (!prev) return prev;
          const updatedRoadmaps = prev.roadmaps.map((r) => ({
            ...r,
            tasks: r.tasks.map((t) => (t.id === taskId ? { ...t, status: nextStatus as any } : t)),
          }));
          return {
            ...prev,
            overallProgress: data.progressPercent ?? prev.overallProgress,
            healthScore: data.healthScore ?? prev.healthScore,
            currentPhase: data.currentPhase ?? prev.currentPhase,
            roadmaps: updatedRoadmaps,
          };
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setUpdatingTaskId(null);
    }
  };

  const toggleSubtask = async (task: RoadmapTask, subtaskId: string) => {
    const rawSubtasks: Subtask[] = JSON.parse(task.subtasks || '[]');
    const updatedSubtasks = rawSubtasks.map((st) => (st.id === subtaskId ? { ...st, done: !st.done } : st));

    try {
      await fetch(`/api/projects/${id}/roadmap`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId: task.id, subtasks: updatedSubtasks }),
      });

      setProject((prev) => {
        if (!prev) return prev;
        const updatedRoadmaps = prev.roadmaps.map((r) => ({
          ...r,
          tasks: r.tasks.map((t) => (t.id === task.id ? { ...t, subtasks: JSON.stringify(updatedSubtasks) } : t)),
        }));
        return { ...prev, roadmaps: updatedRoadmaps };
      });
    } catch (e) {
      console.error(e);
    }
  };

  const toggleExpand = (taskId: string) => {
    setExpandedTaskIds((prev) => ({ ...prev, [taskId]: !prev[taskId] }));
  };

  if (loading || !project) {
    return (
      <div className="flex-1 flex items-center justify-center p-12 text-xs text-slate-400">
        Loading project roadmap & technology stack...
      </div>
    );
  }

  const tasks = project.roadmaps[0]?.tasks || [];
  const completedCount = tasks.filter((t) => t.status === 'COMPLETED').length;

  return (
    <div className="flex-1 flex flex-col md:flex-row">
      
      <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto">
        {/* Header & Tabs */}
        <div className="space-y-4 border-b border-slate-800 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-800/40">
                Module 4: Tech Stack & Roadmap
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
                Development Roadmap & Tech Stack
              </h1>
              <p className="text-xs text-slate-400 mt-1 max-w-2xl">
                Week-by-week actionable engineering plan. Toggle statuses to update your live project health score.
              </p>
            </div>

            {/* Quick Metrics Badge */}
            <div className="flex items-center gap-3 bg-slate-900/80 border border-slate-800 p-3 rounded-xl shrink-0">
              <div>
                <p className="text-[10px] text-slate-400">Progress</p>
                <p className="text-lg font-black text-indigo-400">{project.overallProgress}%</p>
              </div>
              <div className="h-8 w-px bg-slate-800" />
              <div>
                <p className="text-[10px] text-slate-400">Completed</p>
                <p className="text-lg font-black text-emerald-400">{completedCount}/{tasks.length}</p>
              </div>
              <div className="h-8 w-px bg-slate-800" />
              <div>
                <p className="text-[10px] text-slate-400">Health</p>
                <p className="text-lg font-black text-white">{project.healthScore}/100</p>
              </div>
            </div>
          </div>

          {/* View Toggles */}
          <div className="flex items-center gap-2 pt-2 text-xs">
            <button
              onClick={() => setActiveView('roadmap')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeView === 'roadmap'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Layers className="h-3.5 w-3.5" /> Week-by-Week Roadmap ({tasks.length} Weeks)
            </button>
            <button
              onClick={() => setActiveView('techstack')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeView === 'techstack'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Code2 className="h-3.5 w-3.5 text-indigo-400" /> Recommended Tech Stack Breakdown
            </button>
          </div>
        </div>

        {/* VIEW 1: ROADMAP TASKS */}
        {activeView === 'roadmap' && (
          <div className="space-y-4">
            {tasks.map((task) => {
              const subtasks: Subtask[] = JSON.parse(task.subtasks || '[]');
              const dependencies: string[] = JSON.parse(task.dependencies || '[]');
              const isExpanded = expandedTaskIds[task.id] !== false; // default expanded
              const isUpdating = updatingTaskId === task.id;

              return (
                <div
                  key={task.id}
                  className={`rounded-2xl border transition-all p-5 backdrop-blur-xl ${
                    task.status === 'COMPLETED'
                      ? 'border-emerald-500/30 bg-emerald-950/10'
                      : task.status === 'IN_PROGRESS'
                      ? 'border-indigo-500/50 bg-indigo-950/20 shadow-lg shadow-indigo-950/30'
                      : 'border-slate-800 bg-slate-900/40'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-3">
                      {/* Week Badge */}
                      <span className="rounded-xl bg-slate-950 px-3 py-1.5 text-xs font-black text-white border border-slate-800 shrink-0">
                        W{task.weekNumber}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-white tracking-tight">
                            {task.title}
                          </h3>
                          <span className="text-[10px] text-slate-500 flex items-center gap-1">
                            <Clock className="h-3 w-3" /> ~{task.estimatedHours}h
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                          {task.description}
                        </p>
                      </div>
                    </div>

                    {/* Status Toggle Button */}
                    <div className="flex items-center gap-2 shrink-0 sm:self-center">
                      <button
                        onClick={() => toggleTaskStatus(task.id, task.status)}
                        disabled={isUpdating}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
                          task.status === 'COMPLETED'
                            ? 'bg-emerald-600 text-white border-emerald-500 hover:bg-emerald-700'
                            : task.status === 'IN_PROGRESS'
                            ? 'bg-amber-500 text-slate-950 border-amber-400 hover:bg-amber-600'
                            : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        {isUpdating
                          ? 'Updating...'
                          : task.status === 'COMPLETED'
                          ? 'Completed'
                          : task.status === 'IN_PROGRESS'
                          ? 'In Progress'
                          : 'Mark Active'}
                      </button>

                      <button
                        onClick={() => toggleExpand(task.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                      >
                        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Subtasks & Criteria */}
                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-3 text-xs">
                      {/* Subtasks Checklist */}
                      {subtasks.length > 0 && (
                        <div>
                          <p className="font-semibold text-slate-300 mb-1.5 text-[11px]">Actionable Subtasks:</p>
                          <div className="space-y-1.5">
                            {subtasks.map((st) => (
                              <label
                                key={st.id}
                                className="flex items-center gap-2 text-slate-300 hover:text-white cursor-pointer"
                              >
                                <input
                                  type="checkbox"
                                  checked={st.done}
                                  onChange={() => toggleSubtask(task, st.id)}
                                  className="rounded border-slate-700 text-indigo-600 focus:ring-indigo-500"
                                />
                                <span className={st.done ? 'line-through text-slate-500' : ''}>{st.text}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Expected Output & Criteria */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-[11px]">
                        <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                          <span className="font-semibold text-slate-300">Expected Output: </span>
                          <span className="text-slate-400">{task.expectedOutput}</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                          <span className="font-semibold text-slate-300">Completion Criteria: </span>
                          <span className="text-slate-400">{task.completionCriteria}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* VIEW 2: TECH STACK BREAKDOWN */}
        {activeView === 'techstack' && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-xl shadow-lg space-y-2">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Code2 className="h-5 w-5 text-indigo-400" />
                Architectural Tech Stack Rationale
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                Every technology is selected specifically to align with student skill levels, prevent unnecessary complexity, and ensure type safety under academic examination.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {project.technologies.map((tech) => {
                const advantages: string[] = JSON.parse(tech.advantages || '[]');
                const alternatives: string[] = JSON.parse(tech.alternatives || '[]');

                return (
                  <div
                    key={tech.id}
                    className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-xl shadow-lg space-y-3"
                  >
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">
                        {tech.category}
                      </span>
                      <span className="text-xs font-bold text-white">{tech.name}</span>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div>
                        <p className="font-semibold text-slate-300 text-[11px]">Why It Is Recommended:</p>
                        <p className="text-slate-400 text-[11px] mt-0.5 leading-relaxed">{tech.whyRecommended}</p>
                      </div>

                      <div>
                        <p className="font-semibold text-slate-300 text-[11px]">Key Advantages:</p>
                        <ul className="space-y-1 text-slate-400 text-[11px] mt-0.5">
                          {advantages.map((adv, i) => (
                            <li key={i} className="flex items-start gap-1.5">
                              <CheckCircle2 className="h-3 w-3 text-emerald-400 shrink-0 mt-0.5" />
                              <span>{adv}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="pt-2 border-t border-slate-800 flex items-center gap-1.5 text-[11px]">
                        <span className="font-semibold text-slate-400">Possible Alternatives: </span>
                        <span className="text-slate-500">{alternatives.join(', ')}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
