import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, BookMarked, History, Settings, LogOut, Edit3 } from 'lucide-react';
import NovelCard from '../components/NovelCard';

const DUMMY_NOVELS = [
  { id: '1', title: 'Thế Giới Hoàn Mỹ', author: 'Thần Đông', cover: '/images/cover_1.png', rating: '4.8', views: '2.1M', tags: ['Tiên Hiệp'], isTrending: true },
  { id: '2', title: 'Vạn Cổ Thần Đế', author: 'Phi Thiên Ngư', cover: '/images/cover_2.png', rating: '4.7', views: '1.5M', tags: ['Huyền Huyễn'], isTrending: false },
  { id: '3', title: 'Ngạo Thế Đan Thần', author: 'Tịch Tiểu Tặc', cover: '/images/cover_3.png', rating: '4.5', views: '980K', tags: ['Tiên Hiệp'], isTrending: false },
];

const Profile = () => {
  const [activeTab, setActiveTab] = useState('library');

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-bg pt-24 pb-20">
      <div className="container mx-auto px-4 md:px-8">
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Profile Info */}
          <div className="w-full md:w-80 flex-shrink-0">
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-100 dark:border-slate-700 shadow-xl shadow-slate-200/50 dark:shadow-none sticky top-28">
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-4 group">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-primary-500 to-teal-400 p-1">
                    <div className="w-full h-full rounded-full bg-white dark:bg-slate-800 flex items-center justify-center overflow-hidden">
                      <User className="w-12 h-12 text-slate-300 dark:text-slate-600" />
                    </div>
                  </div>
                  <button className="absolute bottom-0 right-0 p-2 bg-white dark:bg-slate-700 rounded-full shadow-md border border-slate-100 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors opacity-0 group-hover:opacity-100">
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>
                
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Nguyễn Văn Độc Giả</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Tham gia: Tháng 4, 2026</p>
                
                <div className="w-full grid grid-cols-2 gap-4 mb-6 border-y border-slate-100 dark:border-slate-700 py-4">
                  <div>
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">42</div>
                    <div className="text-xs text-slate-500 uppercase tracking-wider">Truyện đã lưu</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">156</div>
                    <div className="text-xs text-slate-500 uppercase tracking-wider">Chương đã đọc</div>
                  </div>
                </div>

                <div className="w-full space-y-2">
                  <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors text-slate-700 dark:text-slate-300">
                    <div className="flex items-center gap-3">
                      <Settings className="w-5 h-5 text-slate-400" />
                      <span className="font-medium">Cài đặt tài khoản</span>
                    </div>
                  </button>
                  <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors text-rose-600 dark:text-rose-400">
                    <div className="flex items-center gap-3">
                      <LogOut className="w-5 h-5" />
                      <span className="font-medium">Đăng xuất</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-grow">
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden min-h-[500px]">
              
              {/* Tabs */}
              <div className="flex border-b border-slate-100 dark:border-slate-700">
                <button 
                  onClick={() => setActiveTab('library')}
                  className={`flex-1 flex items-center justify-center gap-2 py-5 font-semibold transition-colors relative ${activeTab === 'library' ? 'text-primary-600 dark:text-primary-400' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                >
                  <BookMarked className="w-5 h-5" />
                  Tủ Truyện
                  {activeTab === 'library' && (
                    <motion.div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500" layoutId="profileTab" />
                  )}
                </button>
                <button 
                  onClick={() => setActiveTab('history')}
                  className={`flex-1 flex items-center justify-center gap-2 py-5 font-semibold transition-colors relative ${activeTab === 'history' ? 'text-primary-600 dark:text-primary-400' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                >
                  <History className="w-5 h-5" />
                  Lịch Sử Đọc
                  {activeTab === 'history' && (
                    <motion.div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500" layoutId="profileTab" />
                  )}
                </button>
              </div>

              {/* Tab Content */}
              <div className="p-6 md:p-8">
                <AnimatePresence mode="wait">
                  {activeTab === 'library' && (
                    <motion.div
                      key="library"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Truyện Đang Theo Dõi</h3>
                        <div className="flex gap-2">
                          <button className="text-sm px-3 py-1.5 bg-slate-100 dark:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-300">Sắp xếp</button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                        {DUMMY_NOVELS.map((novel, index) => (
                          <motion.div
                            key={novel.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <NovelCard {...novel} />
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'history' && (
                    <motion.div
                      key="history"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Đã Đọc Gần Đây</h3>
                      
                      <div className="space-y-4">
                        {DUMMY_NOVELS.map((novel, index) => (
                          <div key={novel.id} className="flex gap-4 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-700 transition-colors group">
                            <img src={novel.cover} alt={novel.title} className="w-16 h-24 object-cover rounded-lg shadow-sm" />
                            <div className="flex-grow flex flex-col justify-center">
                              <h4 className="font-bold text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{novel.title}</h4>
                              <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">Đã đọc đến: Chương 142</p>
                              <div className="flex items-center gap-4 text-xs text-slate-400">
                                <span>2 giờ trước</span>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <button className="px-4 py-2 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 font-medium rounded-lg hover:bg-primary-200 dark:hover:bg-primary-800/50 transition-colors">
                                Đọc tiếp
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;
