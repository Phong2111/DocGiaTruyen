import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Filter, ChevronDown, Search } from 'lucide-react';
import NovelCard from '../components/NovelCard';

const DUMMY_NOVELS = [
  { id: '1', title: 'Thế Giới Hoàn Mỹ', author: 'Thần Đông', cover: '/images/cover_1.png', rating: '4.8', views: '2.1M', tags: ['Tiên Hiệp'], isTrending: true },
  { id: '2', title: 'Vạn Cổ Thần Đế', author: 'Phi Thiên Ngư', cover: '/images/cover_2.png', rating: '4.7', views: '1.5M', tags: ['Huyền Huyễn'], isTrending: true },
  { id: '3', title: 'Ngạo Thế Đan Thần', author: 'Tịch Tiểu Tặc', cover: '/images/cover_3.png', rating: '4.5', views: '980K', tags: ['Tiên Hiệp'], isTrending: false },
  { id: '4', title: 'Đấu Phá Thương Khung', author: 'Thiên Tàm Thổ Đậu', cover: '/images/cover_1.png', rating: '4.9', views: '5.2M', tags: ['Dị Giới'], isTrending: true },
  { id: '5', title: 'Phàm Nhân Tu Tiên', author: 'Vong Ngữ', cover: '/images/cover_2.png', rating: '4.9', views: '3.4M', tags: ['Tiên Hiệp'], isTrending: false },
  { id: '6', title: 'Kiếm Lai', author: 'Phong Hỏa Hí Chư Hầu', cover: '/images/cover_3.png', rating: '4.8', views: '1.2M', tags: ['Tiên Hiệp'], isTrending: false },
  { id: '7', title: 'Đại Phụng Đả Canh Nhân', author: 'Mại Báo Tiểu Lang Quân', cover: '/images/cover_1.png', rating: '4.9', views: '4.1M', tags: ['Xuyên Không'], isTrending: true },
  { id: '8', title: 'Toàn Trí Độc Giả', author: 'Sing N Song', cover: '/images/cover_2.png', rating: '4.9', views: '6.5M', tags: ['Đô Thị', 'Hệ Thống'], isTrending: true },
];

const CATEGORIES = ['Tất cả', 'Tiên Hiệp', 'Huyền Huyễn', 'Đô Thị', 'Khoa Huyễn', 'Võng Du', 'Dị Giới', 'Đồng Nhân'];
const STATUSES = ['Tất cả', 'Đang ra', 'Hoàn thành', 'Tạm dừng'];
const SORTS = ['Lượt xem', 'Đánh giá', 'Mới cập nhật', 'Số chương'];

const Explore = ({ initialTab = 'explore' }) => {
  const [activeCategory, setActiveCategory] = useState(initialTab === 'categories' ? 'Tiên Hiệp' : 'Tất cả');
  const [activeStatus, setActiveStatus] = useState('Tất cả');
  const [activeSort, setActiveSort] = useState(initialTab === 'ranking' ? 'Lượt xem' : 'Mới cập nhật');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-bg pt-24 pb-20">
      <div className="container mx-auto px-4 md:px-8">
        
        {/* Header & Search */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Khám Phá</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Tìm kiếm những bộ truyện hay nhất dành cho bạn</p>
          </div>
          
          <div className="w-full md:w-auto relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
            </div>
            <input 
              type="text" 
              placeholder="Tìm tên truyện, tác giả..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-80 pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-slate-900 dark:text-white placeholder-slate-400 shadow-sm transition-all"
            />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="w-full lg:w-64 flex-shrink-0 space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700 shadow-sm">
              <div className="flex items-center gap-2 mb-4 text-slate-900 dark:text-white font-semibold pb-2 border-b border-slate-100 dark:border-slate-700">
                <Filter className="w-5 h-5" />
                <h2>Bộ Lọc</h2>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-3 uppercase tracking-wider">Thể Loại</h3>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`px-3 py-1.5 text-sm rounded-lg transition-colors border ${
                        activeCategory === cat 
                          ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 border-primary-200 dark:border-primary-800 font-medium' 
                          : 'bg-transparent text-slate-600 dark:text-slate-300 border-transparent hover:bg-slate-100 dark:hover:bg-slate-700'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Status */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-3 uppercase tracking-wider">Trạng Thái</h3>
                <div className="flex flex-col gap-1">
                  {STATUSES.map(status => (
                    <label key={status} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer transition-colors text-slate-700 dark:text-slate-300">
                      <input 
                        type="radio" 
                        name="status"
                        checked={activeStatus === status}
                        onChange={() => setActiveStatus(status)}
                        className="w-4 h-4 text-primary-600 focus:ring-primary-500 border-slate-300 dark:border-slate-600 bg-transparent"
                      />
                      <span className="text-sm">{status}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Sort */}
              <div>
                <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-3 uppercase tracking-wider">Sắp Xếp</h3>
                <div className="relative">
                  <select 
                    value={activeSort}
                    onChange={(e) => setActiveSort(e.target.value)}
                    className="w-full appearance-none bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 py-2.5 pl-4 pr-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                  >
                    {SORTS.map(sort => (
                      <option key={sort} value={sort}>{sort}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Results Grid */}
          <div className="flex-grow">
            <div className="mb-4 text-slate-600 dark:text-slate-400 text-sm flex justify-between items-center">
              <span>Hiển thị <span className="font-semibold text-slate-900 dark:text-white">120</span> kết quả</span>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {DUMMY_NOVELS.map((novel, index) => (
                <motion.div
                  key={novel.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <NovelCard {...novel} />
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-12 flex justify-center">
              <nav className="flex items-center gap-1">
                <button className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50">
                  Trước
                </button>
                <button className="px-4 py-2 rounded-lg bg-primary-600 text-white font-medium shadow-md shadow-primary-500/30">
                  1
                </button>
                <button className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">
                  2
                </button>
                <button className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">
                  3
                </button>
                <span className="px-2 text-slate-500">...</span>
                <button className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">
                  12
                </button>
                <button className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">
                  Sau
                </button>
              </nav>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Explore;
