import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Eye, Clock, Bookmark, Play, List, AlertCircle, MessageSquare, Heart } from 'lucide-react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import CommentSection from '../components/CommentSection';

const NovelDetails = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('synopsis');
  const [novel, setNovel] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [engagement, setEngagement] = useState({ isBookmarked: false, userRating: null });
  const [ratingHover, setRatingHover] = useState(0);

  useEffect(() => {
    const fetchNovelDetails = async () => {
      try {
        const [novelRes, chaptersRes, engagementRes] = await Promise.all([
          api.get(`/novels/${id}`),
          api.get(`/novels/${id}/chapters`),
          api.get(`/engagement/status/${id}`).catch(() => ({ data: { isBookmarked: false, userRating: null } }))
        ]);
        setNovel(novelRes.data);
        setChapters(chaptersRes.data);
        setEngagement(engagementRes.data);
      } catch (error) {
        console.error('Error fetching novel details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchNovelDetails();
  }, [id]);

  const handleBookmark = async () => {
    try {
      const res = await api.post(`/engagement/bookmark/${id}`);
      setEngagement(prev => ({ ...prev, isBookmarked: res.data.bookmarked }));
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      alert('Vui lòng đăng nhập để đánh dấu!');
    }
  };

  const handleRate = async (score) => {
    try {
      await api.post(`/engagement/rate/${id}`, { score });
      setEngagement(prev => ({ ...prev, userRating: score }));
      // Refresh novel to get updated avg rating
      const novelRes = await api.get(`/novels/${id}`);
      setNovel(novelRes.data);
    } catch (error) {
      console.error('Error rating novel:', error);
      alert('Vui lòng đăng nhập để đánh giá!');
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center dark:bg-dark-bg text-white">Đang tải...</div>;
  }

  if (!novel) {
    return <div className="min-h-screen flex items-center justify-center dark:bg-dark-bg text-white">Không tìm thấy truyện!</div>;
  }

  const coverUrl = novel.coverImageUrl || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=800&auto=format&fit=crop';
  const tags = novel.genres ? novel.genres.split(',').map(tag => tag.trim()) : [];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-bg pb-20">
      {/* Hero Section */}
      <div className="relative h-[70vh] min-h-[600px]">
        {/* Blurred Background */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img 
            src={coverUrl} 
            alt="Background" 
            className="w-full h-full object-cover blur-3xl scale-110 opacity-30 dark:opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-50 dark:from-dark-bg via-slate-50/50 dark:via-dark-bg/50 to-transparent"></div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 relative z-10 h-full flex flex-col justify-end pb-12 pt-24 md:pt-32">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-10">
            {/* Cover */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="w-56 md:w-72 flex-shrink-0"
            >
              <img 
                src={coverUrl} 
                alt={novel.title} 
                className="w-full h-[320px] md:h-[420px] object-cover rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] border-4 border-white dark:border-slate-800 bg-slate-100 dark:bg-slate-800"
              />
            </motion.div>

            {/* Info */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex-grow text-center md:text-left"
            >
              <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-4">
                {tags.map(tag => (
                  <span key={tag} className="px-4 py-1.5 bg-primary-600/10 dark:bg-primary-500/10 text-primary-700 dark:text-primary-400 rounded-full text-xs font-bold border border-primary-600/20 uppercase tracking-wider">
                    {tag}
                  </span>
                ))}
              </div>

              <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-4 leading-tight">
                {novel.title}
              </h1>
              
              <div className="flex items-center justify-center md:justify-start gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-teal-500 flex items-center justify-center text-white font-bold">
                  {novel.author ? novel.author[0] : (novel.uploaderUsername ? novel.uploaderUsername[0] : 'U')}
                </div>
                <p className="text-xl text-slate-700 dark:text-slate-300 font-medium">
                  {novel.author || novel.uploaderUsername}
                </p>
              </div>

              <div className="flex flex-wrap justify-center md:justify-start gap-6 mb-10">
                <div className="flex flex-col items-center md:items-start">
                   <div className="flex items-center gap-1.5 text-yellow-500 mb-1">
                      <Star className="w-6 h-6 fill-current" />
                      <span className="text-2xl font-black text-slate-900 dark:text-white">{novel.rating ? novel.rating.toFixed(1) : '0.0'}</span>
                   </div>
                   <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Đánh giá</span>
                </div>
                <div className="w-px h-10 bg-slate-200 dark:bg-slate-800 hidden md:block" />
                <div className="flex flex-col items-center md:items-start">
                   <div className="flex items-center gap-1.5 text-blue-500 mb-1">
                      <Eye className="w-6 h-6" />
                      <span className="text-2xl font-black text-slate-900 dark:text-white">{novel.viewCount || 0}</span>
                   </div>
                   <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Lượt đọc</span>
                </div>
                <div className="w-px h-10 bg-slate-200 dark:bg-slate-800 hidden md:block" />
                <div className="flex flex-col items-center md:items-start">
                   <div className="flex items-center gap-1.5 text-purple-500 mb-1">
                      <List className="w-6 h-6" />
                      <span className="text-2xl font-black text-slate-900 dark:text-white">{novel.chapterCount || 0}</span>
                   </div>
                   <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Chương</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Link 
                  to={chapters.length > 0 ? `/read/${id}?chapter=${chapters[0].id}` : '#'} 
                  className={`px-10 py-4 bg-primary-600 hover:bg-primary-500 text-white font-black rounded-2xl shadow-2xl shadow-primary-500/40 transition-all flex items-center justify-center gap-3 transform hover:-translate-y-1 active:scale-95 ${chapters.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <Play className="w-6 h-6 fill-current" />
                  <span>ĐỌC NGAY</span>
                </Link>
                <button 
                  onClick={handleBookmark}
                  className={`px-10 py-4 font-black rounded-2xl border-2 transition-all flex items-center justify-center gap-3 transform hover:-translate-y-1 active:scale-95 ${engagement.isBookmarked ? 'bg-primary-600 border-primary-600 text-white shadow-xl shadow-primary-500/20' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white hover:border-primary-500'}`}
                >
                  <Bookmark className={`w-6 h-6 ${engagement.isBookmarked ? 'fill-current' : ''}`} />
                  <span>{engagement.isBookmarked ? 'ĐÃ ĐÁNH DẤU' : 'ĐÁNH DẤU'}</span>
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container mx-auto px-4 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Synopsis & Chapters */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden">
              <div className="flex p-2 bg-slate-50 dark:bg-slate-800/50">
                {['synopsis', 'chapters', 'comments'].map((tab) => (
                  <button 
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-4 rounded-2xl font-bold text-sm transition-all uppercase tracking-widest ${activeTab === tab ? 'bg-white dark:bg-slate-900 text-primary-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    {tab === 'synopsis' ? 'Giới thiệu' : tab === 'chapters' ? 'Chương' : 'Bình luận'}
                  </button>
                ))}
              </div>

              <div className="p-8 min-h-[400px]">
                <AnimatePresence mode="wait">
                  {activeTab === 'synopsis' && (
                    <motion.div
                      key="synopsis"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    >
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                        <AlertCircle className="w-6 h-6 text-primary-500" />
                        Tóm tắt nội dung
                      </h3>
                      <div className="text-slate-700 dark:text-slate-300 text-lg leading-relaxed whitespace-pre-wrap font-serif">
                        {novel.description || 'Chưa có giới thiệu cho truyện này.'}
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'chapters' && (
                    <motion.div
                      key="chapters"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    >
                      <div className="flex justify-between items-center mb-8">
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Danh sách chương</h3>
                        <span className="px-4 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-xs font-bold text-slate-500">{chapters.length} chương</span>
                      </div>
                      
                      {chapters.length === 0 ? (
                        <div className="text-center text-slate-500 py-12 bg-slate-50 dark:bg-slate-800/20 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">Chưa có chương nào được đăng.</div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {chapters.map((chapter) => (
                            <Link 
                              key={chapter.id} 
                              to={`/read/${id}?chapter=${chapter.id}`}
                              className="group p-5 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30 hover:bg-white dark:hover:bg-slate-900 hover:border-primary-500 hover:shadow-xl transition-all flex flex-col gap-1"
                            >
                              <span className="text-xs font-bold text-slate-400 group-hover:text-primary-500">CHƯƠNG {chapter.chapterNumber}</span>
                              <span className="font-bold text-slate-800 dark:text-slate-200 line-clamp-1">{chapter.title}</span>
                            </Link>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  )}

                  {activeTab === 'comments' && (
                    <motion.div
                      key="comments"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    >
                      <CommentSection novelId={id} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Right Column: Interaction & Stats */}
          <div className="space-y-8">
            {/* Rating Widget */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-xl border border-slate-100 dark:border-slate-800">
               <h4 className="text-xl font-bold mb-6 text-slate-900 dark:text-white flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500 fill-current" />
                  Đánh giá truyện
               </h4>
               <div className="flex flex-col items-center">
                  <div className="flex gap-2 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onMouseEnter={() => setRatingHover(star)}
                        onMouseLeave={() => setRatingHover(0)}
                        onClick={() => handleRate(star)}
                        className="p-1 transition-transform active:scale-90"
                      >
                        <Star 
                          className={`w-10 h-10 ${
                            (ratingHover || engagement.userRating) >= star 
                              ? 'text-yellow-500 fill-current' 
                              : 'text-slate-200 dark:text-slate-700'
                          }`} 
                        />
                      </button>
                    ))}
                  </div>
                  <p className="text-sm font-medium text-slate-500">
                    {engagement.userRating 
                      ? `Bạn đã đánh giá ${engagement.userRating}/5 sao` 
                      : 'Hãy để lại đánh giá của bạn'}
                  </p>
               </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-gradient-to-br from-primary-600 to-teal-600 rounded-3xl p-8 text-white shadow-2xl shadow-primary-500/30">
               <h4 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Heart className="w-5 h-5 fill-current" />
                  Cảm hứng mỗi ngày
               </h4>
               <div className="space-y-6">
                  <div className="flex justify-between items-end border-b border-white/20 pb-4">
                     <span className="text-sm opacity-80 font-medium">Lượt đọc tháng</span>
                     <span className="text-2xl font-black">{(novel.viewCount || 0) * 12}</span>
                  </div>
                  <div className="flex justify-between items-end border-b border-white/20 pb-4">
                     <span className="text-sm opacity-80 font-medium">Xếp hạng đề cử</span>
                     <span className="text-2xl font-black">Top 100</span>
                  </div>
               </div>
               <p className="mt-6 text-xs leading-relaxed opacity-80">
                  Truyện đang nhận được nhiều sự quan tâm từ cộng đồng. Hãy tiếp tục ủng hộ tác giả nhé!
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NovelDetails;
