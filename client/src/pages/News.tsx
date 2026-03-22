import { Helmet } from 'react-helmet-async';
import { useState, useMemo } from 'react';
import { Search, Filter, Calendar, ArrowRight, X } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { NEWS_CATEGORIES } from '@/const';
import { formatDistanceToNow } from 'date-fns';

// Fake news data for development
const FAKE_NEWS = [
  {
    id: '1',
    title: 'BOCRA Launches New Digital Regulation Framework',
    slug: 'bocra-launches-digital-framework',
    excerpt: 'BOCRA has unveiled a comprehensive new framework for regulating digital services in Botswana, establishing clear guidelines for telecommunications operators.',
    content: 'Full article content here...',
    category: 'regulation' as const,
    featured_image_url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop',
    published_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    title: 'Public Consultation on Mobile Network Coverage Standards',
    slug: 'consultation-mobile-coverage',
    excerpt: 'BOCRA is seeking public input on proposed new standards for mobile network coverage and service quality across the country.',
    content: 'Full article content here...',
    category: 'consultation' as const,
    featured_image_url: 'https://images.unsplash.com/photo-1557821552-17105176677c?w=800&h=400&fit=crop',
    published_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    title: 'Domain Registry Reaches 5,000 Registrations Milestone',
    slug: 'domain-registry-milestone',
    excerpt: 'The .bw domain registry has reached a significant milestone with over 5,000 active domain registrations, reflecting growing digital presence in Botswana.',
    content: 'Full article content here...',
    category: 'announcement' as const,
    featured_image_url: 'https://images.unsplash.com/photo-1522252234503-6f0ea6287aba?w=800&h=400&fit=crop',
    published_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '4',
    title: 'Improved Complaint Resolution Process Now Live',
    slug: 'complaint-process-update',
    excerpt: 'BOCRA has implemented enhanced systems to streamline the complaint resolution process, reducing average resolution time by 30%.',
    content: 'Full article content here...',
    category: 'update' as const,
    featured_image_url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop',
    published_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '5',
    title: 'Broadcasting Regulations Update for 2026',
    slug: 'broadcasting-regulations-2026',
    excerpt: 'New broadcasting regulations have been issued for 2026, with updated requirements for content standards and service delivery obligations.',
    content: 'Full article content here...',
    category: 'regulation' as const,
    featured_image_url: 'https://images.unsplash.com/photo-1573374694457-274fc9bacca5?w=800&h=400&fit=crop',
    published_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '6',
    title: 'Spectrum Allocation Tender Open for Applications',
    slug: 'spectrum-allocation-tender',
    excerpt: 'BOCRA has opened a new tender for spectrum allocation in the 5G and broadband frequencies. Interested operators are invited to apply.',
    content: 'Full article content here...',
    category: 'announcement' as const,
    featured_image_url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=400&fit=crop',
    published_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export default function News() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'recent' | 'oldest'>('recent');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // Filter and sort news
  const filteredNews = useMemo(() => {
    let result = FAKE_NEWS;

    // Apply search filter
    if (searchQuery) {
      result = result.filter(
        (article) =>
          article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          article.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply category filter
    if (selectedCategory) {
      result = result.filter((article) => article.category === selectedCategory);
    }

    // Apply sorting
    if (sortBy === 'oldest') {
      result.sort((a, b) => new Date(a.published_at).getTime() - new Date(b.published_at).getTime());
    } else {
      result.sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());
    }

    return result;
  }, [searchQuery, selectedCategory, sortBy]);

  // Paginate results
  const totalPages = Math.ceil(filteredNews.length / itemsPerPage);
  const paginatedNews = filteredNews.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory(null);
    setSortBy('recent');
    setCurrentPage(1);
  };

  return (
    <>
      <Helmet>
        <title>News & Announcements | BOCRA</title>
        <meta name="description" content="Latest news, announcements, and updates from the Botswana Communications Regulatory Authority" />
        <meta property="og:title" content="News & Announcements | BOCRA" />
        <meta property="og:description" content="Latest news and announcements from BOCRA" />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="w-full">
        {/* Hero Section */}
        <section className="w-full bg-gradient-to-r from-bocra-teal to-bocra-forest-green py-16 md:py-20">
          <div className="container">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">News & Announcements</h1>
            <p className="text-xl text-white/90">Stay updated with the latest from BOCRA</p>
          </div>
        </section>

        {/* Filters Section */}
        <section className="w-full bg-white border-b border-bocra-light-grey sticky top-16 z-40">
          <div className="container py-6">
            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-bocra-text-muted" />
                <input
                  type="text"
                  placeholder="Search news..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-12 pr-4 py-3 border border-bocra-light-grey rounded-lg focus:outline-none focus:ring-2 focus:ring-bocra-teal focus:border-transparent"
                />
              </div>
            </div>

            {/* Filter Controls */}
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
              {/* Category Filter */}
              <div className="flex items-center gap-2 flex-wrap">
                <Filter className="w-5 h-5 text-bocra-text-muted" />
                <span className="text-sm font-medium text-bocra-text-muted">Category:</span>
                {Object.entries(NEWS_CATEGORIES).map(([key, { label }]) => (
                  <button
                    key={key}
                    onClick={() => {
                      setSelectedCategory(selectedCategory === key ? null : key);
                      setCurrentPage(1);
                    }}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      selectedCategory === key
                        ? 'bg-bocra-teal text-white'
                        : 'bg-bocra-light-grey text-bocra-text-primary hover:bg-bocra-teal/10'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/* Sort Dropdown */}
              <div className="ml-auto flex items-center gap-2">
                <label className="text-sm font-medium text-bocra-text-muted">Sort:</label>
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value as 'recent' | 'oldest');
                    setCurrentPage(1);
                  }}
                  className="px-4 py-2 border border-bocra-light-grey rounded-lg focus:outline-none focus:ring-2 focus:ring-bocra-teal focus:border-transparent"
                >
                  <option value="recent">Most Recent</option>
                  <option value="oldest">Oldest First</option>
                </select>
              </div>

              {/* Reset Button */}
              {(searchQuery || selectedCategory) && (
                <button
                  onClick={handleResetFilters}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-bocra-dark-maroon hover:bg-bocra-light-grey rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                  Reset
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Results Count */}
        <section className="w-full bg-bocra-light-grey py-4">
          <div className="container">
            <p className="text-sm text-bocra-text-secondary">
              Showing {paginatedNews.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}–
              {Math.min(currentPage * itemsPerPage, filteredNews.length)} of {filteredNews.length} articles
            </p>
          </div>
        </section>

        {/* News Grid */}
        <section className="w-full bg-white py-12 md:py-16">
          <div className="container">
            {paginatedNews.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                  {paginatedNews.map((article) => {
                    const category = NEWS_CATEGORIES[article.category as keyof typeof NEWS_CATEGORIES];
                    const publishedDate = new Date(article.published_at);

                    return (
                      <Card key={article.id} className="h-full flex flex-col hover:shadow-lg transition-shadow overflow-hidden group">
                        {article.featured_image_url && (
                          <div className="w-full h-40 bg-bocra-light-grey overflow-hidden">
                            <img
                              src={article.featured_image_url}
                              alt={article.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
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

                          {/* Title */}
                          <h3 className="font-semibold text-lg text-bocra-text-primary mb-3 line-clamp-2 flex-1 group-hover:text-bocra-teal transition-colors">
                            {article.title}
                          </h3>

                          {/* Date */}
                          <div className="flex items-center gap-2 text-bocra-text-muted text-sm mb-3">
                            <Calendar className="w-4 h-4" />
                            <time>{formatDistanceToNow(publishedDate, { addSuffix: true })}</time>
                          </div>

                          {/* Excerpt */}
                          <p className="text-bocra-text-secondary text-sm mb-4 line-clamp-3 flex-1">
                            {article.excerpt}
                          </p>

                          {/* Read More */}
                          <a
                            href={`/news/${article.slug}`}
                            className="inline-flex items-center gap-2 text-bocra-teal font-semibold text-sm hover:gap-3 transition-all"
                          >
                            Read More
                            <ArrowRight className="w-4 h-4" />
                          </a>
                        </div>
                      </Card>
                    );
                  })}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2">
                    <Button
                      variant="outline"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    >
                      Previous
                    </Button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${
                          currentPage === page
                            ? 'bg-bocra-teal text-white'
                            : 'bg-bocra-light-grey text-bocra-text-primary hover:bg-bocra-teal/10'
                        }`}
                      >
                        {page}
                      </button>
                    ))}

                    <Button
                      variant="outline"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-bocra-text-secondary text-lg mb-4">No news articles found</p>
                <Button variant="outline" onClick={handleResetFilters}>
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
