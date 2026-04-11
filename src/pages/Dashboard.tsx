import React, { useState } from 'react';
import { GlassCard } from '@/components/UI';
import { 
  TrendingUp, 
  Users, 
  Zap, 
  ShoppingBag, 
  PackageCheck,
  Truck,
  RotateCcw,
  ArrowUpRight, 
  ArrowDownRight,
  Bell,
  Search,
  MessageSquare, 
  Coins, 
  Car,
  Target,
  Calendar,
  CheckCircle2
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

const StatCard = ({ title, value, change, icon: Icon, color }: any) => (
  <GlassCard className="flex flex-col gap-3 sm:gap-4">
    <div className="flex items-center justify-between">
      <div className={cn("p-2.5 sm:p-3 rounded-2xl", color)}>
        <Icon size={20} className="text-white sm:w-6 sm:h-6" />
      </div>
      <div className={cn("flex items-center gap-1 text-sm font-semibold", change > 0 ? "text-green-500" : "text-red-500")}>
        {change > 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
        {Math.abs(change)}%
      </div>
    </div>
    <div>
      <div className="text-slate-500 text-sm font-medium">{title}</div>
      <div className="text-2xl sm:text-3xl font-bold mt-1">{value}</div>
    </div>
  </GlassCard>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, role } = useStore();
  const isBusiness = role === 'business';
  const [notice, setNotice] = useState('');

  const stats = isBusiness
    ? [
        { title: 'Total Earnings', value: '$12,450', change: 12, icon: TrendingUp, color: 'bg-blue-500' },
        { title: 'New Customers', value: '1,240', change: -5, icon: Users, color: 'bg-purple-500' },
        { title: 'Energy Saved', value: '450 kWh', change: 24, icon: Zap, color: 'bg-yellow-500' },
        { title: 'Total Orders', value: '850', change: 8, icon: ShoppingBag, color: 'bg-pink-500' },
      ]
    : [
        { title: 'Orders Placed', value: '18', change: 6, icon: ShoppingBag, color: 'bg-blue-500' },
        { title: 'Savings This Month', value: '$320', change: 9, icon: Coins, color: 'bg-emerald-500' },
        { title: 'Safety Trips', value: '12', change: 4, icon: Car, color: 'bg-pink-500' },
        { title: 'Learning Streak', value: '7 days', change: 14, icon: Zap, color: 'bg-yellow-500' },
      ];

  const snapshotCards = isBusiness
    ? [
        { title: 'Today Orders', value: '24', note: '+8% vs yesterday' },
        { title: 'Active Leads', value: '46', note: '+5 new this morning' },
        { title: 'Pending Payouts', value: '$1,280', note: '2 settlements in queue' },
        { title: 'Safety Alerts', value: '0', note: 'All clear in last 24h' },
      ]
    : [
        { title: 'Open Orders', value: '3', note: '1 arriving today' },
        { title: 'Wishlist Items', value: '9', note: '2 deals expiring soon' },
        { title: 'Support Tickets', value: '1', note: 'AI support replied' },
        { title: 'Safety Alerts', value: '0', note: 'No issues reported' },
      ];

  const activities = isBusiness
    ? [
        { title: 'New booking request received', time: '10 mins ago', type: 'Services' },
        { title: 'Marketplace order marked delivered', time: '45 mins ago', type: 'Marketplace' },
        { title: 'Funding opportunity deadline updated', time: '2 hours ago', type: 'Funding' },
        { title: 'Community post got 24 new likes', time: '3 hours ago', type: 'Community' },
      ]
    : [
        { title: 'Your marketplace order has shipped', time: '18 mins ago', type: 'Marketplace' },
        { title: 'Safety route recommendation refreshed', time: '1 hour ago', type: 'Safety' },
        { title: 'AI assistant suggested new resources', time: '2 hours ago', type: 'AI' },
        { title: 'Learning module progress updated', time: '4 hours ago', type: 'Learning' },
      ];

  const goals = isBusiness
    ? [
        { label: 'Sales Goal', value: 72 },
        { label: 'Service Bookings', value: 58 },
        { label: 'Community Reach', value: 83 },
      ]
    : [
        { label: 'Monthly Savings', value: 64 },
        { label: 'Wellness Completion', value: 70 },
        { label: 'Safety Preparedness', value: 88 },
      ];

  const schedule = isBusiness
    ? [
        { time: '10:30 AM', item: 'Investor check-in call', done: true },
        { time: '1:00 PM', item: 'Service onboarding review', done: false },
        { time: '6:15 PM', item: 'Marketplace catalog update', done: false },
      ]
    : [
        { time: '9:00 AM', item: 'Check order tracking updates', done: true },
        { time: '2:00 PM', item: 'Complete wellness learning module', done: false },
        { time: '7:30 PM', item: 'Review safer commute route', done: false },
      ];

  const actionRoutes: Record<string, string> = {
    'Launch AI Advisor': '/ai',
    'Check Marketplace': '/marketplace',
    'Find Funding': '/funding',
    'Book Safety Taxi': '/taxi',
    'Browse Marketplace': '/marketplace',
    'Open Safety Tools': '/safety',
    'Chat with AI Support': '/ai',
    'Track Wellness': '/learning',
  };

  const customerOrders = [
    {
      id: 'SSK-10241',
      item: 'Solar LED Street Light Kit',
      status: 'Out for Delivery',
      eta: 'Arriving Today, 6:00 PM',
      price: '$149.00',
    },
    {
      id: 'SSK-10211',
      item: 'Rechargeable Power Bank 20000mAh',
      status: 'Delivered',
      eta: 'Delivered on Apr 4',
      price: '$42.00',
    },
    {
      id: 'SSK-10180',
      item: 'Women Safety Smart Alarm',
      status: 'Delivered',
      eta: 'Delivered on Apr 1',
      price: '$18.00',
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
        <div>
          <h1 className="text-2xl sm:text-4xl font-bold leading-tight">
            {isBusiness ? 'Business Dashboard' : 'Customer Dashboard'}, {user?.displayName?.split(' ')[0]}! 👋
          </h1>
          <p className="text-slate-500 mt-1">
            {isBusiness ? 'Here is what is happening with your business today.' : 'Here is your shopping, safety, and support overview today.'}
          </p>
        </div>
        <div className="flex w-full md:w-auto items-center gap-3 sm:gap-4">
          <div className="relative flex-1 md:flex-initial">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search anything..." 
              className="glass pl-12 pr-4 py-2.5 sm:py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 w-full md:w-64"
            />
          </div>
          <button
            type="button"
            onClick={() => setNotice('You are all caught up. No new notifications.')}
            className="glass p-2.5 sm:p-3 rounded-2xl text-slate-600 hover:text-primary relative"
          >
            <Bell size={22} />
            <span className="absolute top-3 right-3 w-2 h-2 bg-primary rounded-full border-2 border-white"></span>
          </button>
        </div>
      </div>

      {notice && <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">{notice}</div>}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat) => (
          <StatCard key={stat.title} title={stat.title} value={stat.value} change={stat.change} icon={stat.icon} color={stat.color} />
        ))}
      </div>

      {!isBusiness && (
        <GlassCard>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-xl font-bold">Your Orders</h3>
              <p className="text-sm text-slate-500 mt-1">Track orders, request replacement, and manage returns.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setNotice('Showing all your orders from the last 6 months.')}
                className="w-full sm:w-auto rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                View All Orders
              </button>
              <button
                type="button"
                onClick={() => navigate('/marketplace')}
                className="w-full sm:w-auto rounded-xl border border-primary/20 px-3 py-2 text-sm font-semibold text-primary hover:bg-primary/5"
              >
                Continue Shopping
              </button>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <p className="text-xs text-slate-500">Total Orders</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">18</p>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <p className="text-xs text-slate-500">In Transit</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">1</p>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <p className="text-xs text-slate-500">Replace / Return Window</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">2 Items</p>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {customerOrders.map((order) => (
              <div key={order.id} className="rounded-2xl border border-slate-100 p-4">
                <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{order.item}</p>
                    <p className="text-xs text-slate-500 mt-1">Order ID: {order.id} • {order.price}</p>
                    <p className="text-xs mt-1 text-slate-600">{order.status} • {order.eta}</p>
                  </div>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 xl:flex xl:flex-wrap">
                    <button
                      type="button"
                      onClick={() => setNotice(`Tracking details opened for ${order.id}.`)}
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      <Truck size={14} className="inline mr-1" /> Track
                    </button>
                    <button
                      type="button"
                      onClick={() => setNotice(`Replacement request started for ${order.id}.`)}
                      className="w-full rounded-xl border border-amber-200 px-3 py-2 text-xs font-semibold text-amber-700 hover:bg-amber-50"
                    >
                      <RotateCcw size={14} className="inline mr-1" /> Replace
                    </button>
                    <button
                      type="button"
                      onClick={() => setNotice(`Return/refund flow started for ${order.id}.`)}
                      className="w-full rounded-xl border border-emerald-200 px-3 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-50"
                    >
                      <PackageCheck size={14} className="inline mr-1" /> Return/Refund
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      )}

      {/* Lightweight Insights Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-8">
        <GlassCard className="lg:col-span-2">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold">Performance Snapshot</h3>
            <select className="bg-transparent text-slate-500 font-medium focus:outline-none">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {snapshotCards.map((item) => (
              <div key={item.title} className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
                <p className="text-sm text-slate-500">{item.title}</p>
                <p className="mt-1 text-2xl font-bold text-slate-900">{item.value}</p>
                <p className="mt-1 text-xs text-slate-500">{item.note}</p>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard>
          <h3 className="text-xl font-bold mb-8">Quick Actions</h3>
          <div className="space-y-4">
            {(
              isBusiness
                ? [
                    { label: 'Launch AI Advisor', icon: MessageSquare, color: 'bg-pink-100 text-pink-600' },
                    { label: 'Check Marketplace', icon: ShoppingBag, color: 'bg-blue-100 text-blue-600' },
                    { label: 'Find Funding', icon: Coins, color: 'bg-yellow-100 text-yellow-600' },
                    { label: 'Book Safety Taxi', icon: Car, color: 'bg-green-100 text-green-600' },
                  ]
                : [
                    { label: 'Browse Marketplace', icon: ShoppingBag, color: 'bg-blue-100 text-blue-600' },
                    { label: 'Open Safety Tools', icon: Car, color: 'bg-green-100 text-green-600' },
                    { label: 'Chat with AI Support', icon: MessageSquare, color: 'bg-pink-100 text-pink-600' },
                    { label: 'Track Wellness', icon: Zap, color: 'bg-yellow-100 text-yellow-600' },
                  ]
            ).map((action, i) => (
              <button
                key={i}
                type="button"
                onClick={() => navigate(actionRoutes[action.label] || '/dashboard')}
                className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-all group"
              >
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-8">
        <GlassCard className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold">Recent Activity</h3>
            <button
              type="button"
              onClick={() => setNotice('Activity stream refreshed.')}
              className="text-sm font-semibold text-primary"
            >
              Refresh
            </button>
          </div>
          <div className="space-y-3">
            {activities.map((item) => (
              <div key={item.title} className="flex items-center justify-between rounded-2xl border border-slate-100 p-4">
                <div>
                  <p className="font-semibold text-slate-800">{item.title}</p>
                  <p className="text-xs text-slate-500 mt-1">{item.time}</p>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">{item.type}</span>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard>
          <h3 className="text-xl font-bold mb-6">Weekly Targets</h3>
          <div className="space-y-4">
            {goals.map((goal) => (
              <div key={goal.label}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="font-medium text-slate-700">{goal.label}</span>
                  <span className="text-slate-500">{goal.value}%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100">
                  <div className="h-2 rounded-full bg-primary" style={{ width: `${goal.value}%` }} />
                </div>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setNotice('Target planner opened for this week.')}
            className="mt-6 w-full rounded-2xl border border-primary/20 px-4 py-3 text-sm font-semibold text-primary hover:bg-primary/5"
          >
            <Target size={16} className="inline mr-2" /> Plan Next Targets
          </button>
        </GlassCard>
      </div>

      <GlassCard>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold">Upcoming Schedule</h3>
          <button type="button" onClick={() => navigate('/community')} className="text-sm font-semibold text-primary">
            Open Community
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {schedule.map((slot) => (
            <div key={slot.time} className="rounded-2xl border border-slate-100 p-4">
              <p className="text-xs font-semibold text-slate-500 flex items-center gap-2">
                <Calendar size={14} /> {slot.time}
              </p>
              <p className="mt-2 font-semibold text-slate-800">{slot.item}</p>
              <p className={slot.done ? 'mt-2 text-xs text-green-600 flex items-center gap-1' : 'mt-2 text-xs text-amber-600 flex items-center gap-1'}>
                <CheckCircle2 size={14} /> {slot.done ? 'Completed' : 'Pending'}
              </p>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
};

export default Dashboard;
 
