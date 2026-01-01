
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface DataPoint {
  name: string;
  value: number;
  percentage: string;
}

interface Props {
  data: DataPoint[];
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass p-3 rounded-xl border border-white/60 shadow-lg backdrop-blur-md">
        <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">{payload[0].name}</p>
        <p className="text-sm font-bold text-slate-800">${payload[0].value.toFixed(2)}</p>
        <p className="text-[10px] text-emerald-600 font-bold">{payload[0].payload.percentage}% of total</p>
      </div>
    );
  }
  return null;
};

const ExpenditureDistributionChart: React.FC<Props> = ({ data }) => {
  const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#6366f1'];

  return (
    <div className="h-80 w-full relative">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
            stroke="none"
            animationBegin={0}
            animationDuration={1500}
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={COLORS[index % COLORS.length]} 
                fillOpacity={0.8}
                className="hover:fill-opacity-100 transition-all duration-300 cursor-pointer"
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            verticalAlign="bottom" 
            height={36}
            content={(props) => {
                const { payload } = props;
                return (
                    <ul className="flex flex-wrap justify-center gap-4 mt-6">
                        {payload?.map((entry: any, index: number) => (
                            <li key={`item-${index}`} className="flex items-center space-x-2">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></div>
                                <span className="text-[10px] text-slate-600 font-bold uppercase tracking-tighter">
                                    {entry.value} <span className="text-slate-400 ml-1 font-normal">({data[index].percentage}%)</span>
                                </span>
                            </li>
                        ))}
                    </ul>
                );
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      
      {/* Center Label */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -mt-4 text-center pointer-events-none">
        <span className="block text-[10px] uppercase tracking-widest text-slate-400 font-bold">Diversity</span>
        <span className="text-xl font-bold text-slate-800">{data.length}</span>
        <span className="block text-[8px] uppercase text-slate-400 font-bold">Merchants</span>
      </div>
    </div>
  );
};

export default ExpenditureDistributionChart;
