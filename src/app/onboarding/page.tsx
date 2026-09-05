'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import {
  Sparkles,
  ArrowRight,
  GraduationCap,
  Code2,
  Cpu,
  Clock,
  Users,
  CheckCircle2,
  Plus,
  X,
} from 'lucide-react';

const COMMON_LANGUAGES = ['Python', 'JavaScript', 'TypeScript', 'C++', 'Java', 'Go', 'Rust', 'PHP', 'Solidity'];
const COMMON_FRAMEWORKS = ['React', 'Next.js', 'FastAPI', 'Node.js / Express', 'Django', 'Flask', 'PyTorch', 'TensorFlow', 'Spring Boot'];
const COMMON_SKILLS = ['Machine Learning', 'NLP', 'Computer Vision', 'Docker', 'Kubernetes', 'PostgreSQL', 'MongoDB', 'REST APIs', 'GraphQL', 'AWS', 'Git'];
const COMMON_INTERESTS = ['Artificial Intelligence', 'Healthcare Tech', 'FinTech', 'Cybersecurity', 'IoT & Smart Cities', 'Web3 / Blockchain', 'EdTech', 'Autonomous Systems'];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);

  // Profile state
  const [college, setCollege] = useState('University Institute of Technology');
  const [degree, setDegree] = useState('B.Tech');
  const [branch, setBranch] = useState('Computer Science');
  const [graduationYear, setGraduationYear] = useState(2026);
  const [experienceLevel, setExperienceLevel] = useState('Intermediate');
  const [teamSize, setTeamSize] = useState(3);
  const [duration, setDuration] = useState('4 months');

  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(['Python', 'JavaScript', 'C++']);
  const [selectedFrameworks, setSelectedFrameworks] = useState<string[]>(['React', 'Next.js', 'FastAPI']);
  const [selectedSkills, setSelectedSkills] = useState<string[]>(['Machine Learning', 'REST APIs', 'PostgreSQL']);
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['Artificial Intelligence', 'Healthcare Tech']);

  const [customLanguage, setCustomLanguage] = useState('');
  const [customSkill, setCustomSkill] = useState('');

  // Toggle helpers
  const toggleItem = (list: string[], setList: (v: string[]) => void, item: string) => {
    if (list.includes(item)) {
      setList(list.filter((i) => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const handleFinish = async () => {
    setSaving(true);
    try {
      await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          college,
          degree,
          branch,
          graduationYear,
          experienceLevel,
          teamSize,
          projectDuration: duration,
          programmingLanguages: selectedLanguages,
          frameworks: selectedFrameworks,
          technicalSkills: selectedSkills,
          areasOfInterest: selectedInterests,
        }),
      });

      // Redirect directly to Idea Generator with student profile ready
      router.push('/generate');
    } catch (e) {
      console.error(e);
      router.push('/dashboard');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-[88vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl space-y-6">
        {/* Wizard Step Indicator */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
              Step {step} of 3
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-white mt-0.5">
              {step === 1 && 'Academic Credentials & Branch'}
              {step === 2 && 'Technical Skills & Frameworks'}
              {step === 3 && 'Project Interests & Logistics'}
            </h1>
          </div>
          <div className="flex gap-1.5">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-2 w-8 rounded-full transition-all ${
                  s === step
                    ? 'bg-indigo-500'
                    : s < step
                    ? 'bg-emerald-500'
                    : 'bg-slate-800'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Step 1: Academic Profile */}
        {step === 1 && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 backdrop-blur-xl space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">College / University</label>
                <input
                  type="text"
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950/80 p-2.5 text-sm text-white focus:border-indigo-500 focus:outline-none"
                  placeholder="e.g. National Institute of Tech"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Degree Program</label>
                <select
                  value={degree}
                  onChange={(e) => setDegree(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950/80 p-2.5 text-sm text-white focus:border-indigo-500 focus:outline-none"
                >
                  <option value="B.Tech">B.Tech</option>
                  <option value="B.E.">B.E.</option>
                  <option value="BCA">BCA</option>
                  <option value="MCA">MCA</option>
                  <option value="B.Sc CS">B.Sc Computer Science</option>
                  <option value="M.Tech">M.Tech</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Branch</label>
                <select
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950/80 p-2.5 text-sm text-white focus:border-indigo-500 focus:outline-none"
                >
                  <option value="Computer Science">Computer Science & Engineering</option>
                  <option value="Information Technology">Information Technology</option>
                  <option value="AI & Data Science">AI & Data Science</option>
                  <option value="Electronics & Communication">Electronics & Communication</option>
                  <option value="Cybersecurity">Cybersecurity</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Graduation Year</label>
                <select
                  value={graduationYear}
                  onChange={(e) => setGraduationYear(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950/80 p-2.5 text-sm text-white focus:border-indigo-500 focus:outline-none"
                >
                  <option value={2025}>2025</option>
                  <option value={2026}>2026 (Final Year)</option>
                  <option value={2027}>2027</option>
                </select>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 transition-all cursor-pointer"
              >
                Next: Technical Skills <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Technical Skills */}
        {step === 2 && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 backdrop-blur-xl space-y-6">
            {/* Programming Languages */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Programming Languages Known
              </label>
              <div className="flex flex-wrap gap-2">
                {COMMON_LANGUAGES.map((lang) => {
                  const active = selectedLanguages.includes(lang);
                  return (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => toggleItem(selectedLanguages, setSelectedLanguages, lang)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                        active
                          ? 'bg-indigo-600/30 text-indigo-300 border-indigo-500 shadow-sm'
                          : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {active && <CheckCircle2 className="inline-block h-3 w-3 mr-1 text-indigo-400" />}
                      {lang}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Frameworks */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Frameworks & Libraries
              </label>
              <div className="flex flex-wrap gap-2">
                {COMMON_FRAMEWORKS.map((fw) => {
                  const active = selectedFrameworks.includes(fw);
                  return (
                    <button
                      key={fw}
                      type="button"
                      onClick={() => toggleItem(selectedFrameworks, setSelectedFrameworks, fw)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                        active
                          ? 'bg-violet-600/30 text-violet-300 border-violet-500 shadow-sm'
                          : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {active && <CheckCircle2 className="inline-block h-3 w-3 mr-1 text-violet-400" />}
                      {fw}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Technical Skills */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Databases & Core Technologies
              </label>
              <div className="flex flex-wrap gap-2">
                {COMMON_SKILLS.map((sk) => {
                  const active = selectedSkills.includes(sk);
                  return (
                    <button
                      key={sk}
                      type="button"
                      onClick={() => toggleItem(selectedSkills, setSelectedSkills, sk)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                        active
                          ? 'bg-emerald-600/30 text-emerald-300 border-emerald-500 shadow-sm'
                          : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {active && <CheckCircle2 className="inline-block h-3 w-3 mr-1 text-emerald-400" />}
                      {sk}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="rounded-xl border border-slate-800 bg-slate-900 px-5 py-2.5 text-xs font-semibold text-slate-300 hover:bg-slate-800"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 transition-all cursor-pointer"
              >
                Next: Interests & Logistics <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Interests & Team Logistics */}
        {step === 3 && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 backdrop-blur-xl space-y-6">
            {/* Interests */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Areas of Interest (Select 1 to 3)
              </label>
              <div className="flex flex-wrap gap-2">
                {COMMON_INTERESTS.map((int) => {
                  const active = selectedInterests.includes(int);
                  return (
                    <button
                      key={int}
                      type="button"
                      onClick={() => toggleItem(selectedInterests, setSelectedInterests, int)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                        active
                          ? 'bg-indigo-600/30 text-indigo-300 border-indigo-500 shadow-sm'
                          : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {active && <CheckCircle2 className="inline-block h-3 w-3 mr-1 text-indigo-400" />}
                      {int}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Logistics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Experience Level
                </label>
                <select
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950/80 p-2.5 text-sm text-white focus:border-indigo-500 focus:outline-none"
                >
                  <option value="Beginner">Beginner (Basic coding)</option>
                  <option value="Intermediate">Intermediate (Built small apps)</option>
                  <option value="Advanced">Advanced (Production/Internship)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Team Size</label>
                <select
                  value={teamSize}
                  onChange={(e) => setTeamSize(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950/80 p-2.5 text-sm text-white focus:border-indigo-500 focus:outline-none"
                >
                  <option value={1}>Solo Project (1 student)</option>
                  <option value={2}>2 Members</option>
                  <option value={3}>3 Members (Standard)</option>
                  <option value={4}>4 Members</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Duration</label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950/80 p-2.5 text-sm text-white focus:border-indigo-500 focus:outline-none"
                >
                  <option value="2 months">2 months (Crash Project)</option>
                  <option value="3 months">3 months</option>
                  <option value="4 months">4 months (Semester standard)</option>
                  <option value="6 months">6 months (Full year)</option>
                </select>
              </div>
            </div>

            {/* Profile Summary Card */}
            <div className="rounded-xl border border-slate-800/80 bg-slate-950/70 p-4 text-xs">
              <div className="font-semibold text-slate-300 mb-1">Configured Profile Preview:</div>
              <div className="text-slate-400 space-y-0.5">
                <p><span className="text-slate-500">Branch:</span> {branch} ({degree})</p>
                <p><span className="text-slate-500">Skills:</span> {selectedLanguages.concat(selectedSkills).slice(0, 5).join(', ')}</p>
                <p><span className="text-slate-500">Team & Timeline:</span> {teamSize} member(s) • {duration}</p>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="rounded-xl border border-slate-800 bg-slate-900 px-5 py-2.5 text-xs font-semibold text-slate-300 hover:bg-slate-800"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleFinish}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-7 py-3 text-xs font-bold text-white shadow-xl shadow-indigo-600/30 hover:from-indigo-500 hover:to-violet-500 transition-all cursor-pointer"
              >
                <Sparkles className="h-4 w-4" />
                {saving ? 'Saving Profile...' : 'Complete & Generate Ideas'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
