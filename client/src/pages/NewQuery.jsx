import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getCategories } from '../api/categories';
import { checkDuplicate, createQuery } from '../api/queries';
import DuplicateAlert from '../components/ui/DuplicateAlert';
import FileUpload from '../components/forms/FileUpload';
import { Search, Send, ChevronLeft, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const STEPS = ['Details', 'Duplicates', 'Photo', 'Submit'];

export default function NewQuery() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const presetCategory = searchParams.get('category');

  const [step, setStep] = useState(0);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    title: '',
    description: '',
    categoryId: presetCategory || '',
  });
  const [photo, setPhoto] = useState(null);
  const [duplicates, setDuplicates] = useState([]);
  const [checking, setChecking] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [skipDuplicate, setSkipDuplicate] = useState(false);

  useEffect(() => {
    getCategories().then((r) => setCategories(r.data)).catch(() => {});
  }, []);

  if (!user) {
    return (
      <div className="section">
        <div className="page-container max-w-lg">
          <div className="card text-center py-12">
            <AlertCircle className="w-12 h-12 text-indigo-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-slate-800 mb-2">Sign in required</h2>
            <p className="text-slate-500 mb-6">You need to be signed in to post a question.</p>
            <Link to="/login" className="btn-primary">Sign In</Link>
          </div>
        </div>
      </div>
    );
  }

  const handleCheckDuplicate = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.categoryId) {
      toast.error('Please fill in title and category');
      return;
    }
    setChecking(true);
    try {
      const { data } = await checkDuplicate({
        title: form.title,
        description: form.description,
        categoryId: form.categoryId,
      });
      setDuplicates(data.duplicates || []);
      setStep(1);
    } catch (err) {
      toast.error('Could not check for duplicates');
      setStep(1);
    } finally {
      setChecking(false);
    }
  };

  const handlePostAnyway = () => {
    setSkipDuplicate(true);
    setStep(2);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append('title', form.title);
      fd.append('description', form.description);
      fd.append('categoryId', form.categoryId);
      if (photo) fd.append('photo', photo);

      const { data } = await createQuery(fd);
      toast.success('Question posted! 🎉');
      navigate(`/query/${data._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post question');
    } finally {
      setSubmitting(false);
    }
  };

  const selectedCategory = categories.find((c) => c._id === form.categoryId);

  return (
    <div className="section">
      <div className="page-container max-w-2xl">
        <Link to="/browse" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-indigo-600 transition-colors mb-6">
          <ChevronLeft className="w-4 h-4" /> Back
        </Link>

        <h1 className="text-3xl font-black text-slate-900 mb-2">Ask a Question</h1>
        <p className="text-slate-500 mb-8">Get help from the SolveHive community</p>

        {/* Progress steps */}
        <div className="flex items-center gap-2 mb-8">
          {STEPS.map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold transition-all duration-300 ${
                i < step ? 'gradient-bg text-white' :
                i === step ? 'bg-indigo-100 text-indigo-700 border-2 border-indigo-400' :
                'bg-slate-100 text-slate-400'
              }`}>
                {i < step ? '✓' : i + 1}
              </div>
              <span className={`text-xs font-medium hidden sm:block ${i === step ? 'text-indigo-600' : 'text-slate-400'}`}>{s}</span>
              {i < STEPS.length - 1 && <div className="w-6 h-0.5 bg-slate-200 mx-1" />}
            </div>
          ))}
        </div>

        {/* Step 0: Details */}
        {step === 0 && (
          <form id="new-query-form" onSubmit={handleCheckDuplicate} className="card space-y-5 animate-fade-in">
            <div>
              <label className="label" htmlFor="query-title">Question Title *</label>
              <input
                id="query-title"
                type="text"
                className="input"
                placeholder="What's your question? Be specific."
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="label" htmlFor="query-description">Description *</label>
              <textarea
                id="query-description"
                className="textarea"
                rows={5}
                placeholder="Provide more context. What have you tried? What exactly are you stuck on?"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="label" htmlFor="query-category">Category *</label>
              <div className="relative">
                <select
                  id="query-category"
                  className="select"
                  value={form.categoryId}
                  onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                  required
                >
                  <option value="">Choose a category...</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.icon} {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              id="check-duplicates-btn"
              disabled={checking || !form.title || !form.categoryId}
              className="btn-primary w-full justify-center py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {checking ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Checking for similar questions...
                </span>
              ) : (
                <>
                  <Search className="w-4 h-4" /> Check for Similar Questions
                </>
              )}
            </button>
          </form>
        )}

        {/* Step 1: Duplicates */}
        {step === 1 && (
          <div className="space-y-5 animate-fade-in">
            {duplicates.length > 0 ? (
              <DuplicateAlert duplicates={duplicates} onPostAnyway={handlePostAnyway} />
            ) : (
              <div className="card text-center py-10">
                <div className="text-4xl mb-3">✨</div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">No similar questions found!</h3>
                <p className="text-slate-500 text-sm mb-6">Your question appears to be unique. Let's post it!</p>
                <button onClick={() => setStep(2)} className="btn-primary">
                  Continue to Next Step
                </button>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Photo */}
        {step === 2 && (
          <div className="card space-y-5 animate-fade-in">
            <div>
              <h2 className="font-bold text-slate-800 text-lg mb-1">Add a Photo <span className="text-slate-400 font-normal">(optional)</span></h2>
              <p className="text-sm text-slate-500 mb-4">A screenshot or photo can help others understand your question better.</p>
              <FileUpload
                label=""
                accept="image/*"
                name="photo"
                onChange={setPhoto}
              />
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(3)} className="btn-primary flex-1 justify-center py-3">
                Continue
              </button>
              <button onClick={() => { setPhoto(null); setStep(3); }} className="btn-secondary">
                Skip
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Review & Submit */}
        {step === 3 && (
          <div className="space-y-5 animate-fade-in">
            <div className="card">
              <h2 className="font-bold text-slate-800 text-lg mb-4">Review Your Question</h2>
              <div className="space-y-4">
                <div>
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Title</div>
                  <p className="text-slate-800 font-semibold">{form.title}</p>
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Description</div>
                  <p className="text-slate-600 text-sm whitespace-pre-wrap">{form.description}</p>
                </div>
                {selectedCategory && (
                  <div>
                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Category</div>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium"
                      style={{ background: selectedCategory.color + '20', color: selectedCategory.color }}>
                      {selectedCategory.icon} {selectedCategory.name}
                    </span>
                  </div>
                )}
                {photo && (
                  <div>
                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Photo</div>
                    <img src={URL.createObjectURL(photo)} alt="preview" className="h-24 rounded-xl object-cover" />
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                id="submit-query-btn"
                onClick={handleSubmit}
                disabled={submitting}
                className="btn-primary flex-1 justify-center py-3 disabled:opacity-50"
              >
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Posting...
                  </span>
                ) : (
                  <>
                    <Send className="w-4 h-4" /> Post Question
                  </>
                )}
              </button>
              <button onClick={() => setStep(2)} className="btn-secondary">
                Back
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
