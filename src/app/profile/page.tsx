'use client';

import { useState, useEffect } from 'react';
import {
  User,
  GraduationCap,
  Code2,
  Clock,
  Users,
  CheckCircle2,
  Save,
  Sparkles,
} from 'lucide-react';

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const [college, setCollege] = useState('');
  const [degree, setDegree] = useState('B.Tech');
  const [branch, setBranch] = useState('Computer Science');
  const [graduationYear, setGraduationYear] = useState(2026);
  const [experienceLevel, setExperienceLevel] = useState('Intermediate');
  const [teamSize, setTeamSize] = useState(3);
  const [duration, setDuration] = useState('4 months');

  const [skillsStr, setSkillsStr] = useState('Python, JavaScript, React, PostgreSQL');
  const [interestsStr, setInterestsStr] = useState('Artificial Intelligence, Web Development');

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch('/api/profile');
        if (res.ok) {
          const data = await res.json();
          if (data.profile) {
            setCollege(data.profile.college || 'University Institute of Technology');
            setDegree(data.profile.degree || 'B.Tech');
            setBranch(data.profile.branch || 'Computer Science');
            setGraduationYear(data.profile.graduationYear || 2026);
            setExperienceLevel(data.profile.experienceLevel || 'Intermediate');
            setTeamSize(data.profile.teamSize || 3);
            setDuration(data.profile.projectDuration || '4 months');

            if (data.profile.programmingLanguages) {
              const langs = JSON.parse(data.profile.programmingLanguages);
              const techs = data.profile.technicalSkills ? JSON.parse(data.profile.technicalSkills) : [];
              setSkillsStr(langs.concat(techs).join(', '));
            }
            if (data.profile.areasOfInterest) {
              setInterestsStr(JSON.parse(data.profile.areasOfInterest).join(', '));
            }
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');

    try {
      const skillsArray = skillsStr.split(',').map((s) => s.trim()).filter(Boolean);
      const interestsArray = interestsStr.split(',').map((i) => i.trim()).filter(Boolean);

      const res = await fetch('/api/profile', {
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
          programmingLanguages: skillsArray,
          areasOfInterest: interestsArray,
        }),
      });

      if (res.ok) {
        setSuccessMsg('Profile saved successfully! New project recommendations will use these criteria.');
        setTimeout(() => setSuccessMsg(''), 4000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center text-xs text-slate-400">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 space-y-6">
      <div className="border-b border-slate-800 pb-4">
        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-800/40">
          Module 1: Student Profile
        </span>
        <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
          Student Profile & Engineering Credentials
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Manage your academic background, skills inventory, and team constraints.
        </p>
      </div>

      {successMsg && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-950/30 p-3.5 text-xs text-emerald-300">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 backdrop-blur-xl shadow-xl space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="font-semibold text-slate-300 block mb-1.5">College / University</label>
            <input
              type="text"
              required
              value={college}
              onChange={(e) => setCollege(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-950/80 p-2.5 text-white focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-300 block mb-1.5">Degree</label>
            <select
              value={degree}
              onChange={(e) => setDegree(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-950/80 p-2.5 text-white focus:border-indigo-500 focus:outline-none"
            >
              <option value="B.Tech">B.Tech</option>
              <option value="B.E.">B.E.</option>
              <option value="BCA">BCA</option>
              <option value="MCA">MCA</option>
              <option value="B.Sc CS">B.Sc CS</option>
            </select>
          </div>

          <div>
            <label className="font-semibold text-slate-300 block mb-1.5">Branch</label>
            <select
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-950/80 p-2.5 text-white focus:border-indigo-500 focus:outline-none"
            >
              <option value="Computer Science">Computer Science & Engineering</option>
              <option value="Information Technology">Information Technology</option>
              <option value="AI & Data Science">Artificial Intelligence & Data Science</option>
              <option value="Electronics & Communication">Electronics & Communication</option>
              <option value="Cybersecurity">Cybersecurity</option>
            </select>
          </div>

          <div>
            <label className="font-semibold text-slate-300 block mb-1.5">Graduation Year</label>
            <input
              type="number"
              value={graduationYear}
              onChange={(e) => setGraduationYear(Number(e.target.value))}
              className="w-full rounded-xl border border-slate-800 bg-slate-950/80 p-2.5 text-white focus:border-indigo-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Skills & Interests */}
        <div className="space-y-4 pt-4 border-t border-slate-800 text-xs">
          <div>
            <label className="font-semibold text-slate-300 block mb-1.5">
              Technical Skills & Languages (Comma-separated)
            </label>
            <input
              type="text"
              value={skillsStr}
              onChange={(e) => setSkillsStr(e.target.value)}
              placeholder="e.g. Python, React, C++, PostgreSQL, Docker"
              className="w-full rounded-xl border border-slate-800 bg-slate-950/80 p-2.5 text-white focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-300 block mb-1.5">
              Areas of Interest (Comma-separated)
            </label>
            <input
              type="text"
              value={interestsStr}
              onChange={(e) => setInterestsStr(e.target.value)}
              placeholder="e.g. Artificial Intelligence, Healthcare, FinTech"
              className="w-full rounded-xl border border-slate-800 bg-slate-950/80 p-2.5 text-white focus:border-indigo-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Team & Logistics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800 text-xs">
          <div>
            <label className="font-semibold text-slate-300 block mb-1.5">Experience Level</label>
            <select
              value={experienceLevel}
              onChange={(e) => setExperienceLevel(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-950/80 p-2.5 text-white focus:border-indigo-500 focus:outline-none"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          <div>
            <label className="font-semibold text-slate-300 block mb-1.5">Team Size</label>
            <input
              type="number"
              min={1}
              max={6}
              value={teamSize}
              onChange={(e) => setTeamSize(Number(e.target.value))}
              className="w-full rounded-xl border border-slate-800 bg-slate-950/80 p-2.5 text-white focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-300 block mb-1.5">Available Duration</label>
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-950/80 p-2.5 text-white focus:border-indigo-500 focus:outline-none"
            >
              <option value="2 months">2 months</option>
              <option value="3 months">3 months</option>
              <option value="4 months">4 months</option>
              <option value="6 months">6 months</option>
            </select>
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 transition-all cursor-pointer"
          >
            <Save className="h-4 w-4" />
            {saving ? 'Saving...' : 'Save Profile Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
