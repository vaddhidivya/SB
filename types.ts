
export enum TransactionCategory {
  FOOD = 'Food',
  HOUSING = 'Housing',
  TRANSPORT = 'Transport',
  ENTERTAINMENT = 'Entertainment',
  SHOPPING = 'Shopping',
  SAVINGS = 'Savings',
  INCOME = 'Income',
  OTHER = 'Other'
}

export type EntryType = 'income' | 'expense';

export interface Transaction {
  id: string;
  amount: number;
  category: TransactionCategory;
  merchant: string;
  date: string;
  isFixed: boolean;
  type: EntryType;
}

export interface BudgetGoal {
  category: TransactionCategory;
  limit: number;
  spent: number;
}

export interface Insight {
  id: string;
  type: 'pattern' | 'predictive' | 'anomaly' | 'nudge';
  message: string;
  impact?: string;
  actionableLabel?: string;
  savingsPotential?: number;
}

// Fix: Add missing PipelineStage interface definition to support the Pipeline component
export interface PipelineStage {
  id: string;
  title: string;
  amount: number;
  status: 'prospect' | 'proposal' | 'won' | 'collected';
}
