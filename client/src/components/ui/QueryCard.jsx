import { Link } from 'react-router-dom';
import { MessageSquare, Clock, CheckCircle2 } from 'lucide-react';
import Badge from './Badge';

function timeAgo(date) {
  const s = Math.floor((new Date() - new Date(date)) / 1000);
  if (s < 60) return 'just now';
  const m = Math.floor(s / 60); if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60); if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24); if (d < 30) return `${d}d ago`;
  return new Date(date).toLocaleDateString();
}

export default function QueryCard({ query, showCategory = true }) {
  const { _id, title, description, postedBy, categoryId, status, answerCount, createdAt } = query;
  const solved = status === 'solved';

  return (
    <Link to={`/query/${_id}`} className="block group">
      <div
        className="bg-white rounded-2xl p-5 transition-all duration-300 group-hover:-translate-y-0.5"
        style={{
          border: solved ? '2px solid #f59e0b' : '2px solid #f0ede8',
          boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
        }}
      >
        <div className="flex items-start gap-4">
          {/* Answer count bubble */}
          <div
            className="flex-shrink-0 w-12 h-12 rounded-xl flex flex-col items-center justify-center text-center"
            style={{ background: answerCount > 0 ? '#fff8e6' : '#f5f5f4', border: answerCount > 0 ? '2px solid #fde68a' : '2px solid #e7e5e4' }}
          >
            <span className="text-base font-black" style={{ color: answerCount > 0 ? '#d97706' : '#a8a29e', lineHeight: 1 }}>
              {answerCount || 0}
            </span>
            <span className="text-xs font-bold" style={{ color: answerCount > 0 ? '#d97706' : '#a8a29e', fontSize: '9px' }}>ANS</span>
          </div>

          <div className="flex-1 min-w-0">
            {/* Tags row */}
            <div className="flex items-center gap-2 flex-wrap mb-2">
              {solved ? (
                <span className="status-solved"><CheckCircle2 className="w-3 h-3" /> Solved</span>
              ) : (
                <span className="status-open"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Open</span>
              )}
              {showCategory && categoryId && (
                <span
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold"
                  style={{ background: categoryId.color + '18', color: categoryId.color, border: `1px solid ${categoryId.color}30` }}
                >
                  {categoryId.icon} {categoryId.name}
                </span>
              )}
            </div>

            <h3
              className="font-bold text-stone-900 text-base group-hover:text-amber-700 transition-colors line-clamp-1 mb-1"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
              {title}
            </h3>
            {description && (
              <p className="text-sm text-stone-500 line-clamp-1 mb-3">{description}</p>
            )}

            <div className="flex items-center gap-4 text-xs text-stone-400">
              {postedBy && (
                <div className="flex items-center gap-1.5">
                  <div className="avatar w-5 h-5 text-xs">{postedBy.name?.[0]?.toUpperCase() || '?'}</div>
                  <span className="font-bold text-stone-600">{postedBy.name}</span>
                  <Badge badge={
                    postedBy.respectPoints >= 200 ? 'Expert' :
                    postedBy.respectPoints >= 51  ? 'Pro Helper' : 'Helper'
                  } />
                </div>
              )}
              <div className="flex items-center gap-1 ml-auto">
                <Clock className="w-3 h-3" /> {timeAgo(createdAt)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
