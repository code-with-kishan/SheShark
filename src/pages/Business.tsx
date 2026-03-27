import React from 'react';
import { GlassCard, Button } from '@/components/UI';
import { Briefcase, Plus, TrendingUp, Package, DollarSign, Settings } from 'lucide-react';

const Business = () => {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Business</h1>
          <p className="text-slate-500">Manage your products, orders, and growth.</p>
        </div>
        <Button icon={Plus}>Add New Product</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <GlassCard className="lg:col-span-3">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold">Recent Orders</h3>
            <Button variant="ghost">View All</Button>
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
            <div className="text-3xl font-bold mt-1">$4,850.00</div>
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
        </div>
      </div>
    </div>
  );
};

import { cn } from '@/lib/utils';
import { Users } from 'lucide-react';
export default Business;
