import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, Image as ImageIcon } from 'lucide-react';
import api from '../services/api';

const NovelEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    genres: '',
    coverImageUrl: '',
    isPublic: false
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditing) {
      const fetchNovel = async () => {
        try {
          const response = await api.get(`/novels/${id}`);
          setFormData({
            title: response.data.title || '',
            author: response.data.author || '',
            description: response.data.description || '',
            genres: response.data.genres || '',
            coverImageUrl: response.data.coverImageUrl || '',
            isPublic: response.data.isPublic || false
          });
        } catch (error) {
          console.error('Error fetching novel:', error);
          alert('Không thể tải thông tin truyện');
        }
      };
      fetchNovel();
    }
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEditing) {
        await api.put(`/novels/${id}`, formData);
        alert('Cập nhật truyện thành công!');
      } else {
        await api.post('/novels', formData);
        alert('Tạo truyện mới thành công!');
      }
      navigate('/writer');
    } catch (error) {
      console.error('Error saving novel:', error);
      alert('Đã xảy ra lỗi khi lưu truyện');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-bg pt-24 pb-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <button 
          onClick={() => navigate('/writer')}
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
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-8">
            {isEditing ? 'Chỉnh sửa Truyện' : 'Tạo Truyện Mới'}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Tên truyện <span className="text-rose-500">*</span></label>
                <input 
                  type="text" 
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                  placeholder="Nhập tên truyện..."
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Tác giả gốc</label>
                <input 
                  type="text" 
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                  placeholder="Tên tác giả gốc (nếu có)"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Thể loại</label>
                <input 
                  type="text" 
                  name="genres"
                  value={formData.genres}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                  placeholder="Tiên hiệp, Kiếm hiệp, Xuyên không... (cách nhau bằng dấu phẩy)"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Ảnh bìa truyện</label>
                <div className="flex flex-col sm:flex-row gap-6 items-start">
                  <div className="w-32 h-44 rounded-2xl overflow-hidden border-2 border-dashed border-slate-300 dark:border-slate-600 flex-shrink-0 relative group">
                    {formData.coverImageUrl ? (
                      <>
                        <img src={formData.coverImageUrl} alt="Cover Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <ImageIcon className="text-white w-8 h-8" />
                        </div>
                      </>
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-700/50 text-slate-400">
                        <ImageIcon className="w-8 h-8 mb-2" />
                        <span className="text-xs text-center px-2">Chưa có ảnh</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-grow space-y-3">
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Tải lên ảnh bìa cho truyện của bạn. Định dạng hỗ trợ: JPG, PNG, WEBP. Dung lượng tối đa 5MB.
                    </p>
                    <div className="flex gap-3">
                      <input 
                        type="file" 
                        id="coverUpload" 
                        className="hidden" 
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files[0];
                          if (!file) return;
                          
                          const formDataFile = new FormData();
                          formDataFile.append('file', file);
                          
                          try {
                            setLoading(true);
                            const response = await api.postMultipart('/novels/cover', formDataFile);
                            setFormData(prev => ({ ...prev, coverImageUrl: response.data.url }));
                          } catch (error) {
                            console.error('Error uploading cover:', error);
                            alert('Không thể tải ảnh lên. Vui lòng thử lại.');
                          } finally {
                            setLoading(false);
                          }
                        }}
                      />
                      <label 
                        htmlFor="coverUpload"
                        className="px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-xl cursor-pointer transition-colors text-sm font-medium border border-slate-200 dark:border-slate-600"
                      >
                        Chọn ảnh từ thiết bị
                      </label>
                      {formData.coverImageUrl && (
                        <button 
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, coverImageUrl: '' }))}
                          className="px-4 py-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-colors text-sm font-medium"
                        >
                          Xóa ảnh
                        </button>
                      )}
                    </div>
                    {/* Keep hidden field for the form submission */}
                    <input type="hidden" name="coverImageUrl" value={formData.coverImageUrl} />
                  </div>
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Giới thiệu truyện</label>
                <textarea 
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={6}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all resize-y"
                  placeholder="Tóm tắt nội dung truyện..."
                ></textarea>
              </div>

              <div className="space-y-2 md:col-span-2 flex items-center gap-3">
                <input 
                  type="checkbox" 
                  id="isPublic"
                  name="isPublic"
                  checked={formData.isPublic}
                  onChange={handleChange}
                  className="w-5 h-5 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                />
                <label htmlFor="isPublic" className="text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                  Công khai truyện này (người khác có thể tìm thấy và đọc)
                </label>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 dark:border-slate-700 flex justify-end gap-4">
              <button 
                type="button"
                onClick={() => navigate('/writer')}
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
                <span>{loading ? 'Đang lưu...' : (isEditing ? 'Cập nhật' : 'Tạo mới')}</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default NovelEditor;
