import React from 'react';
import { GlassCard } from '@/components/UI';
import { 
  TrendingUp, 
  Users, 
  Zap, 
  ShoppingBag, 
  ArrowUpRight, 
  ArrowDownRight,
  Bell,
  Search,
  MessageSquare, 
  Coins, 
  Car
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { motion } from 'motion/react';
import { useStore } from '@/store/useStore';
import { cn } from '@/lib/utils';

const data = [
  { name: 'Mon', value: 400 },
  { name: 'Tue', value: 300 },
  { name: 'Wed', value: 600 },
  { name: 'Thu', value: 800 },
  { name: 'Fri', value: 500 },
  { name: 'Sat', value: 900 },
  { name: 'Sun', value: 700 },
];

const StatCard = ({ title, value, change, icon: Icon, color }: any) => (
  <GlassCard className="flex flex-col gap-4">
    <div className="flex items-center justify-between">
      <div className={cn("p-3 rounded-2xl", color)}>
        <Icon size={24} className="text-white" />
      </div>
      <div className={cn("flex items-center gap-1 text-sm font-semibold", change > 0 ? "text-green-500" : "text-red-500")}>
        {change > 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
        {Math.abs(change)}%
      </div>
    </div>
    <div>
      <div className="text-slate-500 text-sm font-medium">{title}</div>
      <div className="text-3xl font-bold mt-1">{value}</div>
    </div>
  </GlassCard>
);

const Dashboard = () => {
  const { user } = useStore();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold">Welcome back, {user?.displayName?.split(' ')[0]}! 👋</h1>
          <p className="text-slate-500 mt-1">Here's what's happening with your business today.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search anything..." 
              className="glass pl-12 pr-6 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 w-64"
            />
          </div>
          <button className="glass p-3 rounded-2xl text-slate-600 hover:text-primary relative">
            <Bell size={22} />
            <span className="absolute top-3 right-3 w-2 h-2 bg-primary rounded-full border-2 border-white"></span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Earnings" value="$12,450" change={12} icon={TrendingUp} color="bg-blue-500" />
        <StatCard title="New Customers" value="1,240" change={-5} icon={Users} color="bg-purple-500" />
        <StatCard title="Energy Saved" value="450 kWh" change={24} icon={Zap} color="bg-yellow-500" />
        <StatCard title="Total Orders" value="850" change={8} icon={ShoppingBag} color="bg-pink-500" />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <GlassCard className="lg:col-span-2">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold">Revenue Growth</h3>
            <select className="bg-transparent text-slate-500 font-medium focus:outline-none">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'}}
                />
                <Area type="monotone" dataKey="value" stroke="var(--color-primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard>
          <h3 className="text-xl font-bold mb-8">Quick Actions</h3>
          <div className="space-y-4">
            {[
              { label: 'Launch AI Advisor', icon: MessageSquare, color: 'bg-pink-100 text-pink-600' },
              { label: 'Check Marketplace', icon: ShoppingBag, color: 'bg-blue-100 text-blue-600' },
              { label: 'Find Funding', icon: Coins, color: 'bg-yellow-100 text-yellow-600' },
              { label: 'Book Safety Taxi', icon: Car, color: 'bg-green-100 text-green-600' },
            ].map((action, i) => (
              <button key={i} className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-all group">
                <div className={cn("p-3 rounded-xl transition-transform group-hover:scale-110", action.color)}>
                  <action.icon size={20} />
                </div>
                <span className="font-semibold text-slate-700">{action.label}</span>
                <ArrowUpRight size={18} className="ml-auto text-slate-400" />
              </button>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default Dashboard;
