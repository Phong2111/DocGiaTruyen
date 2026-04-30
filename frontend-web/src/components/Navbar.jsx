import React, { useState, useEffect } from 'react';
import { Moon, Sun, BookOpen, Menu, Search, User } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isDark, setIsDark] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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
          <BookOpen className={`w-8 h-8 ${scrolled ? 'text-primary-600 dark:text-primary-400' : 'text-primary-500'} group-hover:scale-110 transition-transform`} />
          <span className={`text-2xl font-bold tracking-tighter ${scrolled ? 'text-slate-900 dark:text-white' : 'text-white drop-shadow-md'}`}>
            DocGia<span className={scrolled ? 'text-primary-600 dark:text-primary-400' : 'text-primary-300'}>Truyen</span>
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/" className={`font-medium hover:text-primary-500 transition-colors ${scrolled ? 'text-slate-700 dark:text-slate-200' : 'text-white/90 hover:text-white'}`}>Trang chủ</Link>
          <Link to="/categories" className={`font-medium hover:text-primary-500 transition-colors ${scrolled ? 'text-slate-700 dark:text-slate-200' : 'text-white/90 hover:text-white'}`}>Thể loại</Link>
          <Link to="/ranking" className={`font-medium hover:text-primary-500 transition-colors ${scrolled ? 'text-slate-700 dark:text-slate-200' : 'text-white/90 hover:text-white'}`}>Bảng xếp hạng</Link>
          <Link to="/writer" className={`font-medium hover:text-primary-500 transition-colors ${scrolled ? 'text-slate-700 dark:text-slate-200' : 'text-white/90 hover:text-white'}`}>Sáng tác</Link>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-4">
          <Link to="/explore" className={`p-2 rounded-full transition-colors ${scrolled ? 'hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200' : 'text-white hover:bg-white/20'}`}>
            <Search className="w-5 h-5" />
          </Link>
          
          <button 
            onClick={toggleTheme}
            className={`p-2 rounded-full transition-colors ${scrolled ? 'hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200' : 'text-white hover:bg-white/20'}`}
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          <Link to="/auth" className={`hidden md:flex items-center space-x-2 px-4 py-2 rounded-full font-medium transition-all transform hover:scale-105 ${scrolled ? 'bg-primary-600 text-white hover:bg-primary-700 shadow-md shadow-primary-500/30' : 'bg-white text-primary-600 hover:bg-slate-100'}`}>
            <span>Đăng nhập</span>
          </Link>

          <Link to="/profile" className={`hidden md:flex p-2 rounded-full transition-colors ${scrolled ? 'hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200' : 'text-white hover:bg-white/20'}`}>
             <User className="w-5 h-5" />
          </Link>

          <button className={`md:hidden p-2 rounded-full ${scrolled ? 'text-slate-700 dark:text-slate-200' : 'text-white'}`}>
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
