import React from 'react';
import { GlassCard, Button } from '@/components/UI';
import { Shield, Zap, Heart, MessageSquare, ShoppingBag, Coins, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const features = [
  {
    icon: Zap,
    title: 'Energy Hub',
    desc: 'Monitor clean-energy progress and business growth insights in one dashboard.',
  },
  {
    icon: Shield,
    title: 'Safety Tools',
    desc: 'SOS panic support, safer route guidance, and emergency assistance workflows.',
  },
  {
    icon: Heart,
    title: 'Health Support',
    desc: 'Mood tracking and wellness-focused learning modules tailored for women.',
  },
  {
    icon: MessageSquare,
    title: 'AI Assistant',
    desc: 'Offline-friendly assistant with platform knowledge, guidance, and team info.',
  },
  {
    icon: ShoppingBag,
    title: 'Marketplace + 3D',
    desc: 'Browse products, view 3D models, and manage .glb model-backed listings.',
  },
  {
    icon: Coins,
    title: 'Funding + Services',
    desc: 'Service monetization, bookings, and funding-oriented growth pathways.',
  },
];

const Features = () => {
  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold">Platform Features</h1>
        <p className="mt-2 text-slate-500">All key SheShark capabilities in one place.</p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {features.map((item) => (
          <GlassCard key={item.title} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <item.icon size={20} />
            </div>
            <h3 className="text-xl font-bold text-slate-900">{item.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.desc}</p>
          </GlassCard>
        ))}
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        <Link to="/marketplace">
          <Button>Open Marketplace <ArrowRight size={16} /></Button>
        </Link>
        <Link to="/community" className="btn-secondary px-6 py-3 text-sm">Open Community</Link>
      </div>
    </div>
  );
};

export default Features;
 
