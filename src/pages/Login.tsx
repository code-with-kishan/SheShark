import React, { useState } from 'react';
import { GlassCard, Button } from '@/components/UI';
import { Mail, Lock, ArrowRight, ShieldCheck, Store, UserRound, KeyRound, Phone } from 'lucide-react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, firebaseAuthEnabled } from '@/lib/firebase';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { useStore } from '@/store/useStore';

const Login = () => {
  const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email');
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [sentOtp, setSentOtp] = useState('');
  const [otpTarget, setOtpTarget] = useState('');
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { role, setRole, setDemoAuth, setUser } = useStore();

  const roleHome = role === 'customer' ? '/marketplace' : '/business';

  const createDemoSession = (identifier: string) => {
    const safeId = identifier.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
    setUser({
      uid: `demo-${safeId || Date.now()}`,
      email: authMethod === 'email' ? identifier : `${identifier}@demo.local`,
      displayName: authMethod === 'email' ? 'Demo Email User' : 'Demo Phone User',
      photoURL: null,
    });
    setDemoAuth(true);
    navigate(roleHome);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setNotice('');

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPhone = phone.trim();
    const authTarget = authMethod === 'email' ? normalizedEmail : normalizedPhone;

    if (!authTarget || !password.trim()) {
      setError(authMethod === 'email' ? 'Email and password are required.' : 'Phone and password are required.');
      setLoading(false);
      return;
    }

    if (!sentOtp || otpTarget !== authTarget) {
      setError('OTP is mandatory. Click Send OTP first for the selected login method.');
      setLoading(false);
      return;
    }

    if (!otp.trim() || otp !== sentOtp) {
      setError('Invalid OTP. Please enter the correct code.');
      setLoading(false);
      return;
    }
    
    try {
      if (authMethod === 'email' && firebaseAuthEnabled) {
        if (isLogin) {
          await signInWithEmailAndPassword(auth, normalizedEmail, password);
        } else {
          await createUserWithEmailAndPassword(auth, normalizedEmail, password);
        }
        setDemoAuth(false);
        navigate(roleHome);
      } else {
        createDemoSession(authTarget);
        setNotice('Logged in via demo OTP mode. Firebase phone OTP is not configured in this build.');
      }
    } catch (err: any) {
      if (String(err?.message || '').toLowerCase().includes('api-key-not-valid')) {
        createDemoSession(authTarget);
        setNotice('Firebase API key is invalid. You are logged in using secure demo OTP mode.');
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = () => {
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPhone = phone.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^[0-9]{10,15}$/;

    if (authMethod === 'email') {
      if (!emailPattern.test(normalizedEmail)) {
        setError('Enter a valid email before requesting OTP.');
        setNotice('');
        return;
      }
    } else if (!phonePattern.test(normalizedPhone.replace(/\D/g, ''))) {
      setError('Enter a valid phone number (10-15 digits) before requesting OTP.');
      setNotice('');
      return;
    }

    const demoCode = `${Math.floor(100000 + Math.random() * 900000)}`;
    setSentOtp(demoCode);
    const target = authMethod === 'email' ? normalizedEmail : normalizedPhone;
    setOtpTarget(target);
    setNotice(`OTP sent to ${target}.`);
    setError('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-3 sm:p-6 bg-mesh pt-24 sm:pt-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-6xl"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8 items-stretch">
          <GlassCard className="hidden lg:flex flex-col justify-between p-8 lg:p-10 bg-gradient-to-br from-primary/10 to-white/60 border-primary/20">
            <div>
              <Link to="/" className="inline-flex items-center gap-2 mb-8">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/30">
                  <span className="text-white font-bold text-xl">S</span>
                </div>
                <span className="text-2xl font-bold gradient-text">SheShark</span>
              </Link>
              <h1 className="text-3xl lg:text-4xl font-bold leading-tight mb-4">One secure login for your business operations</h1>
              <p className="text-slate-600 text-base lg:text-lg">Access marketplace, AI assistant, and growth tools with role-based permissions.</p>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-slate-700 text-sm lg:text-base">
                <ShieldCheck size={18} className="text-primary" />
                <span className="font-medium">Email + OTP both required for access</span>
              </div>
              <div className="flex items-center gap-3 text-slate-700 text-sm lg:text-base">
                <Store size={18} className="text-primary" />
                <span className="font-medium">Business role gets full module access</span>
              </div>
              <div className="flex items-center gap-3 text-slate-700 text-sm lg:text-base">
                <UserRound size={18} className="text-primary" />
                <span className="font-medium">Customer role is product-focused</span>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="space-y-5 sm:space-y-6 p-4 sm:p-8 md:p-10">
            <div className="text-center lg:text-left mb-2">
              <Link to="/" className="inline-flex items-center gap-2 mb-3 lg:hidden">
                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/30">
                  <span className="text-white font-bold text-lg">S</span>
                </div>
                <span className="text-xl sm:text-2xl font-bold gradient-text">SheShark</span>
              </Link>
              <h2 className="text-2xl sm:text-3xl font-bold">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 sm:mt-2">
                {isLogin ? 'Complete login with OTP verification.' : 'Create account with mandatory OTP verification.'}
              </p>
            </div>

          <div className="space-y-2 sm:space-y-3">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Login Method</p>
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => {
                  setAuthMethod('email');
                  setSentOtp('');
                  setOtp('');
                  setOtpTarget('');
                  setNotice('');
                }}
                className={authMethod === 'email' ? 'btn-primary !py-2 sm:!py-3 !px-3 sm:!px-4 !rounded-xl sm:!rounded-2xl text-xs sm:text-sm' : 'glass py-2 sm:py-3 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-semibold text-slate-600'}
              >
                Email
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMethod('phone');
                  setSentOtp('');
                  setOtp('');
                  setOtpTarget('');
                  setNotice('');
                }}
                className={authMethod === 'phone' ? 'btn-primary !py-2 sm:!py-3 !px-3 sm:!px-4 !rounded-xl sm:!rounded-2xl text-xs sm:text-sm' : 'glass py-2 sm:py-3 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-semibold text-slate-600'}
              >
                Mobile No.
              </button>
            </div>
          </div>

          <div className="space-y-2 sm:space-y-3">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Select Role</p>
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => setRole('customer')}
                className={role === 'customer' ? 'btn-primary !py-2 sm:!py-3 !px-3 sm:!px-4 !rounded-xl sm:!rounded-2xl text-xs sm:text-sm' : 'glass py-2 sm:py-3 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-semibold text-slate-600'}
              >
                Customer
              </button>
              <button
                type="button"
                onClick={() => setRole('business')}
                className={role === 'business' ? 'btn-primary !py-2 sm:!py-3 !px-3 sm:!px-4 !rounded-xl sm:!rounded-2xl text-xs sm:text-sm' : 'glass py-2 sm:py-3 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-semibold text-slate-600'}
              >
                Business / Owner
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 sm:p-4 bg-red-50 text-red-500 text-xs sm:text-sm rounded-xl sm:rounded-2xl font-medium border border-red-100">
              {error}
            </div>
          )}

          {notice && (
            <div className="p-3 sm:p-4 bg-emerald-50 text-emerald-700 text-xs sm:text-sm rounded-xl sm:rounded-2xl border border-emerald-100">
              {notice}
            </div>
          )}

          {sentOtp && (
            <div className="p-3 sm:p-4 bg-amber-50 text-amber-700 text-xs sm:text-sm rounded-xl sm:rounded-2xl border border-amber-100">
              Demo OTP: <span className="font-bold tracking-wider">{sentOtp}</span>
            </div>
          )}

            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              {authMethod === 'email' ? (
                <div className="space-y-1 sm:space-y-2">
                  <label className="text-xs sm:text-sm font-semibold text-slate-600 ml-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input 
                      type="email" 
                      required
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (otpTarget && otpTarget !== e.target.value.trim().toLowerCase()) {
                          setSentOtp('');
                          setOtp('');
                          setNotice('Identifier changed. Send OTP again.');
                        }
                      }}
                      placeholder="name@example.com"
                      className="w-full glass pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-1 sm:space-y-2">
                  <label className="text-xs sm:text-sm font-semibold text-slate-600 ml-1">Mobile Number</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        if (otpTarget && otpTarget !== e.target.value.trim()) {
                          setSentOtp('');
                          setOtp('');
                          setNotice('Identifier changed. Send OTP again.');
                        }
                      }}
                      placeholder="10-digit mobile no."
                      className="w-full glass pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1 sm:space-y-2">
                <label className="text-xs sm:text-sm font-semibold text-slate-600 ml-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input 
                    type="password" 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full glass pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div className="space-y-1 sm:space-y-2">
                <label className="text-xs sm:text-sm font-semibold text-slate-600 ml-1">One-Time Password (OTP)</label>
                <div className="flex items-center gap-1 sm:gap-2">
                  <div className="relative flex-1">
                    <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                      type="text"
                      required
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      maxLength={6}
                      placeholder="6-digit code"
                      className="w-full glass pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 tracking-widest"
                    />
                  </div>
                  <Button type="button" onClick={handleSendOtp} className="!py-2.5 sm:!py-3 !px-3 sm:!px-5 rounded-xl sm:rounded-2xl whitespace-nowrap text-xs sm:text-sm">
                    Send OTP
                  </Button>
                </div>
              </div>

              {isLogin && (
                <div className="text-right">
                  <button type="button" className="text-xs sm:text-sm font-bold text-primary hover:underline">Forgot password?</button>
                </div>
              )}

              <Button type="submit" loading={loading} className="w-full py-3 sm:py-4 text-sm sm:text-base">
                {isLogin ? 'Sign In with OTP' : 'Sign Up with OTP'} <ArrowRight size={18} />
              </Button>
            </form>
            <div className="text-center pt-3 sm:pt-4">
              <button 
                onClick={() => setIsLogin(!isLogin)}
                className="text-xs sm:text-sm font-bold text-slate-500 hover:text-primary transition-colors"
              >
                {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
              </button>
            </div>
          </GlassCard>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
 
