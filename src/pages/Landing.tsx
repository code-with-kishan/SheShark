import React from 'react';
import { motion } from 'motion/react';
import { Button, GlassCard } from '@/components/UI';
import { 
  Download, 
  ArrowRight, 
  Shield, 
  Zap, 
  Heart, 
  Globe, 
  CheckCircle2, 
  MessageSquare, 
  ShoppingBag, 
  Coins, 
  Users, 
  Star,
  ChevronRight,
  PlayCircle,
  HelpCircle
} from 'lucide-react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { useNavigate, Link } from 'react-router-dom';

const Landing = () => {
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="relative overflow-hidden">
      {/* 1. Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto w-full relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-bold text-xs uppercase tracking-widest mb-8 border border-primary/20"
            >
              <Zap size={14} className="fill-current" /> Empowering Women in Clean Energy
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 50, rotateX: -45 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="hero-title text-4xl sm:text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[1.1] uppercase"
            >
              The Future <br />
              <span className="gradient-text">is Female</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-lg md:text-2xl text-muted max-w-2xl mx-auto mb-12 font-medium leading-relaxed"
            >
              SheShark is the premier ecosystem for women to lead the sustainable revolution. Build, scale, and thrive with AI-driven insights.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap items-center justify-center gap-4"
            >
              <Button onClick={() => navigate('/login')} className="text-lg px-12 py-5 shadow-2xl shadow-primary/40">
                Get Started <ArrowRight size={20} />
              </Button>
              <a href="/Sheshark.apk" download className="glass px-12 py-5 rounded-full font-bold text-primary hover:bg-primary/5 transition-all flex items-center gap-2">
                Download App <Download size={20} />
              </a>
            </motion.div>
          </div>
        </div>

        {/* Decorative Background Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
              x: [0, 50, 0],
              y: [0, -50, 0]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px]"
          />
          <motion.div 
            animate={{ 
              scale: [1, 1.3, 1],
              rotate: [0, -90, 0],
              x: [0, -50, 0],
              y: [0, 50, 0]
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-primary-light/10 rounded-full blur-[150px]"
          />
          
          {/* Floating Glass Cards for Hero */}
          <motion.div 
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 1 }}
            className="absolute top-[20%] left-[5%] hidden xl:block"
          >
            <GlassCard className="w-64 rotate-[-6deg] border-primary/20">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center text-primary">
                  <Zap size={20} />
                </div>
                <div className="font-bold text-sm">Energy Analytics</div>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "75%" }}
                  transition={{ delay: 1, duration: 2 }}
                  className="h-full bg-primary"
                />
              </div>
            </GlassCard>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="absolute bottom-[20%] right-[5%] hidden xl:block"
          >
            <GlassCard className="w-64 rotate-[6deg] border-primary/20">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-pink-100 rounded-xl flex items-center justify-center text-pink-500">
                  <Heart size={20} />
                </div>
                <div className="font-bold text-sm">Health AI</div>
              </div>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className={`h-4 w-full rounded-sm ${i <= 4 ? 'bg-pink-400' : 'bg-pink-100'}`} />
                ))}
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </section>

      {/* 2. Features Grid */}
      <section id="features" className="py-24 px-6 bg-slate-50/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Everything You Need to Succeed</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">A comprehensive suite of tools designed specifically for the modern woman entrepreneur.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Zap, title: "Energy Hub", desc: "Advanced solar analytics and savings calculators for your green business." },
              { icon: Shield, title: "Safety First", desc: "Integrated SOS and women-only taxi services for complete peace of mind." },
              { icon: Heart, title: "Health AI", desc: "Personalized wellness and health support powered by advanced AI." },
              { icon: MessageSquare, title: "AI Advisor", desc: "24/7 business strategy and clean energy insights at your fingertips." },
              { icon: ShoppingBag, title: "Marketplace", desc: "Connect with women-led brands and source premium solar equipment." },
              { icon: Coins, title: "Funding Access", desc: "Direct access to grants, schemes, and investment opportunities." }
            ].map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass p-8 rounded-3xl hover:scale-105 transition-transform cursor-default"
              >
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6">
                  <f.icon size={28} />
                </div>
                <h3 className="text-2xl font-bold mb-4">{f.title}</h3>
                <p className="text-slate-600 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* QR Code Download Section */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="mt-16 glass p-10 rounded-[3rem] flex flex-col md:flex-row items-center justify-between gap-12 bg-gradient-to-br from-primary/5 to-transparent border-primary/20"
          >
            <div className="max-w-xl text-center md:text-left">
              <h3 className="text-3xl font-bold mb-4">Get the SheShark App</h3>
              <p className="text-slate-600 text-lg mb-6">
                Take the power of SheShark with you wherever you go. Scan the QR code to download our mobile application and start leading the revolution today.
              </p>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <a href="/Sheshark.apk" download className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors">
                  <Download size={18} />
                  <span className="text-sm font-medium">Android APK</span>
                </a>
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-400 rounded-xl cursor-not-allowed">
                  <Download size={18} />
                  <span className="text-sm font-medium italic">iOS (Coming Soon)</span>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-3xl shadow-2xl shadow-primary/20 border-4 border-primary/10">
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(window.location.origin + '/Sheshark.apk')}`} 
                alt="Download QR Code"
                className="w-44 h-44"
                referrerPolicy="no-referrer"
              />
              <div className="mt-4 text-center text-xs font-bold text-primary uppercase tracking-widest">
                Scan to Download
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3. Stats Section */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto glass rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden">
          <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-12">
            {[
              { label: "Active Users", value: "50K+" },
              { label: "Energy Saved", value: "1.2MW" },
              { label: "Businesses", value: "5K+" },
              { label: "Safety SOS", value: "24/7" }
            ].map((s, i) => (
              <div key={i}>
                <div className="text-4xl md:text-5xl font-bold gradient-text mb-2">{s.value}</div>
                <div className="text-slate-500 font-medium">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. About SheShark (Mission) */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-6">Our mission: <span className="text-primary">Powering equality</span></h2>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              We believe that the transition to clean energy is the greatest opportunity for economic empowerment in history. SheShark was founded to ensure that women aren't just participants in this revolution, but leaders.
            </p>
            <div className="space-y-4">
              {[
                "Bridging the gender gap in clean energy",
                "Providing accessible AI-driven business tools",
                "Ensuring physical and digital safety for women",
                "Creating a global network of female innovators"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle2 className="text-primary" size={24} />
                  <span className="font-semibold text-slate-700">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-square rounded-[3rem] overflow-hidden shadow-2xl bg-white flex items-center justify-center p-8 border border-slate-100">
              <img 
                src="https://cdni.iconscout.com/illustration/premium/thumb/female-developer-working-on-laptop-illustration-svg-download-png-11313929.png" 
                alt="Female developer working" 
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-10 -left-10 glass p-8 rounded-3xl shadow-xl hidden md:block">
              <div className="text-3xl font-bold text-primary">98%</div>
              <div className="text-sm text-slate-500 font-medium">User Satisfaction Rate</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 5. How It Works */}
      <section className="py-24 px-6 bg-slate-50/50">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-16">Your Journey with SheShark</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Join", desc: "Create your profile and join the global community." },
              { step: "02", title: "Learn", desc: "Access expert courses on solar and business." },
              { step: "03", title: "Build", desc: "Use our AI tools to launch your energy business." },
              { step: "04", title: "Scale", desc: "Connect with funders and grow your impact." }
            ].map((s, i) => (
              <div key={i} className="relative">
                <div className="text-6xl font-bold text-primary/10 mb-4">{s.step}</div>
                <h3 className="text-2xl font-bold mb-2">{s.title}</h3>
                <p className="text-slate-500">{s.desc}</p>
                {i < 3 && <ChevronRight className="absolute top-8 -right-4 text-primary/20 hidden md:block" size={32} />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. AI Tools Showcase */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto glass rounded-[3rem] p-12 md:p-20 bg-gradient-to-br from-primary/5 to-transparent">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-white mb-8 shadow-lg shadow-primary/30">
                <MessageSquare size={32} />
              </div>
              <h2 className="text-4xl font-bold mb-6">Meet Your AI <span className="text-primary">Co-Pilot</span></h2>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                Our advanced AI models are trained specifically on clean energy markets and women's health data. Whether you need a business strategy or a wellness plan, SheShark AI is here 24/7.
              </p>
              <div className="flex gap-4">
                <Button onClick={() => navigate('/ai')}>Try AI Advisor</Button>
                <Button variant="secondary">Watch Demo</Button>
              </div>
            </div>
            <div className="space-y-6">
              <GlassCard className="translate-x-4">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white shrink-0">
                    <Star size={20} />
                  </div>
                  <div>
                    <div className="font-bold mb-1">Business Strategy</div>
                    <p className="text-sm text-slate-500">"How can I optimize my solar panel distribution in rural areas?"</p>
                  </div>
                </div>
              </GlassCard>
              <GlassCard className="-translate-x-4">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-pink-400 flex items-center justify-center text-white shrink-0">
                    <Heart size={20} />
                  </div>
                  <div>
                    <div className="font-bold mb-1">Health Support</div>
                    <p className="text-sm text-slate-500">"Create a 15-minute wellness routine for a busy entrepreneur."</p>
                  </div>
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Energy Hub Preview */}
      <section className="py-24 px-6 bg-slate-900 text-white overflow-hidden relative">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-6">Smart <span className="text-primary">Energy</span> Analytics</h2>
            <p className="text-lg text-white/60 mb-8 leading-relaxed">
              Track your solar production, calculate your carbon offset, and optimize your energy consumption with our state-of-the-art dashboard.
            </p>
            <ul className="space-y-4 mb-8">
              {["Real-time production monitoring", "ROI & Payback calculators", "Carbon footprint tracking"].map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <Zap className="text-primary" size={20} />
                  <span className="font-medium">{item}</span>
                </li>
              ))}
            </ul>
            <Button onClick={() => navigate('/energy')} className="bg-white text-slate-900 hover:bg-slate-100">Explore Energy Hub</Button>
          </motion.div>
          <div className="relative">
            <div className="glass-dark p-8 rounded-[2rem] border-white/10">
              <div className="h-64 bg-gradient-to-t from-primary/20 to-transparent rounded-2xl flex items-end p-6">
                <div className="w-full flex justify-between items-end gap-2">
                  {[40, 70, 45, 90, 65, 80, 55].map((h, i) => (
                    <motion.div 
                      key={i}
                      initial={{ height: 0 }}
                      whileInView={{ height: `${h}%` }}
                      className="w-full bg-primary rounded-t-lg"
                    />
                  ))}
                </div>
              </div>
              <div className="mt-6 flex justify-between text-white/40 text-xs font-bold uppercase tracking-widest">
                <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
      </section>

      {/* 8. Marketplace Preview */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">The SheShark <span className="text-primary">Marketplace</span></h2>
          <p className="text-slate-500">Source the best equipment and support women-led businesses.</p>
        </div>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            { name: "Microtek Inverter", price: "₹11,800", img: "https://m.media-amazon.com/images/I/31MsUvPF-CS._AC_UY436_FMwebp_QL65_.jpg" },
            { name: "Exide Solar Battery", price: "₹14,102", img: "https://m.media-amazon.com/images/I/51KXnETjtgL._SX679_.jpg" },
            { name: "Solarverter Hybrid", price: "₹29,999", img: "https://m.media-amazon.com/images/I/61+syISwrCL._SL1210_.jpg" },
            { name: "Solar Flood Light", price: "₹4,400", img: "https://m.media-amazon.com/images/I/71vlWKh6ayL._SX679_.jpg" }
          ].map((p, i) => (
            <GlassCard key={i} className="p-0 overflow-hidden group cursor-pointer flex flex-col">
              <div className="h-48 overflow-hidden bg-white p-4">
                <img 
                  src={p.img} 
                  alt={p.name} 
                  className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" 
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-6 mt-auto">
                <h4 className="font-bold mb-1 truncate">{p.name}</h4>
                <div className="text-primary font-bold">{p.price}</div>
              </div>
            </GlassCard>
          ))}
        </div>
        <div className="text-center mt-12">
          <Button variant="secondary" onClick={() => navigate('/marketplace')}>Visit Marketplace <ArrowRight size={18} /></Button>
        </div>
      </section>

      {/* 9. Community Preview */}
      <section className="py-24 px-6 bg-primary/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1 grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="aspect-square rounded-3xl bg-primary/10 flex items-center justify-center text-primary">
                <Users size={48} />
              </div>
              <div className="aspect-square rounded-3xl bg-pink-100 flex items-center justify-center text-pink-500">
                <Heart size={48} />
              </div>
            </div>
            <div className="space-y-4 pt-8">
              <div className="aspect-square rounded-3xl bg-violet-100 flex items-center justify-center text-violet-500">
                <Globe size={48} />
              </div>
              <div className="aspect-square rounded-3xl bg-primary/20 flex items-center justify-center text-primary">
                <Zap size={48} />
              </div>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <h2 className="text-4xl font-bold mb-6">A Global <span className="text-primary">Sisterhood</span></h2>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              Don't build alone. Connect with thousands of women entrepreneurs around the world. Share insights, find partners, and celebrate your wins together.
            </p>
            <div className="flex items-center gap-4 mb-8">
              <div className="flex -space-x-4">
                {[1, 2, 3, 4, 5].map(i => (
                  <img key={i} src={`https://ui-avatars.com/api/?name=User+${i}&background=random`} className="w-12 h-12 rounded-full border-4 border-white" alt="User" />
                ))}
              </div>
              <div className="text-sm font-bold text-slate-500">+50,000 members</div>
            </div>
            <Button onClick={() => navigate('/community')}>Join the Community</Button>
          </div>
        </div>
      </section>

      {/* 10. Testimonials */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Loved by <span className="text-primary">Entrepreneurs</span></h2>
          <p className="text-slate-500">Real stories from women powering the future.</p>
        </div>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { name: "Sarah Jenkins", role: "Solar Startup Founder", text: "SheShark changed everything for me. The AI advisor helped me refine my business plan in days, not months." },
            { name: "Linda M.", role: "Clean Tech Investor", text: "The most comprehensive platform I've seen for women in energy. The funding module is a game-changer." },
            { name: "Priya Sharma", role: "Energy Consultant", text: "I feel so much safer working on-site knowing I have the SOS feature and verified taxi services at my disposal." }
          ].map((t, i) => (
            <GlassCard key={i} className="flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex text-yellow-400">
                  {[1, 2, 3, 4, 5].map(j => <Star key={j} size={16} fill="currentColor" />)}
                </div>
                <p className="text-slate-600 italic">"{t.text}"</p>
              </div>
              <div className="mt-8 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                  {t.name[0]}
                </div>
                <div>
                  <div className="font-bold">{t.name}</div>
                  <div className="text-xs text-slate-400">{t.role}</div>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* 11. FAQ */}
      <section className="py-24 px-6 bg-slate-50/50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-slate-500">Everything you need to know about SheShark.</p>
          </div>
          <div className="space-y-4">
            {[
              { q: "Is SheShark only for women?", a: "Yes, SheShark is specifically designed to empower women entrepreneurs in the clean energy sector, providing a safe and supportive ecosystem." },
              { q: "How does the AI Advisor work?", a: "Our AI uses advanced LLMs trained on clean energy and business data to provide real-time strategic advice tailored to your specific needs." },
              { q: "Is the safety module available globally?", a: "The SOS feature works globally, while the verified taxi service is currently rolling out in major clean energy hubs." }
            ].map((f, i) => (
              <GlassCard key={i} className="p-6">
                <h4 className="font-bold mb-2 flex items-center gap-2">
                  <HelpCircle className="text-primary" size={20} /> {f.q}
                </h4>
                <p className="text-slate-600 text-sm">{f.a}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* 12. Footer */}
      <footer className="py-20 px-6 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <img 
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663171441121/2KBq9fLXuEdZ49RpGeTHqX/sheshark-icon-Rrb6RfnX2Hdhp7NQQUGwTz.png" 
                alt="SheShark Logo" 
                className="w-10 h-10 object-contain"
                referrerPolicy="no-referrer"
              />
              <span className="text-2xl font-bold text-white">SheShark</span>
            </div>
            <p className="text-white/40 text-sm leading-relaxed">
              Empowering the next generation of women leaders in the clean energy revolution. Built for impact, designed for equality.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-6">Platform</h4>
            <ul className="space-y-4 text-white/60 text-sm">
              <li><Link to="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link></li>
              <li><Link to="/ai" className="hover:text-primary transition-colors">AI Assistant</Link></li>
              <li><Link to="/marketplace" className="hover:text-primary transition-colors">Marketplace</Link></li>
              <li><Link to="/energy" className="hover:text-primary transition-colors">Energy Hub</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6">Community</h4>
            <ul className="space-y-4 text-white/60 text-sm">
              <li><Link to="/community" className="hover:text-primary transition-colors">Feed</Link></li>
              <li><Link to="/funding" className="hover:text-primary transition-colors">Grants</Link></li>
              <li><Link to="/learning" className="hover:text-primary transition-colors">Learning</Link></li>
              <li><Link to="/safety" className="hover:text-primary transition-colors">Safety</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6">Download</h4>
            <p className="text-white/40 text-sm mb-6">Get the SheShark mobile app for safety on the go.</p>
            <a href="/Sheshark.apk" download className="btn-primary flex items-center justify-center gap-2">
              <Download size={18} /> Download APK
            </a>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-white/40 text-xs font-medium">
          <div>© 2026 SheShark Global. All rights reserved.</div>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
