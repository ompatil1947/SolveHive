import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { signup as signupApi } from '../api/auth';
import { Eye, EyeOff, UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Signup() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      const { data } = await signupApi(form);
      login(data, data.token);
      toast.success("Account created! 🎉 Let's set up your profile.");
      navigate('/profile-setup');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: '#fafaf9' }}>
      {/* Left amber panel */}
      <div className="hidden lg:flex flex-col justify-between p-12 w-[420px] flex-shrink-0 relative overflow-hidden" style={{ background: '#f59e0b' }}>
        <div className="absolute" style={{ width: 300, height: 300, background: 'rgba(0,0,0,0.1)', borderRadius: '50%', right: -80, top: -80, filter: 'blur(40px)' }} />
        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-2 font-black text-xl text-black" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-black">
              <span className="text-amber-400 text-sm font-black">SH</span>
            </div>
            SolveHive
          </Link>
        </div>
        <div className="relative z-10">
          <div className="text-5xl mb-6 animate-float">🐝</div>
          <h2 className="text-3xl font-black text-black mb-3 leading-tight" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            Join the<br />smartest<br />community
          </h2>
          <p className="text-amber-900 text-sm font-medium">Ask anything. Answer everything. Earn respect.</p>
        </div>
        <p className="text-amber-800 text-xs relative z-10 font-semibold">Free forever · No spam</p>
      </div>

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md animate-fade-up">
          <Link to="/" className="flex items-center gap-2 font-black text-xl text-stone-900 mb-8 lg:hidden" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#f59e0b' }}>
              <span className="text-black text-sm font-black">SH</span>
            </div>
            SolveHive
          </Link>

          <h2 className="text-3xl font-black text-stone-900 mb-1" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Create account</h2>
          <p className="text-stone-500 text-sm mb-8">Already have one? <Link to="/login" className="font-bold hover:underline" style={{ color: '#d97706' }}>Sign in</Link></p>

          <form id="signup-form" onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label" htmlFor="signup-name">Full Name</label>
              <input id="signup-name" type="text" className="input" placeholder="Jane Doe"
                value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div>
              <label className="label" htmlFor="signup-email">Email address</label>
              <input id="signup-email" type="email" className="input" placeholder="you@example.com"
                value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div>
              <label className="label" htmlFor="signup-password">Password</label>
              <div className="relative">
                <input id="signup-password" type={showPass ? 'text' : 'password'} className="input pr-12"
                  placeholder="Min. 6 characters" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required minLength={6} />
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600" onClick={() => setShowPass(!showPass)}>
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button id="signup-submit" type="submit" disabled={loading}
              className="btn-primary w-full justify-center py-3.5 text-base disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? <><svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg> Creating account...</>
                : <><UserPlus className="w-4 h-4" /> Create Account</>
              }
            </button>
            <p className="text-center text-xs text-stone-400">By signing up, you agree to our community guidelines.</p>
          </form>
        </div>
      </div>
    </div>
  );
}
