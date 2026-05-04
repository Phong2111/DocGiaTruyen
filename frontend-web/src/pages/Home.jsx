import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, TrendingUp, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import NovelCard from '../components/NovelCard';

// Sample Data
const trendingNovels = [
  { id: '1', title: 'Thế Giới Hoàn Mỹ', author: 'Thần Đông', cover: '/images/cover_1.png', rating: '4.8', views: '2.1M', tags: ['Tiên Hiệp', 'Huyền Huyễn'], isTrending: true },
  { id: '2', title: 'Vạn Cổ Thần Đế', author: 'Phi Thiên Ngư', cover: '/images/cover_2.png', rating: '4.7', views: '1.5M', tags: ['Huyền Huyễn'], isTrending: true },
  { id: '3', title: 'Ngạo Thế Đan Thần', author: 'Tịch Tiểu Tặc', cover: '/images/cover_3.png', rating: '4.5', views: '980K', tags: ['Tiên Hiệp', 'Trọng Sinh'], isTrending: false },
  { id: '4', title: 'Đấu Phá Thương Khung', author: 'Thiên Tàm Thổ Đậu', cover: '/images/cover_1.png', rating: '4.9', views: '5.2M', tags: ['Dị Giới', 'Huyền Huyễn'], isTrending: true },
  { id: '5', title: 'Phàm Nhân Tu Tiên', author: 'Vong Ngữ', cover: '/images/cover_2.png', rating: '4.9', views: '3.4M', tags: ['Tiên Hiệp', 'Cổ Điển'], isTrending: false },
];

const Home = () => {
  return (
    <div className="min-h-screen pb-10">
      {/* Hero Section */}
      <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/hero_bg.png" 
            alt="Hero Background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-slate-50 dark:to-dark-bg"></div>
        </div>

        <div className="container relative z-10 mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-1.5 mb-6">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <span className="text-white text-sm font-medium">Trải nghiệm đọc truyện thế hệ mới</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight leading-tight">
              Khám Phá Thế Giới <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-teal-300">Vô Tận</span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-200 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
              Đắm chìm vào những câu chuyện hấp dẫn với giao diện tuyệt đẹp và công nghệ AI/Audio tiên tiến.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link to="/explore" className="w-full sm:w-auto px-8 py-3.5 bg-primary-600 hover:bg-primary-500 text-white font-semibold rounded-full transition-all shadow-lg shadow-primary-500/30 flex items-center justify-center space-x-2 group">
                <span>Khám phá ngay</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/categories" className="w-full sm:w-auto px-8 py-3.5 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-semibold rounded-full border border-white/20 transition-all flex items-center justify-center">
                Xem thể loại
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 md:px-8 mt-12 space-y-20">
        
        {/* Trending Section */}
        <section>
          <div className="flex justify-between items-end mb-8">
            <div>
              <div className="flex items-center space-x-2 text-rose-500 mb-2">
                <TrendingUp className="w-5 h-5" />
                <span className="font-bold uppercase tracking-wider text-sm">Thịnh hành</span>
              </div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Truyện Đang Hot</h2>
            </div>
            <Link to="/ranking" className="hidden sm:flex items-center space-x-1 text-primary-600 dark:text-primary-400 hover:underline font-medium">
              <span>Xem tất cả</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
            {trendingNovels.map((novel, index) => (
              <motion.div
                key={novel.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <NovelCard {...novel} />
              </motion.div>
            ))}
          </div>
        </section>

        {/* Latest Updates Section */}
        <section>
          <div className="flex justify-between items-end mb-8">
            <div>
              <div className="flex items-center space-x-2 text-teal-500 mb-2">
                <Clock className="w-5 h-5" />
                <span className="font-bold uppercase tracking-wider text-sm">Mới nhất</span>
              </div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Vừa Cập Nhật</h2>
            </div>
            <Link to="/new" className="hidden sm:flex items-center space-x-1 text-primary-600 dark:text-primary-400 hover:underline font-medium">
              <span>Xem tất cả</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
            {trendingNovels.slice().reverse().map((novel, index) => (
              <motion.div
                key={novel.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <NovelCard {...novel} />
              </motion.div>
            ))}
          </div>
        </section>
        
      </div>
    </div>
  );
};

export default Home;
