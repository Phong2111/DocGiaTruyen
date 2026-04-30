import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Book, Plus, Settings, Edit3, Trash2, Eye, EyeOff, BarChart2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const INITIAL_NOVELS = [
  { id: '101', title: 'Hành Trình Vô Tận', chapters: 42, views: '12K', isPublic: true, cover: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=200' },
  { id: '102', title: 'Bóng Tối Tái Sinh', chapters: 15, views: '3.4K', isPublic: false, cover: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=200' },
  { id: '103', title: 'Thiên Cổ Linh Tôn', chapters: 128, views: '89K', isPublic: true, cover: 'https://images.unsplash.com/photo-1618397746666-63405ce5d015?auto=format&fit=crop&q=80&w=200' },
];

const WriterDashboard = () => {
  const [activeTab, setActiveTab] = useState('my_novels');
  const [novels, setNovels] = useState(INITIAL_NOVELS);

  const togglePublicStatus = (id) => {
    setNovels(novels.map(novel => 
      novel.id === id ? { ...novel, isPublic: !novel.isPublic } : novel
    ));
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-bg pt-24 pb-20">
      <div className="container mx-auto px-4 md:px-8">
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-100 dark:border-slate-700 shadow-xl shadow-slate-200/50 dark:shadow-none sticky top-28">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 pl-2 border-l-4 border-primary-500">Sáng Tác</h2>
              
              <div className="w-full space-y-2">
                <button 
                  onClick={() => setActiveTab('my_novels')}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors ${activeTab === 'my_novels' ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 font-semibold' : 'hover:bg-slate-50 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-300'}`}
                >
                  <Book className="w-5 h-5" />
                  <span>Truyện của tôi</span>
                </button>
                <button 
                  onClick={() => setActiveTab('stats')}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors ${activeTab === 'stats' ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 font-semibold' : 'hover:bg-slate-50 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-300'}`}
                >
                  <BarChart2 className="w-5 h-5" />
                  <span>Thống kê</span>
                </button>
                <button 
                  onClick={() => setActiveTab('settings')}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors ${activeTab === 'settings' ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 font-semibold' : 'hover:bg-slate-50 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-300'}`}
                >
                  <Settings className="w-5 h-5" />
                  <span>Cài đặt</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-grow">
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-xl shadow-slate-200/50 dark:shadow-none min-h-[500px] overflow-hidden">
              
              <div className="p-6 md:p-8">
                <AnimatePresence mode="wait">
                  {activeTab === 'my_novels' && (
                    <motion.div
                      key="my_novels"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Quản lý truyện</h3>
                        <button className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl font-medium transition-colors shadow-lg shadow-primary-500/30">
                          <Plus className="w-5 h-5" />
                          <span>Thêm truyện mới</span>
                        </button>
                      </div>
                      
                      <div className="space-y-4">
                        {novels.length === 0 ? (
                          <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                            Bạn chưa có tác phẩm nào. Hãy tạo tác phẩm đầu tiên!
                          </div>
                        ) : (
                          novels.map((novel, index) => (
                            <motion.div 
                              key={novel.id} 
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="flex flex-col sm:flex-row gap-4 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-700 transition-colors group"
                            >
                              <img src={novel.cover} alt={novel.title} className="w-20 h-28 object-cover rounded-xl shadow-sm" />
                              
                              <div className="flex-grow flex flex-col justify-center">
                                <h4 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors mb-1">{novel.title}</h4>
                                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500 dark:text-slate-400 mb-3">
                                  <span>{novel.chapters} chương</span>
                                  <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                                  <span>{novel.views} lượt xem</span>
                                </div>
                                
                                <div className="flex items-center gap-3">
                                  {/* Toggle Public/Private */}
                                  <button 
                                    onClick={() => togglePublicStatus(novel.id)}
                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${novel.isPublic ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-200 dark:hover:bg-emerald-800/40' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'}`}
                                  >
                                    {novel.isPublic ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                    <span>{novel.isPublic ? 'Công khai' : 'Riêng tư'}</span>
                                  </button>
                                </div>
                              </div>
                              
                              <div className="flex sm:flex-col items-center justify-center gap-2 sm:border-l border-slate-200 dark:border-slate-700 sm:pl-4 mt-4 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-t-0 w-full sm:w-auto">
                                <Link to={`/writer/edit/${novel.id}`} className="flex-1 sm:flex-none flex items-center justify-center gap-2 p-2 px-4 rounded-lg bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-800/40 transition-colors">
                                  <Edit3 className="w-4 h-4" />
                                  <span className="sm:hidden font-medium">Sửa</span>
                                </Link>
                                <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 p-2 px-4 rounded-lg bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-800/40 transition-colors">
                                  <Trash2 className="w-4 h-4" />
                                  <span className="sm:hidden font-medium">Xóa</span>
                                </button>
                              </div>
                            </motion.div>
                          ))
                        )}
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'stats' && (
                    <motion.div
                      key="stats"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Thống kê tác phẩm</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-primary-50 dark:bg-primary-900/20 p-6 rounded-2xl border border-primary-100 dark:border-primary-800/30">
                          <div className="text-primary-600 dark:text-primary-400 text-sm font-medium mb-2">Tổng số lượt xem</div>
                          <div className="text-3xl font-bold text-slate-900 dark:text-white">104.4K</div>
                        </div>
                        <div className="bg-emerald-50 dark:bg-emerald-900/20 p-6 rounded-2xl border border-emerald-100 dark:border-emerald-800/30">
                          <div className="text-emerald-600 dark:text-emerald-400 text-sm font-medium mb-2">Tổng số bình luận</div>
                          <div className="text-3xl font-bold text-slate-900 dark:text-white">1,284</div>
                        </div>
                        <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-2xl border border-purple-100 dark:border-purple-800/30">
                          <div className="text-purple-600 dark:text-purple-400 text-sm font-medium mb-2">Truyện đang viết</div>
                          <div className="text-3xl font-bold text-slate-900 dark:text-white">3</div>
                        </div>
                      </div>
                      <div className="h-64 flex items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl text-slate-500 dark:text-slate-400">
                        Biểu đồ lượt xem sẽ hiển thị ở đây
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'settings' && (
                    <motion.div
                      key="settings"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Cài đặt tác giả</h3>
                      <p className="text-slate-500 dark:text-slate-400">Các tùy chọn về bút danh, nhận thông báo từ độc giả...</p>
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

export default WriterDashboard;
