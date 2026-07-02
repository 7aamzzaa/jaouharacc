import { useState, useMemo } from 'react';
import { useTranslation } from '../i18n';
import { Search, Clock, ArrowLeft, ArrowRight, Calendar, RefreshCw, ChevronDown } from 'lucide-react';
import { BlogPost } from '../types';
import { defaultBlogPosts } from '../data/defaultBlogPosts';

interface BlogProps {
  onPageChange: (pageName: string, params?: any) => void;
  currency: 'USD' | 'MAD';
}

const POSTS_PER_PAGE = 6;

export default function Blog({ onPageChange }: BlogProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [visibleCount, setVisibleCount] = useState(POSTS_PER_PAGE);
  const { t, dir } = useTranslation();

  const featured = defaultBlogPosts[0];

  const filteredPosts = useMemo(() => {
    let list = [...defaultBlogPosts];
    if (selectedCategory !== 'All') {
      list = list.filter(p => p.category === selectedCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        p => p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q)
      );
    }
    return list;
  }, [selectedCategory, searchQuery]);

  const visiblePosts = filteredPosts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredPosts.length;

  const handleReset = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setVisibleCount(POSTS_PER_PAGE);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14 py-8 md:py-12">
      {/* Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <span className="text-xs tracking-[0.3em] font-medium uppercase text-champagne-500 block font-sans">
          {t('blog.header.label')}
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl text-stone-900 font-black tracking-tight">
          {t('blog.header.title')}
        </h1>
        <p className="text-stone-500 text-sm sm:text-base leading-relaxed max-w-lg mx-auto font-sans">
          {t('blog.header.desc')}
        </p>
        <div className="w-16 h-[2px] bg-champagne-500 mx-auto rounded-full"></div>
      </div>

      {/* Featured Article */}
      <section className="relative overflow-hidden rounded-xl bg-stone-900 border border-champagne-400/20 shadow-xl group">
        <div className="aspect-[21/9] sm:aspect-[3/1] relative">
          <img
            src={featured.image}
            alt={featured.title}
            className="w-full h-full object-cover opacity-70 group-hover:opacity-80 transition-opacity duration-700"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/95 via-stone-950/50 to-transparent"></div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 md:p-14 text-start" dir={dir}>
          <span className="inline-block text-[9px] tracking-widest uppercase font-bold text-champagne-400 bg-stone-900/80 border border-champagne-400/30 px-3 py-1.5 rounded-sm mb-3 font-sans">
            {featured.category}
          </span>
          <h2 className="font-serif text-xl sm:text-3xl md:text-4xl text-white font-bold leading-tight mb-3 max-w-2xl">
            {featured.title}
          </h2>
          <p className="text-stone-300 text-xs sm:text-sm max-w-xl leading-relaxed mb-4 font-sans">
            {featured.excerpt}
          </p>
          <div className="flex items-center gap-4 text-[10px] text-stone-400 font-sans">
            <span className="flex items-center gap-1.5">
              <Calendar size={11} />
              {formatDate(featured.date)}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={11} />
              {featured.author}
            </span>
          </div>
          <button
            onClick={() => onPageChange('blog-article', { slug: featured.slug })}
            className="cursor-pointer mt-4 inline-flex items-center gap-1.5 text-[10px] tracking-widest uppercase font-bold text-champagne-400 hover:text-champagne-300 transition-colors font-sans"
          >
            {t('blog.readArticle')}
            {dir === 'ltr' ? <ArrowRight size={12} /> : <ArrowLeft size={12} />}
          </button>
        </div>
      </section>

      {/* Search & Filters */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
            <input
              type="text"
              placeholder={t('blog.searchPlaceholder')}
              value={searchQuery}
              onChange={e => { setSearchQuery(e.target.value); setVisibleCount(POSTS_PER_PAGE); }}
              className="w-full pl-10 pr-4 py-3 bg-white border border-champagne-150 rounded-lg text-xs text-stone-800 focus:outline-hidden focus:border-champagne-400 focus:ring-1 focus:ring-champagne-200 transition-all placeholder-stone-400 font-sans"
            />
          </div>
          <div className="flex items-center gap-2 font-sans">
            <span className="text-[10px] tracking-widest uppercase text-stone-400 font-medium">{t('blog.filterLabel')}</span>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => { setSelectedCategory('All'); setVisibleCount(POSTS_PER_PAGE); }}
                className={`px-3 py-1.5 text-[10px] tracking-wider uppercase font-bold rounded-md transition-colors ${
                  selectedCategory === 'All'
                    ? 'bg-champagne-500 text-white'
                    : 'bg-stone-100 text-stone-600 hover:bg-champagne-50 hover:text-champagne-600'
                }`}
              >
                  {t('blog.all')}
                </button>
                {(t('blog.categories') as string[]).map(cat => (
                <button
                  key={cat}
                  onClick={() => { setSelectedCategory(cat); setVisibleCount(POSTS_PER_PAGE); }}
                  className={`px-3 py-1.5 text-[10px] tracking-wider uppercase font-bold rounded-md transition-colors ${
                    selectedCategory === cat
                      ? 'bg-champagne-500 text-white'
                      : 'bg-stone-100 text-stone-600 hover:bg-champagne-50 hover:text-champagne-600'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Blog Grid */}
      {visiblePosts.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {visiblePosts.map(post => (
              <article
                key={post.id}
                className="bg-white border border-champagne-150 rounded-lg overflow-hidden shadow-xs hover:shadow-md hover:border-champagne-300 transition-all duration-300 group"
              >
                <div
                  onClick={() => onPageChange('blog-article', { slug: post.slug })}
                  className="cursor-pointer aspect-[4/3] relative overflow-hidden bg-stone-100"
                >
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                  <span className="absolute top-3 right-3 text-[8px] tracking-widest uppercase font-bold text-white bg-stone-900/80 border border-white/10 px-2 py-1 rounded-sm font-sans">
                    {post.category}
                  </span>
                </div>
                <div className="p-5 space-y-3 text-start" dir={dir}>
                  <time className="text-[10px] text-stone-400 font-sans flex items-center gap-1.5 justify-end">
                    <Calendar size={10} />
                    {formatDate(post.date)}
                  </time>
                  <h3
                    onClick={() => onPageChange('blog-article', { slug: post.slug })}
                    className="cursor-pointer font-serif text-base text-stone-800 group-hover:text-champagne-600 font-bold leading-snug transition-colors"
                  >
                    {post.title}
                  </h3>
                  <p className="text-stone-500 text-xs leading-relaxed font-sans line-clamp-2">
                    {post.excerpt}
                  </p>
                  <button
                    onClick={() => onPageChange('blog-article', { slug: post.slug })}
                    className="cursor-pointer inline-flex items-center gap-1 text-[10px] tracking-widest uppercase font-bold text-champagne-600 hover:text-champagne-700 transition-colors pt-1 font-sans"
                  >
                    {t('blog.readMore')}
                    {dir === 'ltr' ? <ArrowRight size={11} /> : <ArrowLeft size={11} />}
                  </button>
                </div>
              </article>
            ))}
          </div>

          {/* Load More */}
          {hasMore && (
            <div className="text-center pt-4">
              <button
                onClick={() => setVisibleCount(prev => prev + POSTS_PER_PAGE)}
                className="cursor-pointer inline-flex items-center gap-2 bg-stone-900 text-white px-8 py-3.5 text-xs uppercase tracking-widest font-bold hover:bg-champagne-500 transition-all rounded-xs shadow-md hover:shadow-lg font-sans"
              >
                {t('blog.loadMore')}
                <ChevronDown size={13} />
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-20 bg-white border border-champagne-100 rounded-lg space-y-4">
          <RefreshCw size={40} className="text-stone-300 mx-auto" />
          <p className="font-serif text-xl text-stone-800 font-medium">{t('blog.empty.title')}</p>
          <p className="text-stone-400 text-xs font-sans">{t('blog.empty.desc')}</p>
          <button
            onClick={handleReset}
            className="cursor-pointer bg-champagne-500 text-white px-6 py-3 text-xs uppercase tracking-widest font-bold hover:bg-champagne-600 transition-colors rounded-xs font-sans"
          >
{t('blog.empty.reset')}
          </button>
        </div>
      )}
    </div>
  );
}
