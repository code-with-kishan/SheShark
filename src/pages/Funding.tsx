import React, { useState } from 'react';
import { GlassCard, Button } from '@/components/UI';
import { Coins, Bookmark, ExternalLink, Calendar, Users, Award, Plus } from 'lucide-react';

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
  const [notice, setNotice] = useState('');
  const [savedGrantIds, setSavedGrantIds] = useState<string[]>([]);

  const handleApply = (grantTitle: string) => {
    const query = encodeURIComponent(`${grantTitle} application`);
    window.open(`https://www.google.com/search?q=${query}`, '_blank', 'noopener,noreferrer');
  };

  const toggleSave = (grantId: string) => {
    setSavedGrantIds((prev) =>
      prev.includes(grantId) ? prev.filter((id) => id !== grantId) : [...prev, grantId]
    );
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Funding & Grants</h1>
          <p className="text-slate-500">Access exclusive financial opportunities for your business.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 w-full sm:w-auto">
          <Button className="w-full" variant="secondary" icon={Bookmark} onClick={() => setNotice('Saved grants feature is active. Bookmarking sync will be added to backend next.')}>Saved Grants</Button>
          <Button className="w-full" icon={Plus} onClick={() => setNotice('Post Opportunity form opened in roadmap mode. Backend publish hook can be enabled next.')}>Post Opportunity</Button>
        </div>
      </div>

      {notice && <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">{notice}</div>}

      <div className="grid grid-cols-1 gap-4 sm:gap-6">
        {grants.map((grant) => (
          <GlassCard
            key={grant.id}
            className="flex flex-col md:flex-row gap-4 sm:gap-8 items-start md:items-center cursor-pointer hover:border-primary/20"
            onClick={() => setNotice(`Opened ${grant.title} details.`)}
          >
            <div className="w-14 h-14 sm:w-20 sm:h-20 bg-primary/10 rounded-2xl sm:rounded-3xl flex items-center justify-center text-primary shrink-0">
              <Coins size={24} className="sm:w-8 sm:h-8" />
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
              <h3 className="text-xl sm:text-2xl font-bold leading-tight">{grant.title}</h3>
              <p className="text-slate-500 max-w-2xl">{grant.desc}</p>
              <div className="flex flex-wrap items-center gap-3 sm:gap-6 pt-2">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                  <Award size={18} className="text-primary" /> {grant.provider}
                </div>
                <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                  <Users size={18} className="text-primary" /> 150+ Applicants
                </div>
              </div>
            </div>

            <div className="flex flex-col items-start md:items-end gap-3 sm:gap-4 w-full md:w-auto">
              <div className="text-2xl sm:text-3xl font-bold text-primary">{grant.amount}</div>
              <div className="flex w-full md:w-auto gap-2">
                <Button
                  className="flex-1 md:flex-none"
                  variant={savedGrantIds.includes(grant.id) ? 'primary' : 'secondary'}
                  onClick={(event) => {
                    event.stopPropagation();
                    toggleSave(grant.id);
                    setNotice(savedGrantIds.includes(grant.id) ? 'Removed from saved grants.' : 'Grant saved successfully.');
                  }}
                >
                  {savedGrantIds.includes(grant.id) ? 'Saved' : 'Save'}
                </Button>
                <Button
                  className="flex-1 md:flex-none"
                  onClick={(event) => {
                    event.stopPropagation();
                    handleApply(grant.title);
                  }}
                >
                  Apply Now <ExternalLink size={18} />
                </Button>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};
export default Funding;
