import { motion } from 'framer-motion';
import { ArrowRight, Calendar } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useNews } from '@/hooks/useNews';
import { NEWS_CATEGORIES } from '@/const';
import { formatDistanceToNow } from 'date-fns';

export default function NewsSection() {
  const { news, loading } = useNews(3);

  if (loading) {
    return (
      <section className="w-full bg-white py-14 md:py-20">
        <div className="container">
          <div className="mb-12">
            <Skeleton className="h-10 w-64 mb-4" />
            <Skeleton className="h-6 w-48" />
          </div>
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
                      <span className={`inline-block w-fit px-3 py-1 rounded-full text-xs font-semibold text-white ${category.color} mb-3`}>
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
