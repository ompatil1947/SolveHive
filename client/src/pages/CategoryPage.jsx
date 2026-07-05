import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCategoryQueries } from '../api/categories';
import QueryCard from '../components/ui/QueryCard';
import { PlusCircle, Filter, ChevronLeft } from 'lucide-react';

export default function CategoryPage() {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('open');
  const [page, setPage] = useState(1);

  const fetchQueries = () => {
    setLoading(true);
    getCategoryQueries(slug, { status, page, limit: 10 })
      .then((r) => setData(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    setPage(1);
  }, [slug, status]);

  useEffect(() => {
    fetchQueries();
  }, [slug, status, page]);

  const category = data?.category;
  const queries = data?.queries || [];
  const pagination = data?.pagination;

  return (
    <div className="section">
      <div className="page-container">
        {/* Back */}
        <Link to="/browse" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-indigo-600 transition-colors mb-6">
          <ChevronLeft className="w-4 h-4" /> Back to Browse
        </Link>

        {/* Category header */}
        {category && (
          <div className="flex items-start gap-5 mb-8 p-6 rounded-2xl bg-white border border-slate-100 shadow-card">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
              style={{ background: category.color + '20' }}
            >
              {category.icon}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-black text-slate-900 mb-1">{category.name}</h1>
              <p className="text-slate-500">{category.description}</p>
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

        {/* Filters */}
        <div className="flex items-center gap-3 mb-6">
          <Filter className="w-4 h-4 text-slate-400" />
          {['open', 'solved', 'all'].map((s) => (
            <button
              key={s}
              id={`filter-${s}`}
              onClick={() => setStatus(s)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 capitalize ${
                status === s
                  ? 'gradient-bg text-white shadow-md'
                  : 'bg-white border border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-600'
              }`}
            >
              {s === 'all' ? 'All' : s === 'open' ? '🟢 Open' : '✅ Solved'}
            </button>
          ))}
          {pagination && (
            <span className="ml-auto text-sm text-slate-400">{pagination.total} questions</span>
          )}
        </div>

        {/* Queries list */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="card animate-pulse">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-slate-100 rounded-xl flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-slate-100 rounded w-3/4" />
                    <div className="h-3 bg-slate-100 rounded w-1/2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : queries.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">{status === 'solved' ? '🏆' : '🌱'}</div>
            <h3 className="text-xl font-bold text-slate-700 mb-2">
              {status === 'solved' ? 'No solved questions yet' : 'No questions yet in this category'}
            </h3>
            <p className="text-slate-500 mb-6">Be the first to ask something!</p>
            <Link to={`/query/new?category=${category?._id}`} className="btn-primary">
              <PlusCircle className="w-4 h-4" /> Ask the first question
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {queries.map((q) => (
                <QueryCard key={q._id} query={q} showCategory={false} />
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.pages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="btn-secondary py-2 px-4 disabled:opacity-40"
                >
                  Previous
                </button>
                <span className="text-sm text-slate-500">
                  Page {page} of {pagination.pages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
                  disabled={page === pagination.pages}
                  className="btn-secondary py-2 px-4 disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
