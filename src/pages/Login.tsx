import React, { useState } from 'react';
import { GlassCard, Button } from '@/components/UI';
import { Mail, Lock, LogIn, ArrowRight, Github } from 'lucide-react';
import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // For "demo" purposes that works like real, we'll try real auth
      // If it fails (e.g. user doesn't exist), we'll show error
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-mesh">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/30">
              <span className="text-white font-bold text-xl">S</span>
            </div>
            <span className="text-2xl font-bold gradient-text">SheShark</span>
          </Link>
          <h1 className="text-3xl font-bold">{isLogin ? 'Welcome Back' : 'Create Account'}</h1>
          <p className="text-slate-500 mt-2">
            {isLogin ? 'Enter your details to access your dashboard' : 'Join the community of women entrepreneurs'}
          </p>
        </div>

        <GlassCard className="space-y-6">
          {error && (
            <div className="p-4 bg-red-50 text-red-500 text-sm rounded-2xl font-medium border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-600 ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full glass pl-12 pr-4 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-600 ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full glass pl-12 pr-4 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            {isLogin && (
              <div className="text-right">
                <button type="button" className="text-sm font-bold text-primary hover:underline">Forgot password?</button>
              </div>
            )}

            <Button type="submit" loading={loading} className="w-full py-4 text-lg">
              {isLogin ? 'Sign In' : 'Sign Up'} <ArrowRight size={20} />
            </Button>
          </form>

          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-100"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-4 text-slate-400 font-bold">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={handleGoogleLogin}
              className="flex items-center justify-center gap-2 glass py-3 rounded-2xl hover:bg-slate-50 transition-all font-bold text-slate-600"
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
              Google
            </button>
            <button className="flex items-center justify-center gap-2 glass py-3 rounded-2xl hover:bg-slate-50 transition-all font-bold text-slate-600">
              <Github size={20} />
              GitHub
            </button>
          </div>

          <div className="text-center pt-4">
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm font-bold text-slate-500 hover:text-primary transition-colors"
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
};

export default Login;
