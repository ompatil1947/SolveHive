import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCategories } from '../api/categories';
import CategoryCard from '../components/ui/CategoryCard';
import { Search, LayoutGrid } from 'lucide-react';

export default function Browse() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    getCategories()
      .then((r) => setCategories(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = categories.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="section">
      <div className="page-container">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-2 text-indigo-600 font-semibold text-sm mb-2">
            <LayoutGrid className="w-4 h-4" />
            Browse Topics
          </div>
          <h1 className="text-4xl font-black text-slate-900 mb-3">Find your area</h1>
          <p className="text-slate-500 text-lg max-w-xl">
            Browse through {categories.length} categories and find questions you can answer or ask.
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-8 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            className="input pl-10"
            placeholder="Search categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="card animate-pulse">
                <div className="w-14 h-14 bg-slate-100 rounded-2xl mb-4" />
                <div className="h-4 bg-slate-100 rounded w-1/2 mb-2" />
                <div className="h-3 bg-slate-100 rounded w-3/4" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-slate-700 mb-2">No categories found</h3>
            <p className="text-slate-500">Try a different search term</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {filtered.map((cat) => (
              <CategoryCard key={cat._id} category={cat} />
            ))}
          </div>
        )}

        {/* Ask CTA */}
        <div className="mt-12 p-6 rounded-2xl bg-indigo-50 border border-indigo-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-slate-800 text-lg mb-1">Can't find what you need?</h3>
            <p className="text-slate-500 text-sm">Post your question and let the community help</p>
          </div>
          <Link to="/query/new" className="btn-primary flex-shrink-0">
            Ask a Question
          </Link>
        </div>
      </div>
    </div>
  );
}
