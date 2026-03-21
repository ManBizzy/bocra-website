import { Helmet } from 'react-helmet-async';
import {
  ArrowRight,
  ExternalLink,
  FileCheck,
  Globe,
  Link as LinkIcon,
  MessageSquare,
  Radio,
  ShieldCheck,
  Shield,
  Tv,
} from 'lucide-react';
import { SITE_DESCRIPTION } from '@/const';
import {
  SERVICE_AREAS,
  getAccentClasses,
  getServiceAreaBySlug,
} from '@/content/services';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const SERVICE_ICON_MAP = {
  Radio,
  FileCheck,
  MessageSquare,
  Globe,
  Tv,
  Shield,
} as const;

interface ServiceDetailProps {
  slug: string;
}

export default function ServiceDetail({ slug }: ServiceDetailProps) {
  const service = getServiceAreaBySlug(slug);

  if (!service) {
    return (
      <>
        <Helmet>
          <title>Service Not Found | BOCRA</title>
        </Helmet>
        <div className="bg-bocra-light-grey">
          <section className="container py-12 md:py-16">
            <Card className="border-0 bg-white p-8 shadow-lg md:p-10">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-bocra-dark-maroon">
                Service Centre
              </p>
              <h1 className="mt-4 text-4xl font-bold text-bocra-text-primary">
                Service not found
              </h1>
              <p className="mt-4 max-w-2xl text-bocra-text-secondary">
                The requested service route does not match one of the BOCRA
                service pathways currently published in this site.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button
                  className="bg-bocra-teal text-white hover:bg-bocra-teal/90"
                  asChild
                >
                  <a href="/services">
                    Back to Services
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </Button>
                <Button variant="outline" asChild>
                  <a href="/contact">Contact BOCRA</a>
                </Button>
              </div>
            </Card>
          </section>
        </div>
      </>
    );
  }

  const accent = getAccentClasses(service.accent);
  const relatedServices = SERVICE_AREAS.filter(
    (candidate) => candidate.slug !== service.slug
  ).slice(0, 3);
  const Icon =
    SERVICE_ICON_MAP[service.icon as keyof typeof SERVICE_ICON_MAP] ?? Radio;

  return (
    <>
      <Helmet>
        <title>{`${service.title} | BOCRA`}</title>
        <meta name="description" content={service.summary} />
        <meta property="og:title" content={`${service.title} | BOCRA`} />
        <meta property="og:description" content={service.summary} />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content={`${window.location.origin}/services/${service.slug}`}
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${service.title} | BOCRA`} />
        <meta name="twitter:description" content={SITE_DESCRIPTION} />
      </Helmet>

      <div className="bg-bocra-light-grey">
        <section className="border-b border-bocra-border bg-white">
          <div className="container py-12 md:py-16">
            <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
              <div className="max-w-3xl space-y-4">
                <p className={`text-sm font-semibold uppercase tracking-[0.2em] ${accent.text}`}>
                  {service.eyebrow}
                </p>
                <div className="flex items-start gap-4">
                  <div className={`hidden rounded-2xl p-4 md:block ${accent.soft}`}>
                    <Icon className="h-7 w-7" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold text-bocra-text-primary md:text-5xl">
                      {service.title}
                    </h1>
                    <p className="mt-4 text-lg text-bocra-text-secondary">
                      {service.summary}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 pt-2">
                  {service.channels.slice(0, 2).map((channel, index) => (
                    <Button
                      key={channel.label}
                      variant={index === 0 ? 'default' : 'outline'}
                      className={index === 0 ? accent.button : undefined}
                      asChild
                    >
                      <a
                        href={channel.href}
                        target={channel.external ? '_blank' : undefined}
                        rel={channel.external ? 'noopener noreferrer' : undefined}
                      >
                        {channel.label}
                        {channel.external ? (
                          <ExternalLink className="h-4 w-4" />
                        ) : (
                          <ArrowRight className="h-4 w-4" />
                        )}
                      </a>
                    </Button>
                  ))}
                </div>
              </div>

              <Card className="border-0 bg-bocra-deep-teal p-6 text-white shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-white/10 p-3">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-white/70">
                      Service focus
                    </p>
                    <p className="mt-1 text-lg font-semibold">
                      Official BOCRA pathway
                    </p>
                  </div>
                </div>
                <p className="mt-6 text-sm text-white/80">
                  This page groups the most relevant BOCRA references and live
                  channels for this service area so the public site has a
                  working pathway even before every dedicated workflow is built
                  locally.
                </p>
                <ul className="mt-6 space-y-3 text-sm text-white/85">
                  {service.useCases.map((item) => (
                    <li key={item} className="rounded-xl bg-white/10 p-3">
                      {item}
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          </div>
        </section>

        <section className="container py-8 md:py-10">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <Card className={`border-l-4 bg-white p-6 shadow-sm md:p-8 ${accent.border}`}>
              <h2 className="text-2xl font-semibold text-bocra-text-primary">
                What this service covers
              </h2>
              <p className="mt-4 text-bocra-text-secondary">
                {service.description}
              </p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {service.responsibilities.map((responsibility) => (
                  <div
                    key={responsibility}
                    className="rounded-2xl border border-bocra-border bg-bocra-light-grey p-4 text-sm text-bocra-text-secondary"
                  >
                    {responsibility}
                  </div>
                ))}
              </div>
            </Card>

            <Card className="border-0 bg-white p-6 shadow-sm md:p-8">
              <h2 className="text-2xl font-semibold text-bocra-text-primary">
                Common reasons to use it
              </h2>
              <div className="mt-6 space-y-4">
                {service.useCases.map((item, index) => (
                  <div key={item} className="flex gap-4">
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${accent.soft}`}
                    >
                      {index + 1}
                    </div>
                    <p className="pt-1 text-sm text-bocra-text-secondary">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </section>

        <section className="container pb-8 md:pb-10">
          <h2 className="text-2xl font-semibold text-bocra-text-primary">
            Service channels and references
          </h2>
          <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {service.channels.map((channel) => (
              <Card
                key={channel.label}
                className="flex h-full flex-col bg-white p-6 transition-shadow hover:shadow-lg"
              >
                <Badge variant="outline" className={accent.text}>
                  Official resource
                </Badge>
                <h3 className="mt-4 text-xl font-semibold text-bocra-text-primary">
                  {channel.label}
                </h3>
                <p className="mt-3 flex-1 text-sm text-bocra-text-secondary">
                  {channel.description}
                </p>
                <a
                  href={channel.href}
                  target={channel.external ? '_blank' : undefined}
                  rel={channel.external ? 'noopener noreferrer' : undefined}
                  className={`mt-6 inline-flex items-center gap-2 font-semibold transition-all hover:gap-3 ${accent.text}`}
                >
                  Open resource
                  {channel.external ? (
                    <ExternalLink className="h-4 w-4" />
                  ) : (
                    <LinkIcon className="h-4 w-4" />
                  )}
                </a>
              </Card>
            ))}
          </div>
        </section>

        <section className="container pb-12 md:pb-16">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className={`text-sm font-semibold uppercase tracking-[0.2em] ${accent.text}`}>
                More pathways
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-bocra-text-primary">
                Related BOCRA services
              </h2>
            </div>
            <a
              href="/services"
              className={`hidden items-center gap-2 font-semibold md:inline-flex ${accent.text}`}
            >
              View all services
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {relatedServices.map((related) => {
              const RelatedIcon =
                SERVICE_ICON_MAP[
                  related.icon as keyof typeof SERVICE_ICON_MAP
                ] ?? Radio;
              const relatedAccent = getAccentClasses(related.accent);

              return (
                <Card
                  key={related.slug}
                  className={`border-l-4 bg-white p-6 shadow-sm transition-shadow hover:shadow-lg ${relatedAccent.border}`}
                >
                  <div className={`inline-flex rounded-2xl p-3 ${relatedAccent.soft}`}>
                    <RelatedIcon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-xl font-semibold text-bocra-text-primary">
                    {related.title}
                  </h3>
                  <p className="mt-3 text-sm text-bocra-text-secondary">
                    {related.summary}
                  </p>
                  <a
                    href={`/services/${related.slug}`}
                    className={`mt-5 inline-flex items-center gap-2 font-semibold transition-all hover:gap-3 ${relatedAccent.text}`}
                  >
                    Explore service
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </Card>
              );
            })}
          </div>
        </section>
      </div>
    </>
  );
}
