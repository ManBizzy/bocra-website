import { Helmet } from 'react-helmet-async';
import { useState, useMemo } from 'react';
import { Search, Filter, Download, Calendar, FileText, FileCheck, BarChart3, BookOpen, X } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';

// Publication categories
const PUBLICATION_CATEGORIES = {
  reports: { label: 'Reports', color: 'bg-bocra-teal', icon: BarChart3 },
  guidelines: { label: 'Guidelines', color: 'bg-bocra-forest-green', icon: BookOpen },
  policy: { label: 'Policy Documents', color: 'bg-bocra-dark-maroon', icon: FileCheck },
  research: { label: 'Research', color: 'bg-blue-600', icon: BookOpen },
  annual: { label: 'Annual Reports', color: 'bg-purple-600', icon: BarChart3 },
};

// Fake publications data
const FAKE_PUBLICATIONS = [
  {
    id: '1',
    title: 'Annual Report 2025 - BOCRA Performance Review',
    category: 'annual' as const,
    description: 'Comprehensive annual report covering BOCRA activities, regulatory decisions, market performance metrics, and financial overview for 2025.',
    fileType: 'PDF',
    fileSize: '8.2 MB',
    published_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    downloadUrl: '#',
  },
  {
    id: '2',
    title: 'Digital Service Provider Guidelines 2026',
    category: 'guidelines' as const,
    description: 'Complete guidelines for digital service providers including compliance requirements, security standards, and consumer protection measures.',
    fileType: 'PDF',
    fileSize: '5.7 MB',
    published_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    downloadUrl: '#',
  },
  {
    id: '3',
    title: 'Mobile Network Coverage Report Q4 2025',
    category: 'reports' as const,
    description: 'Detailed analysis of mobile network coverage quality across Botswana, including statistics, trends, and recommendations for improvement.',
    fileType: 'PDF',
    fileSize: '6.4 MB',
    published_at: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
    downloadUrl: '#',
  },
  {
    id: '4',
    title: 'Broadcasting Standards Policy 2026',
    category: 'policy' as const,
    description: 'Official policy document outlining broadcasting standards, content requirements, and regulatory obligations for all broadcasters.',
    fileType: 'PDF',
    fileSize: '4.3 MB',
    published_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    downloadUrl: '#',
  },
  {
    id: '5',
    title: 'Telecommunications Market Research 2025',
    category: 'research' as const,
    description: 'In-depth market research examining telecommunications sector trends, consumer behavior, operator performance, and future growth opportunities.',
    fileType: 'PDF',
    fileSize: '12.1 MB',
    published_at: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
    downloadUrl: '#',
  },
  {
    id: '6',
    title: 'Spectrum Management Framework Guidelines',
    category: 'guidelines' as const,
    description: 'Comprehensive guidelines on spectrum allocation, usage rights, interference management, and compliance procedures.',
    fileType: 'PDF',
    fileSize: '7.1 MB',
    published_at: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
    downloadUrl: '#',
  },
  {
    id: '7',
    title: 'Consumer Complaints Analysis Report 2025',
    category: 'reports' as const,
    description: 'Statistical analysis of consumer complaints received by BOCRA, including trends, common issues, and resolution metrics.',
    fileType: 'PDF',
    fileSize: '3.8 MB',
    published_at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    downloadUrl: '#',
  },
  {
    id: '8',
    title: 'Data Protection and Privacy Guidelines',
    category: 'guidelines' as const,
    description: 'Guidelines for telecommunications operators on data protection, privacy compliance, and consumer data handling requirements.',
    fileType: 'PDF',
    fileSize: '4.9 MB',
    published_at: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000).toISOString(),
    downloadUrl: '#',
  },
  {
    id: '9',
    title: 'Digital Economy Research Study',
    category: 'research' as const,
    description: 'Research study on Botswana digital economy growth, e-commerce trends, and telecommunications infrastructure impact.',
    fileType: 'PDF',
    fileSize: '9.2 MB',
    published_at: new Date(Date.now() - 55 * 24 * 60 * 60 * 1000).toISOString(),
    downloadUrl: '#',
  },
  {
    id: '10',
    title: 'Licensing Policy and Procedures Manual',
    category: 'policy' as const,
    description: 'Complete policy manual covering licensing procedures, application requirements, and license renewal processes.',
    fileType: 'PDF',
    fileSize: '6.5 MB',
    published_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    downloadUrl: '#',
  },
  {
    id: '11',
    title: '5G Deployment Strategy Document',
    category: 'policy' as const,
    description: 'Strategic plan for 5G network deployment in Botswana including timeline, infrastructure requirements, and operator roles.',
    fileType: 'PDF',
    fileSize: '5.3 MB',
    published_at: new Date(Date.now() - 65 * 24 * 60 * 60 * 1000).toISOString(),
    downloadUrl: '#',
  },
  {
    id: '12',
    title: 'Annual Report 2024 - BOCRA Review',
    category: 'annual' as const,
    description: 'Comprehensive annual report for 2024 detailing BOCRA regulatory activities, market changes, and organizational performance.',
    fileType: 'PDF',
    fileSize: '7.8 MB',
    published_at: new Date(Date.now() - 70 * 24 * 60 * 60 * 1000).toISOString(),
    downloadUrl: '#',
  },
];

export default function Publications() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'recent' | 'oldest'>('recent');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Filter and sort publications
  const filteredPublications = useMemo(() => {
    let result = FAKE_PUBLICATIONS;

    // Apply search filter
    if (searchQuery) {
      result = result.filter(
        (pub) =>
          pub.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          pub.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply category filter
    if (selectedCategory) {
      result = result.filter((pub) => pub.category === selectedCategory);
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
  const totalPages = Math.ceil(filteredPublications.length / itemsPerPage);
  const paginatedPublications = filteredPublications.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory(null);
    setSortBy('recent');
    setCurrentPage(1);
  };

  const handleDownload = (title: string) => {
    alert(`Downloading: ${title}\n\nNote: In production, this would download the actual PDF file.`);
  };

  return (
    <>
      <Helmet>
        <title>Publications & Documents | BOCRA</title>
        <meta name="description" content="Download BOCRA publications, reports, guidelines, and policy documents" />
        <meta property="og:title" content="Publications & Documents | BOCRA" />
        <meta property="og:description" content="BOCRA publications and regulatory documents" />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="w-full">
        {/* Hero Section */}
        <section className="w-full bg-gradient-to-r from-bocra-teal to-bocra-forest-green py-16 md:py-20">
          <div className="container">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Publications & Documents</h1>
            <p className="text-xl text-white/90">Access BOCRA reports, guidelines, and policy documents</p>
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
                  placeholder="Search publications..."
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
                {Object.entries(PUBLICATION_CATEGORIES).map(([key, { label }]) => (
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
              Showing {paginatedPublications.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}–
              {Math.min(currentPage * itemsPerPage, filteredPublications.length)} of {filteredPublications.length} documents
            </p>
          </div>
        </section>

        {/* Publications Grid */}
        <section className="w-full bg-white py-12 md:py-16">
          <div className="container">
            {paginatedPublications.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                  {paginatedPublications.map((publication) => {
                    const category = PUBLICATION_CATEGORIES[publication.category as keyof typeof PUBLICATION_CATEGORIES];
                    const publishedDate = new Date(publication.published_at);
                    const CategoryIcon = category?.icon || FileText;

                    return (
                      <Card key={publication.id} className="flex flex-col hover:shadow-lg transition-shadow overflow-hidden group">
                        <div className="p-6 flex-1 flex flex-col">
                          {/* Category Badge */}
                          {category && (
                            <span className={`inline-block w-fit px-3 py-1 rounded-full text-xs font-semibold text-white ${category.color} mb-3`}>
                              {category.label}
                            </span>
                          )}

                          {/* Title */}
                          <h3 className="font-semibold text-lg text-bocra-text-primary mb-3 line-clamp-2 flex-1 group-hover:text-bocra-teal transition-colors">
                            {publication.title}
                          </h3>

                          {/* Description */}
                          <p className="text-bocra-text-secondary text-sm mb-4 line-clamp-2">
                            {publication.description}
                          </p>

                          {/* Metadata */}
                          <div className="space-y-2 mb-4 text-sm text-bocra-text-muted">
                            <div className="flex items-center justify-between">
                              <span className="flex items-center gap-2">
                                <FileCheck className="w-4 h-4" />
                                {publication.fileType}
                              </span>
                              <span>{publication.fileSize}</span>
                            </div>

                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              <time>{formatDistanceToNow(publishedDate, { addSuffix: true })}</time>
                            </div>
                          </div>

                          {/* Download Button */}
                          <Button
                            onClick={() => handleDownload(publication.title)}
                            className="w-full bg-bocra-teal text-white hover:bg-bocra-forest-green transition-colors flex items-center justify-center gap-2 mt-auto"
                          >
                            <Download className="w-4 h-4" />
                            Download
                          </Button>
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
                <p className="text-bocra-text-secondary text-lg mb-4">No publications found</p>
                <Button variant="outline" onClick={handleResetFilters}>
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* Help Section */}
        <section className="w-full bg-bocra-light-grey py-12 md:py-16">
          <div className="container">
            <h2 className="text-3xl font-bold text-bocra-text-primary mb-8">Document Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-6">
                <FileText className="w-8 h-8 text-bocra-teal mb-3" />
                <h3 className="text-lg font-semibold text-bocra-text-primary mb-2">File Types</h3>
                <p className="text-bocra-text-secondary text-sm">
                  Most documents are available in PDF format. Contact BOCRA for alternative formats including accessible documents.
                </p>
              </Card>

              <Card className="p-6">
                <Download className="w-8 h-8 text-bocra-teal mb-3" />
                <h3 className="text-lg font-semibold text-bocra-text-primary mb-2">Download Limit</h3>
                <p className="text-bocra-text-secondary text-sm">
                  All documents available for free download. No registration required. Standard download limits apply per day.
                </p>
              </Card>

              <Card className="p-6">
                <BookOpen className="w-8 h-8 text-bocra-teal mb-3" />
                <h3 className="text-lg font-semibold text-bocra-text-primary mb-2">More Documents</h3>
                <p className="text-bocra-text-secondary text-sm">
                  Additional documents and archives available. Contact the BOCRA communications team for specific requests.
                </p>
              </Card>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
