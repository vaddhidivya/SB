
import React, { useState } from 'react';
import { Transaction, TransactionCategory, EntryType } from '../types';
import GlassCard from './GlassCard';
import { Icons } from '../constants';

interface LedgerProps {
  transactions: Transaction[];
  onAdd: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
}

const Ledger: React.FC<LedgerProps> = ({ transactions, onAdd, onDelete }) => {
  const [type, setType] = useState<EntryType>('expense');
  const [merchant, setMerchant] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<TransactionCategory>(TransactionCategory.FOOD);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!merchant || !amount) return;

    const newEntry: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      merchant,
      amount: parseFloat(amount),
      category: type === 'income' ? TransactionCategory.INCOME : category,
      date,
      type,
      isFixed: false
    };

    onAdd(newEntry);
    setMerchant('');
    setAmount('');
  };

  return (
    <div className="space-y-10">
      <GlassCard title="DATA ENTRY COMMAND">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="flex p-1.5 glass rounded-2xl bg-white/30 w-fit mx-auto shadow-sm border border-white/60">
            <button
              type="button"
              onClick={() => setType('expense')}
              className={`px-8 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${type === 'expense' ? 'bg-slate-800 text-white shadow-xl' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Expense
            </button>
            <button
              type="button"
              onClick={() => setType('income')}
              className={`px-8 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${type === 'income' ? 'bg-emerald-600 text-white shadow-xl' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Income
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Entity / Source</label>
              <input
                type="text"
                value={merchant}
                required
                onChange={(e) => setMerchant(e.target.value)}
                placeholder="Where is it from/going?"
                className="w-full bg-white/50 border border-white/80 rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 transition-all text-slate-800 placeholder:text-slate-300"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Volume ($)</label>
              <input
                type="number"
                step="0.01"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full bg-white/50 border border-white/80 rounded-2xl px-5 py-3.5 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-slate-400 transition-all text-slate-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {type === 'expense' && (
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Classification</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as TransactionCategory)}
                  className="w-full bg-white/50 border border-white/80 rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 transition-all text-slate-800 appearance-none"
                >
                  {Object.values(TransactionCategory).filter(c => c !== TransactionCategory.INCOME).map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            )}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Timestamp</label>
              <input
                type="date"
                value={date}
                required
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-white/50 border border-white/80 rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 transition-all text-slate-800"
              />
            </div>
          </div>

          <button
            type="submit"
            className={`w-full py-5 rounded-2xl text-xs font-black uppercase tracking-widest text-white shadow-2xl transition-all active:scale-[0.98] ${type === 'expense' ? 'bg-slate-800 hover:bg-slate-900 shadow-slate-200' : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-100'}`}
          >
            Commit {type} to Ledger
          </button>
        </form>
      </GlassCard>

      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-slate-500 text-[10px] uppercase tracking-widest font-black">History Audit</h3>
          <span className="text-[10px] text-slate-300 font-bold uppercase">{transactions.length} total entries</span>
        </div>
        
        <GlassCard className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-800/5 border-b border-white/60">
                  <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Date</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Description</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Type</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Amount</th>
                  <th className="px-6 py-4 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/20">
                {transactions.slice().reverse().map((t) => (
                  <tr key={t.id} className="group hover:bg-white/40 transition-all">
                    <td className="px-6 py-4 text-xs font-medium text-slate-400 whitespace-nowrap">{t.date}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-800">{t.merchant}</span>
                        <span className="text-[9px] uppercase font-black text-slate-300 tracking-tighter">{t.category}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter border ${t.type === 'income' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-slate-50 text-slate-600 border-slate-100'}`}>
                        {t.type}
                      </span>
                    </td>
                    <td className={`px-6 py-4 text-sm font-black whitespace-nowrap ${t.type === 'income' ? 'text-emerald-600' : 'text-slate-800'}`}>
                      {t.type === 'income' ? '+' : '-'}${t.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => onDelete(t.id)}
                        className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                      >
                        <Icons.Trash />
                      </button>
                    </td>
                  </tr>
                ))}
                {transactions.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-20 text-center">
                      <div className="flex flex-col items-center space-y-3">
                         <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-300">
                           <Icons.BookOpen />
                         </div>
                         <p className="text-slate-400 italic text-sm font-medium">Your ledger is currently hollow. Add your first entry.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default Ledger;
