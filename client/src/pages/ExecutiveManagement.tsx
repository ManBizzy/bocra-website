import { Helmet } from 'react-helmet-async';
import { ArrowRight, ExternalLink, ShieldCheck, Users } from 'lucide-react';
import { SITE_DESCRIPTION } from '@/const';
import {
  EXECUTIVE_MANAGEMENT,
  GOVERNANCE_SOURCES,
} from '@/content/governance';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function ExecutiveManagement() {
  return (
    <>
      <Helmet>
        <title>Executive Management | BOCRA</title>
        <meta
          name="description"
          content="Meet BOCRA's Executive Management team as listed on the official BOCRA Executive Management page."
        />
        <meta property="og:title" content="Executive Management | BOCRA" />
        <meta
          property="og:description"
          content="Review BOCRA's executive leadership roster, embedded into the current website from BOCRA's official Executive Management page."
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content={`${window.location.origin}/executive-management`}
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Executive Management | BOCRA" />
        <meta name="twitter:description" content={SITE_DESCRIPTION} />
      </Helmet>

      <div className="bg-bocra-light-grey">
        <section className="border-b border-bocra-border bg-white">
          <div className="container py-12 md:py-16">
            <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
              <div className="max-w-3xl space-y-4">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-bocra-teal">
                  Leadership
                </p>
                <h1 className="text-4xl font-bold text-bocra-text-primary md:text-5xl">
                  Executive Management
                </h1>
                <p className="text-lg text-bocra-text-secondary">
                  BOCRA's executive leadership team is responsible for day-to-day
                  authority operations across strategy, licensing, corporate
                  services, finance, legal oversight, and technical delivery.
                </p>
                <p className="max-w-2xl text-bocra-text-secondary">
                  The official BOCRA Executive Management page publishes the team
                  roster, portraits, and titles. This page brings that roster
                  into the current site without sending users back to the legacy
                  website.
                </p>
              </div>

              <Card className="border-0 bg-bocra-deep-teal px-6 py-6 text-white shadow-lg">
                <div className="grid gap-5 sm:grid-cols-3 lg:grid-cols-1">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-white/70">
                      Leadership roles
                    </p>
                    <p className="mt-3 text-3xl font-semibold">8</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-white/70">
                      Functional coverage
                    </p>
                    <p className="mt-3 text-3xl font-semibold">Enterprise-wide</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-white/70">
                      Source format
                    </p>
                    <p className="mt-3 text-3xl font-semibold">Roster + titles</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        <section className="container py-8 md:py-10">
          <Card className="border-0 bg-white px-6 py-6 shadow-sm md:px-8">
            <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
              <div className="space-y-3">
                <Badge variant="outline" className="text-bocra-teal">
                  Official source note
                </Badge>
                <p className="text-bocra-text-secondary">
                  BOCRA's official Executive Management page lists names, titles,
                  and portraits. Unlike the board page, it does not currently
                  publish extended biographies for each executive.
                </p>
              </div>
              <Button asChild variant="outline" className="justify-self-start lg:justify-self-end">
                <a
                  href={GOVERNANCE_SOURCES.executiveManagement}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Official BOCRA Executive Page
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </Card>
        </section>

        <section className="container pb-8 md:pb-10">
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {EXECUTIVE_MANAGEMENT.map((member) => (
              <Card
                key={member.name}
                className="overflow-hidden border-0 bg-white shadow-sm"
              >
                <div className="aspect-[4/4.5] bg-bocra-light-grey">
                  <img
                    src={member.imageUrl}
                    alt={member.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-bocra-teal">
                    Executive management
                  </p>
                  <h2 className="mt-3 text-xl font-semibold text-bocra-text-primary">
                    {member.name}
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-bocra-text-secondary">
                    {member.title}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </section>

        <section className="container pb-12 md:pb-16">
          <Card className="border-0 bg-bocra-deep-teal px-6 py-8 text-white shadow-lg md:px-8 md:py-10">
            <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/70">
                  Continue exploring
                </p>
                <h2 className="mt-3 text-3xl font-bold">
                  Move from executive leadership back to governance and authority
                  profile pages
                </h2>
                <p className="mt-4 max-w-2xl text-white/80">
                  Review BOCRA's Board of Directors or return to the main About
                  page for the Authority's mandate, values, and sector focus.
                </p>
              </div>

              <div className="grid gap-3 sm:min-w-[260px]">
                <Button asChild className="bg-white text-bocra-deep-teal hover:bg-white/90">
                  <a href="/board-of-directors">
                    Board of Directors
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="border-white/25 bg-transparent text-white hover:bg-white/10"
                >
                  <a href="/about">
                    Back to About BOCRA
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl bg-white/10 p-4">
                <Users className="h-5 w-5 text-bocra-golden-yellow" />
                <p className="mt-3 font-semibold">Leadership roster</p>
                <p className="mt-2 text-sm text-white/75">
                  Eight executives are listed on BOCRA's official Executive
                  Management page.
                </p>
              </div>
              <div className="rounded-2xl bg-white/10 p-4">
                <ShieldCheck className="h-5 w-5 text-bocra-golden-yellow" />
                <p className="mt-3 font-semibold">Source integrity</p>
                <p className="mt-2 text-sm text-white/75">
                  Titles and portraits follow BOCRA's official executive roster
                  without forcing users onto the legacy site.
                </p>
              </div>
            </div>
          </Card>
        </section>
      </div>
    </>
  );
}
