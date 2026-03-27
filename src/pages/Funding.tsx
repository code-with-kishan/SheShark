import React from 'react';
import { GlassCard, Button } from '@/components/UI';
import { Coins, Bookmark, ExternalLink, Calendar, Users, Award } from 'lucide-react';

const grants = [
  {
    id: '1',
    title: 'Women in Solar Innovation Grant',
    provider: 'Global Energy Fund',
    amount: '$50,000',
    deadline: 'Oct 15, 2026',
    category: 'Innovation',
    desc: 'Supporting women-led startups developing breakthrough solar technologies.'
  },
  {
    id: '2',
    title: 'Clean Tech Seed Fund',
    provider: 'Sustainability Alliance',
    amount: '$25,000',
    deadline: 'Nov 30, 2026',
    category: 'Seed Funding',
    desc: 'Early-stage funding for sustainable business models in emerging markets.'
  },
  {
    id: '3',
    title: 'Renewable Energy Leadership Award',
    provider: 'SheShark Foundation',
    amount: '$10,000',
    deadline: 'Dec 10, 2026',
    category: 'Leadership',
    desc: 'Recognizing outstanding leadership in the renewable energy sector.'
  }
];

const Funding = () => {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Funding & Grants</h1>
          <p className="text-slate-500">Access exclusive financial opportunities for your business.</p>
        </div>
        <div className="flex gap-4">
          <Button variant="secondary" icon={Bookmark}>Saved Grants</Button>
          <Button icon={Plus}>Post Opportunity</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {grants.map((grant) => (
          <GlassCard key={grant.id} className="flex flex-col md:flex-row gap-8 items-start md:items-center">
            <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center text-primary shrink-0">
              <Coins size={32} />
            </div>
            
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-full">
                  {grant.category}
                </span>
                <span className="flex items-center gap-1 text-xs text-slate-400 font-medium">
                  <Calendar size={14} /> Deadline: {grant.deadline}
                </span>
              </div>
              <h3 className="text-2xl font-bold">{grant.title}</h3>
              <p className="text-slate-500 max-w-2xl">{grant.desc}</p>
              <div className="flex items-center gap-6 pt-2">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                  <Award size={18} className="text-primary" /> {grant.provider}
                </div>
                <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                  <Users size={18} className="text-primary" /> 150+ Applicants
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end gap-4 w-full md:w-auto">
              <div className="text-3xl font-bold text-primary">{grant.amount}</div>
              <Button className="w-full md:w-auto">Apply Now <ExternalLink size={18} /></Button>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};

import { Plus } from 'lucide-react';
export default Funding;
