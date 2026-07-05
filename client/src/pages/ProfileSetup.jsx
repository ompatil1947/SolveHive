import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { setupProfile } from '../api/users';
import { Check, ChevronRight, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

const CATEGORIES = [
  { slug: 'coding', icon: '💻', name: 'Coding' },
  { slug: 'electronics', icon: '🔌', name: 'Electronics' },
  { slug: 'career', icon: '💼', name: 'Career' },
  { slug: 'health', icon: '🏥', name: 'Health' },
  { slug: 'cooking', icon: '🍳', name: 'Cooking' },
  { slug: 'diy', icon: '🔧', name: 'DIY' },
  { slug: 'academics', icon: '📚', name: 'Academics' },
  { slug: 'other', icon: '💡', name: 'Other' },
];

export default function ProfileSetup() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: user?.name || '', bio: '', interests: [] });
  const [loading, setLoading] = useState(false);

  const toggleInterest = (slug) => {
    setForm((prev) => ({
      ...prev,
      interests: prev.interests.includes(slug)
        ? prev.interests.filter((s) => s !== slug)
        : [...prev.interests, slug],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await setupProfile(form);
      updateUser({ ...data, profileSetupComplete: true });
      toast.success('Profile set up! Welcome to the hive 🐝');
      navigate('/browse');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => navigate('/browse');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg animate-fade-in">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-3xl gradient-bg flex items-center justify-center mx-auto mb-4 shadow-xl text-2xl animate-float">
            🐝
          </div>
          <h1 className="text-3xl font-black text-slate-900 mb-2">Set up your profile</h1>
          <p className="text-slate-500">Tell the community a bit about yourself</p>
        </div>

        <div className="card">
          <form id="profile-setup-form" onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label className="label" htmlFor="setup-name">Display Name</label>
              <input
                id="setup-name"
                type="text"
                className="input"
                placeholder="How should we call you?"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>

            {/* Bio */}
            <div>
              <label className="label" htmlFor="setup-bio">
                Short Bio <span className="text-slate-400 font-normal">(optional)</span>
              </label>
              <textarea
                id="setup-bio"
                className="textarea"
                rows={3}
                maxLength={300}
                placeholder="Tell others what you're good at or what you're curious about..."
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
              />
              <p className="text-xs text-slate-400 mt-1 text-right">{form.bio.length}/300</p>
            </div>

            {/* Interests */}
            <div>
              <label className="label">
                Areas of Interest <span className="text-slate-400 font-normal">(pick up to 3)</span>
              </label>
              <div className="grid grid-cols-4 gap-2">
                {CATEGORIES.map((cat) => {
                  const selected = form.interests.includes(cat.slug);
                  const maxed = form.interests.length >= 3 && !selected;
                  return (
                    <button
                      key={cat.slug}
                      type="button"
                      disabled={maxed}
                      id={`interest-${cat.slug}`}
                      onClick={() => toggleInterest(cat.slug)}
                      className={`relative flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 text-center transition-all duration-200 ${
                        selected
                          ? 'border-indigo-400 bg-indigo-50 text-indigo-700'
                          : maxed
                          ? 'border-slate-100 bg-slate-50 opacity-40 cursor-not-allowed'
                          : 'border-slate-200 hover:border-indigo-200 hover:bg-indigo-50/50'
                      }`}
                    >
                      {selected && (
                        <div className="absolute top-1 right-1 w-4 h-4 bg-indigo-500 rounded-full flex items-center justify-center">
                          <Check className="w-2.5 h-2.5 text-white" />
                        </div>
                      )}
                      <span className="text-xl">{cat.icon}</span>
                      <span className="text-xs font-medium leading-tight">{cat.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                id="profile-setup-submit"
                disabled={loading || !form.name}
                className="btn-primary flex-1 justify-center py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Saving...
                  </span>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" /> Complete Setup
                  </>
                )}
              </button>
              <button type="button" onClick={handleSkip} className="btn-secondary">
                Skip <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
