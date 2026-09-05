'use client';

import { BrainCircuit, Play, Settings2, RefreshCw, BarChart2 } from 'lucide-react';

export default function SimulatorPage() {
  return (
    <div className="flex-1 w-full bg-[#090B14] p-4 sm:p-6 lg:p-8 text-white space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-purple-500/10 px-3 py-1 text-xs font-bold text-purple-400 border border-purple-500/20 shadow-[0_0_10px_rgba(168,85,247,0.2)] mb-4">
            <BrainCircuit className="w-3.5 h-3.5" /> Intelligence Engine
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">What-If Simulator</h1>
          <p className="text-sm text-slate-400 mt-2">Adjust variables to see how scope changes impact your deadline and health score.</p>
        </div>
        <button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(168,85,247,0.4)]">
          <Play className="w-4 h-4" /> Run Simulation
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Controls */}
        <div className="lg:col-span-1 space-y-6">
          <div className="rounded-2xl bg-[#0F1322] border border-slate-800/60 p-6">
            <h3 className="font-bold text-white mb-6 flex items-center gap-2">
              <Settings2 className="w-4 h-4 text-purple-400" /> Simulation Parameters
            </h3>
            
            <div className="space-y-5">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Development Time Available</label>
                <input type="range" className="w-full accent-purple-500" defaultValue="45" max="90" />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                  <span>10 Days</span>
                  <span className="text-purple-400 font-bold">45 Days</span>
                  <span>90 Days</span>
                </div>
              </div>
              
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Feature Scope Level</label>
                <select defaultValue="MVP + Recommended" className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-500">
                  <option>MVP Only (Core)</option>
                  <option>MVP + Recommended</option>
                  <option>Full Scale (Advanced)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Team Productivity</label>
                <select defaultValue="Average (Standard)" className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-500">
                  <option>Low (Part-time)</option>
                  <option>Average (Standard)</option>
                  <option>High (Crunch mode)</option>
                </select>
              </div>
            </div>
            
            <button className="w-full mt-6 bg-slate-800 hover:bg-slate-700 text-white py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors border border-slate-700">
              <RefreshCw className="w-4 h-4" /> Reset to Defaults
            </button>
          </div>
        </div>

        {/* Results Graph */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl bg-gradient-to-br from-[#121629] to-[#0a0d18] border border-slate-800/60 p-6 h-full min-h-[400px] flex flex-col relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-bold text-white flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-purple-400" /> Projected Impact
              </h3>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
                Simulation Ready
              </span>
            </div>
            
            <div className="flex-1 flex items-center justify-center border border-slate-800/50 bg-slate-950/50 rounded-xl relative overflow-hidden">
              {/* Fake Graph */}
              <svg className="w-full h-full max-h-[250px] opacity-70" viewBox="0 0 500 200" preserveAspectRatio="none">
                <path d="M0,200 L0,150 C50,140 100,160 150,120 C200,80 250,130 300,90 C350,50 400,70 450,40 L500,20 L500,200 Z" fill="url(#purpleGrad)" />
                <path d="M0,150 C50,140 100,160 150,120 C200,80 250,130 300,90 C350,50 400,70 450,40 L500,20" stroke="#a855f7" strokeWidth="3" fill="none" />
                <defs>
                  <linearGradient id="purpleGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#a855f7" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
              
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-slate-900/90 backdrop-blur border border-slate-700 p-4 rounded-xl text-center shadow-2xl">
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">Projected Health</p>
                  <p className="text-4xl font-black text-white">82<span className="text-lg text-slate-500">/100</span></p>
                  <p className="text-xs text-emerald-400 mt-2 font-medium">+4 points vs baseline</p>
                </div>
              </div>
            </div>
            
          </div>
        </div>

      </div>
    </div>
  );
}
