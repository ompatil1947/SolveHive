import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-stone-900 text-white mt-16">
      <div className="page-container py-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 font-black text-xl mb-3" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#f59e0b' }}>
                <span className="text-black text-sm font-black">SH</span>
              </div>
              Solve<span style={{ color: '#f59e0b' }}>Hive</span>
            </div>
            <p className="text-stone-400 text-sm max-w-xs">Community-powered answers for every real-world problem. Ask, answer, earn.</p>
          </div>

          {/* Links */}
          <nav className="flex flex-col sm:flex-row gap-6 text-sm">
            <div>
              <p className="font-bold text-stone-300 mb-2 text-xs uppercase tracking-widest">Platform</p>
              <div className="flex flex-col gap-1.5">
                <Link to="/browse" className="text-stone-400 hover:text-amber-400 transition-colors">Browse Topics</Link>
                <Link to="/query/new" className="text-stone-400 hover:text-amber-400 transition-colors">Ask a Question</Link>
                <Link to="/signup" className="text-stone-400 hover:text-amber-400 transition-colors">Join the Hive</Link>
              </div>
            </div>
          </nav>

          {/* CTA pill */}
          <Link to="/signup" className="btn-primary text-sm">
            🐝 Join Free
          </Link>
        </div>

        <div className="mt-10 pt-6 border-t border-stone-800 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-xs text-stone-500">© {new Date().getFullYear()} SolveHive. Built for curious minds.</p>
          <p className="text-xs text-stone-600">v1.0</p>
        </div>
      </div>
    </footer>
  );
}
