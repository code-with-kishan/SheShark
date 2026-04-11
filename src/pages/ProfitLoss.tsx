import React, { useState } from 'react';
import { GlassCard, Button } from '@/components/UI';
import { Calculator, BarChart3, ArrowRight, TrendingDown, TrendingUp, Wallet } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const pnlData = [
  { month: 'Jan', revenue: 18000, expense: 13200, profit: 4800 },
  { month: 'Feb', revenue: 19800, expense: 14100, profit: 5700 },
  { month: 'Mar', revenue: 21400, expense: 14900, profit: 6500 },
  { month: 'Apr', revenue: 23600, expense: 15800, profit: 7800 },
  { month: 'May', revenue: 25200, expense: 16700, profit: 8500 },
  { month: 'Jun', revenue: 28400, expense: 17600, profit: 10800 },
];

const monthlySales = [
  { month: 'Jan', orders: 124 },
  { month: 'Feb', orders: 142 },
  { month: 'Mar', orders: 156 },
  { month: 'Apr', orders: 169 },
  { month: 'May', orders: 181 },
  { month: 'Jun', orders: 205 },
];

const stockAlerts = [
  { product: 'Solar Kit X1', remaining: 4, severity: 'critical' },
  { product: 'Battery Pack 48V', remaining: 9, severity: 'warning' },
  { product: 'Smart Inverter', remaining: 18, severity: 'stable' },
  { product: 'Charge Controller', remaining: 6, severity: 'warning' },
];

const ProfitLoss = () => {
  const navigate = useNavigate();
  const [revenue, setRevenue] = useState(25000);
  const [expenses, setExpenses] = useState(17500);
  const [note, setNote] = useState('');

  const net = revenue - expenses;
  const margin = revenue > 0 ? ((net / revenue) * 100).toFixed(1) : '0.0';
  const status = net >= 0 ? 'Profit' : 'Loss';

  const totalProfit = pnlData.reduce((sum, month) => sum + Math.max(month.profit, 0), 0);
  const totalLoss = pnlData.reduce((sum, month) => sum + Math.max(month.expense - month.revenue, 0), 0);
  const totalSales = monthlySales.reduce((sum, month) => sum + month.orders, 0);

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Profit & Loss Hub</h1>
          <p className="text-slate-500">Track business revenue, expenses, net outcome, and margin health.</p>
        </div>
        <Button className="w-full sm:w-auto" variant="secondary" icon={BarChart3} onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
      </div>

      {note && <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">{note}</div>}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <GlassCard className="space-y-1">
          <p className="text-xs uppercase tracking-wide text-slate-500 font-semibold">Total Sales</p>
          <p className="text-2xl sm:text-3xl font-bold text-slate-900">{totalSales}</p>
          <p className="text-xs text-slate-500">Orders in 6 months</p>
        </GlassCard>
        <GlassCard className="space-y-1">
          <p className="text-xs uppercase tracking-wide text-slate-500 font-semibold">Total Profit</p>
          <p className="text-2xl sm:text-3xl font-bold text-green-600">₹{totalProfit.toLocaleString('en-IN')}</p>
          <p className="text-xs text-slate-500">Cumulative profit</p>
        </GlassCard>
        <GlassCard className="space-y-1">
          <p className="text-xs uppercase tracking-wide text-slate-500 font-semibold">Total Loss</p>
          <p className="text-2xl sm:text-3xl font-bold text-red-600">₹{totalLoss.toLocaleString('en-IN')}</p>
          <p className="text-xs text-slate-500">Cumulative loss</p>
        </GlassCard>
        <GlassCard className="space-y-1">
          <p className="text-xs uppercase tracking-wide text-slate-500 font-semibold">Net P&L</p>
          <p className={totalProfit - totalLoss >= 0 ? 'text-2xl sm:text-3xl font-bold text-primary' : 'text-2xl sm:text-3xl font-bold text-red-600'}>
            ₹{Math.abs(totalProfit - totalLoss).toLocaleString('en-IN')}
          </p>
          <p className="text-xs text-slate-500">Overall position</p>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-8">
        <GlassCard className="lg:col-span-1 space-y-4 sm:space-y-6">
          <div className="flex items-center gap-3 text-primary">
            <Calculator size={24} />
            <h3 className="text-xl font-bold">P&L Calculator</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">Monthly Revenue (₹)</label>
              <input 
                type="range" 
                min="10000" max="100000" step="500"
                value={revenue}
                onChange={(e) => setRevenue(Number(e.target.value))}
                className="w-full accent-primary"
              />
              <div className="flex justify-between text-xs font-bold text-slate-400 mt-1">
                <span>₹10,000</span>
                <span className="text-primary">₹{revenue.toLocaleString('en-IN')}</span>
                <span>₹1,00,000</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">Monthly Expenses (₹)</label>
              <input 
                type="range" 
                min="5000" max="90000" step="500"
                value={expenses}
                onChange={(e) => setExpenses(Number(e.target.value))}
                className="w-full accent-primary"
              />
              <div className="flex justify-between text-xs font-bold text-slate-400 mt-1">
                <span>₹5,000</span>
                <span className="text-primary">₹{expenses.toLocaleString('en-IN')}</span>
                <span>₹90,000</span>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-6 bg-primary/5 rounded-2xl sm:rounded-3xl border border-primary/10 space-y-2">
            <div className="text-sm text-slate-500 font-medium">Net {status}</div>
            <div className={net >= 0 ? 'text-3xl sm:text-4xl font-bold text-green-600 mt-1' : 'text-3xl sm:text-4xl font-bold text-red-600 mt-1'}>
              ₹{Math.abs(net).toLocaleString('en-IN')}
            </div>
            <div className="text-xs text-slate-500">Profit Margin: {margin}%</div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-2xl border border-slate-200 p-3 text-center">
              <TrendingUp size={18} className="mx-auto text-green-600" />
              <p className="text-xs text-slate-500 mt-1">Revenue</p>
              <p className="text-xs font-semibold">₹{revenue.toLocaleString('en-IN')}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-3 text-center">
              <TrendingDown size={18} className="mx-auto text-red-600" />
              <p className="text-xs text-slate-500 mt-1">Expense</p>
              <p className="text-xs font-semibold">₹{expenses.toLocaleString('en-IN')}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-3 text-center">
              <Wallet size={18} className="mx-auto text-primary" />
              <p className="text-xs text-slate-500 mt-1">Margin</p>
              <p className="text-xs font-semibold">{margin}%</p>
            </div>
          </div>

          <Button className="w-full" onClick={() => setNote(`P&L snapshot saved: Revenue ₹${revenue.toLocaleString('en-IN')} vs Expense ₹${expenses.toLocaleString('en-IN')}.`)}>Save P&L Snapshot <ArrowRight size={18} /></Button>
        </GlassCard>

        <GlassCard className="lg:col-span-2">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3 text-yellow-500">
              <BarChart3 size={24} />
              <h3 className="text-xl font-bold">Profit & Loss Trend</h3>
            </div>
            <div className="flex gap-2">
              <span className="flex items-center gap-1 text-xs font-bold text-slate-400">
                <div className="w-2 h-2 rounded-full bg-blue-500" /> Revenue
              </span>
              <span className="flex items-center gap-1 text-xs font-bold text-slate-400">
                <div className="w-2 h-2 rounded-full bg-red-400" /> Expense
              </span>
              <span className="flex items-center gap-1 text-xs font-bold text-slate-400">
                <div className="w-2 h-2 rounded-full bg-green-500" /> Profit
              </span>
            </div>
          </div>

          <div className="h-[280px] sm:h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={pnlData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'}}
                />
                <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} dot={{r: 5, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff'}} activeDot={{r: 7}} />
                <Line type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={3} dot={{r: 5, fill: '#ef4444', strokeWidth: 2, stroke: '#fff'}} activeDot={{r: 7}} />
                <Line type="monotone" dataKey="profit" stroke="#22c55e" strokeWidth={3} dot={{r: 5, fill: '#22c55e', strokeWidth: 2, stroke: '#fff'}} activeDot={{r: 7}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {[
          { title: 'Reduce fixed costs by 8-12%', icon: TrendingDown, color: 'bg-red-100 text-red-600' },
          { title: 'Increase high-margin offers', icon: TrendingUp, color: 'bg-green-100 text-green-600' },
          { title: 'Track weekly P&L check-ins', icon: Wallet, color: 'bg-blue-100 text-blue-600' }
        ].map((item, i) => (
          <GlassCard
            key={i}
            className="flex items-center gap-3 sm:gap-4 hover:scale-105 transition-transform cursor-pointer"
            onClick={() => setNote(`${item.title} plan activated for this month.`)}
          >
            <div className={cn("p-3 sm:p-4 rounded-2xl", item.color)}>
              <item.icon size={24} />
            </div>
            <div>
              <h4 className="font-bold">{item.title}</h4>
              <p className="text-xs text-slate-500">Tap to apply</p>
            </div>
          </GlassCard>
        ))}
      </div>

      <GlassCard className="space-y-4">
        <h3 className="text-xl font-bold">Stock Alerts</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {stockAlerts.map((item) => (
            <div key={item.product} className="rounded-2xl border border-slate-200 p-4 flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-800">{item.product}</p>
                <p className="text-xs text-slate-500 mt-1">Remaining stock: {item.remaining}</p>
              </div>
              <span
                className={
                  item.severity === 'critical'
                    ? 'rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-600'
                    : item.severity === 'warning'
                      ? 'rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-600'
                      : 'rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-600'
                }
              >
                {item.severity}
              </span>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
};

import { cn } from '@/lib/utils';
export default ProfitLoss;
 
