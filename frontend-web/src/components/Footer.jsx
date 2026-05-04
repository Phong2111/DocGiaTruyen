import React from 'react';
import { BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 pt-16 pb-8 mt-20 transition-colors duration-300">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-6">
              <BookOpen className="w-8 h-8 text-primary-500" />
              <span className="text-2xl font-bold tracking-tighter text-slate-900 dark:text-white">
                DocGia<span className="text-primary-500">Truyen</span>
              </span>
            </Link>
            <p className="text-slate-500 dark:text-slate-400 max-w-md mb-6 leading-relaxed">
              Nền tảng trực tuyến đa phương tiện dành cho cộng đồng yêu thích tiểu thuyết. Đọc, nghe và khám phá thế giới truyện phong phú với sự hỗ trợ của trí tuệ nhân tạo.
            </p>

          </div>
          
          <div>
            <h4 className="text-slate-900 dark:text-white font-bold mb-6">Khám phá</h4>
            <ul className="space-y-4">
              <li><Link to="/ranking" className="text-slate-500 dark:text-slate-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors">Bảng xếp hạng</Link></li>
              <li><Link to="/categories" className="text-slate-500 dark:text-slate-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors">Thể loại</Link></li>
              <li><Link to="/new" className="text-slate-500 dark:text-slate-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors">Truyện mới cập nhật</Link></li>
              <li><Link to="/completed" className="text-slate-500 dark:text-slate-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors">Truyện full</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-slate-900 dark:text-white font-bold mb-6">Thông tin</h4>
            <ul className="space-y-4">
              <li><Link to="/about" className="text-slate-500 dark:text-slate-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors">Về chúng tôi</Link></li>
              <li><Link to="/terms" className="text-slate-500 dark:text-slate-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors">Điều khoản sử dụng</Link></li>
              <li><Link to="/privacy" className="text-slate-500 dark:text-slate-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors">Chính sách bảo mật</Link></li>
              <li><Link to="/contact" className="text-slate-500 dark:text-slate-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors">Liên hệ</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-slate-200 dark:border-slate-800 text-center text-slate-500 dark:text-slate-400 text-sm">
          &copy; {new Date().getFullYear()} DocGiaTruyen. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
