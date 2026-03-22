import { Helmet } from 'react-helmet-async';
import { ArrowRight, CalendarDays, ExternalLink, ShieldCheck, Users } from 'lucide-react';
import { SITE_DESCRIPTION } from '@/const';
import {
  BOARD_APPOINTMENT_NOTE,
  BOARD_MEMBERS,
  GOVERNANCE_SOURCES,
} from '@/content/governance';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function BoardOfDirectors() {
  return (
    <>
      <Helmet>
        <title>Board of Directors | BOCRA</title>
        <meta
          name="description"
          content="Meet BOCRA's Board of Directors, including the Chairperson, Vice Chairperson, and current non-executive board members."
        />
        <meta property="og:title" content="Board of Directors | BOCRA" />
        <meta
          property="og:description"
          content="Meet BOCRA's Board of Directors and review the governance profiles sourced from BOCRA's official board page."
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content={`${window.location.origin}/board-of-directors`}
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Board of Directors | BOCRA" />
        <meta name="twitter:description" content={SITE_DESCRIPTION} />
      </Helmet>

      <div className="bg-bocra-light-grey">
        <section className="border-b border-bocra-border bg-white">
          <div className="container py-12 md:py-16">
            <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
              <div className="max-w-3xl space-y-4">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-bocra-teal">
                  Governance
                </p>
                <h1 className="text-4xl font-bold text-bocra-text-primary md:text-5xl">
                  Board of Directors
                </h1>
                <p className="text-lg text-bocra-text-secondary">
                  BOCRA's Board provides strategic direction for the Authority in
                  line with Botswana's digital economy and communications
                  transformation priorities.
                </p>
                <p className="max-w-2xl text-bocra-text-secondary">
                  This internal page is sourced from BOCRA's official Board of
                  Directors page and reformatted to fit the current site
                  experience.
                </p>
              </div>

              <Card className="border-0 bg-bocra-deep-teal px-6 py-6 text-white shadow-lg">
                <div className="grid gap-5 sm:grid-cols-3 lg:grid-cols-1">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-white/70">
                      Effective from
                    </p>
                    <p className="mt-3 text-3xl font-semibold">1 Aug 2025</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-white/70">
                      Non-executive directors
                    </p>
                    <p className="mt-3 text-3xl font-semibold">7</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-white/70">
                      Ex-Officio member
                    </p>
                    <p className="mt-3 text-3xl font-semibold">Chief Executive</p>
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
                  Official source summary
                </Badge>
                <p className="text-bocra-text-secondary">{BOARD_APPOINTMENT_NOTE}</p>
              </div>
              <Button asChild variant="outline" className="justify-self-start lg:justify-self-end">
                <a
                  href={GOVERNANCE_SOURCES.boardOfDirectors}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Official BOCRA Board Page
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </Card>
        </section>

        <section className="container pb-8 md:pb-10">
          <div className="grid gap-6 xl:grid-cols-2">
            {BOARD_MEMBERS.map((member) => (
              <Card
                key={member.name}
                className="border-0 bg-white p-6 shadow-sm md:p-7"
              >
                <div className="grid gap-6 sm:grid-cols-[180px_minmax(0,1fr)]">
                  <div className="overflow-hidden rounded-2xl bg-bocra-light-grey">
                    <img
                      src={member.imageUrl}
                      alt={member.name}
                      className="h-full min-h-[220px] w-full object-cover"
                    />
                  </div>

                  <div>
                    <Badge className="bg-bocra-teal text-white hover:bg-bocra-teal">
                      {member.role}
                    </Badge>
                    <h2 className="mt-4 text-2xl font-semibold text-bocra-text-primary">
                      {member.name}
                    </h2>
                    <p className="mt-4 text-sm leading-7 text-bocra-text-secondary">
                      {member.summary}
                    </p>

                    <div className="mt-5 flex flex-wrap gap-2">
                      {member.highlights.map((highlight) => (
                        <span
                          key={highlight}
                          className="rounded-full bg-bocra-light-grey px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-bocra-text-primary"
                        >
                          {highlight}
                        </span>
                      ))}
                    </div>
                  </div>
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
                  Move from board governance into BOCRA's executive leadership
                </h2>
                <p className="mt-4 max-w-2xl text-white/80">
                  Review the executive management roster, then return to the main
                  About page for BOCRA's mandate, values, and sector coverage.
                </p>
              </div>

              <div className="grid gap-3 sm:min-w-[260px]">
                <Button asChild className="bg-white text-bocra-deep-teal hover:bg-white/90">
                  <a href="/executive-management">
                    Executive Management
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

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl bg-white/10 p-4">
                <Users className="h-5 w-5 text-bocra-golden-yellow" />
                <p className="mt-3 font-semibold">Board composition</p>
                <p className="mt-2 text-sm text-white/75">
                  Seven non-executive members with the Chief Executive serving as
                  the Ex-Officio member.
                </p>
              </div>
              <div className="rounded-2xl bg-white/10 p-4">
                <CalendarDays className="h-5 w-5 text-bocra-golden-yellow" />
                <p className="mt-3 font-semibold">Current appointment note</p>
                <p className="mt-2 text-sm text-white/75">
                  BOCRA's official page says the current board took effect on 1
                  August 2025.
                </p>
              </div>
              <div className="rounded-2xl bg-white/10 p-4">
                <ShieldCheck className="h-5 w-5 text-bocra-golden-yellow" />
                <p className="mt-3 font-semibold">Source integrity</p>
                <p className="mt-2 text-sm text-white/75">
                  Profiles on this page are condensed from BOCRA's official board
                  source for faster on-site reading.
                </p>
              </div>
            </div>
          </Card>
        </section>
      </div>
    </>
  );
}
