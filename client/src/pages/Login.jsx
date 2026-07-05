import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { login as loginApi } from '../api/auth';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await loginApi(form);
      login(data, data.token);
      toast.success(`Welcome back, ${data.name}! 👋`);
      navigate(data.profileSetupComplete ? '/browse' : '/profile-setup');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: '#fafaf9' }}>
      {/* Left amber panel */}
      <div className="hidden lg:flex flex-col justify-between p-12 w-[420px] flex-shrink-0 relative overflow-hidden" style={{ background: '#0a0a0a' }}>
        <div className="absolute" style={{ width: 300, height: 300, background: '#f59e0b', opacity: 0.15, borderRadius: '50%', right: -80, bottom: -80, filter: 'blur(60px)' }} />
        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-2 font-black text-xl text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: '#f59e0b' }}>
              <span className="text-black text-sm font-black">SH</span>
            </div>
            SolveHive
          </Link>
        </div>
        <div className="relative z-10">
          <div className="text-5xl mb-6">🐝</div>
          <h2 className="text-3xl font-black text-white mb-3 leading-tight" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            Welcome<br />back to<br /><span style={{ color: '#f59e0b' }}>the hive</span>
          </h2>
          <p className="text-stone-400 text-sm">Your community is waiting.</p>
        </div>
        <p className="text-stone-600 text-xs relative z-10">© {new Date().getFullYear()} SolveHive</p>
      </div>

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md animate-fade-up">
          {/* Mobile logo */}
          <Link to="/" className="flex items-center gap-2 font-black text-xl text-stone-900 mb-8 lg:hidden" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#f59e0b' }}>
              <span className="text-black text-sm font-black">SH</span>
            </div>
            SolveHive
          </Link>

          <h2 className="text-3xl font-black text-stone-900 mb-1" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Sign in</h2>
          <p className="text-stone-500 text-sm mb-8">Don't have an account? <Link to="/signup" className="font-bold hover:underline" style={{ color: '#d97706' }}>Sign up free</Link></p>

          <form id="login-form" onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label" htmlFor="login-email">Email address</label>
              <input id="login-email" type="email" className="input" placeholder="you@example.com"
                value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div>
              <label className="label" htmlFor="login-password">Password</label>
              <div className="relative">
                <input id="login-password" type={showPass ? 'text' : 'password'} className="input pr-12"
                  placeholder="••••••••" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600" onClick={() => setShowPass(!showPass)}>
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button id="login-submit" type="submit" disabled={loading}
              className="btn-primary w-full justify-center py-3.5 text-base disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? <><svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg> Signing in...</>
                : <><LogIn className="w-4 h-4" /> Sign In</>
              }
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
