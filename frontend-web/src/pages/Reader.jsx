import React, { useState, useEffect } from 'react';
import { Settings, Headphones, Sparkles, ChevronLeft, ChevronRight, Menu, X, ArrowLeft, List, Bookmark, Type, AlignLeft, AlignCenter, AlignJustify } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useParams, useSearchParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import AudioPlayer from '../components/AudioPlayer';

const Reader = () => {
  const { id } = useParams(); // novelId
  const [searchParams] = useSearchParams();
  const chapterId = searchParams.get('chapter');
  const navigate = useNavigate();

  // Load settings from localStorage or defaults
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('readerSettings');
    return saved ? JSON.parse(saved) : {
      fontSize: 18,
      fontFamily: 'font-serif',
      theme: 'light', // light, sepia, dark
      textAlign: 'text-justify',
      lineHeight: 'leading-relaxed',
      dropCap: true
    };
  });

  const [showToolbar, setShowToolbar] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [showChapterList, setShowChapterList] = useState(false);
  const [isAIActive, setIsAIActive] = useState(false);
  const [isAudioActive, setIsAudioActive] = useState(false);
  
  const [novel, setNovel] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [currentChapter, setCurrentChapter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Save settings to localStorage when they change
  useEffect(() => {
    localStorage.setItem('readerSettings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    const fetchNovelAndChapters = async () => {
      try {
        const [novelRes, chaptersRes, statusRes] = await Promise.all([
          api.get(`/novels/${id}`),
          api.get(`/novels/${id}/chapters`),
          api.get(`/engagement/status/${id}`).catch(() => ({ data: { isBookmarked: false } }))
        ]);
        setNovel(novelRes.data);
        const fetchedChapters = chaptersRes.data;
        setChapters(fetchedChapters);
        setIsBookmarked(statusRes.data.isBookmarked);

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

        // Increment view count
        api.post(`/novels/${id}/view`).catch(err => console.error('Error incrementing view:', err));

      } catch (error) {
        console.error('Error fetching reader data:', error);
        setLoading(false);
      }
    };

    fetchNovelAndChapters();
  }, [id]);

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

  const handleToggleBookmark = async (e) => {
    e.stopPropagation();
    try {
      const res = await api.post(`/engagement/bookmark/${id}`);
      setIsBookmarked(res.data.bookmarked);
    } catch (error) {
      console.error('Error toggling bookmark:', error);
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

  // Theme styles
  const themeStyles = {
    light: "bg-[#f4f1ea] text-[#333]",
    sepia: "bg-[#f4ecd8] text-[#5b4636]",
    dark: "bg-[#1a1a1a] text-[#d1d1d1]"
  };

  if (loading && !currentChapter) {
    return <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${themeStyles[settings.theme]}`}>Đang tải nội dung...</div>;
  }

  if (chapters.length === 0) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center transition-colors duration-300 ${themeStyles[settings.theme]}`}>
        <p className="mb-4">Truyện này chưa có chương nào.</p>
        <Link to={`/novel/${id}`} className="text-primary-600 hover:underline">Quay lại trang truyện</Link>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${themeStyles[settings.theme]} ${settings.fontFamily}`}>
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

            <div className="flex items-center space-x-1 md:space-x-2">
              <button 
                onClick={handleToggleBookmark}
                className={`p-2 rounded-full transition-colors ${isBookmarked ? 'text-primary-600' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
              >
                <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
              </button>
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
            <h2 className="text-2xl md:text-4xl font-bold font-sans">
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
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 shadow-lg">
                <div className="flex items-center space-x-2 text-primary-500 font-sans font-bold mb-3">
                  <Sparkles className="w-5 h-5" />
                  <span>AI Insight</span>
                </div>
                <p className="text-sm font-sans leading-relaxed opacity-90">
                  Tính năng tóm tắt AI sẽ được cập nhật trong phiên bản tiếp theo.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Text Content */}
        <div 
          className={`whitespace-pre-wrap pointer-events-auto ${settings.textAlign} ${settings.lineHeight} ${settings.dropCap ? 'first-letter:text-5xl md:first-letter:text-7xl first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:mt-2 first-letter:text-primary-600' : ''}`}
          style={{ fontSize: `${settings.fontSize}px` }}
        >
          {loading ? 'Đang tải...' : currentChapter?.content}
        </div>

        {/* Bottom Chapter Navigation Buttons (Large) */}
        {!loading && (
          <div className="mt-16 flex flex-col items-center space-y-6 pointer-events-auto">
             <div className="flex w-full gap-4">
                <button 
                  onClick={() => hasPrev && fetchChapterContent(chapters[currentIndex - 1].id)}
                  disabled={!hasPrev}
                  className={`flex-1 py-4 px-6 rounded-2xl border flex items-center justify-center gap-2 transition-all ${hasPrev ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'opacity-30 cursor-not-allowed'}`}
                >
                  <ChevronLeft className="w-5 h-5" />
                  <span>Chương trước</span>
                </button>
                <button 
                   onClick={() => hasNext && fetchChapterContent(chapters[currentIndex + 1].id)}
                   disabled={!hasNext}
                   className={`flex-1 py-4 px-6 rounded-2xl border flex items-center justify-center gap-2 transition-all ${hasNext ? 'bg-primary-600 text-white border-primary-500 hover:bg-primary-500' : 'opacity-30 cursor-not-allowed'}`}
                >
                  <span>Chương tiếp</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
             </div>
             <Link to={`/novel/${id}`} className="text-sm opacity-60 hover:opacity-100 transition-opacity flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" /> Quay lại thông tin truyện
             </Link>
          </div>
        )}
      </div>

      {/* Bottom Navigation Toolbar */}
      <AnimatePresence>
        {showToolbar && !isAudioActive && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-0 left-0 right-0 h-16 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 z-50 flex items-center justify-around px-4"
          >
             <button onClick={() => hasPrev && fetchChapterContent(chapters[currentIndex - 1].id)} disabled={!hasPrev} className="p-3 disabled:opacity-30"><ChevronLeft /></button>
             <button onClick={() => setShowChapterList(true)} className="flex items-center gap-2 font-sans font-medium"><List className="w-5 h-5" /> Mục lục</button>
             <button onClick={() => hasNext && fetchChapterContent(chapters[currentIndex + 1].id)} disabled={!hasNext} className="p-3 disabled:opacity-30"><ChevronRight /></button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 rounded-t-3xl shadow-2xl z-[60] font-sans p-6 md:p-8 max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="max-w-2xl mx-auto">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Cài đặt đọc truyện</h3>
                <button onClick={() => setShowSettings(false)} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full">
                  <X className="w-6 h-6 text-slate-500" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Font Size */}
                <div className="space-y-4">
                  <label className="flex items-center gap-2 text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    <Type className="w-4 h-4" /> Cỡ chữ: {settings.fontSize}px
                  </label>
                  <div className="flex items-center gap-4">
                    <button onClick={() => setSettings(s => ({...s, fontSize: Math.max(12, s.fontSize - 1)}))} className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xl font-bold">-</button>
                    <input 
                      type="range" min="12" max="40" value={settings.fontSize} 
                      onChange={(e) => setSettings(s => ({...s, fontSize: Number(e.target.value)}))}
                      className="flex-1 accent-primary-600 h-2 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer"
                    />
                    <button onClick={() => setSettings(s => ({...s, fontSize: Math.min(40, s.fontSize + 1)}))} className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xl font-bold">+</button>
                  </div>
                </div>

                {/* Font Family */}
                <div className="space-y-4">
                   <label className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Phông chữ</label>
                   <div className="flex gap-2">
                      {['font-serif', 'font-sans', 'font-mono'].map(f => (
                        <button 
                          key={f} 
                          onClick={() => setSettings(s => ({...s, fontFamily: f}))}
                          className={`flex-1 py-2 rounded-xl border-2 transition-all ${settings.fontFamily === f ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20 text-primary-600' : 'border-slate-100 dark:border-slate-800'}`}
                        >
                          {f === 'font-serif' ? 'Serif' : f === 'font-sans' ? 'Sans' : 'Mono'}
                        </button>
                      ))}
                   </div>
                </div>

                {/* Themes */}
                <div className="space-y-4">
                   <label className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Màu nền</label>
                   <div className="flex gap-3">
                      {[
                        { id: 'light', bg: 'bg-[#f4f1ea]', border: 'border-[#e0ddd5]' },
                        { id: 'sepia', bg: 'bg-[#f4ecd8]', border: 'border-[#e8dfc7]' },
                        { id: 'dark', bg: 'bg-[#1a1a1a]', border: 'border-[#333]' }
                      ].map(t => (
                        <button 
                          key={t.id} 
                          onClick={() => setSettings(s => ({...s, theme: t.id}))}
                          className={`w-12 h-12 rounded-full ${t.bg} ${t.border} border-2 flex items-center justify-center transition-all ${settings.theme === t.id ? 'ring-2 ring-primary-600 ring-offset-2 dark:ring-offset-slate-900' : ''}`}
                        >
                          {settings.theme === t.id && <div className="w-2 h-2 rounded-full bg-primary-600" />}
                        </button>
                      ))}
                   </div>
                </div>

                {/* Alignment */}
                <div className="space-y-4">
                   <label className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Căn lề</label>
                   <div className="flex gap-2">
                      {[
                        { id: 'text-left', icon: AlignLeft },
                        { id: 'text-center', icon: AlignCenter },
                        { id: 'text-justify', icon: AlignJustify }
                      ].map(a => (
                        <button 
                          key={a.id} 
                          onClick={() => setSettings(s => ({...s, textAlign: a.id}))}
                          className={`flex-1 py-2 rounded-xl border-2 flex items-center justify-center transition-all ${settings.textAlign === a.id ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20 text-primary-600' : 'border-slate-100 dark:border-slate-800'}`}
                        >
                          <a.icon className="w-5 h-5" />
                        </button>
                      ))}
                   </div>
                </div>

                {/* Line Height */}
                <div className="space-y-4">
                   <label className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Giãn dòng</label>
                   <div className="flex gap-2">
                      {[
                        { id: 'leading-normal', label: '1.2' },
                        { id: 'leading-relaxed', label: '1.5' },
                        { id: 'leading-loose', label: '2.0' }
                      ].map(l => (
                        <button 
                          key={l.id} 
                          onClick={() => setSettings(s => ({...s, lineHeight: l.id}))}
                          className={`flex-1 py-2 rounded-xl border-2 transition-all ${settings.lineHeight === l.id ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20 text-primary-600' : 'border-slate-100 dark:border-slate-800'}`}
                        >
                          {l.label}
                        </button>
                      ))}
                   </div>
                </div>

                {/* Drop Cap Toggle */}
                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                   <div>
                      <div className="font-bold">Chữ mở đầu lớn</div>
                      <div className="text-xs opacity-60">Hiển thị chữ cái đầu tiên to hơn</div>
                   </div>
                   <button 
                    onClick={() => setSettings(s => ({...s, dropCap: !s.dropCap}))}
                    className={`w-12 h-6 rounded-full transition-colors relative ${settings.dropCap ? 'bg-primary-600' : 'bg-slate-300 dark:bg-slate-700'}`}
                   >
                     <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${settings.dropCap ? 'left-7' : 'left-1'}`} />
                   </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chapter List Panel */}
      <AnimatePresence>
        {showChapterList && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            className="fixed inset-y-0 left-0 w-80 bg-white dark:bg-slate-900 shadow-2xl z-[70] font-sans flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-xl text-slate-900 dark:text-white">Mục lục</h3>
              <button onClick={() => setShowChapterList(false)} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
              {chapters.map(chapter => (
                <button
                  key={chapter.id}
                  onClick={() => {
                    fetchChapterContent(chapter.id);
                    setShowChapterList(false);
                  }}
                  className={`w-full text-left p-4 rounded-2xl mb-2 transition-all ${currentChapter?.id === chapter.id ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                >
                  <div className="text-sm opacity-60 mb-1">Chương {chapter.chapterNumber}</div>
                  <div className="font-bold line-clamp-2">{chapter.title}</div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Audio Player */}
      <AnimatePresence>
        {isAudioActive && currentChapter && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-0 left-0 right-0 z-50"
          >
            <AudioPlayer 
              novelId={id}
              chapterId={currentChapter.id}
              chapterTitle={`Chương ${currentChapter.chapterNumber || ''}: ${currentChapter.title}`}
              content={currentChapter.content}
              hasNext={hasNext}
              onNextChapter={() => {
                if (hasNext) {
                  fetchChapterContent(chapters[currentIndex + 1].id);
                }
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background Overlay for Panels */}
      <AnimatePresence>
        {(showSettings || showChapterList) && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => { setShowSettings(false); setShowChapterList(false); }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[55]"
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Reader;
