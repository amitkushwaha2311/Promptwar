'use client';

import { Users, UserPlus, Mail, Shield, CheckCircle2, ChevronDown, MoreVertical } from 'lucide-react';

export default function TeamPage() {
  const teamMembers = [
    { name: 'Alex Rivera', role: 'Team Lead & Backend', email: 'alex.rivera@edu.in', initials: 'AR', color: 'bg-indigo-600' },
    { name: 'Sam Carter', role: 'Frontend & UI/UX', email: 'sam.c@edu.in', initials: 'SC', color: 'bg-cyan-500' },
    { name: 'Priya Patel', role: 'Data Science & ML', email: 'priya.p@edu.in', initials: 'PP', color: 'bg-emerald-500' },
    { name: 'Karan Desai', role: 'DevOps & Testing', email: 'karan.d@edu.in', initials: 'KD', color: 'bg-amber-500' }
  ];

  return (
    <div className="flex-1 w-full bg-[#090B14] p-4 sm:p-6 lg:p-8 text-white space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-bold text-indigo-400 border border-indigo-500/20 shadow-[0_0_10px_rgba(99,102,241,0.2)] mb-4">
            <Users className="w-3.5 h-3.5" /> Project Collaboration
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">Team Management</h1>
          <p className="text-sm text-slate-400 mt-2">Manage team roles, track individual contributions, and assign tasks.</p>
        </div>
        <button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(99,102,241,0.4)]">
          <UserPlus className="w-4 h-4" /> Invite Member
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Members List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-2xl bg-[#0F1322] border border-slate-800/60 p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>
            
            <h2 className="text-lg font-bold text-white mb-6">Active Members</h2>
            
            <div className="space-y-3">
              {teamMembers.map((member, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-slate-800/80 bg-slate-900/50 hover:bg-slate-800/80 hover:border-indigo-500/30 transition-all group">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full ${member.color} flex items-center justify-center text-sm font-bold shadow-lg shrink-0`}>
                      {member.initials}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-200 group-hover:text-white transition-colors">{member.name}</h3>
                      <p className="text-xs text-slate-400 flex items-center gap-2">
                        <span>{member.role}</span>
                        <span className="w-1 h-1 rounded-full bg-slate-600"></span>
                        <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {member.email}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {i === 0 && <span className="hidden sm:flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded uppercase">Owner</span>}
                    <button className="p-2 text-slate-500 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Roles & Permissions */}
        <div className="space-y-6">
          <div className="rounded-2xl bg-gradient-to-br from-[#121629] to-[#0a0d18] border border-slate-800/60 p-6 shadow-xl relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl"></div>
            
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-indigo-400" />
              <h3 className="font-bold text-white">Access Level</h3>
            </div>
            
            <p className="text-xs text-slate-400 mb-6 leading-relaxed">
              You are currently logged in as the project <strong className="text-indigo-400">Owner</strong>. You have full access to modify repositories, edit the roadmap, and evaluate team performance.
            </p>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-slate-300 bg-slate-900/50 p-2.5 rounded-lg border border-slate-800/50">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Manage Team
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-300 bg-slate-900/50 p-2.5 rounded-lg border border-slate-800/50">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Delete Project
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-300 bg-slate-900/50 p-2.5 rounded-lg border border-slate-800/50">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Transfer Ownership
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
