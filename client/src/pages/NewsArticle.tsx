import { ArrowLeft, ArrowRight, Calendar } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useNews, useNewsArticle } from '@/hooks/useNews';
import { NEWS_CATEGORIES } from '@/const';
import { format } from 'date-fns';

export default function NewsArticle({ slug }: { slug: string }) {
  const { article, loading, error } = useNewsArticle(slug);
  const { news: relatedNews } = useNews(4);

  const relatedArticles = relatedNews.filter((item) => item.slug !== slug).slice(0, 3);
  const paragraphs =
    article?.content
      .split(/\n{2,}/)
      .map((paragraph) => paragraph.trim())
      .filter(Boolean) ?? [];

  return (
    <>
      <Helmet>
        <title>
          {article ? `${article.title} | BOCRA News` : 'Article | BOCRA'}
        </title>
        {article && (
          <>
            <meta name="description" content={article.excerpt} />
            <meta property="og:title" content={`${article.title} | BOCRA News`} />
            <meta property="og:description" content={article.excerpt} />
            <meta property="og:type" content="article" />
            <meta
              property="og:url"
              content={`${window.location.origin}/news/${article.slug}`}
            />
          </>
        )}
      </Helmet>

      <div className="bg-bocra-light-grey">
        {loading ? (
          <div className="container py-12 md:py-16">
            <Skeleton className="mb-6 h-6 w-32" />
            <Skeleton className="mb-4 h-12 w-full max-w-4xl" />
            <Skeleton className="mb-3 h-6 w-48" />
            <Skeleton className="mb-10 h-64 w-full" />
            <div className="space-y-4">
              {[1, 2, 3, 4].map((item) => (
                <Skeleton key={item} className="h-6 w-full" />
              ))}
            </div>
          </div>
        ) : error || !article ? (
          <div className="container py-12 md:py-16">
            <Card className="p-8">
              <h1 className="text-3xl font-bold text-bocra-text-primary">
                Article not found
              </h1>
              <p className="mt-3 text-bocra-text-secondary">
                {error ?? 'The requested news article could not be found.'}
              </p>
              <a
                href="/news"
                className="mt-6 inline-flex items-center gap-2 font-semibold text-bocra-teal"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to News
              </a>
            </Card>
          </div>
        ) : (
          <>
            <section className="border-b border-bocra-border bg-white">
              <div className="container py-12 md:py-16">
                <a
                  href="/news"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-bocra-teal transition-colors hover:text-bocra-forest-green"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to News
                </a>

                <div className="mt-6 max-w-4xl">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${NEWS_CATEGORIES[article.category].color}`}
                  >
                    {NEWS_CATEGORIES[article.category].label}
                  </span>

                  <h1 className="mt-5 text-4xl font-bold text-bocra-text-primary md:text-5xl">
                    {article.title}
                  </h1>

                  <div className="mt-5 flex items-center gap-2 text-sm text-bocra-text-muted">
                    <Calendar className="h-4 w-4 text-bocra-teal" />
                    <time dateTime={article.published_at}>
                      {format(new Date(article.published_at), 'dd MMMM yyyy')}
                    </time>
                  </div>

                  <p className="mt-6 text-xl leading-relaxed text-bocra-text-secondary">
                    {article.excerpt}
                  </p>
                </div>
              </div>
            </section>

            <section className="container py-10 md:py-14">
              <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
                <article className="rounded-2xl bg-white p-6 shadow-sm md:p-8">
                  {article.featured_image_url && (
                    <div className="mb-8 overflow-hidden rounded-2xl bg-bocra-light-grey">
                      <img
                        src={article.featured_image_url}
                        alt={article.title}
                        className="h-full max-h-[420px] w-full object-cover"
                      />
                    </div>
                  )}

                  <div className="prose max-w-none prose-p:text-bocra-text-secondary prose-headings:text-bocra-text-primary">
                    {paragraphs.length > 0 ? (
                      paragraphs.map((paragraph, index) => (
                        <p
                          key={`${article.id}-paragraph-${index}`}
                          className="mb-5 whitespace-pre-wrap text-base leading-8 text-bocra-text-secondary"
                        >
                          {paragraph}
                        </p>
                      ))
                    ) : (
                      <p className="whitespace-pre-wrap text-base leading-8 text-bocra-text-secondary">
                        {article.content}
                      </p>
                    )}
                  </div>
                </article>

                <aside className="space-y-6">
                  <Card className="bg-white p-6">
                    <h2 className="text-xl font-semibold text-bocra-text-primary">
                      Article Details
                    </h2>
                    <div className="mt-4 space-y-3 text-sm text-bocra-text-secondary">
                      <p>
                        <strong className="text-bocra-text-primary">Category:</strong>{' '}
                        {NEWS_CATEGORIES[article.category].label}
                      </p>
                      <p>
                        <strong className="text-bocra-text-primary">Published:</strong>{' '}
                        {format(new Date(article.published_at), 'dd MMM yyyy')}
                      </p>
                      {article.source_label && (
                        <p>
                          <strong className="text-bocra-text-primary">Source:</strong>{' '}
                          {article.source_label}
                        </p>
                      )}
                    </div>
                    {article.source_url && (
                      <a
                        href={article.source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-5 inline-flex items-center gap-2 font-semibold text-bocra-teal transition-all hover:gap-3"
                      >
                        Open Original Source
                        <ArrowRight className="h-4 w-4" />
                      </a>
                    )}
                  </Card>

                  <Card className="bg-white p-6">
                    <h2 className="text-xl font-semibold text-bocra-text-primary">
                      More News
                    </h2>
                    <div className="mt-5 space-y-5">
                      {relatedArticles.length > 0 ? (
                        relatedArticles.map((item) => (
                          <div
                            key={item.id}
                            className="border-b border-bocra-border pb-5 last:border-b-0 last:pb-0"
                          >
                            <p className="text-xs font-semibold uppercase tracking-wide text-bocra-teal">
                              {NEWS_CATEGORIES[item.category].label}
                            </p>
                            <h3 className="mt-2 text-base font-semibold text-bocra-text-primary">
                              {item.title}
                            </h3>
                            <a
                              href={`/news/${item.slug}`}
                              className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-bocra-teal"
                            >
                              Read More
                              <ArrowRight className="h-4 w-4" />
                            </a>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-bocra-text-secondary">
                          No related stories available yet.
                        </p>
                      )}
                    </div>
                  </Card>
                </aside>
              </div>
            </section>
          </>
        )}
      </div>
    </>
  );
}
