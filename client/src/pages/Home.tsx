import { Helmet } from 'react-helmet-async';
import HeroSection from '@/components/sections/HeroSection';
import QuickServicesSection from '@/components/sections/QuickServicesSection';
import AboutBocraSection from '@/components/sections/AboutBocraSection';
import PortalHighlightSection from '@/components/sections/PortalHighlightSection';
import NewsSection from '@/components/sections/NewsSection';
import EventsSection from '@/components/sections/EventsSection';
import ConsultationSection from '@/components/sections/ConsultationSection';
import { SITE_FULL_NAME, SITE_DESCRIPTION } from '@/const';

export default function Home() {
  return (
    <>
      <Helmet>
        <title>Home | BOCRA - Botswana Communications Regulatory Authority</title>
        <meta name="description" content={SITE_DESCRIPTION} />
        <meta property="og:title" content="BOCRA - Botswana Communications Regulatory Authority" />
        <meta property="og:description" content={SITE_DESCRIPTION} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.origin} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="BOCRA - Botswana Communications Regulatory Authority" />
        <meta name="twitter:description" content={SITE_DESCRIPTION} />
      </Helmet>

      <div className="w-full">
        <HeroSection />
        <QuickServicesSection />
        <AboutBocraSection />
        <PortalHighlightSection />
        <NewsSection />
        <EventsSection />
        <ConsultationSection />
      </div>
    </>
  );
}
