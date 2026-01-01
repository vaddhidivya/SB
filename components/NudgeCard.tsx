
import React, { useState } from 'react';
import { Insight } from '../types';
import GlassCard from './GlassCard';

interface NudgeCardProps {
  insight: Insight;
  onCommit: (id: string) => void;
}

const NudgeCard: React.FC<NudgeCardProps> = ({ insight, onCommit }) => {
  const [isCommitted, setIsCommitted] = useState(false);

  const handleCommit = () => {
    setIsCommitted(true);
    onCommit(insight.id);
  };

  if (!insight.actionableLabel) return null;

  return (
    <GlassCard className={`relative overflow-hidden transition-all duration-500 border-l-4 ${isCommitted ? 'border-emerald-600 bg-emerald-500/10' : 'border-amber-500'}`}>
      <div className="flex justify-between items-start mb-3">
        <div className="p-2 rounded-lg bg-white/40">
          <svg className={`w-5 h-5 ${isCommitted ? 'text-emerald-600' : 'text-amber-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        {insight.savingsPotential && (
          <div className="glass px-2 py-1 rounded-md bg-emerald-50 border-emerald-100">
            <span className="text-[10px] font-black text-emerald-700">+${insight.savingsPotential}/mo</span>
          </div>
        )}
      </div>
      
      <p className="text-sm font-medium text-slate-800 leading-relaxed mb-4">
        {insight.message}
      </p>

      {!isCommitted ? (
        <button 
          onClick={handleCommit}
          className="w-full py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-all active:scale-95 shadow-lg"
        >
          {insight.actionableLabel}
        </button>
      ) : (
        <div className="flex items-center justify-center py-2 space-x-2 text-emerald-700 animate-in fade-in slide-in-from-bottom-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-xs font-bold uppercase tracking-widest">Commitment Active</span>
        </div>
      )}
      
      {/* Background Glow Effect */}
      <div className={`absolute -right-8 -bottom-8 w-24 h-24 blur-3xl rounded-full opacity-10 ${isCommitted ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
    </GlassCard>
  );
};

export default NudgeCard;
