import React, { useState, useEffect } from 'react';
import { Settings, Headphones, Sparkles, ChevronLeft, ChevronRight, Menu, X, ArrowLeft, List } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useParams, useSearchParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const Reader = () => {
  const { id } = useParams(); // novelId
  const [searchParams] = useSearchParams();
  const chapterId = searchParams.get('chapter');
  const navigate = useNavigate();

  const [showToolbar, setShowToolbar] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [showChapterList, setShowChapterList] = useState(false);
  const [fontSize, setFontSize] = useState(18);
  const [isAIActive, setIsAIActive] = useState(false);
  const [isAudioActive, setIsAudioActive] = useState(false);
  
  const [novel, setNovel] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [currentChapter, setCurrentChapter] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNovelAndChapters = async () => {
      try {
        const [novelRes, chaptersRes] = await Promise.all([
          api.get(`/novels/${id}`),
          api.get(`/novels/${id}/chapters`)
        ]);
        setNovel(novelRes.data);
        const fetchedChapters = chaptersRes.data;
        setChapters(fetchedChapters);

        if (fetchedChapters.length > 0) {
          let targetChapterId = chapterId;
          if (!targetChapterId) {
            targetChapterId = fetchedChapters[0].id;
          }
          const targetChapter = fetchedChapters.find(c => c.id.toString() === targetChapterId.toString());
          
          if (targetChapter) {
            fetchChapterContent(targetChapter.id);
          } else {
            fetchChapterContent(fetchedChapters[0].id);
          }
        } else {
          setLoading(false); // No chapters
        }
      } catch (error) {
        console.error('Error fetching reader data:', error);
        setLoading(false);
      }
    };

    fetchNovelAndChapters();
  }, [id, chapterId]);

  const fetchChapterContent = async (chId) => {
    setLoading(true);
    try {
      const response = await api.get(`/novels/${id}/chapters/${chId}`);
      setCurrentChapter(response.data);
      // Update URL without reloading page
      navigate(`/read/${id}?chapter=${chId}`, { replace: true });
    } catch (error) {
      console.error('Error fetching chapter content:', error);
    } finally {
      setLoading(false);
      window.scrollTo(0, 0);
    }
  };

  // Auto-hide toolbar after a few seconds
  useEffect(() => {
    let timeout;
    if (showToolbar && !showSettings && !showChapterList) {
      timeout = setTimeout(() => setShowToolbar(false), 5000);
    }
    return () => clearTimeout(timeout);
  }, [showToolbar, showSettings, showChapterList]);

  const currentIndex = currentChapter ? chapters.findIndex(c => c.id === currentChapter.id) : -1;
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < chapters.length - 1;

  if (loading && !currentChapter) {
    return <div className="min-h-screen flex items-center justify-center bg-[#f4f1ea] dark:bg-dark-bg text-[#333] dark:text-slate-300">Đang tải nội dung...</div>;
  }

  if (chapters.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f4f1ea] dark:bg-dark-bg text-[#333] dark:text-slate-300">
        <p className="mb-4">Truyện này chưa có chương nào.</p>
        <Link to={`/novel/${id}`} className="text-primary-600 hover:underline">Quay lại trang truyện</Link>
      </div>
    );
  }

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
              <Link to={`/novel/${id}`} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-700 dark:text-slate-300">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="font-sans font-bold text-lg text-slate-900 dark:text-white line-clamp-1">{novel?.title}</h1>
                <p className="font-sans text-xs text-slate-500 line-clamp-1">
                  {currentChapter ? (currentChapter.chapterNumber ? `Chương ${currentChapter.chapterNumber}: ` : '') + currentChapter.title : ''}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button 
                onClick={(e) => { e.stopPropagation(); setShowChapterList(!showChapterList); setShowSettings(false); }}
                className="p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <List className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setIsAIActive(!isAIActive)}
                className={`hidden md:block p-2 rounded-full transition-colors ${isAIActive ? 'text-primary-600 bg-primary-50 dark:bg-primary-900/30' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
              >
                <Sparkles className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setIsAudioActive(!isAudioActive)}
                className={`hidden md:block p-2 rounded-full transition-colors ${isAudioActive ? 'text-teal-600 bg-teal-50 dark:bg-teal-900/30' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
              >
                <Headphones className="w-5 h-5" />
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); setShowSettings(!showSettings); setShowChapterList(false); }}
                className="p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="relative z-10 max-w-3xl mx-auto pt-24 pb-32 px-6 md:px-12 pointer-events-none">
        
        {/* Title inside reading area */}
        {currentChapter && (
          <div className="mb-10 text-center pointer-events-auto">
            <h2 className="text-2xl md:text-3xl font-bold font-sans">
              {currentChapter.chapterNumber ? `Chương ${currentChapter.chapterNumber}: ` : ''}{currentChapter.title}
            </h2>
          </div>
        )}

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
                  Tính năng tóm tắt AI sẽ được cập nhật trong phiên bản tiếp theo.
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
          {loading ? 'Đang tải...' : currentChapter?.content}
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
              <button 
                onClick={(e) => { e.stopPropagation(); if (hasPrev) fetchChapterContent(chapters[currentIndex - 1].id); }}
                disabled={!hasPrev || loading}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors font-sans font-medium ${hasPrev && !loading ? 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300' : 'opacity-50 cursor-not-allowed text-slate-400'}`}
              >
                <ChevronLeft className="w-5 h-5" />
                <span className="hidden sm:inline">Chương trước</span>
              </button>
              
              <button 
                onClick={(e) => { e.stopPropagation(); setShowChapterList(!showChapterList); setShowSettings(false); }}
                className="px-6 py-2 bg-slate-100 dark:bg-slate-800 rounded-full font-sans font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                Mục lục
              </button>
              
              <button 
                onClick={(e) => { e.stopPropagation(); if (hasNext) fetchChapterContent(chapters[currentIndex + 1].id); }}
                disabled={!hasNext || loading}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors font-sans font-medium ${hasNext && !loading ? 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300' : 'opacity-50 cursor-not-allowed text-slate-400'}`}
              >
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
            onClick={(e) => e.stopPropagation()}
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

      {/* Chapter List Panel */}
      <AnimatePresence>
        {showChapterList && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="fixed top-16 left-0 bottom-0 w-80 bg-white dark:bg-slate-800 shadow-xl border-r border-slate-200 dark:border-slate-700 z-50 font-sans flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-4 border-b border-slate-200 dark:border-slate-700">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">Mục lục</h3>
              <button onClick={() => setShowChapterList(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-2">
              {chapters.map(chapter => (
                <button
                  key={chapter.id}
                  onClick={() => {
                    fetchChapterContent(chapter.id);
                    setShowChapterList(false);
                  }}
                  className={`w-full text-left p-3 rounded-lg mb-1 transition-colors ${currentChapter?.id === chapter.id ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-medium' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50'}`}
                >
                  <div className="line-clamp-2">
                    {chapter.chapterNumber ? `Chương ${chapter.chapterNumber}: ` : ''}{chapter.title}
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Reader;
