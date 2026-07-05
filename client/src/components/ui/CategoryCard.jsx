import { Link } from 'react-router-dom';

export default function CategoryCard({ category }) {
  const { name, slug, icon, description, color, openCount = 0 } = category;

  return (
    <Link to={`/category/${slug}`} className="block group">
      <div
        className="bg-white rounded-2xl p-5 h-full transition-all duration-300 group-hover:-translate-y-1"
        style={{ border: '2px solid #f0ede8', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}
      >
        {/* Icon + count row */}
        <div className="flex items-start justify-between mb-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-transform duration-300 group-hover:scale-110"
            style={{ background: color + '18', border: `2px solid ${color}25` }}
          >
            {icon}
          </div>
          <span
            className="text-xs font-black px-2.5 py-1 rounded-full"
            style={{ background: openCount > 0 ? '#fff8e6' : '#f5f5f4', color: openCount > 0 ? '#d97706' : '#a8a29e', border: openCount > 0 ? '1.5px solid #fde68a' : '1.5px solid #e7e5e4' }}
          >
            {openCount} open
          </span>
        </div>

        <h3
          className="font-bold text-stone-900 text-base mb-1.5 group-hover:text-amber-700 transition-colors"
          style={{ fontFamily: 'Space Grotesk, sans-serif' }}
        >
          {name}
        </h3>
        <p className="text-xs text-stone-500 line-clamp-2 mb-4 leading-relaxed">{description}</p>

        <div className="flex items-center justify-between">
          <div className="w-8 h-0.5 rounded-full transition-all duration-300 group-hover:w-12" style={{ background: color }} />
          <span
            className="text-xs font-bold transition-colors duration-200"
            style={{ color: '#d1d5db' }}
          >
            Browse →
          </span>
        </div>
      </div>
    </Link>
  );
}
