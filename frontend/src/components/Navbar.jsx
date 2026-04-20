import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, Menu, X, Sparkles, LogOut, LayoutDashboard, Upload } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 glass border-b border-white/10 dark:border-dark-700/50">
      <div className="section-padding">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={isAuthenticated ? '/dashboard' : '/'} className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center shadow-lg shadow-primary-500/20 group-hover:shadow-primary-500/40 transition-shadow">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">HireSense</span>
            <span className="text-xs font-semibold bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-300 px-2 py-0.5 rounded-full">AI</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-2">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className={`btn-ghost flex items-center gap-2 ${isActive('/dashboard') ? 'bg-primary-50 dark:bg-dark-800 text-primary-600 dark:text-primary-400' : ''}`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <Link
                  to="/upload"
                  className={`btn-ghost flex items-center gap-2 ${isActive('/upload') ? 'bg-primary-50 dark:bg-dark-800 text-primary-600 dark:text-primary-400' : ''}`}
                >
                  <Upload className="w-4 h-4" />
                  Upload
                </Link>
                <div className="w-px h-6 bg-dark-200 dark:bg-dark-700 mx-1" />
                <span className="text-sm text-dark-500 dark:text-dark-400 px-2">
                  {user?.name}
                </span>
                <button onClick={handleLogout} className="btn-ghost flex items-center gap-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20">
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-ghost">Sign In</Link>
                <Link to="/register" className="btn-primary text-sm">Get Started</Link>
              </>
            )}
            <button
              onClick={toggleDarkMode}
              className="ml-2 p-2 rounded-xl hover:bg-dark-100 dark:hover:bg-dark-800 transition-colors"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-dark-500" />}
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-xl hover:bg-dark-100 dark:hover:bg-dark-800 transition-colors"
            >
              {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-dark-500" />}
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-xl hover:bg-dark-100 dark:hover:bg-dark-800 transition-colors"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden glass border-t border-white/10"
          >
            <div className="section-padding py-4 flex flex-col gap-2">
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="btn-ghost w-full text-left flex items-center gap-2">
                    <LayoutDashboard className="w-4 h-4" /> Dashboard
                  </Link>
                  <Link to="/upload" onClick={() => setMobileOpen(false)} className="btn-ghost w-full text-left flex items-center gap-2">
                    <Upload className="w-4 h-4" /> Upload Resume
                  </Link>
                  <hr className="border-dark-200 dark:border-dark-700" />
                  <button onClick={() => { handleLogout(); setMobileOpen(false); }} className="btn-ghost w-full text-left flex items-center gap-2 text-red-500">
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMobileOpen(false)} className="btn-ghost w-full text-left">Sign In</Link>
                  <Link to="/register" onClick={() => setMobileOpen(false)} className="btn-primary w-full text-center">Get Started</Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
