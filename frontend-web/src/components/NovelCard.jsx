import React from 'react';
import { Star, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

const NovelCard = ({ id, title, author, cover, rating, views, tags, isTrending }) => {
  return (
    <Link to={`/novel/${id}`} className="group block h-full">
      <div className="relative overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800 aspect-[2/3] mb-3 shadow-sm group-hover:shadow-xl transition-all duration-300">
        <img 
          src={cover || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=300&auto=format&fit=crop'} 
          alt={title} 
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500 bg-slate-200 dark:bg-slate-700"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=300&auto=format&fit=crop';
          }}
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {isTrending && (
            <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider shadow-md">
              Hot
            </span>
          )}
        </div>

        {/* Stats on hover/bottom */}
        <div className="absolute bottom-0 left-0 w-full p-3 flex justify-between items-end transform translate-y-2 group-hover:translate-y-0 opacity-90 group-hover:opacity-100 transition-all duration-300">
          <div className="flex items-center space-x-1 text-yellow-400 text-sm font-medium">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span>{rating}</span>
          </div>
          <div className="flex items-center space-x-1 text-white text-xs opacity-80">
            <Eye className="w-3.5 h-3.5" />
            <span>{views}</span>
          </div>
        </div>
      </div>
      
      {/* Novel Info */}
      <div className="px-1">
        <h3 className="font-bold text-slate-900 dark:text-slate-100 line-clamp-2 leading-tight group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
          {title}
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">{author}</p>
        
        <div className="flex flex-wrap gap-1 mt-2">
          {tags?.slice(0, 2).map((tag, idx) => (
            <span key={idx} className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
};

export default NovelCard;
