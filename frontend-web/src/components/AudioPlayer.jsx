import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipForward, Settings2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AudioPlayer = ({ chapterId, chapterTitle, content, onNextChapter, hasNext }) => {
  const [status, setStatus] = useState('idle'); // idle, playing, paused
  const [sentences, setSentences] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [autoplayNext, setAutoplayNext] = useState(() => {
    return localStorage.getItem('audio_autoplay') === 'true';
  });
  const [showSettings, setShowSettings] = useState(false);

  const isPlayingRef = useRef(false);
  isPlayingRef.current = status === 'playing';

  // Extract sentences from content
  useEffect(() => {
    if (content) {
      // Split by paragraphs or sentence-ending punctuation, keeping them somewhat chunked
      // This regex splits by newline or punctuation followed by space, but keeps the chunk reasonable
      const chunks = content
        .replace(/<[^>]+>/g, '') // remove HTML tags if any
        .split(/(?<=[.!?\n])\s+/)
        .filter(s => s.trim().length > 0);
      setSentences(chunks.length > 0 ? chunks : ["Chương này không có nội dung."]);
    } else {
      setSentences(["Đang tải nội dung..."]);
    }
  }, [content]);

  // Reset when chapter changes
  useEffect(() => {
    window.speechSynthesis.cancel();
    setStatus('idle');
    setCurrentIndex(0);
    
    // Auto-start next chapter
    if (autoplayNext && content) {
      // Small delay to let sentences array populate
      const timer = setTimeout(() => {
        setStatus('playing');
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [chapterId, autoplayNext]);

  // Load saved position
  useEffect(() => {
    if (status === 'idle') {
      const saved = localStorage.getItem(`audio_pos_${chapterId}`);
      if (saved && !isNaN(saved)) {
        setCurrentIndex(parseInt(saved, 10));
      }
    }
  }, [chapterId, status]);

  // Save position periodically
  useEffect(() => {
    if (currentIndex > 0) {
      localStorage.setItem(`audio_pos_${chapterId}`, currentIndex.toString());
    }
  }, [currentIndex, chapterId]);

  // Playback engine
  useEffect(() => {
    if (status === 'playing' && sentences.length > 0) {
      if (currentIndex >= sentences.length) {
        // Finished chapter
        setStatus('idle');
        if (autoplayNext && hasNext && onNextChapter) {
          onNextChapter();
        }
        return;
      }
      
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(sentences[currentIndex]);
      utterance.lang = 'vi-VN';
      utterance.rate = speed;
      
      utterance.onend = (e) => {
        if (isPlayingRef.current) {
          setCurrentIndex(prev => prev + 1);
        }
      };
      
      utterance.onerror = (e) => {
        if (e.error !== 'canceled' && e.error !== 'interrupted' && isPlayingRef.current) {
           setCurrentIndex(prev => prev + 1);
        }
      };
      
      // Delay slightly before speaking to avoid overlap bugs in Chrome
      setTimeout(() => {
        if (isPlayingRef.current) {
          window.speechSynthesis.speak(utterance);
        }
      }, 50);
      
    } else if (status === 'paused' || status === 'idle') {
      window.speechSynthesis.cancel();
    }
    
    return () => {
      // Cleanup happens when component unmounts or deps change
    };
  }, [currentIndex, status, sentences, speed, autoplayNext, hasNext, onNextChapter]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  // Handlers
  const togglePlay = () => {
    if (status === 'playing') {
      setStatus('paused');
    } else {
      setStatus('playing');
    }
  };

  const handleSeek = (e) => {
    const val = parseInt(e.target.value, 10);
    setCurrentIndex(val);
  };

  const changeSpeed = () => {
    setSpeed(s => s === 1 ? 1.25 : s === 1.25 ? 1.5 : s === 1.5 ? 2 : 1);
  };

  // Handle Autoplay option
  useEffect(() => {
    localStorage.setItem('audio_autoplay', autoplayNext);
  }, [autoplayNext]);

  return (
    <div className="w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 p-4 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)]">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-4">
        {/* Controls */}
        <div className="flex items-center gap-3">
          <button 
            onClick={togglePlay}
            className="w-12 h-12 flex items-center justify-center rounded-full bg-primary-600 hover:bg-primary-700 text-white shadow-lg transition-transform active:scale-95"
          >
             {status === 'playing' ? <Pause className="w-5 h-5 fill-current" /> :
             <Play className="w-5 h-5 fill-current ml-1" />}
          </button>
          
          <button 
            onClick={() => hasNext && onNextChapter()}
            disabled={!hasNext}
            className="w-10 h-10 flex items-center justify-center rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 transition-colors"
          >
            <SkipForward className="w-5 h-5 fill-current" />
          </button>
        </div>

        {/* Progress & Info */}
        <div className="flex-1 w-full flex flex-col gap-1">
          <div className="flex justify-between items-center text-xs text-slate-500 font-medium">
            <span className="line-clamp-1">{chapterTitle}</span>
            <span className="text-primary-500">Giọng đọc AI (Offline)</span>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500 font-mono w-10 text-right">{(currentIndex / Math.max(1, sentences.length) * 100).toFixed(0)}%</span>
            <input 
              type="range" 
              min="0" 
              max={Math.max(1, sentences.length - 1)} 
              value={currentIndex}
              onChange={handleSeek}
              className="flex-1 h-1.5 accent-primary-600 bg-slate-200 dark:bg-slate-700 rounded-full appearance-none cursor-pointer"
            />
            <span className="text-xs text-slate-500 font-mono w-10">{sentences.length} câu</span>
          </div>
        </div>

        {/* Additional Controls */}
        <div className="flex items-center gap-2 relative">
          <button 
            onClick={changeSpeed}
            className="px-2 py-1.5 min-w-[3rem] text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            {speed}x
          </button>
          
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className={`p-2 rounded-lg transition-colors ${showSettings ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
          >
            <Settings2 className="w-5 h-5" />
          </button>

          {/* Settings Popup */}
          <AnimatePresence>
            {showSettings && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute bottom-full right-0 mb-4 w-56 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 p-4"
              >
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">Tự động nghe chương tiếp</span>
                  <div className="relative">
                    <input 
                      type="checkbox" 
                      className="sr-only" 
                      checked={autoplayNext}
                      onChange={() => setAutoplayNext(!autoplayNext)}
                    />
                    <div className={`block w-10 h-6 rounded-full transition-colors ${autoplayNext ? 'bg-primary-600' : 'bg-slate-300 dark:bg-slate-600'}`}></div>
                    <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${autoplayNext ? 'transform translate-x-4' : ''}`}></div>
                  </div>
                </label>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
