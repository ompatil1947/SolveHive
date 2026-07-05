import { Link } from 'react-router-dom';
import { Hexagon, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-100 mt-16">
      <div className="page-container py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <Link to="/" className="flex items-center gap-2 font-bold text-lg text-slate-800">
            <div className="w-7 h-7 rounded-lg gradient-bg flex items-center justify-center">
              <Hexagon className="w-3.5 h-3.5 text-white" fill="white" />
            </div>
            SolveHive
          </Link>

          <nav className="flex items-center gap-6 text-sm text-slate-500">
            <Link to="/browse" className="hover:text-indigo-600 transition-colors">Browse</Link>
            <Link to="/query/new" className="hover:text-indigo-600 transition-colors">Ask a Question</Link>
            <Link to="/signup" className="hover:text-indigo-600 transition-colors">Join</Link>
          </nav>

          <p className="text-sm text-slate-400 flex items-center gap-1.5">
            Made with <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400" /> by the community
          </p>
        </div>
        <div className="mt-8 pt-6 border-t border-slate-100 text-center text-xs text-slate-400">
          © {new Date().getFullYear()} SolveHive. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
