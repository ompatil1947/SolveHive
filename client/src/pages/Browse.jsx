import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCategories } from '../api/categories';
import CategoryCard from '../components/ui/CategoryCard';
import { Search, PlusCircle } from 'lucide-react';

export default function Browse() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    getCategories().then(r => setCategories(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const filtered = categories.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="section">
      <div className="page-container">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-amber-600 mb-3 block">All Topics</span>
            <h1 className="text-4xl md:text-5xl font-black text-stone-900 leading-none" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Browse categories
            </h1>
          </div>
          <Link to="/query/new" className="btn-primary self-start md:self-auto">
            <PlusCircle className="w-4 h-4" /> Ask a Question
          </Link>
        </div>

        {/* Search */}
        <div className="relative mb-8 max-w-sm">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            className="input pl-11"
            placeholder="Search topics..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="rounded-2xl p-5 animate-pulse" style={{ background: '#f5f5f4', border: '2px solid #f0ede8', height: 180 }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-stone-700 mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Nothing found</h3>
            <p className="text-stone-400 text-sm">Try a different search term</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 stagger">
            {filtered.map(cat => <CategoryCard key={cat._id} category={cat} />)}
          </div>
        )}

        {/* Bottom CTA */}
        <div
          className="mt-12 p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ background: '#fff8e6', border: '2px solid #fde68a' }}
        >
          <div>
            <h3 className="font-black text-stone-900 text-lg mb-1" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Can't find what you need?</h3>
            <p className="text-stone-500 text-sm">Post your question and let the community help</p>
          </div>
          <Link to="/query/new" className="btn-primary flex-shrink-0">Ask a Question</Link>
        </div>
      </div>
    </div>
  );
}
