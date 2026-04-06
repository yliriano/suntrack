import { useState } from 'react';

const AuthModal = ({ open, onClose, onLogin, onRegister, loading, error }) => {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [info, setInfo] = useState('');

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault(); setInfo('');
    const result = mode === 'login' ? await onLogin(email, password) : await onRegister(email, password);
    if (result?.ok) { result.confirm ? setInfo('Check your email to confirm your account.') : onClose(); }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
        <div className="bg-slate-900 px-6 py-5 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white">
              {mode === 'login' ? 'Sign in to ' : 'Create account · '}<span className="text-amber-400">Sun</span><span className="text-white">Track</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">{mode === 'login' ? 'Sync your watchlist & lead statuses' : 'Save your work across devices'}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors p-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1.5">Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-400/60 focus:border-amber-400 placeholder-slate-400" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1.5">Password</label>
            <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-400/60 focus:border-amber-400 placeholder-slate-400" />
          </div>
          {error && <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>}
          {info && <p className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-2">{info}</p>}
          <button type="submit" disabled={loading} className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-900 text-sm font-bold rounded-lg transition-colors">
            {loading ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'}
          </button>
          <p className="text-center text-xs text-slate-400">
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button type="button" onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setInfo(''); }} className="text-amber-500 hover:text-amber-600 font-semibold">
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};
export default AuthModal;
