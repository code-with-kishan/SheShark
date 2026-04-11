import React, { useEffect, useState, Suspense, lazy } from 'react';
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Navigate, 
  useLocation,
  useNavigate,
  Link
} from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useStore } from '@/store/useStore';
import { languageLabels as voiceLanguageLabels, useVoiceAssistant } from '@/hooks/useVoiceAssistant';
import { 
  LayoutDashboard, 
  Zap, 
  MessageSquare, 
  ShoppingBag, 
  Coins, 
  GraduationCap, 
  Users, 
  User, 
  BadgeDollarSign,
  Car, 
  ShieldAlert,
  Briefcase,
  LogOut,
  Menu,
  X,
  Download,
  Mic,
  MicOff,
  Languages,
  Volume,
  Volume2,
  VolumeX,
  ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import FloatingWomenChatbot from '@/components/Chatbot/FloatingWomenChatbot';

// Pages
import Landing from '@/pages/Landing';

const Login = lazy(() => import('@/pages/Login'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const ProfitLoss = lazy(() => import('@/pages/ProfitLoss'));
const AIAssistant = lazy(() => import('@/pages/AIAssistant'));
const Marketplace = lazy(() => import('@/pages/Marketplace'));
const Brand = lazy(() => import('@/pages/Brand'));
const Features = lazy(() => import('@/pages/Features'));
const DownloadApp = lazy(() => import('@/pages/DownloadApp'));
const Funding = lazy(() => import('@/pages/Funding'));
const Learning = lazy(() => import('@/pages/Learning'));
const Business = lazy(() => import('@/pages/Business'));
const Services = lazy(() => import('@/pages/Services'));
const Community = lazy(() => import('@/pages/Community'));
const Taxi = lazy(() => import('@/pages/Taxi'));
const Safety = lazy(() => import('@/pages/Safety'));
const Profile = lazy(() => import('@/pages/Profile'));
import VoiceAssistantWidget from '@/components/VoiceAssistant/VoiceAssistant';

const CUSTOMER_ALLOWED_PATHS = ['/dashboard', '/marketplace', '/profile', '/services', '/safety'];
const PUBLIC_PATHS = ['/', '/login', '/features', '/marketplace', '/community', '/download-app', '/safety'];

const languageLabels = {
  en: 'English',
  hi: 'Hindi',
  es: 'Spanish',
} as const;

const SidebarItem = ({ to, icon: Icon, label, active, isCollapsed, onClick }: any) => (
  <Link 
    to={to}
    onClick={onClick}
    className={cn(
      "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300",
      active ? "bg-primary text-white shadow-lg shadow-primary/30" : "text-slate-500 hover:bg-primary/10 hover:text-primary",
      isCollapsed && "justify-center px-0"
    )}
    title={isCollapsed ? label : ""}
  >
    <Icon size={22} className={cn(isCollapsed ? "mx-auto" : "")} />
    {!isCollapsed && <span className="font-medium">{label}</span>}
  </Link>
);

const Navbar = () => {
  const { user, language, setLanguage, audioEnabled, setAudioEnabled, setIsVoicePanelOpen } = useStore();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-3 py-3 sm:px-6 sm:py-4">
      <div className="max-w-7xl mx-auto glass rounded-2xl sm:rounded-full px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img 
            src="/icon.png" 
            alt="SheShark Logo" 
            className="w-10 h-10 object-contain"
            referrerPolicy="no-referrer"
          />
          <span className="text-sm sm:text-2xl font-bold gradient-text">SheShark</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-slate-600 hover:text-primary font-medium">Home</Link>
          <Link to="/features" className="text-slate-600 hover:text-primary font-medium">Features</Link>
          <Link to="/marketplace" className="text-slate-600 hover:text-primary font-medium">Marketplace</Link>
          <Link to="/community" className="text-slate-600 hover:text-primary font-medium">Community</Link>
          <Link to="/download-app" className="text-slate-600 hover:text-primary font-medium flex items-center gap-1">
            <Download size={16} /> Download App
          </Link>
          {user && <Link to="/dashboard" className="text-slate-600 hover:text-primary font-medium">Dashboard</Link>}
        </div>

        <div className="flex items-center gap-4 ml-auto md:ml-0">
          <div className="hidden md:flex items-center gap-2">
            <Languages size={16} className="text-slate-500" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as 'en' | 'hi' | 'es')}
              className="text-sm bg-white text-slate-600 font-medium focus:outline-none appearance-none cursor-pointer px-3 py-1.5 rounded-lg border border-slate-200 hover:border-primary/30 min-w-fit w-28"
              style={{ position: 'relative' }}
              aria-label="Select language"
            >
              {Object.entries(languageLabels).map(([code, label]) => (
                <option key={code} value={code}>{label}</option>
              ))}
            </select>
            <button
              onClick={() => setAudioEnabled(!audioEnabled)}
              className="p-2 hover:bg-primary/10 rounded-xl text-slate-600"
              aria-label={audioEnabled ? 'Turn audio off' : 'Turn audio on'}
              title={audioEnabled ? 'Audio On' : 'Audio Off'}
            >
              {audioEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            </button>
          </div>
          {user ? (
            <div className="flex items-center gap-4">
              <Link to="/dashboard" className="btn-primary py-2 px-6 text-sm hidden md:block">Dashboard</Link>
              <Link to="/profile" className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary/20">
                <img src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}`} alt="Profile" />
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-2 sm:gap-3">
              <Link to="/login" className="hidden sm:block text-xs sm:text-sm font-bold text-slate-600 hover:text-primary transition-colors py-2 px-3">Login</Link>
              <Link to="/login" className="btn-primary py-2.5 sm:py-3 px-3 sm:px-6 text-xs sm:text-sm flex items-center gap-2 hover:gap-3 transition-all shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 whitespace-nowrap">Join Now <ArrowRight size={16} /></Link>
            </div>
          )}
          <button
            type="button"
            onClick={() => setIsOpen((open) => !open)}
            className="inline-flex md:hidden items-center justify-center rounded-xl p-2 text-slate-600 hover:bg-primary/10"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

        {isOpen && (
          <div className="mt-3 rounded-2xl border border-slate-100 bg-white p-3 md:hidden">
            <div className="flex flex-col gap-2 text-sm font-medium text-slate-600">
              <Link to="/" onClick={() => setIsOpen(false)} className="rounded-xl px-3 py-2 hover:bg-slate-50">Home</Link>
              <Link to="/features" onClick={() => setIsOpen(false)} className="rounded-xl px-3 py-2 hover:bg-slate-50">Features</Link>
              <Link to="/marketplace" onClick={() => setIsOpen(false)} className="rounded-xl px-3 py-2 hover:bg-slate-50">Marketplace</Link>
              <Link to="/community" onClick={() => setIsOpen(false)} className="rounded-xl px-3 py-2 hover:bg-slate-50">Community</Link>
              <Link to="/download-app" onClick={() => setIsOpen(false)} className="rounded-xl px-3 py-2 hover:bg-slate-50">Download App</Link>
              <button
                type="button"
                onClick={() => {
                  setIsVoicePanelOpen(true);
                  setIsOpen(false);
                }}
                className="rounded-xl px-3 py-2 hover:bg-slate-50 flex items-center gap-2 text-primary font-bold"
              >
                <Mic size={16} /> Voice Assistant
              </button>
              {user && <Link to="/dashboard" onClick={() => setIsOpen(false)} className="rounded-xl px-3 py-2 hover:bg-slate-50">Dashboard</Link>}
              <div className="mt-2 flex items-center gap-2 border-t border-slate-100 pt-2">
                <Languages size={14} className="text-slate-500" />
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as 'en' | 'hi' | 'es')}
                  className="text-sm bg-transparent text-slate-600 font-medium focus:outline-none"
                  aria-label="Select language"
                >
                  {Object.entries(languageLabels).map(([code, label]) => (
                    <option key={code} value={code}>{label}</option>
                  ))}
                </select>
                <button
                  onClick={() => setAudioEnabled(!audioEnabled)}
                  className="ml-auto p-1.5 rounded-lg text-slate-600 hover:bg-primary/10"
                  aria-label={audioEnabled ? 'Turn audio off' : 'Turn audio on'}
                  title={audioEnabled ? 'Audio On' : 'Audio Off'}
                >
                  {audioEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    user,
    role,
    setUser,
    setDemoAuth,
    language,
    setLanguage,
    voiceEnabled,
    setVoiceEnabled,
    audioEnabled,
    audioVolume,
    setAudioEnabled,
    isVoicePanelOpen,
    setIsVoicePanelOpen,
  } = useStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const voiceAssistant = useVoiceAssistant({
    initialLanguageMode: language === 'hi' ? 'hi' : 'auto',
    speechEnabled: audioEnabled,
    speechVolume: audioVolume,
    onCommand: (result) => {
      navigate(result.route);
    },
  });

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    if (!voiceEnabled) {
      voiceAssistant.stopListening();
    }
  }, [voiceAssistant, voiceEnabled]);

  if (!user && !PUBLIC_PATHS.includes(location.pathname)) {
    return <Navigate to="/" />;
  }

  if (user && role === 'customer' && location.pathname !== '/' && location.pathname !== '/login' && !CUSTOMER_ALLOWED_PATHS.includes(location.pathname)) {
    return <Navigate to="/marketplace" replace />;
  }

  const handleSignOut = async () => {
    try {
      await auth.signOut();
    } finally {
      setUser(null);
      setDemoAuth(false);
      navigate('/');
    }
  };

  const menuItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/profit-loss', icon: Zap, label: 'Profit Loss' },
    { to: '/ai', icon: MessageSquare, label: 'AI Assistant' },
    { to: '/business', icon: Briefcase, label: 'My Business' },
    { to: '/marketplace', icon: ShoppingBag, label: 'Marketplace' },
    { to: '/funding', icon: Coins, label: 'Funding' },
    { to: '/services', icon: BadgeDollarSign, label: 'Services' },
    { to: '/learning', icon: GraduationCap, label: 'Learning' },
    { to: '/community', icon: Users, label: 'Community' },
    { to: '/taxi', icon: Car, label: 'Taxi' },
    { to: '/safety', icon: ShieldAlert, label: 'Safety' },
    { to: '/profile', icon: User, label: 'Profile' },
  ];

  const scopedMenuItems = role === 'customer'
    ? menuItems.filter((item) => CUSTOMER_ALLOWED_PATHS.includes(item.to))
    : menuItems;

  const isAuthPage = location.pathname === '/' || location.pathname === '/login';
  const showSidebar = !isAuthPage && Boolean(user);
  const showNavbar = isAuthPage || !user;

  return (
    <div className="app-min-h bg-mesh">
      {showNavbar && <Navbar />}
      {showSidebar ? (
        <div className="flex">
          {isSidebarOpen && <div className="fixed inset-0 z-30 bg-black/30 lg:hidden" onClick={() => setIsSidebarOpen(false)} />}

          <button
            type="button"
            onClick={() => setIsSidebarOpen((open) => !open)}
            className="fixed left-3 top-4 z-50 rounded-xl bg-white/95 p-2 text-primary shadow lg:hidden"
            aria-label="Toggle sidebar"
          >
            {isSidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>

          {/* Sidebar */}
          <aside className={cn(
            "fixed left-0 top-0 h-screen glass border-r border-white/20 transition-all duration-500 z-40 flex flex-col overflow-hidden",
            "w-72",
            isSidebarOpen ? "translate-x-0 lg:w-72" : "-translate-x-full lg:translate-x-0 lg:w-20"
          )}>
            <div className="p-6 flex items-center justify-between">
              {isSidebarOpen && <span className="text-2xl font-bold gradient-text">SheShark</span>}
              <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="hidden lg:inline-flex p-2 hover:bg-primary/10 rounded-xl text-primary">
                {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 pb-4">
              <nav className="mt-4 space-y-2">
                {scopedMenuItems.map((item) => (
                  <SidebarItem 
                    key={item.to} 
                    {...item} 
                    active={location.pathname === item.to} 
                    isCollapsed={!isSidebarOpen}
                    onClick={() => {
                      if (typeof window !== 'undefined' && window.innerWidth < 1024) {
                        setIsSidebarOpen(false);
                      }
                    }}
                  />
                ))}
              </nav>

              <div className="mt-4 lg:hidden">
                <button
                  type="button"
                  onClick={() => setIsVoicePanelOpen(true)}
                  className="w-full rounded-2xl bg-gradient-to-r from-primary to-primary-dark px-4 py-3 text-sm font-semibold text-white hover:brightness-105"
                >
                  <MessageSquare size={16} className="inline mr-2" />
                  Voice Assistant
                </button>
              </div>
            </div>

            <div className="px-4 py-4 border-t border-slate-100">
              <button 
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-red-50 hover:text-red-500 rounded-2xl transition-all"
              >
                <LogOut size={22} />
                {isSidebarOpen && <span className="font-medium">Logout</span>}
              </button>
            </div>
          </aside>

          {/* Main Content */}
          <main className={cn(
            "flex-1 transition-all duration-500 app-min-h p-3 sm:p-6 lg:p-8",
            isSidebarOpen ? "lg:ml-72" : "lg:ml-20"
          )}>
            {children}
          </main>
        </div>
      ) : (
        <main className={cn('relative z-10 app-min-h p-3 sm:p-6 md:p-8', showNavbar && 'pt-24 sm:pt-32 md:pt-36')}>
          {children}
        </main>
      )}
      {(PUBLIC_PATHS.includes(location.pathname) || user) && (
        <div className="fixed right-3 z-50 hidden sm:flex items-end gap-2 sm:right-5 bottom-[calc(1rem+env(safe-area-inset-bottom,0px))] sm:bottom-5">
          <div className="glass rounded-2xl sm:rounded-full px-2 sm:px-3 py-2 flex items-center gap-1 sm:gap-2 max-w-[calc(100vw-6rem)] overflow-x-auto">
            <Languages size={14} className="text-slate-500" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as 'en' | 'hi' | 'es')}
              className="hidden sm:block text-sm bg-transparent text-slate-600 font-medium focus:outline-none"
              aria-label="Select language"
            >
              {Object.entries(languageLabels).map(([code, label]) => (
                <option key={code} value={code}>{label}</option>
              ))}
            </select>
            <select
              value={voiceAssistant.languageMode}
              onChange={(e) => voiceAssistant.setLanguageMode(e.target.value as 'auto' | 'en' | 'hi')}
              className="hidden md:block text-sm bg-transparent text-slate-600 font-medium focus:outline-none"
              aria-label="Select voice language mode"
            >
              {Object.entries(voiceLanguageLabels).map(([code, label]) => (
                <option key={code} value={code}>{label}</option>
              ))}
            </select>
            <button
              onClick={() => setAudioEnabled(!audioEnabled)}
              className="p-1 rounded-lg text-slate-600 hover:bg-primary/10"
              aria-label={audioEnabled ? 'Turn audio off' : 'Turn audio on'}
              title={audioEnabled ? 'Audio On' : 'Audio Off'}
            >
              {audioEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            </button>
            <button
              onClick={() => setVoiceEnabled(!voiceEnabled)}
              className="p-1 rounded-lg text-slate-600 hover:bg-primary/10"
              aria-label={voiceEnabled ? 'Turn voice commands off' : 'Turn voice commands on'}
              title={voiceEnabled ? 'Voice On' : 'Voice Off'}
            >
              {voiceEnabled ? <Mic size={16} /> : <MicOff size={16} />}
            </button>
            <button
              onClick={() => setIsVoicePanelOpen(!isVoicePanelOpen)}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full px-2.5 sm:px-3 py-1.5 text-xs font-semibold transition-all',
                isVoicePanelOpen
                  ? 'bg-slate-900 text-white shadow-sm ring-2 ring-slate-300'
                  : 'bg-gradient-to-r from-primary to-primary-dark text-white shadow-sm hover:brightness-105'
              )}
              aria-label={isVoicePanelOpen ? 'Close voice assistant' : 'Open voice assistant'}
              title={isVoicePanelOpen ? 'Close Assistant' : 'Open Assistant'}
            >
              <MessageSquare size={14} />
              <span>{isVoicePanelOpen ? 'Close AI' : 'AI Voice'}</span>
            </button>
            <button
              onClick={() => void voiceAssistant.speak('Audio test successful.')}
              className="p-1 rounded-lg text-slate-600 hover:bg-primary/10"
              aria-label="Test audio"
              title="Test audio"
            >
              <Volume size={16} />
            </button>
          </div>
          <button
            onClick={voiceAssistant.toggleListening}
            disabled={!voiceEnabled || !voiceAssistant.isSupported}
            className={cn(
              'rounded-full p-3 sm:p-4 shadow-xl transition-all',
              voiceEnabled ? 'bg-primary text-white hover:scale-105' : 'bg-slate-200 text-slate-500 cursor-not-allowed',
              voiceAssistant.isListening && 'animate-pulse'
            )}
            title={voiceEnabled ? 'Voice command' : 'Voice disabled'}
            aria-label={voiceAssistant.isListening ? 'Stop voice command' : 'Start voice command'}
          >
            <Mic size={20} />
          </button>
          {(voiceAssistant.transcript || voiceAssistant.response || voiceAssistant.error) && (
            <div className="absolute bottom-16 right-0 glass rounded-xl px-3 py-2 text-xs text-slate-600 max-w-[80vw] sm:max-w-xs">
              {voiceAssistant.transcript && <div>Heard: {voiceAssistant.transcript}</div>}
              {voiceAssistant.response && <div className="mt-1 text-slate-500">{voiceAssistant.response}</div>}
              {voiceAssistant.error && <div className="mt-1 text-red-500">{voiceAssistant.error}</div>}
            </div>
          )}
        </div>
      )}
      {isVoicePanelOpen && (
        <div className="fixed left-3 right-3 z-50 overflow-hidden rounded-3xl shadow-2xl ring-1 ring-black/5 bottom-[calc(6rem+env(safe-area-inset-bottom,0px))] sm:bottom-24 sm:left-auto sm:right-5 sm:w-[24rem] sm:max-w-[calc(100vw-2.5rem)]">
          <button
            type="button"
            onClick={() => setIsVoicePanelOpen(false)}
            className="absolute top-3 right-3 z-10 rounded-lg bg-white/90 p-1.5 text-slate-600 hover:bg-slate-100"
            aria-label="Close voice assistant"
            title="Close"
          >
            <X size={18} />
          </button>
          <VoiceAssistantWidget />
        </div>
      )}
      <FloatingWomenChatbot voicePanelOpen={isVoicePanelOpen} />
    </div>
  );
};

export default function App() {
  const { setUser, demoAuth, setDemoAuth } = useStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setDemoAuth(false);
        setUser({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
        });
      } else if (!demoAuth) {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, [demoAuth, setDemoAuth, setUser]);

  return (
    <Router>
      <AppLayout>
        <Suspense
          fallback={
            <div className="flex min-h-[40vh] items-center justify-center text-slate-500">
              Loading...
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/features" element={<Features />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profit-loss" element={<ProfitLoss />} />
            <Route path="/energy" element={<Navigate to="/profit-loss" replace />} />
            <Route path="/ai" element={<AIAssistant />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/download-app" element={<DownloadApp />} />
            <Route path="/brands/:brand" element={<Brand />} />
            <Route path="/funding" element={<Funding />} />
            <Route path="/services" element={<Services />} />
            <Route path="/learning" element={<Learning />} />
            <Route path="/business" element={<Business />} />
            <Route path="/community" element={<Community />} />
            <Route path="/taxi" element={<Taxi />} />
            <Route path="/safety" element={<Safety />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Suspense>
      </AppLayout>
    </Router>
  );
}
 
