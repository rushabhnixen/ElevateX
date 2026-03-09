import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

export default function AuthPage() {
  const { login, register } = useAuth();
  const [tab, setTab] = useState('login'); // 'login' | 'register'
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'investor' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (tab === 'login') {
        await login(form.email, form.password);
      } else {
        await register(form.name, form.email, form.password, form.role);
      }
    } catch (err) {
      setError(err?.response?.data?.error || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-dvh bg-background flex flex-col items-center justify-center px-6 overflow-hidden">
      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-2 mb-10"
      >
        <div className="w-10 h-10 bg-accent rounded-2xl flex items-center justify-center">
          <Zap size={22} className="text-white" fill="white" />
        </div>
        <span className="text-2xl font-bold text-white tracking-tight">ElevateX</span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        {/* Tab toggle */}
        <div className="flex bg-surface rounded-xl p-1 mb-6">
          {['login', 'register'].map((t) => (
            <button
              key={t}
              onClick={() => { setTab(t); setError(''); }}
              className={`flex-1 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                tab === t ? 'bg-accent text-white' : 'text-muted'
              }`}
            >
              {t === 'login' ? 'Sign In' : 'Sign Up'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <AnimatePresence mode="wait">
            {tab === 'register' && (
              <motion.div
                key="name"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <Input
                  label="Full Name"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={set('name')}
                  required
                />
              </motion.div>
            )}
          </AnimatePresence>

          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={set('email')}
            required
          />

          <div className="relative flex flex-col gap-1">
            <label className="text-sm text-muted font-medium">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Min. 6 characters"
                value={form.password}
                onChange={set('password')}
                required
                className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-white placeholder:text-muted focus:outline-none focus:border-accent pr-11"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {tab === 'register' && (
              <motion.div
                key="role"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="flex flex-col gap-1">
                  <label className="text-sm text-muted font-medium">I am a…</label>
                  <div className="flex gap-3">
                    {['investor', 'founder'].map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setForm((f) => ({ ...f, role: r }))}
                        className={`flex-1 py-3 rounded-xl border text-sm font-medium capitalize transition-all ${
                          form.role === r
                            ? 'border-accent bg-accent/10 text-accent'
                            : 'border-border text-muted'
                        }`}
                      >
                        {r === 'investor' ? '💼 Investor' : '🚀 Founder'}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {error && (
            <p className="text-red-400 text-sm text-center bg-red-500/10 rounded-xl px-4 py-2">
              {error}
            </p>
          )}

          <Button type="submit" size="lg" className="w-full mt-1" disabled={loading}>
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                {tab === 'login' ? 'Signing in…' : 'Creating account…'}
              </span>
            ) : (
              tab === 'login' ? 'Sign In' : 'Create Account'
            )}
          </Button>
        </form>

        <p className="text-center text-muted text-xs mt-6">
          {tab === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button
            onClick={() => { setTab(tab === 'login' ? 'register' : 'login'); setError(''); }}
            className="text-accent font-medium"
          >
            {tab === 'login' ? 'Sign Up' : 'Sign In'}
          </button>
        </p>
      </motion.div>
    </div>
  );
}
