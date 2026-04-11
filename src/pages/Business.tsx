import React, { useState } from 'react';
import { GlassCard, Button } from '@/components/UI';
import { Briefcase, Plus, TrendingUp, Package, DollarSign, Settings, AlertTriangle, BarChart3, Truck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Business = () => {
  const navigate = useNavigate();
  const [notice, setNotice] = useState('');

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">My Business</h1>
          <p className="text-slate-500">Manage your products, orders, and growth.</p>
        </div>
        <Button icon={Plus} className="w-full sm:w-auto" onClick={() => navigate('/marketplace')}>Add New Product</Button>
      </div>

      {notice && <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">{notice}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
        <GlassCard className="lg:col-span-3">
          <div className="flex items-center justify-between mb-5 sm:mb-8">
            <h3 className="text-xl font-bold">Recent Orders</h3>
            <Button variant="ghost" onClick={() => navigate('/marketplace')}>View All</Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-slate-400 text-sm border-b border-slate-100">
                  <th className="pb-4 font-semibold">Order ID</th>
                  <th className="pb-4 font-semibold">Customer</th>
                  <th className="pb-4 font-semibold">Product</th>
                  <th className="pb-4 font-semibold">Amount</th>
                  <th className="pb-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {[
                  { id: '#8492', customer: 'Alice Johnson', product: 'Solar Kit', amount: '$1,200', status: 'Delivered' },
                  { id: '#8491', customer: 'Emma Smith', product: 'Battery Pack', amount: '$450', status: 'Processing' },
                  { id: '#8490', customer: 'Maria Garcia', product: 'Inverter Pro', amount: '$800', status: 'Shipped' },
                ].map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 font-bold text-slate-700">{order.id}</td>
                    <td className="py-4 text-slate-600">{order.customer}</td>
                    <td className="py-4 text-slate-600">{order.product}</td>
                    <td className="py-4 font-bold text-primary">{order.amount}</td>
                    <td className="py-4">
                      <span className={cn(
                        "px-3 py-1 rounded-full text-xs font-bold",
                        order.status === 'Delivered' ? "bg-green-100 text-green-600" :
                        order.status === 'Processing' ? "bg-blue-100 text-blue-600" : "bg-yellow-100 text-yellow-600"
                      )}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>

        <div className="space-y-6">
          <GlassCard className="bg-gradient-to-br from-primary to-primary-dark text-white">
            <div className="flex items-center justify-between mb-4">
              <DollarSign size={24} />
              <TrendingUp size={20} />
            </div>
            <div className="text-sm font-medium opacity-80">Monthly Revenue</div>
            <div className="text-2xl sm:text-3xl font-bold mt-1">$4,850.00</div>
            <div className="mt-4 text-xs font-bold bg-white/20 inline-block px-2 py-1 rounded">
              +15% from last month
            </div>
          </GlassCard>

          <GlassCard>
            <h3 className="font-bold mb-4">Quick Stats</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Package size={18} className="text-slate-400" />
                  <span className="text-sm font-medium text-slate-600">Active Products</span>
                </div>
                <span className="font-bold">24</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Users size={18} className="text-slate-400" />
                  <span className="text-sm font-medium text-slate-600">Total Customers</span>
                </div>
                <span className="font-bold">1,420</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Settings size={18} className="text-slate-400" />
                  <span className="text-sm font-medium text-slate-600">Store Status</span>
                </div>
                <span className="text-xs font-bold text-green-500">ONLINE</span>
              </div>
            </div>
          </GlassCard>

          <GlassCard>
            <h3 className="font-bold mb-4">Quick Tools</h3>
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => navigate('/funding')}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-left hover:bg-slate-50"
              >
                <BarChart3 size={16} className="inline mr-2 text-primary" /> Open Funding Insights
              </button>
              <button
                type="button"
                onClick={() => navigate('/services')}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-left hover:bg-slate-50"
              >
                <Briefcase size={16} className="inline mr-2 text-primary" /> Manage Service Listings
              </button>
              <button
                type="button"
                onClick={() => setNotice('Logistics module opened in demo mode.')}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-left hover:bg-slate-50"
              >
                <Truck size={16} className="inline mr-2 text-primary" /> Track Deliveries
              </button>
            </div>
          </GlassCard>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <GlassCard>
          <h3 className="text-xl font-bold mb-4">Inventory Alerts</h3>
          <div className="space-y-3">
            {[
              { name: 'Solar Kit X1', qty: 4, severity: 'high' },
              { name: 'Battery Pack 48V', qty: 9, severity: 'medium' },
              { name: 'Inverter Pro', qty: 12, severity: 'low' },
            ].map((item) => (
              <div key={item.name} className="flex items-center justify-between rounded-2xl border border-slate-100 p-3">
                <div>
                  <p className="font-semibold text-slate-800">{item.name}</p>
                  <p className="text-xs text-slate-500">Available: {item.qty}</p>
                </div>
                <span className={item.severity === 'high' ? 'text-xs font-bold text-red-600' : item.severity === 'medium' ? 'text-xs font-bold text-amber-600' : 'text-xs font-bold text-green-600'}>
                  <AlertTriangle size={14} className="inline mr-1" /> {item.severity}
                </span>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard>
          <h3 className="text-xl font-bold mb-4">Top Products</h3>
          <div className="space-y-3">
            {[
              { name: 'Solar Kit', sales: 124, revenue: '₹2,40,000' },
              { name: 'Battery Pack', sales: 96, revenue: '₹1,72,000' },
              { name: 'Inverter Pro', sales: 74, revenue: '₹1,38,000' },
            ].map((item) => (
              <button
                type="button"
                key={item.name}
                onClick={() => navigate('/marketplace')}
                className="w-full rounded-2xl border border-slate-100 p-3 text-left hover:bg-slate-50"
              >
                <p className="font-semibold text-slate-800">{item.name}</p>
                <p className="text-xs text-slate-500 mt-1">Sales: {item.sales} • Revenue: {item.revenue}</p>
              </button>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

import { cn } from '@/lib/utils';
import { Users } from 'lucide-react';
export default Business;
 
