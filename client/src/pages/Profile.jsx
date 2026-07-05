import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProfile } from '../api/users';
import StatCard from '../components/ui/StatCard';
import Badge from '../components/ui/Badge';
import QueryCard from '../components/ui/QueryCard';
import { Calendar, MessageSquare, Star, CheckCircle2, HelpCircle } from 'lucide-react';

function timeAgo(date) {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

export default function Profile() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('queries');

  useEffect(() => {
    setLoading(true);
    getProfile(id)
      .then((r) => setData(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="section">
        <div className="page-container max-w-4xl">
          <div className="card animate-pulse mb-6">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-3xl bg-slate-100" />
              <div className="space-y-2 flex-1">
                <div className="h-6 bg-slate-100 rounded w-1/3" />
                <div className="h-4 bg-slate-100 rounded w-1/2" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="section">
        <div className="page-container text-center py-20">
          <h2 className="text-2xl font-bold text-slate-700">User not found</h2>
        </div>
      </div>
    );
  }

  const { user, stats, recentQueries, recentAnswers } = data;
  const badge = user.badge;
  const interests = user.interests || [];

  return (
    <div className="section">
      <div className="page-container max-w-4xl">
        {/* Profile header */}
        <div className="card mb-6">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            {/* Avatar */}
            <div className="avatar w-20 h-20 text-3xl font-black flex-shrink-0 shadow-lg">
              {user.name?.[0]?.toUpperCase()}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap mb-1">
                <h1 className="text-2xl font-black text-slate-900">{user.name}</h1>
                <Badge badge={badge} />
              </div>

              {user.bio ? (
                <p className="text-slate-500 mb-3">{user.bio}</p>
              ) : (
                <p className="text-slate-400 text-sm italic mb-3">No bio yet</p>
              )}

              <div className="flex items-center gap-1.5 text-sm text-slate-400 mb-4">
                <Calendar className="w-4 h-4" />
                Joined {timeAgo(user.createdAt)}
                <span className="mx-2">·</span>
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span className="font-semibold text-slate-700">{user.respectPoints}</span> respect points
              </div>

              {interests.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-slate-400 font-medium">Interested in:</span>
                  {interests.map((slug) => (
                    <Link
                      key={slug}
                      to={`/category/${slug}`}
                      className="px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors capitalize"
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
          <StatCard icon="🎯" label="Respect Points" value={user.respectPoints} color="indigo" />
          <StatCard icon="❓" label="Questions Asked" value={stats.queriesPosted} color="blue" />
          <StatCard icon="✅" label="Questions Solved" value={stats.queriesSolved} color="emerald" />
          <StatCard icon="💬" label="Answers Given" value={stats.answersGiven} color="amber" />
        </div>

        {/* Badge progress */}
        <div className="card mb-8">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-400 fill-amber-400" /> Badge Progress
          </h3>
          <div className="flex items-center gap-4">
            {[
              { label: 'Helper', min: 0, max: 50, badge: 'Helper' },
              { label: 'Pro Helper', min: 51, max: 200, badge: 'Pro Helper' },
              { label: 'Expert', min: 200, max: Infinity, badge: 'Expert' },
            ].map((tier, i) => {
              const isActive = user.respectPoints >= tier.min && (tier.max === Infinity || user.respectPoints <= tier.max);
              const isEarned = user.respectPoints > tier.max;
              return (
                <div key={i} className={`flex-1 text-center p-4 rounded-xl border-2 transition-all duration-300 ${
                  isActive ? 'border-indigo-400 bg-indigo-50' : isEarned ? 'border-emerald-300 bg-emerald-50' : 'border-slate-100 bg-slate-50'
                }`}>
                  <div className="text-2xl mb-1">{tier.badge === 'Helper' ? '🌱' : tier.badge === 'Pro Helper' ? '⚡' : '🏆'}</div>
                  <div className={`text-xs font-bold ${isActive ? 'text-indigo-700' : isEarned ? 'text-emerald-700' : 'text-slate-400'}`}>
                    {tier.label}
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    {tier.max === Infinity ? `${tier.min}+ pts` : `${tier.min}–${tier.max} pts`}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-xs text-slate-400 mb-1">
              <span>0 pts</span>
              <span className="font-medium text-indigo-600">{user.respectPoints} pts</span>
              <span>200+ pts</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full gradient-bg transition-all duration-700"
                style={{ width: `${Math.min(100, (user.respectPoints / 200) * 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Activity tabs */}
        <div className="flex gap-2 mb-4">
          <button
            id="tab-queries"
            onClick={() => setTab('queries')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
              tab === 'queries' ? 'gradient-bg text-white shadow' : 'bg-white border border-slate-200 text-slate-600 hover:border-indigo-300'
            }`}
          >
            <HelpCircle className="w-4 h-4" /> Questions ({stats.queriesPosted})
          </button>
          <button
            id="tab-answers"
            onClick={() => setTab('answers')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
              tab === 'answers' ? 'gradient-bg text-white shadow' : 'bg-white border border-slate-200 text-slate-600 hover:border-indigo-300'
            }`}
          >
            <MessageSquare className="w-4 h-4" /> Answers ({stats.answersGiven})
          </button>
        </div>

        {tab === 'queries' && (
          <div className="space-y-4 animate-fade-in">
            {recentQueries.length === 0 ? (
              <div className="card text-center py-10">
                <HelpCircle className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-400">No questions posted yet</p>
              </div>
            ) : (
              recentQueries.map((q) => <QueryCard key={q._id} query={q} />)
            )}
          </div>
        )}

        {tab === 'answers' && (
          <div className="space-y-4 animate-fade-in">
            {recentAnswers.length === 0 ? (
              <div className="card text-center py-10">
                <MessageSquare className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-400">No answers posted yet</p>
              </div>
            ) : (
              recentAnswers.map((a) => (
                <Link key={a._id} to={`/query/${a.queryId?._id}`} className="block group">
                  <div className="card hover:shadow-card-hover transition-all duration-300 group-hover:-translate-y-0.5">
                    <div className="flex items-start gap-3">
                      {a.isAccepted && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-slate-400 mb-1">
                          Answered: <span className="text-slate-600 font-medium">{a.queryId?.title}</span>
                          {a.queryId?.status === 'solved' && <span className="ml-2 status-solved">Solved</span>}
                        </div>
                        <p className="text-sm text-slate-600 line-clamp-2">{a.text}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
