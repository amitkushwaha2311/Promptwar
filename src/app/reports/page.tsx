'use client';

import { FileText, Download, Printer, ChevronDown, CheckCircle2, Clock, PlayCircle } from 'lucide-react';

export default function ReportsPage() {
  return (
    <div className="flex-1 w-full bg-[#090B14] p-4 sm:p-6 lg:p-8 text-white space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-bold text-indigo-400 border border-indigo-500/20 shadow-[0_0_10px_rgba(99,102,241,0.2)] mb-4">
            <FileText className="w-3.5 h-3.5" /> Documentation
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">Project Reports</h1>
          <p className="text-sm text-slate-400 mt-2">Generate and export automated thesis chapters, READMEs, and presentations.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="bg-slate-900/60 border border-slate-700 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all">
            <Printer className="w-4 h-4" /> Print
          </button>
          <button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(79,70,229,0.4)]">
            <Download className="w-4 h-4" /> Export All
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Report Cards */}
        {[
          { title: 'Project README.md', desc: 'Auto-generated repository documentation with setup instructions and architecture.', status: 'Ready', icon: CheckCircle2, color: 'text-emerald-400' },
          { title: 'Feasibility Study', desc: 'Chapter 2 of thesis. Detailed analysis of technical stack and timelines.', status: 'Ready', icon: CheckCircle2, color: 'text-emerald-400' },
          { title: 'System Architecture', desc: 'UML diagrams, DFDs, and database schema mappings.', status: 'In Progress', icon: Clock, color: 'text-amber-400' },
          { title: 'Final Thesis Report', desc: 'Complete IEEE format document covering all phases of development.', status: 'Locked', icon: PlayCircle, color: 'text-slate-500' },
          { title: 'Viva Presentation', desc: 'Slide deck with key metrics, problem statement, and solution.', status: 'Locked', icon: PlayCircle, color: 'text-slate-500' },
        ].map((report, i) => (
          <div key={i} className="rounded-2xl bg-[#0F1322] border border-slate-800/60 p-6 flex flex-col justify-between hover:border-indigo-500/40 transition-colors group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-bl-full pointer-events-none group-hover:bg-indigo-500/10 transition-colors"></div>
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider ${report.color}`}>
                  <report.icon className="w-3.5 h-3.5" /> {report.status}
                </div>
                <button className="text-slate-500 hover:text-white transition-colors">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{report.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{report.desc}</p>
            </div>
            
            <div className="mt-6 pt-4 border-t border-slate-800">
              <button 
                disabled={report.status === 'Locked'}
                className={`w-full py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                  report.status === 'Locked' 
                    ? 'bg-slate-900 text-slate-600 cursor-not-allowed'
                    : 'bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600 hover:text-white'
                }`}
              >
                <Download className="w-4 h-4" /> Download PDF
              </button>
            </div>
          </div>
        ))}

      </div>
    </div>
  );
}

// ensure lucide-react imports
import { MoreVertical } from 'lucide-react';
