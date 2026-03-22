import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Calendar, Share2, Bookmark, Mail, Facebook, Linkedin, Copy } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { NEWS_CATEGORIES } from '@/const';
import { formatDistanceToNow } from 'date-fns';
import { useState } from 'react';

// Comprehensive fake news data with full articles
const ARTICLES_DATA = {
  'bocra-launches-digital-framework': {
    id: '1',
    title: 'BOCRA Launches New Digital Regulation Framework',
    slug: 'bocra-launches-digital-framework',
    excerpt: 'BOCRA has unveiled a comprehensive new framework for regulating digital services in Botswana, establishing clear guidelines for telecommunications operators.',
    content: `
      <h2>Overview</h2>
      <p>The Botswana Communications Regulatory Authority (BOCRA) has announced the launch of a groundbreaking Digital Regulation Framework designed to foster innovation while protecting consumers in the rapidly evolving digital landscape. This comprehensive framework sets new standards for digital service providers and establishes clear regulatory pathways for emerging technologies.</p>

      <h2>Key Components of the Framework</h2>
      <p>The new framework addresses several critical areas including data protection, cybersecurity requirements, net neutrality principles, and consumer safeguards. It introduces a tiered regulatory approach that allows flexibility for startups while maintaining strict compliance standards for established operators.</p>
      
      <h3>Data Protection & Privacy</h3>
      <p>Service providers must implement robust data protection mechanisms complying with international standards. Personal data collection requires explicit user consent with clear disclosure of usage purposes. Operators must conduct regular security audits and report any breaches to BOCRA within 72 hours.</p>
      
      <h3>Cybersecurity Standards</h3>
      <p>All digital service providers must maintain minimum cybersecurity standards including encrypted data transmission, regular penetration testing, and incident response protocols. BOCRA will conduct quarterly audits to ensure compliance with these essential security requirements.</p>
      
      <h3>Consumer Protection</h3>
      <p>The framework guarantees consumers' right to access transparent pricing, easy service termination, and effective complaint resolution mechanisms. Service providers must maintain customer support services and implement fair billing practices with clear, itemized invoices.</p>

      <h2>Implementation Timeline</h2>
      <p>The framework will be rolled out in three phases. Phase 1 (immediate) covers compliance announcement and operator registration. Phase 2 (6 months) involves technical implementation and audit preparation. Phase 3 (12 months) marks full enforcement with potential penalties for non-compliance reaching up to 5% of annual revenue.</p>

      <h2>Impact on Industry</h2>
      <p>Industry experts predict this framework will accelerate digital innovation in Botswana while positioning the country as a leader in responsible digital regulation. The balanced approach encourages new entrants while protecting established operators from unfair competition.</p>

      <h2>Looking Forward</h2>
      <p>BOCRA will establish a Digital Regulation Council comprising representatives from industry, civil society, and academia to review framework effectiveness annually. This collaborative approach ensures the regulations remain current with technological advancements and market changes.</p>
    `,
    category: 'regulation' as const,
    featured_image_url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=600&fit=crop',
    published_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    author: 'BOCRA Communications',
    readTime: 8,
  },
  'consultation-mobile-coverage': {
    id: '2',
    title: 'Public Consultation on Mobile Network Coverage Standards',
    slug: 'consultation-mobile-coverage',
    excerpt: 'BOCRA is seeking public input on proposed new standards for mobile network coverage and service quality across the country.',
    content: `
      <h2>Consultation Objectives</h2>
      <p>BOCRA invites all stakeholders to participate in a critical consultation process regarding new mobile network coverage standards. These proposed standards aim to improve service quality, expand rural connectivity, and establish consistent minimum performance benchmarks across all operators.</p>

      <h2>Current Coverage Challenges</h2>
      <p>Current data shows significant coverage gaps in rural areas, with some regions experiencing poor signal quality during peak hours. Urban areas face congestion issues affecting data speeds. BOCRA's new standards aim to address these challenges comprehensively.</p>

      <h3>Proposed Coverage Requirements</h3>
      <ul>
        <li>Minimum 95% population coverage in urban areas</li>
        <li>Minimum 85% coverage in peri-urban areas</li>
        <li>Minimum 70% coverage in rural areas</li>
        <li>Consistent 4G/LTE deployment by 2027</li>
        <li>5G rollout requirement by 2028</li>
      </ul>

      <h3>Service Quality Metrics</h3>
      <p>Operators must meet specific quality of service standards including minimum download speeds of 10 Mbps, voice call success rate above 98%, and SMS delivery within 5 seconds. Network availability must achieve 99.5% uptime annually.</p>

      <h2>How to Participate</h2>
      <p>Public consultation runs through April 30, 2026. Stakeholders can submit written comments via email to consultation@bocra.org.bw or attend regional consultation workshops scheduled across the country. Individual operators, civil society organizations, and citizens are all encouraged to participate.</p>

      <h2>Expected Outcomes</h2>
      <p>BOCRA will analyze all feedback and publish a final standards document by June 2026. Operators will have 12 months to achieve compliance with the new standards, supported by BOCRA technical guidance and regular monitoring.</p>

      <h2>Timeline</h2>
      <p>Key dates: Consultation workshops March 22-April 15, written submission deadline April 30, draft standards publication June 15, operator compliance period until June 30, 2027.</p>
    `,
    category: 'consultation' as const,
    featured_image_url: 'https://images.unsplash.com/photo-1557821552-17105176677c?w=1200&h=600&fit=crop',
    published_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    author: 'BOCRA Networks Division',
    readTime: 7,
  },
  'domain-registry-milestone': {
    id: '3',
    title: 'Domain Registry Reaches 5,000 Registrations Milestone',
    slug: 'domain-registry-milestone',
    excerpt: 'The .bw domain registry has reached a significant milestone with over 5,000 active domain registrations, reflecting growing digital presence in Botswana.',
    content: `
      <h2>Celebrating Digital Growth</h2>
      <p>The Botswana domain name registry (.bw) has passed the historic 5,000 registrations mark, representing a 35% growth over the past 2 years. This milestone reflects the increasing digital transformation across businesses and organizations throughout Botswana.</p>

      <h2>Registry Statistics</h2>
      <p>Current breakdown shows commercial (.co.bw) domains account for 60% of registrations, government (.gov.bw) comprises 15%, non-profits (.org.bw) represent 10%, and other categories make up the remaining 15%. Business registrations continue to grow at 15% annually.</p>

      <h2>Sector Growth Drivers</h2>
      <h3>E-Commerce Expansion</h3>
      <p>Online retail businesses have driven significant growth, with 400+ new registrations in the past 12 months. This sector growth reflects consumer adoption of online shopping and business digital transformation initiatives.</p>

      <h3>Government Digitalization</h3>
      <p>Government agencies have strengthened their digital presence with official .gov.bw domains, improving citizen access to services and information transparency. Electronic government services now reach 85% of government departments.</p>

      <h3>Professional Services</h3>
      <p>Law firms, accounting practices, and consulting companies lead professional sectors with 300+ domains. These registrations enhance business credibility and facilitate digital client engagement.</p>

      <h2>Benefits of .bw Domains</h2>
      <p>Local domain registrations strengthen Botswana's digital identity, improve search engine optimization for local searches, build consumer trust through Botswana association, and support BOCRA's digital economy goals.</p>

      <h2>Registration Process Improvements</h2>
      <p>BOCRA has simplified registration with a streamlined online portal, reduced registration fees, and faster processing times. Domain registration now takes 24 hours on average, down from 5 days previously.</p>

      <h2>Future Growth Projections</h2>
      <p>BOCRA targets 8,000 registrations by 2027 through targeted marketing to SMEs, introduction of promotional registration rates, and enhanced registry infrastructure. Government incentives for business digitalization are expected to accelerate growth.</p>
    `,
    category: 'announcement' as const,
    featured_image_url: 'https://images.unsplash.com/photo-1522252234503-6f0ea6287aba?w=1200&h=600&fit=crop',
    published_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    author: 'BOCRA Registry Operations',
    readTime: 6,
  },
  'complaint-process-update': {
    id: '4',
    title: 'Improved Complaint Resolution Process Now Live',
    slug: 'complaint-process-update',
    excerpt: 'BOCRA has implemented enhanced systems to streamline the complaint resolution process, reducing average resolution time by 30%.',
    content: `
      <h2>Streamlined Complaint Handling</h2>
      <p>BOCRA has successfully deployed an enhanced complaint management system delivering faster resolution times and improved transparency. The new system reduced average complaint resolution time from 45 days to 31 days, a 31% improvement.</p>

      <h2>System Enhancements</h2>
      <h3>Digital Submission</h3>
      <p>Citizens can now lodge complaints through multiple channels: online portal, mobile application, email, phone, or in-person visits. Digital submission provides instant confirmation numbers and expected resolution timelines.</p>

      <h3>Automated Tracking</h3>
      <p>Complainants receive automated status updates via SMS and email at each resolution stage. Real-time dashboard access allows tracking complaint progress from submission to closure with complete documentation access.</p>

      <h3>Faster Investigation</h3>
      <p>New investigation procedures prioritize complaints by severity and impact. Critical issues affecting service continuity receive priority investigation within 5 days. Standard complaints proceed through streamlined investigation within 14 days.</p>

      <h2>Complaint Categories & Timelines</h2>
      <h3>Service Quality Issues</h3>
      <p>Network outages, poor signal quality, and data speed complaints are resolved within 7-14 days following field investigation and operator assessment.</p>

      <h3>Billing Disputes</h3>
      <p>Overcharging and billing errors are resolved within 10 days through documentation review and operator verification, with refunds processed upon confirmation.</p>

      <h3>Consumer Rights Violations</h3>
      <p>Data misuse, unauthorized charges, and privacy violations are escalated to senior investigation teams with 5-day preliminary assessment and 30-day final resolution.</p>

      <h2>Performance Metrics</h2>
      <p>Current system performance shows 89% on-time closure rate, 94% complainant satisfaction, and 4.2 out of 5 average service rating. BOCRA targets 95% on-time closure and 96% satisfaction by year-end.</p>

      <h2>Access Points</h2>
      <p>Complaints can be filed at 8 BOCRA regional offices, through the online portal at complaints.bocra.org.bw, by calling 26-001800 (toll-free), or via email at complaints@bocra.org.bw.</p>

      <h2>Consumer Education</h2>
      <p>BOCRA conducts monthly training for vulnerable populations about complaint rights and procedures. Radio broadcasts, SMS campaigns, and community outreach programs ensure all citizens understand their rights.</p>
    `,
    category: 'update' as const,
    featured_image_url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=600&fit=crop',
    published_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    author: 'BOCRA Consumer Affairs',
    readTime: 8,
  },
  'broadcasting-regulations-2026': {
    id: '5',
    title: 'Broadcasting Regulations Update for 2026',
    slug: 'broadcasting-regulations-2026',
    excerpt: 'New broadcasting regulations have been issued for 2026, with updated requirements for content standards and service delivery obligations.',
    content: `
      <h2>Regulatory Updates Overview</h2>
      <p>BOCRA has issued comprehensive updates to broadcasting regulations effective January 1, 2026. These updates address content standards, service quality requirements, infrastructure obligations, and consumer protection measures for radio and television broadcasters.</p>

      <h2>Content Standards</h2>
      <h3>Prohibited Content</h3>
      <p>Broadcasters must not transmit content inciting violence, hatred, discrimination, or criminality. Adult content is designated for 22:00-06:00 broadcast windows only. Political advertising must comply with election codes and fair representation requirements.</p>

      <h3>Local Content Requirements</h3>
      <p>Radio stations must broadcast minimum 50% local content during drive time hours. Television stations must feature 40% local programming daily. Local music must comprise at least 30% of music playlists across all formats.</p>

      <h3>Educational Broadcasting</h3>
      <p>Broadcasters must dedicate minimum 10 hours weekly to educational content covering health, environment, civic participation, and skills development. Public interest content must reach 20% of daily programming.</p>

      <h2>Service Delivery Obligations</h2>
      <h3>Technical Standards</h3>
      <p>All broadcasters must maintain 99.5% transmission uptime with backup systems for emergency interruption capability. Signal quality must meet ITU-R specifications. Equipment must support emergency alert system integration.</p>

      <h3>Accessibility</h3>
      <p>Television broadcasters must provide subtitles for 75% of content by end of 2026, progressing to 90% by 2027. Audio description services must cover 20% of programming by 2027. Sign language interpretation required for major news bulletins.</p>

      <h2>Advertising Standards</h2>
      <p>Advertising airtime limited to 10 minutes per hour in television, 12 minutes per hour in radio. Tobacco, alcohol, and gambling advertising prohibited during children's viewing hours (06:00-21:00). Food advertising must include nutritional information.</p>

      <h2>Infrastructure Requirements</h2>
      <p>License renewal requires demonstration of compliant broadcasting facilities. Rural broadcasters receive 2-year transition period for upgrades. BOCRA provides technical guidance for compliance achievement at minimal cost.</p>

      <h2>Compliance & Enforcement</h2>
      <p>Non-compliance penalties range from warnings for minor violations to license suspension for serious breaches. Broadcasters receive monthly compliance reports with guidance for improvement. Dispute resolution available through BOCRA appeals process.</p>

      <h2>Support for Broadcasters</h2>
      <p>BOCRA offers free technical training workshops for content standards, regulatory compliance seminars, and one-on-one consultations for license holders. Online resources and detailed guidance documents are available on the BOCRA website.</p>
    `,
    category: 'regulation' as const,
    featured_image_url: 'https://images.unsplash.com/photo-1573374694457-274fc9bacca5?w=1200&h=600&fit=crop',
    published_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    author: 'BOCRA Broadcasting Division',
    readTime: 10,
  },
  'spectrum-allocation-tender': {
    id: '6',
    title: 'Spectrum Allocation Tender Open for Applications',
    slug: 'spectrum-allocation-tender',
    excerpt: 'BOCRA has opened a new tender for spectrum allocation in the 5G and broadband frequencies. Interested operators are invited to apply.',
    content: `
      <h2>Spectrum Tender Announcement</h2>
      <p>BOCRA announces the opening of a historic spectrum allocation tender offering prime frequency bands essential for next-generation telecommunications. This tender represents significant opportunity for established operators and new market entrants to expand or commence 5G and broadband services.</p>

      <h2>Available Frequencies</h2>
      <h3>5G Spectrum Bands</h3>
      <p>n78 band (3.5 GHz): Two 2x100 MHz blocks available. n77 band (3.7-3.8 GHz): One 100 MHz block. n41 band (2.5 GHz): Two 50 MHz blocks. These bands support high-capacity, low-latency 5G applications.</p>

      <h3>Broadband Expansion</h3>
      <p>2.3 GHz band: 2x20 MHz blocks for broadband fixed wireless access. 2.6 GHz band: 3x20 MHz blocks for mobile broadband. These frequencies enable rural connectivity expansion and competition in underserved areas.</p>

      <h2>Eligibility Requirements</h2>
      <p>Applicants must be licensed telecommunications operators with minimum 2 years operational history, demonstrated financial capability for investments, technical expertise for spectrum deployment, and clean compliance records with BOCRA.</p>

      <h2>Application Timeline</h2>
      <p>Tender opens March 22, 2026. Application period runs until May 31, 2026. Technical qualification evaluation occurs June 1-30, 2026. Bidding phase scheduled July 2026. License issuance by September 30, 2026.</p>

      <h2>Evaluation Criteria</h2>
      <h3>Technical Capability</h3>
      <p>Applicants must demonstrate experience deploying similar spectrum bands, having trained technical personnel, maintaining necessary testing equipment, and following international standards compliance procedures.</p>

      <h3>Financial Capacity</h3>
      <p>Minimum annual capital expenditure commitment of 5% of annual revenue required. Bank guarantees covering 2 years of projected license fees must be presented. Audited financial statements for previous 3 years required.</p>

      <h3>Coverage Commitments</h3>
      <p>Winners commit to specific rural coverage targets, deployment timelines, and service quality standards. Coverage audits occur bi-annually. Non-compliance triggers penalties up to 10% of annual license fees.</p>

      <h2>License Terms</h2>
      <p>Licenses issued for 15-year terms with renewal options. Annual license fees determined by spectrum amount and frequency band. Spectrum sharing capacity allows multiple operators in select bands, reducing barriers to new entrants.</p>

      <h2>Supporting New Entrants</h2>
      <p>BOCRA offers subsidized equipment testing for startups, training programs for deployment planning, shared infrastructure incentives, and flexible payment structures. Technology-neutral licensing enables innovation in service delivery models.</p>

      <h2>How to Apply</h2>
      <p>Complete application forms available at tender.bocra.org.bw. Applications must include technical proposal, financial projections, coverage plans, and compliance documentation. Questions answered during pre-tender consultation March 22-April 30.</p>

      <h2>Contact Information</h2>
      <p>Tender enquiries: spectrum@bocra.org.bw. Phone: +267-3640800. Address: A10 Digital Park, Tonota Road, Gaborone. Pre-tender meeting: April 15, 2026 at BOCRA Head Office.</p>
    `,
    category: 'announcement' as const,
    featured_image_url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&h=600&fit=crop',
    published_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    author: 'BOCRA Spectrum Management',
    readTime: 9,
  },
};

export default function NewsArticle({ slug }: { slug: string }) {
  const [isSaved, setIsSaved] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  const article = ARTICLES_DATA[slug as keyof typeof ARTICLES_DATA];

  if (!article) {
    return (
      <>
        <Helmet><title>Article Not Found | BOCRA</title></Helmet>
        <div className="w-full">
          <section className="w-full bg-bocra-light-grey py-16">
            <div className="container text-center">
              <h1 className="text-4xl font-bold text-bocra-text-primary mb-4">Article Not Found</h1>
              <p className="text-bocra-text-secondary mb-6">The article you're looking for doesn't exist.</p>
              <a href="/news" className="inline-flex items-center gap-2 bg-bocra-teal text-white px-6 py-3 rounded-lg hover:bg-bocra-forest-green transition-colors">
                <ArrowLeft className="w-4 h-4" />
                Back to News
              </a>
            </div>
          </section>
        </div>
      </>
    );
  }

  const category = NEWS_CATEGORIES[article.category as keyof typeof NEWS_CATEGORIES];
  const publishedDate = new Date(article.published_at);

  // Get related articles (other articles)
  const relatedArticles = Object.values(ARTICLES_DATA)
    .filter((a) => a.slug !== article.slug)
    .slice(0, 3);

  const handleShare = (platform: string) => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    const title = article.title;

    const shareLinks: Record<string, string> = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      email: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`,
      copy: url,
    };

    if (platform === 'copy') {
      navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    } else {
      window.open(shareLinks[platform], '_blank');
    }
  };

  return (
    <>
      <Helmet>
        <title>{article.title} | BOCRA News</title>
        <meta name="description" content={article.excerpt} />
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={article.excerpt} />
        <meta property="og:image" content={article.featured_image_url} />
        <meta property="og:type" content="article" />
      </Helmet>

      <div className="w-full">
        {/* Back Navigation */}
        <section className="w-full bg-white border-b border-bocra-light-grey">
          <div className="container py-4">
            <a href="/news" className="inline-flex items-center gap-2 text-bocra-teal font-medium hover:gap-3 transition-all">
              <ArrowLeft className="w-4 h-4" />
              Back to News
            </a>
          </div>
        </section>

        {/* Article Header */}
        <section className="w-full bg-white py-8 md:py-12">
          <div className="container">
            {/* Category Badge */}
            {category && (
              <span className={`inline-block w-fit px-4 py-2 rounded-full text-sm font-semibold text-white ${category.color} mb-6`}>
                {category.label}
              </span>
            )}

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-bocra-text-primary mb-6 leading-tight">{article.title}</h1>

            {/* Meta Information */}
            <div className="flex flex-col md:flex-row md:items-center gap-4 pb-8 border-b border-bocra-light-grey">
              <div className="flex items-center gap-2 text-bocra-text-muted">
                <Calendar className="w-4 h-4" />
                <time dateTime={article.published_at}>
                  {publishedDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </time>
              </div>

              <span className="text-bocra-text-muted">•</span>

              <span className="text-bocra-text-muted">{article.readTime} min read</span>

              <span className="text-bocra-text-muted">•</span>

              <span className="text-bocra-text-muted">By {article.author}</span>

              {/* Share & Save Buttons */}
              <div className="md:ml-auto flex items-center gap-3">
                <button
                  onClick={() => setIsSaved(!isSaved)}
                  className={`p-2 rounded-lg transition-colors ${isSaved ? 'bg-bocra-teal text-white' : 'bg-bocra-light-grey text-bocra-text-primary hover:bg-bocra-teal/10'}`}
                >
                  <Bookmark className="w-5 h-5" />
                </button>

                <div className="relative">
                  <button
                    onClick={() => setShowShareMenu(!showShareMenu)}
                    className="p-2 rounded-lg bg-bocra-light-grey text-bocra-text-primary hover:bg-bocra-teal/10 transition-colors"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>

                  {showShareMenu && (
                    <div className="absolute right-0 top-full mt-2 bg-white border border-bocra-light-grey rounded-lg shadow-lg z-50 min-w-max">
                      <button
                        onClick={() => handleShare('facebook')}
                        className="flex items-center gap-2 w-full px-4 py-3 hover:bg-bocra-light-grey transition-colors text-left text-sm"
                      >
                        <Facebook className="w-4 h-4" />
                        Share on Facebook
                      </button>
                      <button
                        onClick={() => handleShare('linkedin')}
                        className="flex items-center gap-2 w-full px-4 py-3 hover:bg-bocra-light-grey transition-colors text-left text-sm border-t border-bocra-light-grey"
                      >
                        <Linkedin className="w-4 h-4" />
                        Share on LinkedIn
                      </button>
                      <button
                        onClick={() => handleShare('email')}
                        className="flex items-center gap-2 w-full px-4 py-3 hover:bg-bocra-light-grey transition-colors text-left text-sm border-t border-bocra-light-grey"
                      >
                        <Mail className="w-4 h-4" />
                        Share via Email
                      </button>
                      <button
                        onClick={() => handleShare('copy')}
                        className="flex items-center gap-2 w-full px-4 py-3 hover:bg-bocra-light-grey transition-colors text-left text-sm border-t border-bocra-light-grey"
                      >
                        <Copy className="w-4 h-4" />
                        Copy Link
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Image */}
        {article.featured_image_url && (
          <section className="w-full bg-bocra-light-grey">
            <div className="container">
              <img
                src={article.featured_image_url}
                alt={article.title}
                className="w-full h-96 object-cover rounded-lg my-8"
              />
            </div>
          </section>
        )}

        {/* Article Content */}
        <section className="w-full bg-white py-12">
          <div className="container">
            <div className="max-w-3xl mx-auto">
              <div className="prose prose-lg max-w-none prose-headings:text-bocra-text-primary prose-a:text-bocra-teal hover:prose-a:underline">
                {/* Parse HTML content */}
                <div
                  dangerouslySetInnerHTML={{ __html: article.content }}
                  className="text-bocra-text-secondary leading-relaxed space-y-6"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Article Footer */}
        <section className="w-full bg-bocra-light-grey py-8">
          <div className="container max-w-3xl mx-auto">
            <div className="bg-white rounded-lg p-6">
              <p className="text-sm text-bocra-text-muted mb-4">
                <strong>Published:</strong> {publishedDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
              <p className="text-sm text-bocra-text-muted">
                <strong>Category:</strong> {category?.label}
              </p>
            </div>
          </div>
        </section>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <section className="w-full bg-white py-14 md:py-20">
            <div className="container">
              <h2 className="text-3xl font-bold text-bocra-text-primary mb-8">Related Articles</h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedArticles.map((related) => {
                  const relatedCategory = NEWS_CATEGORIES[related.category as keyof typeof NEWS_CATEGORIES];
                  const relatedDate = new Date(related.published_at);

                  return (
                    <Card key={related.slug} className="flex flex-col hover:shadow-lg transition-shadow overflow-hidden group">
                      {related.featured_image_url && (
                        <div className="w-full h-40 bg-bocra-light-grey overflow-hidden">
                          <img
                            src={related.featured_image_url}
                            alt={related.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}

                      <div className="p-6 flex-1 flex flex-col">
                        {relatedCategory && (
                          <span className={`inline-block w-fit px-3 py-1 rounded-full text-xs font-semibold text-white ${relatedCategory.color} mb-3`}>
                            {relatedCategory.label}
                          </span>
                        )}

                        <h3 className="font-semibold text-lg text-bocra-text-primary mb-3 line-clamp-2 flex-1 group-hover:text-bocra-teal transition-colors">
                          {related.title}
                        </h3>

                        <div className="flex items-center gap-2 text-bocra-text-muted text-sm mb-4">
                          <Calendar className="w-4 h-4" />
                          <time>{formatDistanceToNow(relatedDate, { addSuffix: true })}</time>
                        </div>

                        <a
                          href={`/news/${related.slug}`}
                          className="inline-flex items-center gap-2 text-bocra-teal font-semibold text-sm hover:gap-3 transition-all"
                        >
                          Read More
                          <ArrowLeft className="w-4 h-4 rotate-180" />
                        </a>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          </section>
        )}
      </div>
    </>
  );
}
