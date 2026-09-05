'use client';

import { CheckSquare, Plus, MoreHorizontal, MessageSquare, Clock, ArrowRight } from 'lucide-react';

export default function TasksPage() {
  const columns = [
    { title: 'To Do', color: 'border-slate-500', count: 3 },
    { title: 'In Progress', color: 'border-blue-500', count: 2 },
    { title: 'In Review', color: 'border-amber-500', count: 1 },
    { title: 'Completed', color: 'border-emerald-500', count: 4 }
  ];

  const tasks = [
    { title: 'Setup PostgreSQL Database', desc: 'Initialize Prisma schema and connect to Supabase.', tag: 'Backend', comments: 2, dueDate: 'Tomorrow', col: 'In Progress' },
    { title: 'Design Dashboard UI', desc: 'Implement glassmorphism cards from Figma.', tag: 'Frontend', comments: 5, dueDate: 'Today', col: 'In Progress' },
    { title: 'Write API Documentation', desc: 'Document all REST endpoints using Swagger.', tag: 'Docs', comments: 0, dueDate: 'Next Week', col: 'To Do' }
  ];

  return (
    <div className="flex-1 w-full bg-[#090B14] p-4 sm:p-6 lg:p-8 text-white space-y-6 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-slate-400 mb-1">
            <CheckSquare className="w-4 h-4 text-cyan-400" />
            <span className="text-sm font-bold uppercase tracking-wider text-cyan-400">Kanban Board</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">Project Tasks</h1>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2 mr-2">
            <div className="w-8 h-8 rounded-full border-2 border-[#090B14] bg-indigo-600 flex items-center justify-center text-xs font-bold">AR</div>
            <div className="w-8 h-8 rounded-full border-2 border-[#090B14] bg-cyan-500 flex items-center justify-center text-xs font-bold">SC</div>
          </div>
          <button className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)]">
            <Plus className="w-4 h-4" /> New Task
          </button>
        </div>
      </div>

      {/* Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 pb-10 overflow-x-auto">
        {columns.map((col, i) => (
          <div key={i} className="flex flex-col min-w-[280px]">
            {/* Column Header */}
            <div className={`flex items-center justify-between mb-4 pb-2 border-b-2 ${col.color}`}>
              <h3 className="font-bold text-slate-200">{col.title}</h3>
              <span className="text-xs font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">{col.count}</span>
            </div>
            
            {/* Column Tasks Container */}
            <div className="flex-1 space-y-3 min-h-[500px] rounded-xl bg-slate-900/30 border border-slate-800/40 p-2">
              
              {tasks.filter(t => t.col === col.title || (col.title === 'To Do' && i === 0)).map((task, j) => (
                <div key={j} className="rounded-xl bg-[#121629] border border-slate-700/60 p-4 hover:border-cyan-500/50 cursor-grab active:cursor-grabbing transition-colors shadow-lg group">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {task.tag}
                    </span>
                    <button className="text-slate-500 hover:text-white transition-colors opacity-0 group-hover:opacity-100">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <h4 className="font-bold text-white text-sm mb-1 leading-snug">{task.title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4 line-clamp-2">{task.desc}</p>
                  
                  <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
                    <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                      <div className="flex items-center gap-1">
                        <MessageSquare className="w-3.5 h-3.5" /> {task.comments}
                      </div>
                      <div className={`flex items-center gap-1 ${task.dueDate === 'Today' ? 'text-rose-400' : ''}`}>
                        <Clock className="w-3.5 h-3.5" /> {task.dueDate}
                      </div>
                    </div>
                    <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-[10px] font-bold text-white">
                      AR
                    </div>
                  </div>
                </div>
              ))}
              
              <button className="w-full py-2.5 rounded-xl border border-dashed border-slate-700 text-slate-500 hover:border-slate-500 hover:text-slate-300 transition-colors flex items-center justify-center gap-2 text-sm font-semibold">
                <Plus className="w-4 h-4" /> Add Task
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
