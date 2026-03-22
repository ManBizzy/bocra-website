import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { ArrowRight, Calendar, Search } from 'lucide-react';
import { useNews } from '@/hooks/useNews';
import { NEWS_CATEGORIES, SITE_DESCRIPTION } from '@/const';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';

export default function News() {
  const { news, loading, error } = useNews();
  const [activeCategory, setActiveCategory] = useState<
    'all' | 'announcement' | 'consultation' | 'regulation' | 'update' | 'vacancy'
  >('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredNews = news.filter((article) => {
    const matchesCategory =
      activeCategory === 'all' || article.category === activeCategory;
    const normalizedQuery = searchQuery.trim().toLowerCase();
    const matchesSearch =
      normalizedQuery.length === 0 ||
      article.title.toLowerCase().includes(normalizedQuery) ||
      article.excerpt.toLowerCase().includes(normalizedQuery) ||
      article.content.toLowerCase().includes(normalizedQuery);

    return matchesCategory && matchesSearch;
  });

  const featuredArticle = filteredNews[0] ?? null;
  const secondaryArticles = featuredArticle ? filteredNews.slice(1) : [];
  const categories = [
    { key: 'all', label: 'All' },
    { key: 'announcement', label: 'Announcements' },
    { key: 'consultation', label: 'Consultations' },
    { key: 'regulation', label: 'Regulation' },
    { key: 'update', label: 'Updates' },
    { key: 'vacancy', label: 'Vacancies' },
  ] as const;

  return (
    <>
      <Helmet>
        <title>News & Announcements | BOCRA</title>
        <meta
          name="description"
          content="Latest BOCRA news, media releases, consultations, and public announcements."
        />
        <meta property="og:title" content="News & Announcements | BOCRA" />
        <meta
          property="og:description"
          content="Latest BOCRA news, media releases, consultations, and public announcements."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${window.location.origin}/news`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="News & Announcements | BOCRA" />
        <meta
          name="twitter:description"
          content={SITE_DESCRIPTION}
        />
      </Helmet>

      <div className="bg-bocra-light-grey">
        <section className="border-b border-bocra-border bg-white">
          <div className="container py-12 md:py-16">
            <div className="max-w-3xl space-y-4">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-bocra-teal">
                Media Centre
              </p>
              <h1 className="text-4xl font-bold text-bocra-text-primary md:text-5xl">
                News & Announcements
              </h1>
              <p className="text-lg text-bocra-text-secondary">
                Latest media releases, social updates, regulatory notices, and
                vacancy announcements
                from the Botswana Communications Regulatory Authority.
              </p>
            </div>
          </div>
        </section>

        <section className="container py-8 md:py-10">
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative w-full md:max-w-md">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-bocra-text-muted" />
              <Input
                type="search"
                placeholder="Search news and announcements"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category.key}
                  type="button"
                  variant={activeCategory === category.key ? 'default' : 'outline'}
                  className={
                    activeCategory === category.key
                      ? 'bg-bocra-teal text-white hover:bg-bocra-teal/90'
                      : ''
                  }
                  onClick={() => setActiveCategory(category.key)}
                >
                  {category.label}
                </Button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="space-y-8">
              <Skeleton className="h-[360px] w-full" />
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <Skeleton key={item} className="h-72 w-full" />
                ))}
              </div>
            </div>
          ) : error ? (
            <Card className="p-8">
              <h2 className="text-2xl font-semibold text-bocra-text-primary">
                News is temporarily unavailable
              </h2>
              <p className="mt-3 text-bocra-text-secondary">{error}</p>
            </Card>
          ) : filteredNews.length === 0 ? (
            <Card className="p-8">
              <h2 className="text-2xl font-semibold text-bocra-text-primary">
                No matching stories
              </h2>
              <p className="mt-3 text-bocra-text-secondary">
                Adjust the search or category filters to find another article.
              </p>
            </Card>
          ) : (
            <div className="space-y-8">
              {featuredArticle && (
                <Card className="overflow-hidden border-0 bg-bocra-deep-teal text-white shadow-lg">
                  <div className="grid md:grid-cols-[1.2fr_0.8fr]">
                    <div className="p-8 md:p-10">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${NEWS_CATEGORIES[featuredArticle.category].color}`}
                      >
                        {NEWS_CATEGORIES[featuredArticle.category].label}
                      </span>
                      <h2 className="mt-5 text-3xl font-bold md:text-4xl">
                        {featuredArticle.title}
                      </h2>
                      <p className="mt-4 max-w-2xl text-white/80">
                        {featuredArticle.excerpt}
                      </p>
                      <div className="mt-6 flex items-center gap-2 text-sm text-white/70">
                        <Calendar className="h-4 w-4" />
                        <time dateTime={featuredArticle.published_at}>
                          {format(new Date(featuredArticle.published_at), 'dd MMM yyyy')}
                        </time>
                      </div>
                      <a
                        href={`/news/${featuredArticle.slug}`}
                        className="mt-8 inline-flex items-center gap-2 rounded-md bg-white px-5 py-3 font-semibold text-bocra-deep-teal transition-colors hover:bg-bocra-golden-yellow"
                      >
                        Read Full Story
                        <ArrowRight className="h-4 w-4" />
                      </a>
                    </div>

                    {featuredArticle.featured_image_url ? (
                      <div className="min-h-[280px] bg-bocra-teal">
                        <img
                          src={featuredArticle.featured_image_url}
                          alt={featuredArticle.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="flex min-h-[280px] items-center justify-center bg-gradient-to-br from-bocra-teal to-bocra-forest-green p-8">
                        <p className="max-w-xs text-center text-lg font-semibold text-white/90">
                          Official updates from BOCRA
                        </p>
                      </div>
                    )}
                  </div>
                </Card>
              )}

              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {secondaryArticles.map((article) => {
                  const category = NEWS_CATEGORIES[article.category];

                  return (
                    <Card
                      key={article.id}
                      className="flex h-full flex-col overflow-hidden bg-white transition-shadow hover:shadow-lg"
                    >
                      {article.featured_image_url && (
                        <div className="h-44 w-full overflow-hidden bg-bocra-light-grey">
                          <img
                            src={article.featured_image_url}
                            alt={article.title}
                            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                          />
                        </div>
                      )}

                      <div className="flex flex-1 flex-col p-6">
                        <span
                          className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold ${category.color}`}
                        >
                          {category.label}
                        </span>
                        {article.source_label && (
                          <p className="mt-3 text-xs font-semibold uppercase tracking-[0.18em] text-bocra-text-muted">
                            {article.source_label}
                          </p>
                        )}

                        <h3 className="mt-4 text-xl font-semibold text-bocra-text-primary">
                          {article.title}
                        </h3>
                        <p className="mt-3 flex-1 text-sm text-bocra-text-secondary">
                          {article.excerpt}
                        </p>
                        <div className="mt-5 flex items-center gap-2 text-sm text-bocra-text-muted">
                          <Calendar className="h-4 w-4" />
                          <time dateTime={article.published_at}>
                            {format(new Date(article.published_at), 'dd MMM yyyy')}
                          </time>
                        </div>
                        <a
                          href={`/news/${article.slug}`}
                          className="mt-6 inline-flex items-center gap-2 font-semibold text-bocra-teal transition-all hover:gap-3"
                        >
                          Read More
                          <ArrowRight className="h-4 w-4" />
                        </a>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}
        </section>
      </div>
    </>
  );
}
