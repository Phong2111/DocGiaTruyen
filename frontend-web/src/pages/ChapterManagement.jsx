import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Plus, Edit3, Trash2, BookOpen, AlertCircle } from 'lucide-react';
import api from '../services/api';

const ChapterManagement = () => {
  const { novelId } = useParams();
  const navigate = useNavigate();
  
  const [novel, setNovel] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch novel details
        const novelRes = await api.get(`/novels/${novelId}`);
        setNovel(novelRes.data);

        // Fetch chapters
        const chaptersRes = await api.get(`/novels/${novelId}/chapters`);
        setChapters(chaptersRes.data);
      } catch (err) {
        console.error('Error fetching chapter management data:', err);
        setError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [novelId]);

  const handleDeleteChapter = async (chapterId, chapterNumber) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa chương ${chapterNumber} không?`)) {
      try {
        await api.delete(`/novels/${novelId}/chapters/${chapterId}`);
        setChapters(chapters.filter(c => c.id !== chapterId));
        alert('Xóa chương thành công!');
      } catch (err) {
        console.error('Error deleting chapter:', err);
        alert('Không thể xóa chương. Vui lòng thử lại.');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-dark-bg">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error || !novel) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-dark-bg p-4">
        <AlertCircle className="w-16 h-16 text-rose-500 mb-4" />
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{error || 'Không tìm thấy truyện'}</h2>
        <button onClick={() => navigate('/writer')} className="mt-4 px-6 py-2 bg-primary-600 text-white rounded-xl">Quay lại</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-bg pt-24 pb-20">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/writer')}
              className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-slate-600 dark:text-slate-400" />
            </button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white line-clamp-1">
                Quản lý chương: {novel.title}
              </h1>
              <p className="text-slate-500 dark:text-slate-400">Tổng cộng {chapters.length} chương</p>
            </div>
          </div>
          
          <Link 
            to={`/writer/novel/${novelId}/chapter/new`}
            className="flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-2xl font-semibold transition-all shadow-lg shadow-primary-500/30"
          >
            <Plus className="w-5 h-5" />
            <span>Thêm chương mới</span>
          </Link>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 text-sm font-medium uppercase tracking-wider">
                  <th className="px-6 py-4">Chương</th>
                  <th className="px-6 py-4">Tiêu đề</th>
                  <th className="px-6 py-4">Ngày cập nhật</th>
                  <th className="px-6 py-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                <AnimatePresence>
                  {chapters.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                        Chưa có chương nào được đăng.
                      </td>
                    </tr>
                  ) : (
                    chapters.map((chapter) => (
                      <motion.tr 
                        key={chapter.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors"
                      >
                        <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                          Chương {chapter.chapterNumber}
                        </td>
                        <td className="px-6 py-4 text-slate-700 dark:text-slate-300">
                          {chapter.title}
                        </td>
                        <td className="px-6 py-4 text-slate-500 dark:text-slate-400 text-sm">
                          {new Date(chapter.updatedAt || chapter.createdAt).toLocaleDateString('vi-VN')}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <Link 
                              to={`/read/${novelId}?chapter=${chapter.id}`}
                              className="p-2 text-slate-400 hover:text-primary-500 transition-colors"
                              title="Đọc thử"
                            >
                              <BookOpen className="w-5 h-5" />
                            </Link>
                            <Link 
                              to={`/writer/novel/${novelId}/chapter/${chapter.id}/edit`}
                              className="p-2 text-slate-400 hover:text-indigo-500 transition-colors"
                              title="Chỉnh sửa"
                            >
                              <Edit3 className="w-5 h-5" />
                            </Link>
                            <button 
                              onClick={() => handleDeleteChapter(chapter.id, chapter.chapterNumber)}
                              className="p-2 text-slate-400 hover:text-rose-500 transition-colors"
                              title="Xóa chương"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChapterManagement;
