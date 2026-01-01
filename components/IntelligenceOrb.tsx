
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { CATEGORY_COLORS, Icons } from '../constants';
import { BudgetGoal } from '../types';

interface IntelligenceOrbProps {
  totalBudget: number;
  totalSpent: number;
  goals: BudgetGoal[];
}

const IntelligenceOrb: React.FC<IntelligenceOrbProps> = ({ totalBudget, totalSpent, goals }) => {
  const remaining = totalBudget - totalSpent;
  const healthPercent = Math.max(0, Math.min(100, Math.round((remaining / (totalBudget || 1)) * 100)));

  return (
    <div className="relative flex flex-col items-center justify-center p-4">
      {/* Background Refractive Sphere */}
      <div className="absolute inset-0 rounded-full glass-refractive blur-sm opacity-30 animate-pulse-soft"></div>
      
      {/* The Core Container */}
      <div className="relative z-10 w-64 h-64 md:w-80 md:h-80 flex flex-col items-center justify-center rounded-full glass border border-white/80 shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
        
        {/* Animated Donut Layer */}
        <div className="absolute inset-0 rotate-[-90deg]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={goals.length > 0 ? goals : [{ category: 'Empty', spent: 1 }]}
                cx="50%"
                cy="50%"
                innerRadius="88%"
                outerRadius="95%"
                paddingAngle={4}
                dataKey="spent"
                stroke="none"
              >
                {goals.length > 0 ? goals.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.category] || '#e2e8f0'} />
                )) : <Cell fill="#e2e8f0" />}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Primary Metric */}
        <div className="text-center px-6">
          <span className="block text-[10px] uppercase font-black tracking-widest text-slate-400 mb-2">Portfolio Spend</span>
          <h2 className="text-5xl md:text-6xl font-black text-slate-800 tracking-tighter">
            ${totalSpent.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </h2>
          <div className="flex items-center justify-center mt-3 space-x-2">
            <span className="text-emerald-600 flex items-center text-xs font-black uppercase tracking-tighter bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
              <Icons.TrendingUp />
              <span className="ml-1">Optimized</span>
            </span>
          </div>
        </div>

        {/* Intelligence Badge */}
        <div className="absolute top-6 glass px-3 py-1 rounded-full border border-white/60 flex items-center space-x-2 shadow-sm">
          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
          <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Glass Intelligence</span>
        </div>
        
        {/* Health Score Subtext */}
        <div className="absolute bottom-10">
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
             Efficiency: <span className={healthPercent > 20 ? 'text-emerald-500' : 'text-amber-500'}>{healthPercent}%</span>
           </p>
        </div>
      </div>

      {/* Predictive Nudge below orb */}
      <div className="mt-8 text-center max-w-xs animate-in fade-in slide-in-from-top-2 duration-1000">
        <p className="text-slate-500 text-sm font-medium leading-relaxed italic">
          "Your current burn rate suggests a <span className="text-slate-900 font-bold">${remaining.toLocaleString()}</span> surplus by month end. Excellent discipline."
        </p>
      </div>
    </div>
  );
};

export default IntelligenceOrb;
