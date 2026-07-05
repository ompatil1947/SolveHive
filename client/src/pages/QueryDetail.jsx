import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getQuery } from '../api/queries';
import { postAnswer, acceptAnswer } from '../api/answers';
import AnswerCard from '../components/ui/AnswerCard';
import FileUpload from '../components/forms/FileUpload';
import Badge from '../components/ui/Badge';
import { MessageSquare, Clock, Send, ChevronLeft, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

function timeAgo(date) {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function QueryDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [answerText, setAnswerText] = useState('');
  const [answerPhoto, setAnswerPhoto] = useState(null);
  const [answerVideo, setAnswerVideo] = useState(null);
  const [submittingAnswer, setSubmittingAnswer] = useState(false);
  const [acceptingId, setAcceptingId] = useState(null);

  const fetchData = () => {
    getQuery(id)
      .then((r) => setData(r.data))
      .catch(() => toast.error('Failed to load question'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleAnswerSubmit = async (e) => {
    e.preventDefault();
    if (!answerText.trim()) { toast.error('Answer text is required'); return; }
    setSubmittingAnswer(true);
    try {
      const fd = new FormData();
      fd.append('queryId', id);
      fd.append('text', answerText);
      if (answerPhoto) fd.append('photo', answerPhoto);
      if (answerVideo) fd.append('video', answerVideo);
      await postAnswer(fd);
      toast.success('Answer posted! 🎉');
      setAnswerText('');
      setAnswerPhoto(null);
      setAnswerVideo(null);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post answer');
    } finally {
      setSubmittingAnswer(false);
    }
  };

  const handleAccept = async (answerId) => {
    setAcceptingId(answerId);
    try {
      await acceptAnswer(answerId);
      toast.success('Answer accepted! +10 points awarded 🏆');
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to accept answer');
    } finally {
      setAcceptingId(null);
    }
  };

  if (loading) {
    return (
      <div className="section">
        <div className="page-container max-w-3xl">
          <div className="card animate-pulse space-y-4">
            <div className="h-8 bg-slate-100 rounded w-3/4" />
            <div className="h-4 bg-slate-100 rounded w-1/4" />
            <div className="h-24 bg-slate-100 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const { query, answers } = data;
  const isOwner = user && query.postedBy?._id === user._id;
  const category = query.categoryId;

  return (
    <div className="section">
      <div className="page-container max-w-3xl">
        <Link
          to={category ? `/category/${category.slug}` : '/browse'}
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-indigo-600 transition-colors mb-6"
        >
          <ChevronLeft className="w-4 h-4" /> Back
        </Link>

        {/* Query card */}
        <div className="card mb-6">
          {/* Status + Category */}
          <div className="flex items-center gap-3 flex-wrap mb-4">
            {query.status === 'solved' ? (
              <span className="status-solved text-sm px-3 py-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Solved
              </span>
            ) : (
              <span className="status-open text-sm px-3 py-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500" /> Open
              </span>
            )}
            {category && (
              <span
                className="px-3 py-1 rounded-full text-sm font-medium"
                style={{ background: category.color + '20', color: category.color }}
              >
                {category.icon} {category.name}
              </span>
            )}
          </div>

          <h1 className="text-2xl font-black text-slate-900 mb-4">{query.title}</h1>
          <p className="text-slate-600 leading-relaxed whitespace-pre-wrap mb-5">{query.description}</p>

          {query.photoUrl && (
            <img
              src={query.photoUrl}
              alt="Question attachment"
              className="rounded-xl max-h-72 object-cover border border-slate-100 mb-5"
            />
          )}

          {/* Poster info */}
          {query.postedBy && (
            <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
              <div className="avatar w-10 h-10">
                {query.postedBy.name?.[0]?.toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <Link
                    to={`/profile/${query.postedBy._id}`}
                    className="text-sm font-semibold text-slate-800 hover:text-indigo-600 transition-colors"
                  >
                    {query.postedBy.name}
                  </Link>
                  <Badge badge={
                    (query.postedBy.respectPoints || 0) >= 200 ? 'Expert' :
                    (query.postedBy.respectPoints || 0) >= 51 ? 'Pro Helper' : 'Helper'
                  } />
                </div>
                <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                  <Clock className="w-3 h-3" />
                  Asked {timeAgo(query.createdAt)}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Answers header */}
        <div className="flex items-center gap-2 mb-4">
          <MessageSquare className="w-5 h-5 text-indigo-500" />
          <h2 className="text-lg font-bold text-slate-800">
            {answers.length} {answers.length === 1 ? 'Answer' : 'Answers'}
          </h2>
        </div>

        {/* Answer list */}
        {answers.length === 0 ? (
          <div className="card text-center py-12 mb-6">
            <div className="text-4xl mb-3">🤔</div>
            <h3 className="font-bold text-slate-700 mb-1">No answers yet</h3>
            <p className="text-slate-400 text-sm">Be the first to help!</p>
          </div>
        ) : (
          <div className="space-y-4 mb-6">
            {answers.map((a) => (
              <AnswerCard
                key={a._id}
                answer={a}
                isQueryOwner={isOwner}
                queryStatus={query.status}
                onAccept={handleAccept}
                accepting={acceptingId === a._id}
              />
            ))}
          </div>
        )}

        {/* Answer form */}
        {user ? (
          query.status === 'open' ? (
            <div className="card animate-fade-in">
              <h3 className="font-bold text-slate-800 text-lg mb-4">Your Answer</h3>
              <form id="answer-form" onSubmit={handleAnswerSubmit} className="space-y-5">
                <div>
                  <label className="label" htmlFor="answer-text">Answer *</label>
                  <textarea
                    id="answer-text"
                    className="textarea"
                    rows={5}
                    placeholder="Write a clear, helpful answer. Share what you know!"
                    value={answerText}
                    onChange={(e) => setAnswerText(e.target.value)}
                    required
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <FileUpload
                    label="Attach Photo (optional)"
                    accept="image/*"
                    name="photo"
                    onChange={setAnswerPhoto}
                  />
                  <FileUpload
                    label="Attach Video (optional)"
                    accept="video/*"
                    name="video"
                    onChange={setAnswerVideo}
                  />
                </div>

                <button
                  id="submit-answer-btn"
                  type="submit"
                  disabled={submittingAnswer || !answerText.trim()}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed py-3 px-8"
                >
                  {submittingAnswer ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      Posting...
                    </span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" /> Post Answer
                    </>
                  )}
                </button>
              </form>
            </div>
          ) : (
            <div className="card text-center py-8 bg-emerald-50 border border-emerald-100">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
              <h3 className="font-bold text-slate-800 mb-1">Question Solved!</h3>
              <p className="text-slate-500 text-sm">This question has been marked as solved. No more answers needed.</p>
            </div>
          )
        ) : (
          <div className="card text-center py-8">
            <p className="text-slate-500 mb-4">Sign in to post an answer</p>
            <Link to="/login" className="btn-primary">Sign In to Answer</Link>
          </div>
        )}
      </div>
    </div>
  );
}
