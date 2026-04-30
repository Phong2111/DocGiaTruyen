import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Eye, Clock, Bookmark, Play, List, AlertCircle } from 'lucide-react';
import { useParams, Link } from 'react-router-dom';

// Dummy data for a novel
const novelData = {
  id: '1',
  title: 'Thế Giới Hoàn Mỹ',
  author: 'Thần Đông',
  cover: '/images/cover_1.png',
  rating: '4.8',
  views: '2.1M',
  status: 'Đang ra',
  chaptersCount: 1450,
  tags: ['Tiên Hiệp', 'Huyền Huyễn', 'Hành Động'],
  synopsis: `Một hạt bụi có thể lấp biển, một cọng cỏ trảm tận nhật nguyệt tinh thần, trong nháy mắt có thể lật úp đất trời. Quần hùng cùng nổi lên, vạn tộc mọc lên san sát như rừng, chư thánh tranh bá, loạn cả đất trời. Hỏi mặt đất bao la, ai làm chủ thăng trầm? Một thiếu niên từ trong Đại hoang đi ra, hết thảy từ nơi này bắt đầu...`,
  chapters: Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    title: `Chương ${i + 1}: Đại Hoang`,
    date: '2 ngày trước'
  }))
};

const NovelDetails = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('synopsis');

  // Use the id to fetch novel data in a real app
  const novel = novelData; 

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-bg pb-20">
      {/* Hero Section */}
      <div className="relative h-[60vh] min-h-[500px]">
        {/* Blurred Background */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img 
            src={novel.cover} 
            alt="Background" 
            className="w-full h-full object-cover blur-xl scale-110 opacity-40 dark:opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-50 dark:from-dark-bg via-slate-50/80 dark:via-dark-bg/80 to-transparent"></div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 relative z-10 h-full flex flex-col justify-end pb-12 pt-24 md:pt-32">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-8">
            {/* Cover */}
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="w-48 md:w-64 flex-shrink-0"
            >
              <img 
                src={novel.cover} 
                alt={novel.title} 
                className="w-full rounded-2xl shadow-2xl border-4 border-white dark:border-slate-800"
              />
            </motion.div>

            {/* Info */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex-grow text-center md:text-left"
            >
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4 leading-tight">
                {novel.title}
              </h1>
              <p className="text-xl text-slate-600 dark:text-slate-300 mb-4 font-medium">
                {novel.author}
              </p>

              <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-6 text-sm text-slate-700 dark:text-slate-300">
                <div className="flex items-center bg-white/50 dark:bg-slate-800/50 px-3 py-1.5 rounded-lg backdrop-blur-md">
                  <Star className="w-4 h-4 text-yellow-500 mr-1.5" />
                  <span className="font-semibold">{novel.rating}</span>
                </div>
                <div className="flex items-center bg-white/50 dark:bg-slate-800/50 px-3 py-1.5 rounded-lg backdrop-blur-md">
                  <Eye className="w-4 h-4 text-blue-500 mr-1.5" />
                  <span>{novel.views}</span>
                </div>
                <div className="flex items-center bg-white/50 dark:bg-slate-800/50 px-3 py-1.5 rounded-lg backdrop-blur-md">
                  <Clock className="w-4 h-4 text-green-500 mr-1.5" />
                  <span>{novel.status}</span>
                </div>
                <div className="flex items-center bg-white/50 dark:bg-slate-800/50 px-3 py-1.5 rounded-lg backdrop-blur-md">
                  <List className="w-4 h-4 text-purple-500 mr-1.5" />
                  <span>{novel.chaptersCount} Chương</span>
                </div>
              </div>

              <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-8">
                {novel.tags.map(tag => (
                  <span key={tag} className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-sm font-medium border border-primary-200 dark:border-primary-800">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Link to={`/read/${id}`} className="px-8 py-3.5 bg-primary-600 hover:bg-primary-500 text-white font-bold rounded-xl shadow-lg shadow-primary-500/30 transition-all flex items-center justify-center gap-2 transform hover:-translate-y-1">
                  <Play className="w-5 h-5 fill-current" />
                  <span>Đọc Từ Đầu</span>
                </Link>
                <button className="px-8 py-3.5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold rounded-xl shadow-md border border-slate-200 dark:border-slate-700 transition-all flex items-center justify-center gap-2 transform hover:-translate-y-1">
                  <Bookmark className="w-5 h-5" />
                  <span>Đánh Dấu</span>
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 mt-8 md:mt-16">
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 overflow-hidden">
          {/* Tabs Header */}
          <div className="flex border-b border-slate-200 dark:border-slate-800">
            <button 
              onClick={() => setActiveTab('synopsis')}
              className={`flex-1 py-5 text-center font-semibold text-lg transition-colors relative ${activeTab === 'synopsis' ? 'text-primary-600 dark:text-primary-400' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
            >
              Giới Thiệu
              {activeTab === 'synopsis' && (
                <motion.div layoutId="activeTabIndicator" className="absolute bottom-0 left-0 right-0 h-1 bg-primary-500" />
              )}
            </button>
            <button 
              onClick={() => setActiveTab('chapters')}
              className={`flex-1 py-5 text-center font-semibold text-lg transition-colors relative ${activeTab === 'chapters' ? 'text-primary-600 dark:text-primary-400' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
            >
              Danh Sách Chương
              {activeTab === 'chapters' && (
                <motion.div layoutId="activeTabIndicator" className="absolute bottom-0 left-0 right-0 h-1 bg-primary-500" />
              )}
            </button>
          </div>

          {/* Tabs Content */}
          <div className="p-6 md:p-10 min-h-[400px]">
            <AnimatePresence mode="wait">
              {activeTab === 'synopsis' && (
                <motion.div
                  key="synopsis"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                    <AlertCircle className="w-6 h-6 text-primary-500" />
                    Nội dung truyện
                  </h3>
                  <div className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 text-lg leading-relaxed">
                    <p>{novel.synopsis}</p>
                    {/* Fake paragraphs to make it look longer */}
                    <p className="mt-4">Năm tháng dài đằng đẵng, thời không luân chuyển, một đời thiên kiêu quật khởi, để lại vô số truyền thuyết. Thế giới này rộng lớn vô biên, cường giả như mây, nhưng ai mới là người bước lên đỉnh cao nhất?</p>
                    <p className="mt-4">Hãy cùng theo dõi bước chân của nhân vật chính trong hành trình tu luyện gian khổ, khám phá những bí ẩn kinh thiên động địa và giành lấy vinh quang tối thượng.</p>
                  </div>
                </motion.div>
              )}

              {activeTab === 'chapters' && (
                <motion.div
                  key="chapters"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Mới Cập Nhật</h3>
                    <span className="text-sm text-slate-500 dark:text-slate-400">Hiển thị {novel.chapters.length} chương</span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {novel.chapters.map((chapter) => (
                      <Link 
                        key={chapter.id} 
                        to={`/read/${id}?chapter=${chapter.id}`}
                        className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:border-primary-200 dark:hover:border-primary-800 transition-colors group flex justify-between items-center"
                      >
                        <span className="font-medium text-slate-800 dark:text-slate-200 group-hover:text-primary-600 dark:group-hover:text-primary-400 line-clamp-1">
                          {chapter.title}
                        </span>
                        <span className="text-xs text-slate-400 whitespace-nowrap ml-2">
                          {chapter.date}
                        </span>
                      </Link>
                    ))}
                  </div>
                  
                  <div className="mt-8 text-center">
                    <button className="px-6 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium rounded-lg transition-colors">
                      Xem tất cả chương
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NovelDetails;
