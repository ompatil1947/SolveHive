import { Link } from 'react-router-dom';
import { AlertTriangle, CheckCircle2, ExternalLink } from 'lucide-react';

export default function DuplicateAlert({ duplicates, onPostAnyway }) {
  const solvedOnes = duplicates.filter((d) => d.status === 'solved');
  const openOnes = duplicates.filter((d) => d.status === 'open');

  return (
    <div className="rounded-2xl border-2 border-amber-200 bg-amber-50 p-6 animate-fade-in">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
          <AlertTriangle className="w-5 h-5 text-amber-600" />
        </div>
        <div>
          <h3 className="font-bold text-amber-900 text-base">Similar questions found</h3>
          <p className="text-sm text-amber-700">
            We found {duplicates.length} similar {duplicates.length === 1 ? 'question' : 'questions'}. Check if yours is already answered!
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {duplicates.map((dup) => (
          <div key={dup._id} className="bg-white rounded-xl p-4 border border-amber-100">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  {dup.status === 'solved' ? (
                    <span className="status-solved">
                      <CheckCircle2 className="w-3 h-3" /> Solved
                    </span>
                  ) : (
                    <span className="status-open">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Open
                    </span>
                  )}
                </div>
                <h4 className="font-semibold text-slate-800 text-sm line-clamp-1">{dup.title}</h4>
                {dup.status === 'solved' && dup.acceptedAnswer && (
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    ✅ Solved by {dup.acceptedAnswer.postedBy?.name}: "{dup.acceptedAnswer.text?.slice(0, 100)}..."
                  </p>
                )}
              </div>
              <Link
                to={`/query/${dup._id}`}
                target="_blank"
                className="btn-secondary text-xs py-1.5 px-3 flex-shrink-0"
              >
                <ExternalLink className="w-3 h-3" /> View
              </Link>
            </div>
          </div>
        ))}
      </div>

      {solvedOnes.length === 0 && (
        <p className="text-sm text-amber-700 mt-4">
          None of the similar questions have been solved yet — your new question might still help!
        </p>
      )}

      <div className="mt-4 flex gap-3">
        {solvedOnes.length > 0 && (
          <Link to={`/query/${solvedOnes[0]._id}`} className="btn-primary">
            <CheckCircle2 className="w-4 h-4" /> View Solved Answer
          </Link>
        )}
        <button onClick={onPostAnyway} className="btn-secondary">
          Post Anyway
        </button>
      </div>
    </div>
  );
}
