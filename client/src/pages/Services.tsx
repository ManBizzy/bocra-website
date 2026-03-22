import { Helmet } from 'react-helmet-async';
import {
  ArrowRight,
  ExternalLink,
  FileCheck,
  Globe,
  MessageSquare,
  Radio,
  Shield,
  Tv,
} from 'lucide-react';
import { SITE_DESCRIPTION } from '@/const';
import {
  SERVICE_AREAS,
  SERVICE_PORTALS,
  getAccentClasses,
} from '@/content/services';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

const SERVICE_ICON_MAP = {
  Radio,
  FileCheck,
  MessageSquare,
  Globe,
  Tv,
  Shield,
} as const;

export default function Services() {
  const complaintPortalHref = `/portal/login?next=${encodeURIComponent(
    '/portal/dashboard#file-complaint'
  )}`;

  return (
    <>
      <Helmet>
        <title>Services | BOCRA</title>
        <meta
          name="description"
          content="Explore BOCRA service pathways for licensing, spectrum, broadcasting, complaints, cybersecurity, and domain administration."
        />
        <meta property="og:title" content="Services | BOCRA" />
        <meta
          property="og:description"
          content="Explore BOCRA service pathways for licensing, spectrum, broadcasting, complaints, cybersecurity, and domain administration."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${window.location.origin}/services`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Services | BOCRA" />
        <meta name="twitter:description" content={SITE_DESCRIPTION} />
      </Helmet>

      <div className="bg-bocra-light-grey">
        <section className="border-b border-bocra-border bg-white">
          <div className="container py-12 md:py-16">
            <div className="max-w-3xl space-y-4">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-bocra-teal">
                Service Centre
              </p>
              <h1 className="text-4xl font-bold text-bocra-text-primary md:text-5xl">
                BOCRA Services
              </h1>
              <p className="text-lg text-bocra-text-secondary">
                Browse BOCRA service pathways for spectrum, licensing,
                broadcasting, consumer protection, cybersecurity, and .bw
                administration. Each route below now points to a working
                service page instead of a placeholder.
              </p>
            </div>
          </div>
        </section>

        <section className="container py-8 md:py-10">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {SERVICE_PORTALS.map((portal) => (
              <a
                key={portal.label}
                href={portal.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group"
              >
                <Card className="border-0 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
                  <Badge variant="outline" className="text-bocra-teal">
                    Live portal
                  </Badge>
                  <h2 className="mt-4 text-lg font-semibold text-bocra-text-primary">
                    {portal.label}
                  </h2>
                  <p className="mt-2 text-sm text-bocra-text-secondary">
                    {portal.description}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-2 font-semibold text-bocra-teal transition-all group-hover:gap-3">
                    Open portal
                    <ExternalLink className="h-4 w-4" />
                  </span>
                </Card>
              </a>
            ))}
          </div>
        </section>

        <section className="container pb-8 md:pb-10">
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {SERVICE_AREAS.map((service) => {
              const Icon =
                SERVICE_ICON_MAP[
                  service.icon as keyof typeof SERVICE_ICON_MAP
                ] ?? Radio;
              const accent = getAccentClasses(service.accent);
              const officialChannel =
                service.slug === 'complaints'
                  ? {
                      href: complaintPortalHref,
                      external: false,
                    }
                  : service.slug === 'domain-registry'
                  ? service.channels.find(
                      (channel) => channel.href === 'https://nic.net.bw'
                    ) ?? service.channels[0]
                  : service.channels[0];

              return (
                <Card
                  key={service.slug}
                  className={`flex h-full flex-col border-l-4 bg-white p-6 shadow-sm transition-shadow hover:shadow-lg ${accent.border}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className={`rounded-2xl p-3 ${accent.soft}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <Badge variant="outline" className={accent.text}>
                      {service.eyebrow}
                    </Badge>
                  </div>

                  <h2 className="mt-5 text-2xl font-semibold text-bocra-text-primary">
                    {service.title}
                  </h2>
                  <p className="mt-3 text-sm text-bocra-text-secondary">
                    {service.summary}
                  </p>

                  <div className="mt-5 space-y-2 text-sm text-bocra-text-secondary">
                    {service.responsibilities.slice(0, 3).map((item) => (
                      <p key={item}>{item}</p>
                    ))}
                  </div>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <a
                      href={`/services/${service.slug}`}
                      className={`inline-flex items-center gap-2 font-semibold transition-all hover:gap-3 ${accent.text}`}
                    >
                      Explore service
                      <ArrowRight className="h-4 w-4" />
                    </a>
                    <a
                      href={officialChannel.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-medium text-bocra-text-secondary transition-colors hover:text-bocra-teal"
                    >
                      Official resource
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                </Card>
              );
            })}
          </div>
        </section>

        <section className="container pb-12 md:pb-16">
          <Card className="border-0 bg-bocra-deep-teal p-8 text-white shadow-lg md:p-10">
            <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/70">
                  Choosing the right pathway
                </p>
                <h2 className="mt-3 text-3xl font-bold">
                  Start with the service outcome you need
                </h2>
                <p className="mt-4 max-w-2xl text-white/80">
                  Use service detail pages when you need the right BOCRA
                  reference, official portal, or sector-specific route quickly.
                  Use the contact page when the request does not fit one clear
                  service line or needs manual follow-up.
                </p>
              </div>

              <div className="grid gap-4 text-sm">
                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="font-semibold">Need an operator pathway?</p>
                  <p className="mt-2 text-white/75">
                    Start with Licensing, Spectrum Management, or Broadcasting
                    Regulation.
                  </p>
                </div>
                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="font-semibold">Need a public-facing remedy?</p>
                  <p className="mt-2 text-white/75">
                    Start with Consumer Complaints or the Contact page.
                  </p>
                </div>
                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="font-semibold">Need trust and security guidance?</p>
                  <p className="mt-2 text-white/75">
                    Start with Cybersecurity Advisory and related digital trust
                    references.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </section>
      </div>
    </>
  );
}
