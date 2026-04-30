import React, { useState, useEffect } from 'react';
import { Settings, Headphones, Sparkles, ChevronLeft, ChevronRight, Menu, X, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const sampleContent = `
Đây là một chương ví dụ. Trong một thế giới nơi sức mạnh quyết định tất cả, chàng thiếu niên trẻ tuổi bước lên con đường tu luyện gian nan. 

Hắn sinh ra đã không có linh căn, bị gia tộc ruồng bỏ. Nhưng vào một đêm mưa bão, một luồng sét kỳ lạ đã đánh trúng hắn, thức tỉnh một hệ thống bí ẩn...

"Ngươi muốn sức mạnh không?" - Một giọng nói lạnh lùng vang lên trong tâm trí hắn.

Từ đó, hành trình nghịch thiên cải mệnh của hắn bắt đầu. Hắn sẽ đối mặt với vô vàn thử thách, yêu ma quỷ quái, và những cường giả đỉnh phong. Liệu hắn có thể đứng trên đỉnh cao của thế giới này?
`;

const Reader = () => {
  const [showToolbar, setShowToolbar] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [fontSize, setFontSize] = useState(18);
  const [isAIActive, setIsAIActive] = useState(false);
  const [isAudioActive, setIsAudioActive] = useState(false);
  
  // Auto-hide toolbar after a few seconds
  useEffect(() => {
    let timeout;
    if (showToolbar && !showSettings) {
      timeout = setTimeout(() => setShowToolbar(false), 5000);
    }
    return () => clearTimeout(timeout);
  }, [showToolbar, showSettings]);

  return (
    <div className="min-h-screen bg-[#f4f1ea] dark:bg-dark-bg text-[#333] dark:text-slate-300 font-serif transition-colors duration-300">
      {/* Click zone to toggle toolbar */}
      <div 
        className="fixed inset-0 z-0" 
        onClick={() => setShowToolbar(!showToolbar)}
      />

      {/* Top Toolbar */}
      <AnimatePresence>
        {showToolbar && (
          <motion.div
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            exit={{ y: -100 }}
            className="fixed top-0 left-0 right-0 h-16 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 z-50 flex items-center justify-between px-4"
          >
            <div className="flex items-center space-x-4">
              <Link to="/" className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-700 dark:text-slate-300">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="font-sans font-bold text-lg text-slate-900 dark:text-white line-clamp-1">Thế Giới Hoàn Mỹ</h1>
                <p className="font-sans text-xs text-slate-500">Chương 1: Khởi nguồn</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button 
                onClick={() => setIsAIActive(!isAIActive)}
                className={`p-2 rounded-full transition-colors ${isAIActive ? 'text-primary-600 bg-primary-50 dark:bg-primary-900/30' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
              >
                <Sparkles className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setIsAudioActive(!isAudioActive)}
                className={`p-2 rounded-full transition-colors ${isAudioActive ? 'text-teal-600 bg-teal-50 dark:bg-teal-900/30' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
              >
                <Headphones className="w-5 h-5" />
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); setShowSettings(!showSettings); }}
                className="p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <Settings className="w-5 h-5" />
              </button>
              <button className="p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors md:hidden">
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="relative z-10 max-w-3xl mx-auto pt-24 pb-32 px-6 md:px-12 pointer-events-none">
        
        {/* AI Summary Banner */}
        <AnimatePresence>
          {isAIActive && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8 pointer-events-auto"
            >
              <div className="bg-gradient-to-r from-primary-50 to-teal-50 dark:from-primary-900/20 dark:to-teal-900/20 border border-primary-200 dark:border-primary-800/50 rounded-xl p-4 shadow-sm">
                <div className="flex items-center space-x-2 text-primary-700 dark:text-primary-400 font-sans font-bold mb-2">
                  <Sparkles className="w-4 h-4" />
                  <span>AI Tóm tắt chương</span>
                </div>
                <p className="text-sm font-sans text-slate-700 dark:text-slate-300 leading-relaxed">
                  Chương này giới thiệu hoàn cảnh xuất thân bi đát của nhân vật chính và cơ duyên kỳ ngộ khi anh ta bị sét đánh trúng, kích hoạt một hệ thống bí ẩn giúp cải biến số mệnh.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Text Content */}
        <div 
          className="leading-[1.8] whitespace-pre-wrap pointer-events-auto text-justify"
          style={{ fontSize: `${fontSize}px` }}
        >
          {sampleContent}
        </div>
      </div>

      {/* Bottom Navigation */}
      <AnimatePresence>
        {showToolbar && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-0 left-0 right-0 h-20 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 z-50 flex items-center justify-center px-4"
          >
            <div className="w-full max-w-3xl flex items-center justify-between">
              <button className="flex items-center space-x-2 px-4 py-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-700 dark:text-slate-300 font-sans font-medium opacity-50 cursor-not-allowed">
                <ChevronLeft className="w-5 h-5" />
                <span className="hidden sm:inline">Chương trước</span>
              </button>
              
              <button className="px-6 py-2 bg-slate-100 dark:bg-slate-800 rounded-full font-sans font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                Danh sách chương
              </button>
              
              <button className="flex items-center space-x-2 px-4 py-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-700 dark:text-slate-300 font-sans font-medium">
                <span className="hidden sm:inline">Chương sau</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed top-20 right-4 w-72 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-4 z-50 font-sans"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-slate-900 dark:text-white">Cài đặt đọc truyện</h3>
              <button onClick={() => setShowSettings(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Cỡ chữ: {fontSize}px</label>
                <input 
                  type="range" 
                  min="14" max="32" 
                  value={fontSize} 
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="w-full accent-primary-600"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Reader;
