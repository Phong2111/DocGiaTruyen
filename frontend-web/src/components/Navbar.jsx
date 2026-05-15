import React, { useState, useEffect } from 'react';
import { Moon, Sun, BookOpen, Menu, Search, User } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';

const Navbar = () => {
  const [isDark, setIsDark] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const { isAuthenticated, user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const isHomePage = location.pathname === '/';
  const isWhiteText = isHomePage && !scrolled;

  const handleLogout = () => {
    dispatch(logout());
    setDropdownOpen(false);
    navigate('/');
  };

  useEffect(() => {
    // Check initial theme
    if (document.documentElement.classList.contains('dark')) {
      setIsDark(true);
    }
    
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'glass py-3 shadow-md' : 'bg-transparent py-5 dark:text-white'}`}>
      <div className="container mx-auto px-4 md:px-8 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 group">
          <BookOpen className={`w-8 h-8 ${!isWhiteText ? 'text-primary-600 dark:text-primary-400' : 'text-primary-500'} group-hover:scale-110 transition-transform`} />
          <span className={`text-2xl font-bold tracking-tighter ${!isWhiteText ? 'text-slate-900 dark:text-white' : 'text-white drop-shadow-md'}`}>
            DocGia<span className={!isWhiteText ? 'text-primary-600 dark:text-primary-400' : 'text-primary-300'}>Truyen</span>
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/" className={`font-medium hover:text-primary-500 transition-colors ${!isWhiteText ? 'text-slate-700 dark:text-slate-200' : 'text-white/90 hover:text-white'}`}>Trang chủ</Link>
          <Link to="/categories" className={`font-medium hover:text-primary-500 transition-colors ${!isWhiteText ? 'text-slate-700 dark:text-slate-200' : 'text-white/90 hover:text-white'}`}>Thể loại</Link>
          <Link to="/ranking" className={`font-medium hover:text-primary-500 transition-colors ${!isWhiteText ? 'text-slate-700 dark:text-slate-200' : 'text-white/90 hover:text-white'}`}>Bảng xếp hạng</Link>
          <Link to="/writer" className={`font-medium hover:text-primary-500 transition-colors ${!isWhiteText ? 'text-slate-700 dark:text-slate-200' : 'text-white/90 hover:text-white'}`}>Sáng tác</Link>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-4">
          <Link to="/explore" className={`p-2 rounded-full transition-colors ${!isWhiteText ? 'hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200' : 'text-white hover:bg-white/20'}`}>
            <Search className="w-5 h-5" />
          </Link>
          
          <button 
            onClick={toggleTheme}
            className={`p-2 rounded-full transition-colors ${!isWhiteText ? 'hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200' : 'text-white hover:bg-white/20'}`}
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {!isAuthenticated ? (
            <Link to="/auth" className={`hidden md:flex items-center space-x-2 px-4 py-2 rounded-full font-medium transition-all transform hover:scale-105 ${!isWhiteText ? 'bg-primary-600 text-white hover:bg-primary-700 shadow-md shadow-primary-500/30' : 'bg-white text-primary-600 hover:bg-slate-100'}`}>
              <span>Đăng nhập</span>
            </Link>
          ) : (
            <div className="relative">
              <button 
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-tr from-primary-500 to-teal-400 p-0.5 shadow-sm"
              >
                <div className="w-full h-full rounded-full bg-white dark:bg-slate-800 flex items-center justify-center overflow-hidden">
                   {user?.avatarUrl ? (
                     <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                   ) : (
                     <User className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                   )}
                </div>
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 py-2 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                      {user?.username || 'Độc giả'}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      {user?.email || ''}
                    </p>
                  </div>
                  
                  <div className="py-2">
                    <Link to="/profile" onClick={() => setDropdownOpen(false)} className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-primary-600 dark:hover:text-primary-400">
                      Trang cá nhân
                    </Link>
                    {user?.role === 'ROLE_AUTHOR' && (
                      <Link to="/writer" onClick={() => setDropdownOpen(false)} className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-primary-600 dark:hover:text-primary-400">
                        Quản lý truyện
                      </Link>
                    )}
                  </div>
                  
                  <div className="py-2 border-t border-slate-100 dark:border-slate-700">
                    <button 
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20"
                    >
                      Đăng xuất
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          <button className={`md:hidden p-2 rounded-full ${!isWhiteText ? 'text-slate-700 dark:text-slate-200' : 'text-white'}`}>
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
