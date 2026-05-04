import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Save } from 'lucide-react';
import api from '../services/api';

const ChapterEditor = () => {
  const { novelId, chapterId } = useParams();
  const navigate = useNavigate();
  const isEditing = !!chapterId;

  const [novelData, setNovelData] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    chapterNumber: '',
    content: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch novel info just to show title
    const fetchNovel = async () => {
      try {
        const response = await api.get(`/novels/${novelId}`);
        setNovelData(response.data);
      } catch (error) {
        console.error('Error fetching novel:', error);
      }
    };
    fetchNovel();

    if (isEditing) {
      const fetchChapter = async () => {
        try {
          const response = await api.get(`/novels/${novelId}/chapters/${chapterId}`);
          setFormData({
            title: response.data.title || '',
            chapterNumber: response.data.chapterNumber || '',
            content: response.data.content || ''
          });
        } catch (error) {
          console.error('Error fetching chapter:', error);
          alert('Không thể tải thông tin chương');
        }
      };
      fetchChapter();
    }
  }, [novelId, chapterId, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Prepare data
    const dataToSubmit = {
      ...formData,
      chapterNumber: formData.chapterNumber ? parseInt(formData.chapterNumber) : null
    };

    try {
      if (isEditing) {
        await api.put(`/novels/${novelId}/chapters/${chapterId}`, dataToSubmit);
        alert('Cập nhật chương thành công!');
      } else {
        await api.post(`/novels/${novelId}/chapters`, dataToSubmit);
        alert('Thêm chương mới thành công!');
      }
      navigate(`/writer/novel/${novelId}/chapters`); 
    } catch (error) {
      console.error('Error saving chapter:', error);
      alert('Đã xảy ra lỗi khi lưu chương');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-bg pt-24 pb-20">
      <div className="container mx-auto px-4 max-w-5xl">
        <button 
          onClick={() => navigate(`/writer/novel/${novelId}/chapters`)}
          className="flex items-center gap-2 text-slate-500 hover:text-primary-600 transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Quay lại Dashboard</span>
        </button>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-800 rounded-3xl p-6 md:p-8 shadow-xl border border-slate-100 dark:border-slate-700"
        >
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2">
              {isEditing ? 'Chỉnh sửa Chương' : 'Thêm Chương Mới'}
            </h1>
            {novelData && (
              <p className="text-slate-500 dark:text-slate-400">
                Thuộc truyện: <span className="font-semibold text-primary-600 dark:text-primary-400">{novelData.title}</span>
              </p>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="space-y-2 md:col-span-1">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Chương số</label>
                <input 
                  type="number" 
                  name="chapterNumber"
                  value={formData.chapterNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                  placeholder="Auto nếu để trống"
                />
              </div>

              <div className="space-y-2 md:col-span-3">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Tên chương <span className="text-rose-500">*</span></label>
                <input 
                  type="text" 
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                  placeholder="VD: Khởi đầu mới..."
                />
              </div>

              <div className="space-y-2 md:col-span-4 flex flex-col h-[500px]">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Nội dung chương <span className="text-rose-500">*</span></label>
                <textarea 
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  required
                  className="flex-grow w-full px-4 py-4 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all resize-none leading-relaxed text-lg"
                  placeholder="Bắt đầu viết nội dung tại đây..."
                ></textarea>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 dark:border-slate-700 flex justify-end gap-4">
              <button 
                type="button"
                onClick={() => navigate(`/writer/novel/${novelId}/chapters`)}
                className="px-6 py-2.5 rounded-xl font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                Hủy
              </button>
              <button 
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-8 py-2.5 rounded-xl font-medium transition-colors shadow-lg shadow-primary-500/30 disabled:opacity-70"
              >
                <Save className="w-5 h-5" />
                <span>{loading ? 'Đang lưu...' : (isEditing ? 'Cập nhật' : 'Đăng chương')}</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default ChapterEditor;
