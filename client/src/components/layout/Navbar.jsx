import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';
import { Menu, X, Hexagon, PlusCircle, LayoutGrid, LogOut, User } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="page-container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-slate-800">
            <div className="w-8 h-8 rounded-xl gradient-bg flex items-center justify-center shadow-md">
              <Hexagon className="w-4 h-4 text-white" fill="white" />
            </div>
            <span>
              Solve<span className="gradient-text">Hive</span>
            </span>
          </Link>

          {/* Center Nav */}
          <div className="hidden md:flex items-center gap-1">
            <Link to="/browse" className="btn-ghost">
              <LayoutGrid className="w-4 h-4" />
              Browse
            </Link>
            {user && (
              <Link to="/query/new" className="btn-ghost">
                <PlusCircle className="w-4 h-4" />
                Ask a Question
              </Link>
            )}
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button
                  id="profile-menu-btn"
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  <div className="avatar w-8 h-8 text-sm">{initials}</div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-slate-800 leading-none">{user.name}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{user.respectPoints || 0} pts</p>
                  </div>
                </button>

                {profileOpen && (
                  <div className="absolute right-0 top-12 w-48 bg-white rounded-2xl shadow-card-hover border border-slate-100 py-2 animate-fade-in">
                    <Link
                      to={`/profile/${user._id}`}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
                      onClick={() => setProfileOpen(false)}
                    >
                      <User className="w-4 h-4" /> My Profile
                    </Link>
                    <div className="divider my-1" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 w-full"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="btn-secondary">
                  Sign In
                </Link>
                <Link to="/signup" className="btn-primary">
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-xl hover:bg-slate-100"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden py-4 border-t border-slate-100 animate-fade-in space-y-1">
            <Link
              to="/browse"
              className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50"
              onClick={() => setMenuOpen(false)}
            >
              <LayoutGrid className="w-4 h-4" /> Browse
            </Link>
            {user ? (
              <>
                <Link
                  to="/query/new"
                  className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50"
                  onClick={() => setMenuOpen(false)}
                >
                  <PlusCircle className="w-4 h-4" /> Ask a Question
                </Link>
                <Link
                  to={`/profile/${user._id}`}
                  className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50"
                  onClick={() => setMenuOpen(false)}
                >
                  <User className="w-4 h-4" /> My Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 w-full"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </>
            ) : (
              <div className="flex gap-2 px-4 pt-2">
                <Link to="/login" className="btn-secondary flex-1 justify-center" onClick={() => setMenuOpen(false)}>Sign In</Link>
                <Link to="/signup" className="btn-primary flex-1 justify-center" onClick={() => setMenuOpen(false)}>Sign Up</Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
