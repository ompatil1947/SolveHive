import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ArrowRight, MessageSquare, Users, CheckCircle2 } from 'lucide-react';
import { getCategories } from '../api/categories';
import { getRecentQueries } from '../api/queries';
import QueryCard from '../components/ui/QueryCard';

const STEPS = [
  { icon: '❓', step: '01', title: 'Post Your Question', desc: 'Describe your problem. We check for existing solutions first — no duplicate clutter.' },
  { icon: '💡', step: '02', title: 'Community Solves It', desc: 'Experts and helpers post text, photo, or video answers from every field.' },
  { icon: '🏆', step: '03', title: 'Earn Reputation', desc: 'Accepted answers earn Respect Points and unlock badges. The best helpers rise up.' },
];

const MARQUEE_TAGS = ['Coding', 'Electronics', 'Career', 'Health', 'Cooking', 'DIY', 'Academics', 'Arduino', 'Resume Tips', 'Python', 'React', 'Nutrition', 'Home Repair', 'Machine Learning', 'Recipes'];

export default function Landing() {
  const [categories, setCategories] = useState([]);
  const [recentQueries, setRecentQueries] = useState([]);

  useEffect(() => {
    getCategories().then(r => setCategories(r.data.slice(0, 4))).catch(() => {});
    getRecentQueries({ limit: 3 }).then(r => setRecentQueries(r.data.queries || [])).catch(() => {});
  }, []);

  return (
    <div>
      {/* ── HERO ── */}
      <section className="relative overflow-hidden" style={{ background: '#0a0a0a', minHeight: '92vh', display: 'flex', alignItems: 'center' }}>
        {/* Amber blob */}
        <div
          className="absolute animate-blob"
          style={{ width: 520, height: 520, background: '#f59e0b', opacity: 0.12, borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%', right: '-80px', top: '50%', transform: 'translateY(-50%)', filter: 'blur(60px)' }}
        />
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.3) 1px, transparent 1px)', backgroundSize: '60px 60px' }}
        />

        <div className="page-container relative z-10 py-24">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            {/* Left copy */}
            <div className="flex-1 text-white animate-fade-up">
              {/* Eyebrow */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest mb-8" style={{ background: '#f59e0b20', border: '1.5px solid #f59e0b40', color: '#fbbf24' }}>
                🐝 Community Q&A Platform
              </div>

              <h1
                className="mb-6 text-white leading-none"
                style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(3rem, 7vw, 5.5rem)', fontWeight: 900, letterSpacing: '-0.04em' }}
              >
                Got a
                <br />
                <span style={{ color: '#f59e0b' }}>question?</span>
                <br />
                <span style={{ fontSize: '75%', fontWeight: 800, color: '#e7e5e4' }}>The hive knows.</span>
              </h1>

              <p className="text-stone-400 text-lg mb-10 max-w-md leading-relaxed">
                Post any real-world problem. Get answers in text, photo, or video. Earn reputation for helping others.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link to="/signup" id="hero-cta-signup" className="btn-primary text-base px-8 py-4">
                  Start for Free <ArrowRight className="w-5 h-5" />
                </Link>
                <Link to="/browse" id="hero-cta-browse" className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-sm text-white transition-all duration-200" style={{ border: '2px solid #3f3f46' }}>
                  Browse Questions
                </Link>
              </div>

              {/* Stats row */}
              <div className="flex gap-8 mt-12 pt-10" style={{ borderTop: '1px solid #27272a' }}>
                {[
                  { icon: <MessageSquare className="w-4 h-4" />, value: '1.2K+', label: 'Questions' },
                  { icon: <Users className="w-4 h-4" />, value: '340+', label: 'Experts' },
                  { icon: <CheckCircle2 className="w-4 h-4" />, value: '890+', label: 'Solved' },
                ].map(({ icon, value, label }) => (
                  <div key={label}>
                    <div className="flex items-center gap-1.5 font-black text-xl text-white mb-0.5" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                      <span style={{ color: '#f59e0b' }}>{icon}</span> {value}
                    </div>
                    <div className="text-xs text-stone-500 font-semibold uppercase tracking-wider">{label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — floating cards */}
            <div className="flex-1 relative hidden lg:flex items-center justify-center" style={{ minHeight: 480 }}>
              {/* Central amber circle */}
              <div
                className="absolute animate-float"
                style={{ width: 280, height: 280, background: '#f59e0b', borderRadius: '50%', opacity: 0.15, left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
              />

              {/* Floating question card */}
              <div
                className="absolute bg-white rounded-2xl p-4 shadow-2xl animate-float"
                style={{ width: 240, top: '5%', left: '5%', animationDelay: '0s', border: '2px solid #f0ede8' }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-full bg-stone-900 flex items-center justify-center text-white text-xs font-black">A</div>
                  <div>
                    <div className="text-xs font-bold text-stone-800">Alex M.</div>
                    <div className="text-xs text-stone-400">2m ago</div>
                  </div>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">"How do I fix CORS errors in Express.js?"</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{ background: '#6366f118', color: '#6366f1' }}>💻 Coding</span>
                  <span className="text-xs text-emerald-600 font-bold">● Open</span>
                </div>
              </div>

              {/* Floating answer card */}
              <div
                className="absolute bg-white rounded-2xl p-4 shadow-2xl animate-float"
                style={{ width: 220, bottom: '10%', right: '0%', animationDelay: '1.5s', border: '2px solid #fde68a' }}
              >
                <div className="text-xs font-black text-amber-600 mb-2 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> ACCEPTED ANSWER
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">"Set `Access-Control-Allow-Origin` in your headers and enable the cors middleware..."</p>
                <div className="flex items-center justify-between mt-2">
                  <div className="text-xs font-bold text-stone-500">+10 pts earned</div>
                  <span className="text-xs px-2 py-0.5 rounded-full font-black" style={{ background: '#f59e0b', color: '#0a0a0a' }}>🏆 Expert</span>
                </div>
              </div>

              {/* Floating badge card */}
              <div
                className="absolute bg-stone-900 text-white rounded-2xl px-4 py-3 shadow-2xl animate-float"
                style={{ top: '42%', right: '5%', animationDelay: '0.8s' }}
              >
                <div className="text-xs text-stone-400 mb-1 font-semibold">Respect Points</div>
                <div className="text-2xl font-black" style={{ fontFamily: 'Space Grotesk, sans-serif', color: '#f59e0b' }}>+10</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── MARQUEE TAGS ── */}
      <div className="py-4 overflow-hidden" style={{ background: '#f59e0b', borderTop: '2px solid #d97706', borderBottom: '2px solid #d97706' }}>
        <div className="flex gap-6 whitespace-nowrap" style={{ animation: 'marquee 30s linear infinite' }}>
          {[...MARQUEE_TAGS, ...MARQUEE_TAGS].map((tag, i) => (
            <span key={i} className="text-sm font-black text-black uppercase tracking-widest flex-shrink-0">
              {tag} <span className="mx-2 opacity-40">✦</span>
            </span>
          ))}
        </div>
        <style>{`@keyframes marquee { from { transform: translateX(0) } to { transform: translateX(-50%) } }`}</style>
      </div>

      {/* ── HOW IT WORKS ── */}
      <section className="section bg-white">
        <div className="page-container">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-amber-600 mb-3 block">How it works</span>
              <h2 className="text-4xl md:text-5xl font-black text-stone-900 leading-none" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                Three steps<br />to your answer
              </h2>
            </div>
            <Link to="/signup" className="btn-primary self-start md:self-auto">
              Get started <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {STEPS.map((step, i) => (
              <div
                key={i}
                className="rounded-2xl p-7 group hover:-translate-y-1 transition-all duration-300"
                style={{ background: i === 1 ? '#0a0a0a' : '#fafaf9', border: `2px solid ${i === 1 ? '#0a0a0a' : '#f0ede8'}` }}
              >
                <div className="flex items-start justify-between mb-6">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
                    style={{ background: i === 1 ? '#f59e0b' : '#fff8e6', border: `2px solid ${i === 1 ? '#f59e0b' : '#fde68a'}` }}
                  >
                    {step.icon}
                  </div>
                  <span
                    className="text-4xl font-black opacity-20"
                    style={{ fontFamily: 'Space Grotesk, sans-serif', color: i === 1 ? 'white' : '#0a0a0a' }}
                  >
                    {step.step}
                  </span>
                </div>
                <h3
                  className="text-xl font-black mb-2"
                  style={{ fontFamily: 'Space Grotesk, sans-serif', color: i === 1 ? 'white' : '#0a0a0a' }}
                >
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: i === 1 ? '#a8a29e' : '#78716c' }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORIES PREVIEW ── */}
      {categories.length > 0 && (
        <section className="section" style={{ background: '#fafaf9' }}>
          <div className="page-container">
            <div className="flex items-end justify-between mb-10">
              <div>
                <span className="text-xs font-black uppercase tracking-widest text-amber-600 mb-3 block">Browse Topics</span>
                <h2 className="text-4xl font-black text-stone-900 leading-none" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  Find your area
                </h2>
              </div>
              <Link to="/browse" className="btn-secondary text-sm">All Topics <ArrowRight className="w-4 h-4" /></Link>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {categories.map(cat => (
                <Link
                  key={cat._id} to={`/category/${cat.slug}`}
                  className="flex items-center gap-3 bg-white rounded-2xl p-4 group hover:-translate-y-1 transition-all duration-300"
                  style={{ border: '2px solid #f0ede8' }}
                >
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0" style={{ background: cat.color + '18' }}>
                    {cat.icon}
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-stone-800 text-sm" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{cat.name}</div>
                    <div className="text-xs text-stone-400 font-semibold">{cat.openCount} open</div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-stone-300 group-hover:text-amber-500 transition-colors ml-auto flex-shrink-0" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── RECENT QUESTIONS ── */}
      {recentQueries.length > 0 && (
        <section className="section bg-white">
          <div className="page-container">
            <div className="flex items-end justify-between mb-10">
              <div>
                <span className="text-xs font-black uppercase tracking-widest text-amber-600 mb-3 block">Live Feed</span>
                <h2 className="text-4xl font-black text-stone-900 leading-none" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  Needs your help
                </h2>
              </div>
              <Link to="/browse" className="btn-secondary text-sm">See All <ArrowRight className="w-4 h-4" /></Link>
            </div>
            <div className="space-y-3">
              {recentQueries.map(q => <QueryCard key={q._id} query={q} />)}
            </div>
          </div>
        </section>
      )}

      {/* ── BOTTOM CTA ── */}
      <section className="section" style={{ background: '#fafaf9' }}>
        <div className="page-container">
          <div
            className="rounded-3xl p-10 md:p-16 relative overflow-hidden"
            style={{ background: '#0a0a0a' }}
          >
            {/* Amber glow */}
            <div className="absolute" style={{ width: 400, height: 400, background: '#f59e0b', opacity: 0.08, borderRadius: '50%', right: -100, top: '50%', transform: 'translateY(-50%)', filter: 'blur(80px)' }} />

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div>
                <div className="text-5xl mb-4">🐝</div>
                <h2 className="text-4xl md:text-5xl font-black text-white mb-3 leading-none" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  Join the<br /><span style={{ color: '#f59e0b' }}>hive today</span>
                </h2>
                <p className="text-stone-400 max-w-sm">Every question asked, every answer given makes the community stronger.</p>
              </div>
              <div className="flex flex-col gap-3 flex-shrink-0">
                <Link to="/signup" className="btn-primary text-base px-10 py-4 justify-center">
                  Create Free Account <ArrowRight className="w-5 h-5" />
                </Link>
                <Link to="/browse" className="inline-flex items-center justify-center gap-2 px-10 py-4 rounded-full font-bold text-sm text-white transition-all duration-200" style={{ border: '2px solid #3f3f46' }}>
                  Browse Questions
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
