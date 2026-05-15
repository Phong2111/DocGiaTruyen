import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, User, Trash2, MessageSquare } from 'lucide-react';
import api from '../services/api';

const CommentSection = ({ novelId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [novelId]);

  const fetchComments = async () => {
    try {
      const response = await api.get(`/engagement/comments/${novelId}`);
      setComments(response.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setSubmitting(true);
    try {
      const response = await api.post(`/engagement/comments/${novelId}`, { content: newComment });
      setComments([response.data, ...comments]);
      setNewComment('');
    } catch (error) {
      console.error('Error posting comment:', error);
      alert('Vui lòng đăng nhập để bình luận!');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
  };

  return (
    <div className="space-y-8">
      {/* Post Comment */}
      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-100 dark:border-slate-800">
        <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-primary-500" />
          Viết bình luận
        </h4>
        <form onSubmit={handleSubmit} className="relative">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Chia sẻ cảm nghĩ của bạn về bộ truyện này..."
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4 pr-16 min-h-[120px] focus:ring-2 focus:ring-primary-500 outline-none transition-all resize-none"
          />
          <button
            type="submit"
            disabled={submitting || !newComment.trim()}
            className="absolute bottom-4 right-4 p-3 bg-primary-600 hover:bg-primary-500 text-white rounded-xl shadow-lg shadow-primary-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </form>
      </div>

      {/* Comments List */}
      <div className="space-y-6">
        {loading ? (
          <div className="text-center py-12 text-slate-500">Đang tải bình luận...</div>
        ) : comments.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800">
            <MessageSquare className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
            <p className="text-slate-500">Chưa có bình luận nào. Hãy là người đầu tiên!</p>
          </div>
        ) : (
          comments.map((comment, index) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              key={comment.id}
              className="flex gap-4 p-4 hover:bg-slate-50 dark:hover:bg-slate-800/30 rounded-2xl transition-colors"
            >
              {/* Avatar */}
              <div className="flex-shrink-0">
                {comment.avatarUrl ? (
                  <img src={comment.avatarUrl} alt={comment.username} className="w-12 h-12 rounded-full object-cover border-2 border-white dark:border-slate-800" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-teal-400 flex items-center justify-center text-white">
                    <User className="w-6 h-6" />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-grow space-y-1">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white mr-2">{comment.username}</span>
                    <span className="text-xs text-slate-500">{formatDate(comment.createdAt)}</span>
                  </div>
                </div>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  {comment.content}
                </p>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentSection;
