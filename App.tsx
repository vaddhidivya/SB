
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import IntelligenceOrb from './components/IntelligenceOrb';
import GlassCard from './components/GlassCard';
import WaterfallChart from './components/WaterfallChart';
import NudgeCard from './components/NudgeCard';
import Ledger from './components/Ledger';
import ExpenditureDistributionChart from './components/ExpenditureDistributionChart';
import { Transaction, TransactionCategory, BudgetGoal, Insight } from './types';
import { generateFinancialInsights } from './services/geminiService';
import { CATEGORY_COLORS, Icons } from './constants';

const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: '1', date: '2024-03-01', merchant: 'Starbucks', amount: 5.50, category: TransactionCategory.FOOD, isFixed: false, type: 'expense' },
  { id: '2', date: '2024-03-02', merchant: 'Rent Corp', amount: 2000, category: TransactionCategory.HOUSING, isFixed: true, type: 'expense' },
  { id: '3', date: '2024-03-02', merchant: 'DoorDash', amount: 32.40, category: TransactionCategory.FOOD, isFixed: false, type: 'expense' },
  { id: '4', date: '2024-03-03', merchant: 'Chevron', amount: 55.00, category: TransactionCategory.TRANSPORT, isFixed: false, type: 'expense' },
  { id: '5', date: '2024-03-04', merchant: 'Starbucks', amount: 4.75, category: TransactionCategory.FOOD, isFixed: false, type: 'expense' },
  { id: '6', date: '2024-03-05', merchant: 'Salary', amount: 5200, category: TransactionCategory.INCOME, isFixed: true, type: 'income' },
  { id: '7', date: '2024-03-06', merchant: 'Amazon', amount: 125.99, category: TransactionCategory.SHOPPING, isFixed: false, type: 'expense' },
  { id: '8', date: '2024-03-07', merchant: 'Netflix', amount: 19.99, category: TransactionCategory.ENTERTAINMENT, isFixed: true, type: 'expense' },
];

type AppTab = 'dashboard' | 'analysis' | 'ledger';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>('dashboard');
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [commitments, setCommitments] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const fetchInsights = useCallback(async () => {
    if (transactions.length === 0) return;
    setIsLoading(true);
    const result = await generateFinancialInsights(transactions);
    setInsights(result);
    setIsLoading(false);
  }, [transactions]);

  useEffect(() => {
    fetchInsights();
  }, [fetchInsights]);

  const handleCommit = (id: string) => {
    setCommitments(prev => [...prev, id]);
  };

  const handleAddEntry = (entry: Transaction) => {
    setTransactions(prev => [...prev, entry]);
  };

  const handleDeleteEntry = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const actionableNudges = useMemo(() => 
    insights.filter(i => i.actionableLabel), 
  [insights]);

  const regularInsights = useMemo(() => 
    insights.filter(i => !i.actionableLabel), 
  [insights]);

  const stats = useMemo(() => {
    const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    
    const categorySpent: Record<string, number> = {};
    transactions.filter(t => t.type === 'expense').forEach(t => {
      categorySpent[t.category] = (categorySpent[t.category] || 0) + t.amount;
    });

    const goals: BudgetGoal[] = Object.values(TransactionCategory)
      .filter(c => c !== TransactionCategory.INCOME && categorySpent[c])
      .map(c => ({
        category: c as TransactionCategory,
        limit: c === TransactionCategory.HOUSING ? 2500 : 500,
        spent: categorySpent[c] || 0
      }));

    return { totalIncome, totalExpenses, goals };
  }, [transactions]);

  const merchantDistributionData = useMemo(() => {
    const totals: Record<string, number> = {};
    const expenses = transactions.filter(t => t.type === 'expense');
    let grandTotal = expenses.reduce((sum, t) => sum + t.amount, 0);

    expenses.forEach(t => {
      totals[t.merchant] = (totals[t.merchant] || 0) + t.amount;
    });

    return Object.entries(totals)
      .map(([name, value]) => ({
        name,
        value,
        percentage: grandTotal > 0 ? ((value / grandTotal) * 100).toFixed(1) : '0'
      }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Icons.Layout },
    { id: 'ledger', label: 'Ledger', icon: Icons.BookOpen },
    { id: 'analysis', label: 'Analysis', icon: Icons.TrendingUp },
  ];

  return (
    <div className="flex flex-col min-h-screen relative">
      {/* Sticky Floating Top Navigation */}
      <nav className="sticky top-0 z-50 w-full px-4 py-4 pointer-events-none">
        <div className="max-w-6xl mx-auto glass rounded-3xl border border-white/80 shadow-2xl flex items-center justify-between px-6 py-4 pointer-events-auto">
          {/* Logo & App Name */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">M</div>
            <div className="flex flex-col">
              <h1 className="text-sm font-black tracking-tighter text-slate-800 uppercase leading-none">Middle Class</h1>
              <span className="text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">Budget Intelligence</span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-1 glass bg-white/10 p-1 rounded-2xl border border-white/40">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as AppTab)}
                className={`flex items-center px-5 py-2.5 rounded-xl transition-all duration-300 group ${
                  activeTab === item.id 
                  ? 'bg-white/60 text-emerald-700 shadow-sm font-bold' 
                  : 'text-slate-500 hover:text-slate-800 hover:bg-white/20'
                }`}
              >
                <item.icon />
                <span className="ml-2 text-[11px] font-black uppercase tracking-widest">{item.label}</span>
              </button>
            ))}
          </div>

          {/* Right Section: Status & Profile */}
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex flex-col text-right">
              <div className="flex items-center justify-end space-x-2">
                <div className={`w-1.5 h-1.5 rounded-full ${isLoading ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`}></div>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{isLoading ? 'Thinking' : 'Synced'}</span>
              </div>
              <p className="text-sm font-black text-slate-800">${(stats.totalIncome - stats.totalExpenses).toLocaleString()}</p>
            </div>
            
            <div className="w-10 h-10 rounded-xl glass border-white/60 flex items-center justify-center overflow-hidden shadow-sm group cursor-pointer">
               <img className="group-hover:scale-110 transition-transform" src="https://picsum.photos/100/100?random=88" alt="profile" />
            </div>

            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 glass rounded-xl text-slate-800"
            >
              <Icons.Menu />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[60] bg-white/20 backdrop-blur-3xl animate-in fade-in duration-300 md:hidden">
          <div className="flex flex-col items-center justify-center h-full space-y-8">
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute top-8 right-8 p-4 glass rounded-full"
            >
              <Icons.X />
            </button>
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id as AppTab);
                  setIsMobileMenuOpen(false);
                }}
                className={`flex flex-col items-center p-6 rounded-3xl transition-all ${
                  activeTab === item.id ? 'glass bg-white/60 text-emerald-700 scale-110' : 'text-slate-400'
                }`}
              >
                <div className="mb-2 transform scale-150"><item.icon /></div>
                <span className="text-xs font-black uppercase tracking-[0.2em]">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 w-full flex flex-col pt-4 pb-20">
        <div className="px-6 lg:px-10 max-w-6xl mx-auto w-full space-y-12">
          
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            {activeTab === 'dashboard' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Left Column: Hero Orb */}
                <div className="lg:col-span-5 space-y-8">
                  <IntelligenceOrb 
                    totalBudget={stats.totalIncome} 
                    totalSpent={stats.totalExpenses} 
                    goals={stats.goals} 
                  />
                  
                  <GlassCard title="FINANCIAL RATIOS" defaultOpen={false}>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-2xl bg-white/40 border border-white/60 text-center">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Savings Rate</p>
                        <p className="text-lg font-black text-emerald-600">
                          {stats.totalIncome > 0 ? Math.round(((stats.totalIncome - stats.totalExpenses) / stats.totalIncome) * 100) : 0}%
                        </p>
                      </div>
                      <div className="p-4 rounded-2xl bg-white/40 border border-white/60 text-center">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Fixed Cost</p>
                        <p className="text-lg font-black text-blue-600">
                           {stats.totalExpenses > 0 ? Math.round((transactions.filter(t => t.isFixed).reduce((s,t) => s+t.amount, 0) / stats.totalExpenses) * 100) : 0}%
                        </p>
                      </div>
                    </div>
                  </GlassCard>
                </div>

                {/* Right Column: Insights & Summary */}
                <div className="lg:col-span-7 space-y-8">
                  <GlassCard title="CASH FLOW WATERFALL">
                    <WaterfallChart />
                  </GlassCard>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-slate-500 text-[10px] uppercase tracking-widest font-black ml-2">Active Nudges</h3>
                      {actionableNudges.map(nudge => (
                        <NudgeCard key={nudge.id} insight={nudge} onCommit={handleCommit} />
                      ))}
                      {actionableNudges.length === 0 && (
                        <div className="p-6 text-center glass rounded-3xl border-dashed border-slate-200">
                           <p className="text-xs text-slate-400 font-medium">No behavioral nudges yet.</p>
                        </div>
                      )}
                    </div>

                    <GlassCard title="AI PATTERNS">
                      <div className="space-y-4">
                        {regularInsights.map(insight => (
                          <div key={insight.id} className="flex space-x-3 group">
                            <div className={`mt-1 flex-shrink-0 w-2 h-2 rounded-full ${insight.type === 'anomaly' ? 'bg-red-500' : 'bg-emerald-500'}`}></div>
                            <div>
                              <p className="text-sm text-slate-700 font-medium leading-tight group-hover:text-slate-900 transition-colors">{insight.message}</p>
                              {insight.impact && <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{insight.impact}</span>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </GlassCard>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'ledger' && (
              <div className="max-w-5xl mx-auto space-y-8">
                <Ledger 
                  transactions={transactions} 
                  onAdd={handleAddEntry} 
                  onDelete={handleDeleteEntry} 
                />
              </div>
            )}

            {activeTab === 'analysis' && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <GlassCard title="MERCHANT EXPOSURE">
                    <ExpenditureDistributionChart data={merchantDistributionData} />
                  </GlassCard>
                  
                  <GlassCard title="BUDGET ENVELOPES">
                    <div className="space-y-6">
                      {stats.goals.map(goal => (
                        <div key={goal.category} className="space-y-2">
                          <div className="flex justify-between text-[11px] font-black">
                            <span className="text-slate-500 uppercase tracking-widest">{goal.category}</span>
                            <span className="text-slate-800">${goal.spent.toFixed(2)} <span className="text-slate-300 mx-1">/</span> ${goal.limit}</span>
                          </div>
                          <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden border border-white/40 shadow-inner">
                            <div 
                              className="h-full transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(0,0,0,0.05)]"
                              style={{ 
                                width: `${Math.min((goal.spent / goal.limit) * 100, 100)}%`,
                                backgroundColor: CATEGORY_COLORS[goal.category]
                              }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </GlassCard>
                </div>

                <GlassCard title="SPENDING VELOCITY ANALYSIS" defaultOpen={false}>
                  <div className="h-64 flex flex-col items-center justify-center text-center space-y-4">
                    <div className="p-4 bg-white/40 rounded-full animate-pulse-soft">
                      <Icons.Alert />
                    </div>
                    <div>
                      <p className="text-slate-600 font-bold">Velocity Metrics Synchronizing</p>
                      <p className="text-xs text-slate-400 mt-1 max-w-sm">
                        Spending velocity tracks the acceleration of daily outflows. 
                        Your current burn rate is <span className="text-emerald-600 font-black">optimal</span> for your income level.
                      </p>
                    </div>
                  </div>
                </GlassCard>
              </div>
            )}
          </div>
        </div>

        {/* Subtle Bottom Spacer */}
        <div className="h-20"></div>

        {/* Footer */}
        <footer className="mt-auto py-12 glass border-t border-white/60">
          <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10 items-center">
            <div className="flex flex-col items-center md:items-start space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white text-xs font-bold">M</div>
                <span className="text-sm font-black text-slate-800 tracking-tighter uppercase">Middle Class Budget</span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest text-center md:text-left">Sophisticated Intelligence for Everyday Wealth.</p>
            </div>
            
            <div className="flex items-center justify-center space-x-8">
              <a href="#" className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-emerald-600 transition-colors">Privacy</a>
              <a href="#" className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-emerald-600 transition-colors">Terms</a>
              <a href="#" className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-emerald-600 transition-colors">Support</a>
            </div>

            <div className="flex flex-col items-center md:items-end">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                © 2024 Middle Class Budget Intelligence.
              </p>
              <p className="text-[9px] text-slate-300 font-bold uppercase tracking-tighter mt-1">Built for clarity.</p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default App;
