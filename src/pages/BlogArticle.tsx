import { useEffect, useState, useMemo } from 'react';
import { useTranslation } from '../i18n';
import { Calendar, Clock, User, ArrowLeft, Share2, Link, Check, Facebook, Twitter } from 'lucide-react';
import { BlogPost } from '../types';
import { defaultBlogPosts } from '../data/defaultBlogPosts';

interface BlogArticleProps {
  slug: string;
  onPageChange: (pageName: string, params?: any) => void;
  currency: 'USD' | 'MAD';
}

export default function BlogArticle({ slug, onPageChange }: BlogArticleProps) {
  const [copied, setCopied] = useState(false);
  const { t } = useTranslation();

  const post = useMemo(
    () => defaultBlogPosts.find(p => p.slug === slug) || null,
    [slug]
  );

  const related = useMemo(
    () => (post ? defaultBlogPosts.filter(p => p.category === post.category && p.id !== post.id).slice(0, 3) : []),
    [post]
  );

  useEffect(() => {
    if (post) {
      document.title = `${post.title} | ${t('blog.seo.title')}`;
      let metaDesc = document.querySelector('meta[name="description"]');
      const prev = metaDesc?.getAttribute('content') || '';
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', post.excerpt);
      return () => {
        document.title = t('blogArticle.seoTitle');
        if (metaDesc) metaDesc.setAttribute('content', prev);
      };
    }
  }, [post]);

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  const handleShare = async (platform?: string) => {
    const url = window.location.href;
    if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
    } else if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(post?.title || '')}`, '_blank');
    } else {
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch { /* fallback */ }
    }
  };

  if (!post) {
    return (
      <div className="max-w-2xl mx-auto text-center py-24 px-6">
        <p className="font-serif text-xl text-stone-800 mb-4">{t('blogArticle.notFound')}</p>
        <button
          onClick={() => onPageChange('blog')}
          className="cursor-pointer inline-flex items-center gap-1.5 text-xs tracking-widest uppercase font-bold text-champagne-600 hover:text-champagne-700 transition-colors font-sans"
        >
          <ArrowLeft size={12} />
          {t('blogArticle.back')}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-10">
      {/* Back link */}
      <button
        onClick={() => onPageChange('blog')}
        className="cursor-pointer inline-flex items-center gap-1.5 text-[10px] tracking-widest uppercase font-bold text-champagne-600 hover:text-champagne-700 transition-colors font-sans"
      >
        <ArrowLeft size={12} />
        {t('blogArticle.back')}
      </button>

      {/* Hero Image */}
      <div className="aspect-[21/9] relative overflow-hidden rounded-xl border border-champagne-150">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Article Header */}
      <div className="space-y-4 text-right" dir="rtl">
        <span className="inline-block text-[9px] tracking-widest uppercase font-bold text-champagne-600 bg-champagne-50 border border-champagne-200 px-3 py-1.5 rounded-sm font-sans">
          {post.category}
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-stone-900 font-black leading-tight tracking-tight">
          {post.title}
        </h1>
        <div className="flex flex-wrap items-center gap-4 text-[10px] text-stone-400 font-sans justify-end">
          <span className="flex items-center gap-1.5">
            <Calendar size={11} />
            {formatDate(post.date)}
          </span>
          <span className="flex items-center gap-1.5">
            <User size={11} />
            {post.author}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock size={11} />
            {post.content.split(' ').length > 200 ? t('blogArticle.minRead', { min: '5' }) : t('blogArticle.minRead', { min: '3' })}
          </span>
        </div>
        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 justify-end pt-1">
          {post.tags.map(tag => (
            <span
              key={tag}
              className="text-[9px] tracking-wider uppercase text-stone-400 bg-stone-50 border border-stone-200 px-2 py-1 rounded-sm font-sans"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="w-full h-[1px] bg-champagne-150"></div>

      {/* Article Content */}
      <article
        className="prose prose-stone prose-sm max-w-none text-right font-sans leading-relaxed text-stone-700 space-y-4 [&_p]:text-sm [&_p]:leading-[1.9] [&_strong]:text-stone-900 [&_strong]:font-bold"
        dir="rtl"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* Divider */}
      <div className="w-full h-[1px] bg-champagne-150"></div>

      {/* Social Sharing */}
      <div className="flex flex-col sm:flex-row items-center gap-4 justify-between" dir="rtl">
        <span className="text-[10px] tracking-widest uppercase font-bold text-stone-500 font-sans">
          {t('blogArticle.share')}
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleShare('facebook')}
            className="cursor-pointer w-9 h-9 rounded-full bg-stone-100 hover:bg-champagne-500 hover:text-white border border-stone-200 flex items-center justify-center text-stone-600 transition-all"
            aria-label={t('blogArticle.shareFacebook')}
          >
            <Facebook size={14} />
          </button>
          <button
            onClick={() => handleShare('twitter')}
            className="cursor-pointer w-9 h-9 rounded-full bg-stone-100 hover:bg-champagne-500 hover:text-white border border-stone-200 flex items-center justify-center text-stone-600 transition-all"
            aria-label={t('blogArticle.shareTwitter')}
          >
            <Twitter size={14} />
          </button>
          <button
            onClick={() => handleShare()}
            className="cursor-pointer w-9 h-9 rounded-full bg-stone-100 hover:bg-champagne-500 hover:text-white border border-stone-200 flex items-center justify-center text-stone-600 transition-all"
            aria-label={t('blogArticle.copyLink')}
          >
            {copied ? <Check size={14} className="text-emerald-500" /> : <Link size={14} />}
          </button>
          <button
            onClick={() => handleShare()}
            className="cursor-pointer w-9 h-9 rounded-full bg-stone-100 hover:bg-champagne-500 hover:text-white border border-stone-200 flex items-center justify-center text-stone-600 transition-all"
            aria-label="Share"
          >
            <Share2 size={14} />
          </button>
        </div>
      </div>

      {/* Related Articles */}
      {related.length > 0 && (
        <section className="space-y-6 pt-4">
          <div className="text-center space-y-2">
            <span className="text-[10px] tracking-widest uppercase font-bold text-champagne-500 block font-sans">
              {t('blogArticle.youMayAlsoLike')}
            </span>
            <h2 className="font-serif text-2xl text-stone-900 font-bold">{t('blogArticle.related')}</h2>
            <div className="w-12 h-[2px] bg-champagne-500 mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {related.map(rel => (
              <article
                key={rel.id}
                className="bg-white border border-champagne-150 rounded-lg overflow-hidden shadow-xs hover:shadow-md hover:border-champagne-300 transition-all duration-300 group"
              >
                <div
                  onClick={() => onPageChange('blog-article', { slug: rel.slug })}
                  className="cursor-pointer aspect-[4/3] relative overflow-hidden bg-stone-100"
                >
                  <img
                    src={rel.image}
                    alt={rel.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                </div>
                <div className="p-4 space-y-2 text-right" dir="rtl">
                  <time className="text-[9px] text-stone-400 font-sans">{formatDate(rel.date)}</time>
                  <h3
                    onClick={() => onPageChange('blog-article', { slug: rel.slug })}
                    className="cursor-pointer font-serif text-sm text-stone-800 group-hover:text-champagne-600 font-bold leading-snug transition-colors"
                  >
                    {rel.title}
                  </h3>
                  <button
                    onClick={() => onPageChange('blog-article', { slug: rel.slug })}
                    className="cursor-pointer inline-flex items-center gap-1 text-[9px] tracking-widest uppercase font-bold text-champagne-600 hover:text-champagne-700 transition-colors font-sans"
                  >
                    {t('blog.readMore')}
                    <ArrowLeft size={10} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
