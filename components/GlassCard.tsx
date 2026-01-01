
import React, { useState } from 'react';
import { Icons } from '../constants';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  defaultOpen?: boolean;
}

const GlassCard: React.FC<GlassCardProps> = ({ children, className = "", title, defaultOpen = true }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={`glass rounded-3xl p-6 relative overflow-hidden transition-all duration-300 hover:bg-white/60 ${className}`}>
      {title && (
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="w-full text-slate-500 text-xs uppercase tracking-widest font-bold mb-0 flex items-center justify-between group focus:outline-none"
        >
          <span className="flex items-center">
            {title}
            <div className={`ml-2 w-1.5 h-1.5 rounded-full transition-colors ${isOpen ? 'bg-emerald-400' : 'bg-slate-300'}`}></div>
          </span>
          <div className="p-1 rounded-lg hover:bg-white/40 transition-all">
            {isOpen ? <Icons.ChevronUp /> : <Icons.ChevronDown />}
          </div>
        </button>
      )}
      <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isOpen ? 'max-h-[2000px] mt-4 opacity-100' : 'max-h-0 opacity-0'}`}>
        {children}
      </div>
    </div>
  );
};

export default GlassCard;
