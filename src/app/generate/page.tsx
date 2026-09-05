'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Sliders,
  TrendingUp,
  Cpu,
  Layers,
  Award,
  Clock,
  Users,
  Shield,
  Zap,
  Bookmark,
  Scale,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { GeneratedIdea } from '@/lib/ai/types';

const DOMAINS = ['All', 'AI/ML', 'Healthcare', 'FinTech', 'Cybersecurity', 'IoT', 'Blockchain', 'EdTech', 'Data Science'];
const PROJECT_TYPES = ['Web Application', 'Mobile Application', 'AI/ML', 'IoT / Embedded', 'Cybersecurity', 'Data Science', 'Blockchain', 'Cloud / DevOps', 'Automation'];

export default function GeneratePage() {
  const router = useRouter();

  // Generator form state
  const [branch, setBranch] = useState('Computer Science');
  const [skills, setSkills] = useState('Python, JavaScript, React, PostgreSQL');
  const [interests, setInterests] = useState('Artificial Intelligence, Healthcare, Full Stack');
  const [domain, setDomain] = useState('All');
  const [projectType, setProjectType] = useState('Web Application');
  const [difficulty, setDifficulty] = useState('Intermediate');
  const [teamSize, setTeamSize] = useState(3);
  const [duration, setDuration] = useState('4 months');
  const [aiRequired, setAiRequired] = useState(true);

  // Results state
  const [ideas, setIdeas] = useState<GeneratedIdea[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedForCompare, setSelectedForCompare] = useState<string[]>([]);
  const [startingProjectId, setStartingProjectId] = useState<string | null>(null);
  const [expandedIdeaIndex, setExpandedIdeaIndex] = useState<number | null>(null);

  // Load profile preferences on mount
  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch('/api/profile');
        if (res.ok) {
          const data = await res.json();
          if (data.profile) {
            setBranch(data.profile.branch || 'Computer Science');
            if (data.profile.programmingLanguages) {
              const langs = JSON.parse(data.profile.programmingLanguages);
              const techs = data.profile.technicalSkills ? JSON.parse(data.profile.technicalSkills) : [];
              setSkills(langs.concat(techs).slice(0, 5).join(', '));
            }
            if (data.profile.areasOfInterest) {
              setInterests(JSON.parse(data.profile.areasOfInterest).join(', '));
            }
            if (data.profile.experienceLevel) setDifficulty(data.profile.experienceLevel);
            if (data.profile.teamSize) setTeamSize(data.profile.teamSize);
            if (data.profile.projectDuration) setDuration(data.profile.projectDuration);
          }
        }
      } catch (e) {
        console.error('Failed to load profile:', e);
      }
    }
    loadProfile();
  }, []);

  // Generate Ideas trigger
  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setIdeas([]);

    try {
      const res = await fetch('/api/ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          branch,
          skills: skills.split(',').map((s) => s.trim()).filter(Boolean),
          interests: interests.split(',').map((i) => i.trim()).filter(Boolean),
          domain: domain === 'All' ? undefined : domain,
          projectType,
          difficulty,
          teamSize,
          projectDuration: duration,
          aiRequired,
        }),
      });

      const data = await res.json();
      if (data.ideas && data.ideas.length > 0) {
        setIdeas(data.ideas);
        setExpandedIdeaIndex(0); // auto-expand top idea
      }
    } catch (err) {
      console.error('Failed to generate ideas:', err);
    } finally {
      setLoading(false);
    }
  };

  // Convert an idea into an active project
  const handleStartProject = async (idea: GeneratedIdea) => {
    setStartingProjectId(idea.title);
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
          domain: idea.domain || domain,
          projectType: idea.type || projectType,
          difficulty: idea.difficulty,
          estimatedDuration: idea.estimatedDuration,
          teamSize,
          coreFeatures: idea.coreFeatures,
          optionalFeatures: idea.optionalFeatures,
          recommendedTechStack: idea.recommendedTechStack,
        }),
      });

      const data = await res.json();
      if (data.projectId) {
        router.push(`/project/${data.projectId}`);
      } else {
        alert('Could not start project. Please log in first.');
      }
    } catch (e) {
      console.error(e);
      alert('Network error while creating project.');
    } finally {
      setStartingProjectId(null);
    }
  };

  const toggleCompare = (title: string) => {
    if (selectedForCompare.includes(title)) {
      setSelectedForCompare(selectedForCompare.filter((t) => t !== title));
    } else {
      if (selectedForCompare.length >= 3) {
        alert('You can compare up to 3 ideas at a time.');
        return;
      }
      setSelectedForCompare([...selectedForCompare, title]);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Page Title & Intro */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-400 mb-2">
            <Sparkles className="h-3.5 w-3.5" /> Module 2: AI Idea Generator
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Generate Project Ideas
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Personalized, technically rigorous final-year projects tuned to your branch, skills, and recruiter appeal.
          </p>
        </div>

        {selectedForCompare.length >= 2 && (
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400">{selectedForCompare.length} selected</span>
            <Link
              href={`/ideas/compare?items=${encodeURIComponent(JSON.stringify(selectedForCompare))}`}
              className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-violet-600/30 hover:bg-violet-500 transition-all"
            >
              <Scale className="h-3.5 w-3.5" /> Compare Ideas Matrix
            </Link>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form Settings Panel */}
        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6 backdrop-blur-xl shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Sliders className="h-4 w-4 text-indigo-400" />
                Project Filters & Criteria
              </h2>
              <span className="text-[10px] text-slate-500">Auto-tuned</span>
            </div>

            <form onSubmit={handleGenerate} className="space-y-4 text-xs">
              {/* Branch */}
              <div>
                <label className="font-semibold text-slate-300 block mb-1">Engineering Branch</label>
                <input
                  type="text"
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950/80 p-2.5 text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>

              {/* Skills */}
              <div>
                <label className="font-semibold text-slate-300 block mb-1">Your Technical Skills</label>
                <input
                  type="text"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="e.g. Python, React, C++, Docker"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950/80 p-2.5 text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>

              {/* Interests */}
              <div>
                <label className="font-semibold text-slate-300 block mb-1">Areas of Interest</label>
                <input
                  type="text"
                  value={interests}
                  onChange={(e) => setInterests(e.target.value)}
                  placeholder="e.g. AI, Healthcare, Cybersecurity"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950/80 p-2.5 text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>

              {/* Domain & Project Type */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Domain</label>
                  <select
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950/80 p-2 text-white focus:border-indigo-500 focus:outline-none"
                  >
                    {DOMAINS.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Project Type</label>
                  <select
                    value={projectType}
                    onChange={(e) => setProjectType(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950/80 p-2 text-white focus:border-indigo-500 focus:outline-none"
                  >
                    {PROJECT_TYPES.map((pt) => (
                      <option key={pt} value={pt}>{pt}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Difficulty & Team Size */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Difficulty</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950/80 p-2 text-white focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Team Size</label>
                  <select
                    value={teamSize}
                    onChange={(e) => setTeamSize(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950/80 p-2 text-white focus:border-indigo-500 focus:outline-none"
                  >
                    <option value={1}>1 (Individual)</option>
                    <option value={2}>2 Members</option>
                    <option value={3}>3 Members</option>
                    <option value={4}>4 Members</option>
                  </select>
                </div>
              </div>

              {/* Duration & AI toggle */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Duration</label>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950/80 p-2 text-white focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="2 months">2 months</option>
                    <option value="3 months">3 months</option>
                    <option value="4 months">4 months</option>
                    <option value="6 months">6 months</option>
                  </select>
                </div>

                <div className="flex flex-col justify-end">
                  <label className="flex items-center gap-2 p-2 rounded-xl border border-slate-800 bg-slate-950/60 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={aiRequired}
                      onChange={(e) => setAiRequired(e.target.checked)}
                      className="rounded border-slate-700 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="font-medium text-slate-300 text-[11px]">AI/ML Required</span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-xs font-bold text-white shadow-xl shadow-indigo-600/30 hover:bg-indigo-500 transition-all cursor-pointer"
              >
                <Sparkles className="h-4 w-4" />
                {loading ? 'Synthesizing Projects...' : 'Generate 6 Curated Ideas'}
              </button>
            </form>
          </div>
        </div>

        {/* Right Ideas Feed Panel */}
        <div className="lg:col-span-8 space-y-5">
          {loading && (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-12 text-center space-y-4">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600/20 text-indigo-400 animate-spin">
                <Cpu className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Analyzing Student Profile & Domain Trends...</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Running semantic scoring, eliminating repetitive topics, and structuring comprehensive final-year project blueprints.
              </p>
            </div>
          )}

          {!loading && ideas.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/30 p-12 text-center space-y-4">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-800 text-slate-400">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Ready to Generate Ideas</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Click <strong>&quot;Generate 6 Curated Ideas&quot;</strong> on the left to receive customized project ideas with full problem statements, scope limits, and tech stacks.
              </p>
              <button
                onClick={() => handleGenerate()}
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 transition-all cursor-pointer"
              >
                <Sparkles className="h-4 w-4" /> Generate Now
              </button>
            </div>
          )}

          {!loading && ideas.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                <span>Generated {ideas.length} Personalized Project Recommendations</span>
                <span>Select to compare or click &quot;Start Project&quot;</span>
              </div>

              {ideas.map((idea, index) => {
                const isExpanded = expandedIdeaIndex === index;
                const isSelected = selectedForCompare.includes(idea.title);
                const isStarting = startingProjectId === idea.title;

                return (
                  <div
                    key={idea.title}
                    className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-6 backdrop-blur-xl shadow-lg hover:border-slate-700 transition-all"
                  >
                    {/* Top Row: Title, Badges, Metrics */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="space-y-1.5 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-md bg-indigo-500/20 px-2 py-0.5 text-[10px] font-bold text-indigo-400 border border-indigo-500/30">
                            {idea.difficulty}
                          </span>
                          <span className="rounded-md bg-slate-800 px-2 py-0.5 text-[10px] font-medium text-slate-300">
                            {idea.estimatedDuration}
                          </span>
                        </div>
                        <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                          {idea.title}
                        </h3>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {idea.shortDescription}
                        </p>
                      </div>

                      {/* 3 Metric Badges */}
                      <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0">
                        <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/40 px-2.5 py-1 rounded-lg border border-emerald-800/50">
                          <TrendingUp className="h-3 w-3" />
                          <span>Resume: {idea.resumeValue}/10</span>
                        </div>
                        <div className="flex items-center gap-1 text-[11px] font-semibold text-amber-400 bg-amber-950/40 px-2.5 py-1 rounded-lg border border-amber-800/50">
                          <Award className="h-3 w-3" />
                          <span>Innovation: {idea.innovationScore}/10</span>
                        </div>
                      </div>
                    </div>

                    {/* Tech Stack Chips */}
                    <div className="mt-4 pt-3 border-t border-slate-800/60 flex flex-wrap items-center gap-1.5">
                      <span className="text-[11px] font-medium text-slate-400 mr-1">Recommended Stack:</span>
                      {idea.recommendedTechStack.map((tech) => (
                        <span
                          key={tech}
                          className="rounded-md border border-slate-800 bg-slate-950/80 px-2 py-0.5 text-[11px] font-medium text-slate-300"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* Expandable Deep Details */}
                    {isExpanded && (
                      <div className="mt-5 space-y-4 pt-4 border-t border-slate-800/80 text-xs">
                        {/* Problem & Solution */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3.5">
                            <p className="font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                              <span className="h-1.5 w-1.5 rounded-full bg-rose-400" />
                              Problem Statement
                            </p>
                            <p className="text-slate-400 text-[11px] leading-relaxed">
                              {idea.problemStatement}
                            </p>
                          </div>

                          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3.5">
                            <p className="font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                              Proposed Solution
                            </p>
                            <p className="text-slate-400 text-[11px] leading-relaxed">
                              {idea.proposedSolution}
                            </p>
                          </div>
                        </div>

                        {/* Core Features & Scope */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3.5">
                            <p className="font-bold text-indigo-300 mb-1.5">Core Features (MVP)</p>
                            <ul className="space-y-1 text-slate-400 text-[11px]">
                              {idea.coreFeatures.map((f, i) => (
                                <li key={i} className="flex items-start gap-1.5">
                                  <CheckCircle2 className="h-3 w-3 text-indigo-400 mt-0.5 shrink-0" />
                                  <span>{f}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3.5">
                            <p className="font-bold text-violet-300 mb-1.5">Advanced / Optional Features</p>
                            <ul className="space-y-1 text-slate-400 text-[11px]">
                              {idea.optionalFeatures.map((f, i) => (
                                <li key={i} className="flex items-start gap-1.5">
                                  <Sparkles className="h-3 w-3 text-violet-400 mt-0.5 shrink-0" />
                                  <span>{f}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {/* Target Users & Challenges */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
                          <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/80">
                            <span className="font-semibold text-slate-300">Target Users: </span>
                            <span className="text-slate-400">{idea.targetUsers}</span>
                          </div>
                          <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/80">
                            <span className="font-semibold text-slate-300">Potential Challenges: </span>
                            <span className="text-slate-400">{idea.potentialChallenges.join('; ')}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Card Actions Footer */}
                    <div className="mt-5 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <label className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-300 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleCompare(idea.title)}
                            className="rounded border-slate-700 text-violet-600 focus:ring-violet-500"
                          />
                          <span>Compare</span>
                        </label>

                        <button
                          onClick={() => setExpandedIdeaIndex(isExpanded ? null : index)}
                          className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
                        >
                          {isExpanded ? (
                            <>Hide Breakdown <ChevronUp className="h-3.5 w-3.5" /></>
                          ) : (
                            <>View Full Breakdown <ChevronDown className="h-3.5 w-3.5" /></>
                          )}
                        </button>
                      </div>

                      <button
                        onClick={() => handleStartProject(idea)}
                        disabled={isStarting}
                        className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 transition-all cursor-pointer"
                      >
                        <Zap className="h-3.5 w-3.5" />
                        {isStarting ? 'Building Project...' : 'Start This Project'}
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
