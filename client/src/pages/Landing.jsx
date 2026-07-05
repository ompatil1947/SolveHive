import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ArrowRight, Search, Users, CheckCircle2, Zap, MessageSquare, Star } from 'lucide-react';
import { getCategories } from '../api/categories';
import { getRecentQueries } from '../api/queries';
import QueryCard from '../components/ui/QueryCard';

const STEPS = [
  {
    icon: '❓',
    title: 'Post Your Question',
    desc: 'Describe your problem. We check for existing solutions first — no duplicate clutter.',
    color: '#6366f1',
  },
  {
    icon: '💡',
    title: 'Community Solves It',
    desc: 'Experts and helpers from every field post text, photo, or video answers.',
    color: '#8b5cf6',
  },
  {
    icon: '🏆',
    title: 'Earn Reputation',
    desc: 'Accepted answers earn Respect Points and unlock badges. The best helpers rise to the top.',
    color: '#a855f7',
  },
];

export default function Landing() {
  const [categories, setCategories] = useState([]);
  const [recentQueries, setRecentQueries] = useState([]);

  useEffect(() => {
    getCategories().then((r) => setCategories(r.data.slice(0, 4))).catch(() => {});
    getRecentQueries({ limit: 4 }).then((r) => setRecentQueries(r.data.queries || [])).catch(() => {});
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white">
        {/* Background blobs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600 opacity-20 rounded-full blur-3xl -translate-y-1/2" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600 opacity-15 rounded-full blur-3xl translate-y-1/2" />

        <div className="page-container py-24 md:py-32 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-sm font-medium text-indigo-200 mb-8 backdrop-blur-sm">
              <Zap className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              Community-powered answers for anything
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight">
              Got a question?
              <br />
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                The hive knows.
              </span>
            </h1>

            <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              SolveHive connects people with real-world problems to a community of experts and helpers
              across coding, electronics, health, cooking, and more.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup" id="hero-cta-signup" className="btn-primary text-base px-8 py-4">
                Start Solving <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/browse" id="hero-cta-browse" className="btn-secondary text-base px-8 py-4 bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white hover:border-white/40">
                <Search className="w-5 h-5" /> Browse Questions
              </Link>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-center gap-10 mt-16 pt-10 border-t border-white/10">
              {[
                { label: 'Questions Asked', value: '1.2K+', icon: MessageSquare },
                { label: 'Experts Active', value: '340+', icon: Users },
                { label: 'Solutions Found', value: '890+', icon: CheckCircle2 },
              ].map(({ label, value, icon: Icon }) => (
                <div key={label} className="text-center">
                  <div className="flex items-center justify-center gap-1.5 text-2xl font-black text-white mb-1">
                    <Icon className="w-5 h-5 text-indigo-400" />
                    {value}
                  </div>
                  <div className="text-xs text-slate-400">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="section bg-white">
        <div className="page-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-3">How it works</h2>
            <p className="text-slate-500 text-lg">Three simple steps to get your answer</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {STEPS.map((step, i) => (
              <div key={i} className="relative text-center group">
                {i < STEPS.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[calc(50%+3rem)] w-[calc(100%-6rem)] h-0.5 bg-gradient-to-r from-slate-200 to-slate-100" />
                )}
                <div
                  className="w-16 h-16 rounded-3xl flex items-center justify-center text-3xl mx-auto mb-5 transition-transform duration-300 group-hover:scale-110 group-hover:shadow-lg"
                  style={{ background: step.color + '18' }}
                >
                  {step.icon}
                </div>
                <div className="text-xs font-bold text-slate-400 tracking-widest uppercase mb-2">Step {i + 1}</div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">{step.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories preview */}
      {categories.length > 0 && (
        <section className="section bg-slate-50">
          <div className="page-container">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-black text-slate-900 mb-1">Browse by Topic</h2>
                <p className="text-slate-500">Find your area of interest</p>
              </div>
              <Link to="/browse" className="btn-secondary">
                All Topics <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {categories.map((cat) => (
                <Link key={cat._id} to={`/category/${cat.slug}`} className="card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 flex items-center gap-4">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                    style={{ background: cat.color + '20' }}
                  >
                    {cat.icon}
                  </div>
                  <div>
                    <div className="font-bold text-slate-800 text-sm">{cat.name}</div>
                    <div className="text-xs text-slate-400">{cat.openCount} open questions</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Recent questions */}
      {recentQueries.length > 0 && (
        <section className="section bg-white">
          <div className="page-container">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-black text-slate-900 mb-1">Recent Questions</h2>
                <p className="text-slate-500">Waiting for your expertise</p>
              </div>
              <Link to="/browse" className="btn-secondary">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="space-y-4">
              {recentQueries.map((q) => (
                <QueryCard key={q._id} query={q} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Banner */}
      <section className="section">
        <div className="page-container">
          <div className="relative overflow-hidden rounded-3xl gradient-bg p-12 text-center text-white">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full translate-x-1/3 -translate-y-1/3" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-x-1/3 translate-y-1/3" />
            <div className="relative z-10">
              <div className="text-4xl mb-4">🐝</div>
              <h2 className="text-3xl md:text-4xl font-black mb-4">Join the hive today</h2>
              <p className="text-indigo-200 text-lg mb-8 max-w-xl mx-auto">
                Whether you have a question or an answer — every contribution makes the community stronger.
              </p>
              <Link to="/signup" className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-indigo-700 font-bold text-base hover:bg-indigo-50 transition-colors shadow-lg">
                Create Free Account <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
