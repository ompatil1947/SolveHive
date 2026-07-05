import { CheckCircle2, Clock } from 'lucide-react';
import Badge from './Badge';

function timeAgo(date) {
  const s = Math.floor((new Date() - new Date(date)) / 1000);
  if (s < 60) return 'just now';
  const m = Math.floor(s / 60); if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60); if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24); return `${d}d ago`;
}

export default function AnswerCard({ answer, isQueryOwner, queryStatus, onAccept, accepting }) {
  const { _id, text, photoUrl, videoUrl, postedBy, isAccepted, createdAt } = answer;

  return (
    <div
      className="bg-white rounded-2xl p-6 transition-all duration-300"
      style={{
        border: isAccepted ? '2px solid #f59e0b' : '2px solid #f0ede8',
        boxShadow: isAccepted ? '0 4px 24px rgba(245,158,11,0.15)' : '0 2px 12px rgba(0,0,0,0.04)',
      }}
    >
      {isAccepted && (
        <div
          className="flex items-center gap-2 text-sm font-black mb-4 pb-4"
          style={{ color: '#d97706', borderBottom: '2px solid #fde68a' }}
        >
          <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: '#f59e0b' }}>
            <CheckCircle2 className="w-3.5 h-3.5 text-black" />
          </div>
          ACCEPTED ANSWER
        </div>
      )}

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="avatar w-10 h-10 text-sm font-black">
            {postedBy?.name?.[0]?.toUpperCase() || '?'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-stone-900">{postedBy?.name}</span>
              <Badge badge={
                (postedBy?.respectPoints || 0) >= 200 ? 'Expert' :
                (postedBy?.respectPoints || 0) >= 51  ? 'Pro Helper' : 'Helper'
              } />
            </div>
            <div className="flex items-center gap-1 text-xs text-stone-400 mt-0.5 font-medium">
              <Clock className="w-3 h-3" /> {timeAgo(createdAt)}
              <span className="mx-1.5">·</span> {postedBy?.respectPoints || 0} pts
            </div>
          </div>
        </div>

        {isQueryOwner && !isAccepted && queryStatus === 'open' && (
          <button
            id={`accept-answer-${_id}`}
            onClick={() => onAccept(_id)}
            disabled={accepting}
            className="btn-success text-xs py-1.5 px-4 rounded-full disabled:opacity-50"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            {accepting ? 'Accepting...' : 'Accept'}
          </button>
        )}
      </div>

      <p className="text-stone-700 leading-relaxed whitespace-pre-wrap text-sm">{text}</p>

      {photoUrl && (
        <img src={photoUrl} alt="Answer attachment" className="mt-4 rounded-xl max-h-64 object-cover border-2 border-stone-100" />
      )}
      {videoUrl && (
        <video src={videoUrl} controls className="mt-4 rounded-xl max-h-64 w-full border-2 border-stone-100" />
      )}
    </div>
  );
}
