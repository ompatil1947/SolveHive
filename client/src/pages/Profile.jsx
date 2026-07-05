import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProfile } from '../api/users';
import StatCard from '../components/ui/StatCard';
import Badge from '../components/ui/Badge';
import QueryCard from '../components/ui/QueryCard';
import { Calendar, MessageSquare, HelpCircle, CheckCircle2 } from 'lucide-react';

export default function Profile() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('queries');

  useEffect(() => {
    setLoading(true);
    getProfile(id).then(r => setData(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="section">
        <div className="page-container max-w-4xl">
          <div className="rounded-2xl animate-pulse mb-6" style={{ background: '#f5f5f4', border: '2px solid #f0ede8', height: 160 }} />
        </div>
      </div>
    );
  }

  if (!data) return (
    <div className="section">
      <div className="page-container text-center py-20">
        <h2 className="text-2xl font-black text-stone-700" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>User not found</h2>
      </div>
    </div>
  );

  const { user, stats, recentQueries, recentAnswers } = data;
  const badge = user.badge;
  const interests = user.interests || [];

  return (
    <div className="section">
      <div className="page-container max-w-4xl">

        {/* Profile hero */}
        <div
          className="rounded-2xl p-8 mb-6 relative overflow-hidden"
          style={{ background: '#0a0a0a', border: '2px solid #1c1c1e' }}
        >
          {/* Amber glow */}
          <div className="absolute right-0 top-0 w-64 h-64 opacity-10 rounded-full" style={{ background: '#f59e0b', filter: 'blur(60px)', transform: 'translate(30%, -30%)' }} />

          <div className="relative z-10 flex flex-col sm:flex-row items-start gap-6">
            {/* Avatar */}
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-black text-black flex-shrink-0"
              style={{ background: '#f59e0b' }}
            >
              {user.name?.[0]?.toUpperCase()}
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-3 flex-wrap mb-1">
                <h1 className="text-2xl font-black text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{user.name}</h1>
                <Badge badge={badge} />
              </div>

              {user.bio
                ? <p className="text-stone-400 text-sm mb-3">{user.bio}</p>
                : <p className="text-stone-600 text-sm italic mb-3">No bio yet</p>
              }

              <div className="flex items-center gap-4 flex-wrap text-xs text-stone-500 font-semibold">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  Joined {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </span>
                <span className="flex items-center gap-1.5 font-black" style={{ color: '#f59e0b' }}>
                  ⚡ {user.respectPoints} pts
                </span>
              </div>

              {interests.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap mt-3">
                  {interests.map(slug => (
                    <Link key={slug} to={`/category/${slug}`}
                      className="px-2.5 py-1 rounded-full text-xs font-bold capitalize transition-colors"
                      style={{ background: '#1c1c1e', color: '#d6d3d1', border: '1px solid #3f3f46' }}
                    >
                      {slug}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard icon="⚡" label="Respect Points"    value={user.respectPoints} color="amber" />
          <StatCard icon="❓" label="Questions Asked"    value={stats.queriesPosted}  color="blue" />
          <StatCard icon="✅" label="Questions Solved"   value={stats.queriesSolved}  color="emerald" />
          <StatCard icon="💬" label="Answers Given"      value={stats.answersGiven}   color="violet" />
        </div>

        {/* Badge Progress */}
        <div className="rounded-2xl p-6 mb-8 bg-white" style={{ border: '2px solid #f0ede8' }}>
          <h3 className="font-black text-stone-900 mb-5 flex items-center gap-2 text-base" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            🏆 Badge Progress
          </h3>
          <div className="grid grid-cols-3 gap-3 mb-5">
            {[
              { label: 'Helper',     emoji: '🌱', min: 0,   max: 50  },
              { label: 'Pro Helper', emoji: '⚡', min: 51,  max: 200 },
              { label: 'Expert',     emoji: '🏆', min: 200, max: Infinity },
            ].map((tier, i) => {
              const isActive  = user.respectPoints >= tier.min && (tier.max === Infinity || user.respectPoints <= tier.max);
              const isEarned  = user.respectPoints > tier.max;
              return (
                <div key={i}
                  className="rounded-xl p-4 text-center transition-all duration-300"
                  style={{
                    background: isActive ? '#0a0a0a' : isEarned ? '#fff8e6' : '#fafaf9',
                    border: isActive ? '2px solid #0a0a0a' : isEarned ? '2px solid #fde68a' : '2px solid #f0ede8',
                  }}
                >
                  <div className="text-2xl mb-1">{tier.emoji}</div>
                  <div className="text-xs font-black mb-0.5" style={{ color: isActive ? '#f59e0b' : isEarned ? '#92400e' : '#a8a29e' }}>{tier.label}</div>
                  <div className="text-xs font-semibold" style={{ color: isActive ? '#71717a' : isEarned ? '#d97706' : '#d6d3d1' }}>
                    {tier.max === Infinity ? `${tier.min}+ pts` : `${tier.min}–${tier.max}`}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="h-2.5 rounded-full overflow-hidden" style={{ background: '#f0ede8' }}>
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${Math.min(100, (user.respectPoints / 200) * 100)}%`, background: '#f59e0b' }}
            />
          </div>
          <div className="flex justify-between text-xs font-bold text-stone-400 mt-1.5">
            <span>0</span><span style={{ color: '#d97706' }}>{user.respectPoints} pts</span><span>200+</span>
          </div>
        </div>

        {/* Activity tabs */}
        <div className="flex gap-2 mb-5">
          {[
            { key: 'queries',  icon: <HelpCircle className="w-4 h-4" />,     label: `Questions (${stats.queriesPosted})` },
            { key: 'answers',  icon: <MessageSquare className="w-4 h-4" />,  label: `Answers (${stats.answersGiven})` },
          ].map(t => (
            <button
              key={t.key}
              id={`tab-${t.key}`}
              onClick={() => setTab(t.key)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-black transition-all duration-200"
              style={tab === t.key
                ? { background: '#0a0a0a', color: '#f59e0b', border: '2px solid #0a0a0a' }
                : { background: 'white',   color: '#78716c',  border: '2px solid #f0ede8' }
              }
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {tab === 'queries' && (
          <div className="space-y-3 animate-fade-in">
            {recentQueries.length === 0
              ? <div className="rounded-2xl p-10 text-center bg-white" style={{ border: '2px solid #f0ede8' }}>
                  <HelpCircle className="w-10 h-10 text-stone-300 mx-auto mb-3" />
                  <p className="text-stone-400 font-semibold">No questions posted yet</p>
                </div>
              : recentQueries.map(q => <QueryCard key={q._id} query={q} />)
            }
          </div>
        )}

        {tab === 'answers' && (
          <div className="space-y-3 animate-fade-in">
            {recentAnswers.length === 0
              ? <div className="rounded-2xl p-10 text-center bg-white" style={{ border: '2px solid #f0ede8' }}>
                  <MessageSquare className="w-10 h-10 text-stone-300 mx-auto mb-3" />
                  <p className="text-stone-400 font-semibold">No answers yet</p>
                </div>
              : recentAnswers.map(a => (
                  <Link key={a._id} to={`/query/${a.queryId?._id}`} className="block group">
                    <div className="bg-white rounded-2xl p-5 transition-all duration-300 group-hover:-translate-y-0.5" style={{ border: '2px solid #f0ede8' }}>
                      <div className="flex items-start gap-3">
                        {a.isAccepted && <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#d97706' }} />}
                        <div className="flex-1 min-w-0">
                          <div className="text-xs text-stone-400 mb-1 font-semibold">
                            On: <span className="text-stone-700 font-bold">{a.queryId?.title}</span>
                            {a.isAccepted && <span className="ml-2 status-solved">Accepted</span>}
                          </div>
                          <p className="text-sm text-stone-600 line-clamp-2">{a.text}</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
            }
          </div>
        )}
      </div>
    </div>
  );
}
