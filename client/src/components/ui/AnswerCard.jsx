import { CheckCircle2, Clock } from 'lucide-react';
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

export default function AnswerCard({ answer, isQueryOwner, queryStatus, onAccept, accepting }) {
  const { _id, text, photoUrl, videoUrl, postedBy, isAccepted, createdAt } = answer;

  return (
    <div className={`card transition-all duration-300 ${isAccepted ? 'border-2 border-emerald-400 shadow-[0_0_0_4px_rgba(52,211,153,0.15)]' : ''}`}>
      {isAccepted && (
        <div className="flex items-center gap-2 text-emerald-600 font-semibold text-sm mb-4 pb-4 border-b border-emerald-100">
          <CheckCircle2 className="w-5 h-5 fill-emerald-100" />
          Accepted Answer
        </div>
      )}

      {/* Author info */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="avatar w-9 h-9 text-sm font-bold">
            {postedBy?.name?.[0]?.toUpperCase() || '?'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-slate-800">{postedBy?.name}</span>
              <Badge badge={
                (postedBy?.respectPoints || 0) >= 200 ? 'Expert' :
                (postedBy?.respectPoints || 0) >= 51 ? 'Pro Helper' : 'Helper'
              } />
            </div>
            <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
              <Clock className="w-3 h-3" />
              {timeAgo(createdAt)}
              <span className="mx-1">·</span>
              {postedBy?.respectPoints || 0} pts
            </div>
          </div>
        </div>

        {/* Accept button */}
        {isQueryOwner && !isAccepted && queryStatus === 'open' && (
          <button
            id={`accept-answer-${_id}`}
            onClick={() => onAccept(_id)}
            disabled={accepting}
            className="btn-success text-xs py-1.5 px-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            {accepting ? 'Accepting...' : 'Accept'}
          </button>
        )}
      </div>

      {/* Answer text */}
      <div className="prose prose-sm max-w-none">
        <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{text}</p>
      </div>

      {/* Media */}
      {photoUrl && (
        <div className="mt-4">
          <img
            src={photoUrl}
            alt="Answer attachment"
            className="rounded-xl max-h-64 object-cover border border-slate-100"
          />
        </div>
      )}
      {videoUrl && (
        <div className="mt-4">
          <video
            src={videoUrl}
            controls
            className="rounded-xl max-h-64 w-full border border-slate-100"
          />
        </div>
      )}
    </div>
  );
}
