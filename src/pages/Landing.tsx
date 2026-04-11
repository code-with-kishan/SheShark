import React from 'react';
import { ArrowRight, Download, Shield, Zap, Heart, MessageSquare, ShoppingBag, Coins, Bot, Mic } from 'lucide-react';
import { Button, GlassCard } from '@/components/UI';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '@/store/useStore';

const featureCards = [
  {
    icon: Zap,
    title: 'Energy Hub',
    desc: 'Track energy, savings, and clean business growth with lightweight tools.',
  },
  {
    icon: Shield,
    title: 'Safety Tools',
    desc: 'Panic support, safer routes, and emergency access in one place.',
  },
  {
    icon: Heart,
    title: 'Health Support',
    desc: 'Mood tracking and health learning modules for daily wellbeing.',
  },
  {
    icon: MessageSquare,
    title: 'AI Assistant',
    desc: 'Get business and wellness guidance with multilingual AI support.',
  },
  {
    icon: ShoppingBag,
    title: 'Marketplace',
    desc: 'Explore products and 3D model-enabled listings from trusted sellers.',
  },
  {
    icon: Coins,
    title: 'Funding Access',
    desc: 'Find grants, opportunities, and practical resources to scale faster.',
  },
];

const Landing = () => {
  const navigate = useNavigate();
  const { setIsVoicePanelOpen } = useStore();

  return (
    <div className="min-h-screen px-3 sm:px-6 pb-16">
      <section className="mx-auto max-w-6xl text-center pt-8 sm:pt-12">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-primary">
          <Zap size={14} /> Women-led clean energy ecosystem
        </div>

        <h1 className="mt-6 text-2xl font-black leading-tight sm:text-4xl md:text-6xl">
          Build safer, smarter,
          <span className="gradient-text"> faster businesses</span>
        </h1>

        <p className="mx-auto mt-4 sm:mt-6 max-w-2xl text-base sm:text-lg text-slate-600">
          SheShark gives women entrepreneurs one stable platform for AI support, marketplace, safety, and growth.
        </p>

        <div className="mt-6 sm:mt-10 flex flex-col gap-3 sm:flex-wrap sm:items-center sm:justify-center sm:gap-4">
          <Button onClick={() => navigate('/login')} className="w-full sm:w-auto px-6 sm:px-10 py-3 sm:py-4 text-sm sm:text-base">
            Start Now <ArrowRight size={18} />
          </Button>
          <button
            type="button"
            onClick={() => setIsVoicePanelOpen(true)}
            className="sm:hidden w-full flex items-center justify-center gap-2 rounded-full bg-primary text-white px-6 py-3 text-sm font-semibold shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all"
          >
            Voice Assistant <Mic size={18} />
          </button>
          <Button variant="secondary" onClick={() => navigate('/ai')} className="w-full sm:w-auto px-6 sm:px-10 py-3 sm:py-4 text-sm sm:text-base">
            Open Chatbot <Bot size={18} />
          </Button>
          <a
            href="/Sheshark.apk"
            download
            className="inline-flex w-full justify-center items-center sm:w-auto gap-2 rounded-full border border-primary/20 bg-white px-6 sm:px-10 py-3 sm:py-4 font-semibold text-primary text-sm sm:text-base"
          >
            Download App <Download size={18} />
          </a>
        </div>
      </section>

      <section className="mx-auto mt-12 sm:mt-16 max-w-6xl">
        <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 xl:grid-cols-3">
          {featureCards.map((item) => (
            <GlassCard key={item.title} className="rounded-2xl border border-slate-100 bg-white p-4 sm:p-6 shadow-sm">
              <div className="mb-4 inline-flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <item.icon size={20} />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900">{item.title}</h3>
              <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-600">{item.desc}</p>
            </GlassCard>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-12 sm:mt-16 max-w-6xl">
        <GlassCard className="rounded-2xl sm:rounded-3xl border border-primary/20 bg-gradient-to-r from-primary/5 to-white p-4 sm:p-8 md:p-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold">Ready to launch with SheShark?</h2>
              <p className="mt-2 text-sm sm:text-base text-slate-600">Sign in, open your dashboard, and start building today.</p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-wrap sm:justify-end">
              <Button onClick={() => navigate('/login')} className="w-full sm:w-auto">Open Login</Button>
              <Button variant="secondary" onClick={() => navigate('/ai')} className="w-full sm:w-auto">
                Chat with AI <Bot size={16} />
              </Button>
              <Link to="/marketplace" className="btn-secondary px-6 py-3 text-sm text-center">
                Explore Marketplace
              </Link>
            </div>
          </div>
        </GlassCard>
      </section>

      <footer className="mx-auto mt-16 max-w-6xl border-t border-slate-200 pt-6 text-center text-xs text-slate-500">
        © 2026 SheShark. Lightweight performance mode enabled.
      </footer>
    </div>
  );
};

export default Landing;
 
