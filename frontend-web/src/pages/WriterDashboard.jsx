import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Book, Plus, Settings, Edit3, Trash2, Eye, EyeOff, BarChart2, List } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

const WriterDashboard = () => {
  const [activeTab, setActiveTab] = useState('my_novels');
  const [novels, setNovels] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyNovels = async () => {
      try {
        const response = await api.get('/novels/my');
        setNovels(response.data);
      } catch (error) {
        console.error('Error fetching my novels:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMyNovels();
  }, []);

  const togglePublicStatus = async (id, currentStatus) => {
    try {
      // Create a partial update. We need to fetch current novel first to preserve other fields
      // Or just send the isPublic field if the backend supports partial update.
      // Assuming our backend PUT requires all fields, we will send current fields.
      const novel = novels.find(n => n.id === id);
      if (!novel) return;

      const updatedNovelReq = {
        title: novel.title,
        description: novel.description,
        author: novel.author,
        genres: novel.genres,
        coverImageUrl: novel.coverImageUrl,
        isPublic: !currentStatus
      };

      const response = await api.put(`/novels/${id}`, updatedNovelReq);
      setNovels(novels.map(n => n.id === id ? response.data : n));
    } catch (error) {
      console.error('Error toggling public status:', error);
      alert('Không thể thay đổi trạng thái');
    }
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
                        <Link to="/writer/novel/new" className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl font-medium transition-colors shadow-lg shadow-primary-500/30">
                          <Plus className="w-5 h-5" />
                          <span>Thêm truyện mới</span>
                        </Link>
                      </div>
                      
                      <div className="space-y-4">
                        {loading ? (
                          <div className="text-center py-12 text-slate-500 dark:text-slate-400">Đang tải danh sách truyện...</div>
                        ) : novels.length === 0 ? (
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
                              <img 
                                src={novel.coverImageUrl || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=200&auto=format&fit=crop'} 
                                alt={novel.title} 
                                className="w-20 h-28 object-cover rounded-xl shadow-sm bg-slate-200 dark:bg-slate-700" 
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=200&auto=format&fit=crop';
                                }}
                              />
                              
                              <div className="flex-grow flex flex-col justify-center">
                                <Link to={`/novel/${novel.id}`} className="text-lg font-bold text-slate-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors mb-1 inline-block">
                                  {novel.title}
                                </Link>
                                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500 dark:text-slate-400 mb-3">
                                  <span>{novel.chapterCount || 0} chương</span>
                                  <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                                  <span>{novel.viewCount || 0} lượt xem</span>
                                </div>
                                
                                <div className="flex flex-wrap items-center gap-3">
                                  {/* Toggle Public/Private */}
                                  <button 
                                    onClick={() => togglePublicStatus(novel.id, novel.isPublic)}
                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${novel.isPublic ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-200 dark:hover:bg-emerald-800/40' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'}`}
                                  >
                                    {novel.isPublic ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                    <span>{novel.isPublic ? 'Công khai' : 'Riêng tư'}</span>
                                  </button>
                                  
                                  <Link 
                                    to={`/writer/novel/${novel.id}/chapters`}
                                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 hover:bg-indigo-200 dark:hover:bg-indigo-800/40 transition-colors"
                                  >
                                    <List className="w-4 h-4" />
                                    <span>Quản lý chương</span>
                                  </Link>
                                  
                                  <Link 
                                    to={`/writer/novel/${novel.id}/chapter/new`}
                                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 hover:bg-primary-200 dark:hover:bg-primary-800/40 transition-colors"
                                  >
                                    <Plus className="w-4 h-4" />
                                    <span>Thêm chương</span>
                                  </Link>
                                </div>
                              </div>
                              
                              <div className="flex sm:flex-col items-center justify-center gap-2 sm:border-l border-slate-200 dark:border-slate-700 sm:pl-4 mt-4 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-t-0 w-full sm:w-auto">
                                <Link to={`/writer/novel/${novel.id}/edit`} className="flex-1 sm:flex-none flex items-center justify-center gap-2 p-2 px-4 rounded-lg bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-800/40 transition-colors">
                                  <Edit3 className="w-4 h-4" />
                                  <span className="sm:hidden font-medium">Sửa truyện</span>
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
                          <div className="text-3xl font-bold text-slate-900 dark:text-white">
                            {novels.reduce((sum, n) => sum + (n.viewCount || 0), 0)}
                          </div>
                        </div>
                        <div className="bg-emerald-50 dark:bg-emerald-900/20 p-6 rounded-2xl border border-emerald-100 dark:border-emerald-800/30">
                          <div className="text-emerald-600 dark:text-emerald-400 text-sm font-medium mb-2">Tổng số bình luận</div>
                          <div className="text-3xl font-bold text-slate-900 dark:text-white">0</div>
                        </div>
                        <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-2xl border border-purple-100 dark:border-purple-800/30">
                          <div className="text-purple-600 dark:text-purple-400 text-sm font-medium mb-2">Truyện đang viết</div>
                          <div className="text-3xl font-bold text-slate-900 dark:text-white">{novels.length}</div>
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
