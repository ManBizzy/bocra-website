import { motion } from 'framer-motion';
import { ArrowRight, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useNews } from '@/hooks/useNews';
import { NEWS_CATEGORIES } from '@/const';
import { formatDistanceToNow } from 'date-fns';
import { useState, useEffect } from 'react';

export default function NewsSection() {
  const { news, loading } = useNews(3);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  // Fake featured news data for carousel
  const featuredNews = [
    {
      id: '1',
      title: 'BOCRA Launches New Digital Regulation Framework',
      slug: 'bocra-launches-digital-framework',
      excerpt: 'BOCRA has unveiled a comprehensive new framework for regulating digital services in Botswana.',
      category: 'regulation' as const,
      featured_image_url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=500&fit=crop',
      published_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '2',
      title: 'Public Consultation on Mobile Network Coverage Standards',
      slug: 'consultation-mobile-coverage',
      excerpt: 'BOCRA is seeking public input on proposed new standards for mobile network coverage.',
      category: 'consultation' as const,
      featured_image_url: 'https://images.unsplash.com/photo-1557821552-17105176677c?w=1200&h=500&fit=crop',
      published_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '3',
      title: 'Domain Registry Reaches 5,000 Registrations Milestone',
      slug: 'domain-registry-milestone',
      excerpt: 'The .bw domain registry has achieved significant growth with over 5,000 active registrations.',
      category: 'announcement' as const,
      featured_image_url: 'https://images.unsplash.com/photo-1522252234503-6f0ea6287aba?w=1200&h=500&fit=crop',
      published_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];

  // Auto-play carousel every 2 seconds (pause on hover)
  useEffect(() => {
    if (isHovering) return;

    const interval = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % featuredNews.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [isHovering, featuredNews.length]);

  if (loading) {
    return (
      <section className="w-full bg-white py-14 md:py-20">
        <div className="container">
          <div className="mb-12">
            <Skeleton className="h-10 w-64 mb-4" />
            <Skeleton className="h-6 w-48" />
          </div>
          <Skeleton className="h-96 w-full mb-12 rounded-lg" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-80" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-white py-14 md:py-20">
      <div className="container">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-bocra-text-primary">Latest News & Announcements</h2>
          <a
            href="/news"
            className="inline-flex items-center gap-2 text-bocra-teal font-semibold hover:gap-3 transition-all"
          >
            View All News
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        {/* Featured News Carousel */}
        <div className="mb-12">
          <div className="relative group" onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>
            {/* Carousel Item */}
            <div className="relative h-96 rounded-lg overflow-hidden">
              {featuredNews[carouselIndex].featured_image_url && (
                <img
                  src={featuredNews[carouselIndex].featured_image_url}
                  alt={featuredNews[carouselIndex].title}
                  className="w-full h-full object-cover"
                />
              )}
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-8">
                <div className="text-white">
                  {/* Category Badge */}
                  {NEWS_CATEGORIES[featuredNews[carouselIndex].category as keyof typeof NEWS_CATEGORIES] && (
                    <span className={`inline-block w-fit px-3 py-1 rounded-full text-xs font-semibold text-white ${NEWS_CATEGORIES[featuredNews[carouselIndex].category as keyof typeof NEWS_CATEGORIES].color} mb-4`}>
                      {NEWS_CATEGORIES[featuredNews[carouselIndex].category as keyof typeof NEWS_CATEGORIES].label}
                    </span>
                  )}

                  {/* Title */}
                  <h3 className="text-2xl md:text-3xl font-bold mb-3">{featuredNews[carouselIndex].title}</h3>

                  {/* Excerpt */}
                  <p className="text-white/90 mb-4 max-w-2xl line-clamp-2">{featuredNews[carouselIndex].excerpt}</p>

                  {/* Date */}
                  <div className="flex items-center gap-2 text-white/80 text-sm">
                    <Calendar className="w-4 h-4" />
                    <time>{formatDistanceToNow(new Date(featuredNews[carouselIndex].published_at), { addSuffix: true })}</time>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Buttons */}
            <button
              onClick={() => setCarouselIndex((prev) => (prev - 1 + featuredNews.length) % featuredNews.length)}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-bocra-teal rounded-full p-2 transition-all opacity-0 group-hover:opacity-100"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={() => setCarouselIndex((prev) => (prev + 1) % featuredNews.length)}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-bocra-teal rounded-full p-2 transition-all opacity-0 group-hover:opacity-100"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Carousel Indicators */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {featuredNews.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCarouselIndex(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === carouselIndex ? 'bg-white w-8' : 'bg-white/50 w-2 hover:bg-white/75'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* News Ticker */}
        {news.length > 0 && (
          <div className="mb-12 bg-bocra-light-grey rounded-lg overflow-hidden">
            <div className="flex items-center h-12 px-4 bg-bocra-teal text-white text-sm font-semibold">
              <span className="mr-4">LATEST:</span>
              <div className="flex-1 overflow-hidden">
                <div className="animate-scroll whitespace-nowrap">
                  {news.map((item, index) => (
                    <span key={index} className="inline-block mr-8">
                      {item.title}
                    </span>
                  ))}
                  {news.map((item, index) => (
                    <span key={`repeat-${index}`} className="inline-block mr-8">
                      {item.title}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {news.map((article, index) => {
            const category = NEWS_CATEGORIES[article.category as keyof typeof NEWS_CATEGORIES];
            const publishedDate = new Date(article.published_at);

            return (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card className="h-full flex flex-col hover:shadow-lg transition-shadow overflow-hidden">
                  {article.featured_image_url && (
                    <div className="w-full h-40 bg-bocra-light-grey overflow-hidden">
                      <img
                        src={article.featured_image_url}
                        alt={article.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}

                  <div className="p-6 flex-1 flex flex-col">
                    {/* Category Badge */}
                    {category && (
                      <span className={`inline-block w-fit px-3 py-1 rounded-full text-xs font-semibold ${category.color} mb-3`}>
                        {category.label}
                      </span>
                    )}

                    {/* Date */}
                    <div className="flex items-center gap-2 text-bocra-text-muted text-sm mb-3">
                      <Calendar className="w-4 h-4" />
                      <time>{formatDistanceToNow(publishedDate, { addSuffix: true })}</time>
                    </div>

                    {/* Title */}
                    <h3 className="font-semibold text-lg text-bocra-text-primary mb-3 line-clamp-2 flex-1">
                      {article.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-bocra-text-secondary text-sm mb-4 line-clamp-3">
                      {article.excerpt}
                    </p>

                    {/* Read More */}
                    <a
                      href={`/news/${article.slug}`}
                      className="inline-flex items-center gap-2 text-bocra-teal font-semibold text-sm hover:gap-3 transition-all mt-auto"
                    >
                      Read More
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
