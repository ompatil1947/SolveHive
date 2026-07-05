import { Link } from 'react-router-dom';
import { MessageSquare, Clock, CheckCircle2 } from 'lucide-react';
import Badge from './Badge';

function timeAgo(date) {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(date).toLocaleDateString();
}

export default function QueryCard({ query, showCategory = true }) {
  const { _id, title, description, postedBy, categoryId, status, answerCount, createdAt } = query;

  return (
    <Link to={`/query/${_id}`} className="block group">
      <div className="card hover:shadow-card-hover transition-all duration-300 group-hover:-translate-y-0.5">
        <div className="flex items-start gap-4">
          {/* Left: answer count */}
          <div className="flex-shrink-0 text-center w-12">
            <div className={`text-lg font-bold ${answerCount > 0 ? 'text-indigo-600' : 'text-slate-300'}`}>
              {answerCount || 0}
            </div>
            <div className="text-xs text-slate-400">ans</div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1.5">
              {status === 'solved' ? (
                <span className="status-solved">
                  <CheckCircle2 className="w-3 h-3" /> Solved
                </span>
              ) : (
                <span className="status-open">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Open
                </span>
              )}
              {showCategory && categoryId && (
                <span
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
                  style={{ background: categoryId.color + '20', color: categoryId.color }}
                >
                  {categoryId.icon} {categoryId.name}
                </span>
              )}
            </div>

            <h3 className="font-semibold text-slate-800 text-base group-hover:text-indigo-600 transition-colors line-clamp-1 mb-1">
              {title}
            </h3>

            {description && (
              <p className="text-sm text-slate-500 line-clamp-2 mb-3">{description}</p>
            )}

            <div className="flex items-center gap-4 text-xs text-slate-400">
              {postedBy && (
                <div className="flex items-center gap-1.5">
                  <div className="avatar w-5 h-5 text-xs">
                    {postedBy.name?.[0]?.toUpperCase() || '?'}
                  </div>
                  <span className="font-medium text-slate-600">{postedBy.name}</span>
                  {postedBy.respectPoints !== undefined && (
                    <Badge badge={
                      postedBy.respectPoints >= 200 ? 'Expert' :
                      postedBy.respectPoints >= 51 ? 'Pro Helper' : 'Helper'
                    } />
                  )}
                </div>
              )}
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {timeAgo(createdAt)}
              </div>
              <div className="flex items-center gap-1">
                <MessageSquare className="w-3 h-3" />
                {answerCount || 0} {answerCount === 1 ? 'answer' : 'answers'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
