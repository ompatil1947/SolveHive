import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';
import { Menu, X, PlusCircle, LayoutGrid, LogOut, User, Zap } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); };

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md" style={{ borderBottom: '2px solid #f0ede8' }}>
      <div className="page-container">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-black text-xl tracking-tight text-stone-900" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: '#f59e0b' }}>
              <span className="text-black text-sm font-black">SH</span>
            </div>
            Solve<span style={{ color: '#f59e0b' }}>Hive</span>
          </Link>

          {/* Center links */}
          <div className="hidden md:flex items-center gap-1">
            <Link to="/browse" className="btn-ghost font-semibold">
              <LayoutGrid className="w-4 h-4" /> Browse
            </Link>
            {user && (
              <Link to="/query/new" className="btn-ghost font-semibold">
                <PlusCircle className="w-4 h-4" /> Ask
              </Link>
            )}
          </div>

          {/* Right */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button
                  id="profile-menu-btn"
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2.5 pl-1 pr-3 py-1 rounded-full border-2 border-stone-200 hover:border-amber-400 transition-all duration-200"
                >
                  <div className="avatar w-7 h-7 text-xs font-black">{initials}</div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-stone-800 leading-none">{user.name}</p>
                    <p className="text-xs text-amber-600 font-semibold mt-0.5">{user.respectPoints || 0} pts</p>
                  </div>
                </button>

                {profileOpen && (
                  <div className="absolute right-0 top-12 w-48 bg-white rounded-2xl shadow-xl border-2 border-stone-100 py-2 animate-fade-in">
                    <Link
                      to={`/profile/${user._id}`}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-stone-700 hover:bg-amber-50 hover:text-amber-800"
                      onClick={() => setProfileOpen(false)}
                    >
                      <User className="w-4 h-4" /> My Profile
                    </Link>
                    <div className="border-t border-stone-100 my-1" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-red-500 hover:bg-red-50 w-full"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="btn-secondary text-xs px-5 py-2.5">Sign In</Link>
                <Link to="/signup" className="btn-primary text-xs px-5 py-2.5">
                  <Zap className="w-3.5 h-3.5" /> Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile */}
          <button className="md:hidden p-2 rounded-xl hover:bg-stone-100" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden py-4 border-t-2 border-stone-100 animate-fade-in space-y-1">
            <Link to="/browse" className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-bold text-stone-700 hover:bg-amber-50" onClick={() => setMenuOpen(false)}>
              <LayoutGrid className="w-4 h-4" /> Browse
            </Link>
            {user ? (
              <>
                <Link to="/query/new" className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-bold text-stone-700 hover:bg-amber-50" onClick={() => setMenuOpen(false)}>
                  <PlusCircle className="w-4 h-4" /> Ask a Question
                </Link>
                <Link to={`/profile/${user._id}`} className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-bold text-stone-700 hover:bg-amber-50" onClick={() => setMenuOpen(false)}>
                  <User className="w-4 h-4" /> Profile
                </Link>
                <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 w-full">
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
