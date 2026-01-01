
import React from 'react';
import { PipelineStage } from '../types';

const stages: PipelineStage[] = [
  { id: '1', title: 'Prospect', amount: 1200, status: 'prospect' },
  { id: '2', title: 'Proposal', amount: 4500, status: 'proposal' },
  { id: '3', title: 'Won', amount: 2800, status: 'won' },
  { id: '4', title: 'Collected', amount: 5200, status: 'collected' },
];

const Pipeline: React.FC = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stages.map((stage) => (
        <div key={stage.id} className="relative group">
          <div className="glass p-4 rounded-2xl h-32 flex flex-col justify-between border-white/60 group-hover:bg-white/60 transition-all shadow-sm">
            <span className="text-[10px] uppercase font-bold tracking-tighter text-slate-500">{stage.title}</span>
            <div className="flex flex-col">
                <span className="text-xl font-bold text-slate-800">${stage.amount.toLocaleString()}</span>
                {/* Visual indicator for status */}
                <div className="mt-2 h-1 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div 
                        className={`h-full transition-all duration-1000 ${
                            stage.status === 'prospect' ? 'w-[5%] bg-slate-400' :
                            stage.status === 'proposal' ? 'w-[40%] bg-blue-500' :
                            stage.status === 'won' ? 'w-full bg-emerald-500' : 'w-full bg-amber-500'
                        }`}
                    ></div>
                </div>
            </div>
            {stage.status === 'collected' && (
                <div className="absolute top-2 right-2 text-amber-500">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Pipeline;
