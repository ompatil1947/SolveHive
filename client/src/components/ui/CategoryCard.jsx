import { Link } from 'react-router-dom';

export default function CategoryCard({ category }) {
  const { name, slug, icon, description, color, openCount = 0 } = category;

  return (
    <Link to={`/category/${slug}`} className="block group">
      <div className="card hover:shadow-card-hover transition-all duration-300 group-hover:-translate-y-1 h-full">
        {/* Icon */}
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-4 transition-transform duration-300 group-hover:scale-110"
          style={{ background: color + '18' }}
        >
          {icon}
        </div>

        {/* Content */}
        <h3 className="font-bold text-slate-800 text-base mb-1 group-hover:text-indigo-600 transition-colors">
          {name}
        </h3>
        <p className="text-sm text-slate-500 line-clamp-2 mb-4">{description}</p>

        {/* Footer */}
        <div className="flex items-center justify-between mt-auto">
          <span
            className="text-xs font-semibold px-2.5 py-1 rounded-full"
            style={{ background: color + '20', color }}
          >
            {openCount} open
          </span>
          <span className="text-xs text-slate-400 group-hover:text-indigo-500 transition-colors font-medium">
            Browse →
          </span>
        </div>
      </div>
    </Link>
  );
}
