import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCategoryQueries } from '../api/categories';
import QueryCard from '../components/ui/QueryCard';
import { PlusCircle, ChevronLeft } from 'lucide-react';

export default function CategoryPage() {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('open');
  const [page, setPage] = useState(1);

  useEffect(() => { setPage(1); }, [slug, status]);
  useEffect(() => {
    setLoading(true);
    getCategoryQueries(slug, { status, page, limit: 10 })
      .then(r => setData(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, [slug, status, page]);

  const category = data?.category;
  const queries   = data?.queries || [];
  const pagination = data?.pagination;

  return (
    <div className="section">
      <div className="page-container">
        <Link to="/browse" className="inline-flex items-center gap-1.5 text-sm font-bold text-stone-400 hover:text-amber-600 transition-colors mb-6">
          <ChevronLeft className="w-4 h-4" /> Back to Browse
        </Link>

        {/* Category header */}
        {category && (
          <div
            className="rounded-2xl p-6 mb-8 flex items-start gap-5"
            style={{ background: '#0a0a0a', border: '2px solid #1c1c1e' }}
          >
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
              style={{ background: category.color + '25', border: `2px solid ${category.color}40` }}
            >
              {category.icon}
            </div>
            <div className="flex-1">
              <h1
                className="text-3xl font-black text-white mb-1"
                style={{ fontFamily: 'Space Grotesk, sans-serif' }}
              >
                {category.name}
              </h1>
              <p className="text-stone-400 text-sm">{category.description}</p>
            </div>
            <Link
              to={`/query/new?category=${category._id}`}
              id="ask-in-category-btn"
              className="btn-primary flex-shrink-0"
            >
              <PlusCircle className="w-4 h-4" /> Ask Here
            </Link>
          </div>
        )}

        {/* Filter tabs */}
        <div className="flex items-center gap-2 mb-6">
          {['open', 'solved', 'all'].map(s => (
            <button
              key={s}
              id={`filter-${s}`}
              onClick={() => setStatus(s)}
              className="px-5 py-2 rounded-full text-sm font-black transition-all duration-200 capitalize"
              style={status === s
                ? { background: '#f59e0b', color: '#0a0a0a', border: '2px solid #f59e0b' }
                : { background: 'white', color: '#78716c', border: '2px solid #f0ede8' }
              }
            >
              {s === 'all' ? 'All' : s === 'open' ? '🟢 Open' : '✅ Solved'}
            </button>
          ))}
          {pagination && (
            <span className="ml-auto text-xs font-bold text-stone-400 uppercase tracking-wider">{pagination.total} questions</span>
          )}
        </div>

        {/* Queries */}
        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="rounded-2xl animate-pulse" style={{ background: '#f5f5f4', border: '2px solid #f0ede8', height: 90 }} />
            ))}
          </div>
        ) : queries.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">{status === 'solved' ? '🏆' : '🌱'}</div>
            <h3 className="text-xl font-black text-stone-700 mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              {status === 'solved' ? 'No solved questions yet' : 'No open questions yet'}
            </h3>
            <p className="text-stone-400 text-sm mb-6">Be the first to ask!</p>
            <Link to={`/query/new?category=${category?._id}`} className="btn-primary">
              <PlusCircle className="w-4 h-4" /> Ask first question
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {queries.map(q => <QueryCard key={q._id} query={q} showCategory={false} />)}
            </div>
            {pagination && pagination.pages > 1 && (
              <div className="flex items-center justify-center gap-3 mt-8">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="btn-secondary py-2 px-5 disabled:opacity-40">← Prev</button>
                <span className="text-sm font-bold text-stone-500">{page} / {pagination.pages}</span>
                <button onClick={() => setPage(p => Math.min(pagination.pages, p + 1))} disabled={page === pagination.pages} className="btn-secondary py-2 px-5 disabled:opacity-40">Next →</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
