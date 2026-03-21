import { Helmet } from 'react-helmet-async';
import {
  ArrowRight,
  Award,
  Building2,
  Eye,
  Globe,
  Landmark,
  Radio,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
} from 'lucide-react';
import { CONTACT_DETAILS, SITE_DESCRIPTION } from '@/const';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const VALUES = [
  {
    title: 'Excellence',
    description:
      'BOCRA aims to deliver world-class regulatory service through committed teams and disciplined public service.',
    icon: Award,
    accent: 'bg-bocra-teal/10 text-bocra-teal',
  },
  {
    title: 'Proactiveness',
    description:
      'The Authority positions itself to respond early to technology shifts, policy changes, and emerging industry risks.',
    icon: Sparkles,
    accent: 'bg-bocra-golden-yellow/20 text-bocra-deep-teal',
  },
  {
    title: 'Integrity',
    description:
      'Openness, honesty, and accountability remain central to BOCRA’s regulatory decisions and public trust mandate.',
    icon: ShieldCheck,
    accent: 'bg-bocra-dark-maroon/10 text-bocra-dark-maroon',
  },
  {
    title: 'People',
    description:
      'BOCRA treats talent development and collaboration as critical enablers of long-term regulatory performance.',
    icon: Users,
    accent: 'bg-bocra-forest-green/10 text-bocra-forest-green',
  },
] as const;

const SECTOR_FOCUS = [
  {
    title: 'Telecommunications and ICTs',
    description:
      'Licensing, market oversight, interconnection, tariffs, and frameworks that support competitive communications markets.',
    icon: Radio,
  },
  {
    title: 'Broadcasting',
    description:
      'Oversight of broadcasting services, audience protections, standards, and licensing pathways for commercial operators.',
    icon: Building2,
  },
  {
    title: 'Radio Communications',
    description:
      'Spectrum planning, assignments, technical standards, monitoring, and interference management across Botswana.',
    icon: Radio,
  },
  {
    title: 'Postal Services',
    description:
      'Regulation of universal postal obligations, courier licensing, and safe, reliable postal service delivery.',
    icon: Landmark,
  },
  {
    title: 'Internet and .bw Administration',
    description:
      'Oversight of internet-related regulation and management of the .bw country-code namespace under the CRA Act.',
    icon: Globe,
  },
  {
    title: 'Consumer Protection',
    description:
      'Complaint handling, service quality protections, and public-interest oversight across regulated service providers.',
    icon: ShieldCheck,
  },
] as const;

const STRATEGIC_PILLARS = [
  'Competition',
  'Universal Access and Service',
  'Consumer Protection',
  'Resource Optimisation',
  'Talent Management',
  'Stakeholder Engagement',
] as const;

const HISTORY_MILESTONES = [
  {
    year: '1996',
    title: 'Sector liberalisation begins',
    description:
      'Botswana approved the Telecommunications Act of 1996 and established the Botswana Telecommunications Authority as competition entered the market.',
  },
  {
    year: '1999',
    title: 'Broadcasting and internet licensing expand',
    description:
      'Commercial FM radio licensing and early internet service provider licensing widened the communications landscape.',
  },
  {
    year: '1 Apr 2013',
    title: 'BOCRA is formally established',
    description:
      'The Communications Regulatory Authority Act, 2012 created a converged regulator for telecommunications, internet and ICTs, radio communications, broadcasting, and postal services.',
  },
  {
    year: '2015',
    title: 'Converged ICT licensing framework begins',
    description:
      'BOCRA began implementing a revised licensing regime designed to support greater innovation, access, and market responsiveness.',
  },
] as const;

const MANDATE_POINTS = [
  'Regulate Botswana’s communications sector in the public interest.',
  'Promote competition, innovation, consumer protection, and universal access.',
  'Manage scarce national resources such as radio spectrum and the .bw namespace fairly and efficiently.',
  'Support a digitally driven society through transparent, converged regulation.',
] as const;

export default function About() {
  return (
    <>
      <Helmet>
        <title>About | BOCRA</title>
        <meta
          name="description"
          content="Learn about BOCRA’s statutory mandate, mission, values, strategic pillars, and role in regulating Botswana’s communications sector."
        />
        <meta property="og:title" content="About | BOCRA" />
        <meta
          property="og:description"
          content="Learn about BOCRA’s statutory mandate, mission, values, strategic pillars, and role in regulating Botswana’s communications sector."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${window.location.origin}/about`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="About | BOCRA" />
        <meta name="twitter:description" content={SITE_DESCRIPTION} />
      </Helmet>

      <div className="bg-bocra-light-grey">
        <section className="border-b border-bocra-border bg-white">
          <div className="container py-12 md:py-16">
            <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
              <div className="max-w-3xl space-y-4">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-bocra-teal">
                  Authority Profile
                </p>
                <h1 className="text-4xl font-bold text-bocra-text-primary md:text-5xl">
                  About BOCRA
                </h1>
                <p className="text-lg text-bocra-text-secondary">
                  The Botswana Communications Regulatory Authority is Botswana’s
                  converged communications regulator, established by the
                  Communications Regulatory Authority Act, 2012 and operational
                  from 1 April 2013.
                </p>
                <p className="max-w-2xl text-bocra-text-secondary">
                  BOCRA regulates telecommunications, internet and ICTs, radio
                  communications, broadcasting, postal services, and related
                  matters while promoting competition, innovation, consumer
                  protection, and universal access.
                </p>
              </div>

              <Card className="border-0 bg-bocra-deep-teal px-6 py-6 text-white shadow-lg">
                <div className="grid gap-5 sm:grid-cols-3 lg:grid-cols-1">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-white/70">
                      Established
                    </p>
                    <p className="mt-3 text-3xl font-semibold">2013</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-white/70">
                      Strategic pillars
                    </p>
                    <p className="mt-3 text-3xl font-semibold">6</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-white/70">
                      Regulated domains
                    </p>
                    <p className="mt-3 text-3xl font-semibold">5+</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        <section className="container py-8 md:py-10">
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <Card className="border-0 bg-white px-6 py-6 shadow-sm md:px-8">
              <Badge variant="outline" className="text-bocra-teal">
                Statutory mandate
              </Badge>
              <h2 className="mt-4 text-3xl font-semibold text-bocra-text-primary">
                A converged regulator for Botswana’s communications sector
              </h2>
              <p className="mt-4 text-bocra-text-secondary">
                BOCRA replaced earlier fragmented regulation under the
                Broadcasting Act, the Telecommunications Act, and amendments to
                the Postal Services Act. The result was an integrated authority
                with one cross-sector regulatory lens.
              </p>
              <div className="mt-6 grid gap-3">
                {MANDATE_POINTS.map((point) => (
                  <div
                    key={point}
                    className="rounded-2xl bg-bocra-light-grey px-4 py-3 text-sm text-bocra-text-secondary"
                  >
                    {point}
                  </div>
                ))}
              </div>
            </Card>

            <div className="grid gap-6">
              <Card className="border-0 bg-white px-6 py-6 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="rounded-2xl bg-bocra-teal/10 p-3 text-bocra-teal">
                    <Target className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-bocra-teal">
                      Mission
                    </p>
                    <p className="mt-3 text-lg font-semibold text-bocra-text-primary">
                      To regulate the communications sector for the promotion of
                      competition, innovation, consumer protection and universal
                      access.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="border-0 bg-white px-6 py-6 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="rounded-2xl bg-bocra-dark-maroon/10 p-3 text-bocra-dark-maroon">
                    <Eye className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-bocra-dark-maroon">
                      Vision
                    </p>
                    <p className="mt-3 text-lg font-semibold text-bocra-text-primary">
                      A connected and digitally driven society.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        <section className="container pb-8 md:pb-10">
          <div className="mb-6 max-w-2xl space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-bocra-teal">
              Values
            </p>
            <h2 className="text-3xl font-semibold text-bocra-text-primary">
              The operating principles behind BOCRA’s public mandate
            </h2>
            <p className="text-bocra-text-secondary">
              The Authority’s values shape how it regulates, engages
              stakeholders, and builds institutional capacity.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {VALUES.map((value) => {
              const Icon = value.icon;

              return (
                <Card
                  key={value.title}
                  className="border-0 bg-white px-6 py-6 shadow-sm"
                >
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl ${value.accent}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 text-xl font-semibold text-bocra-text-primary">
                    {value.title}
                  </h3>
                  <p className="mt-3 text-sm text-bocra-text-secondary">
                    {value.description}
                  </p>
                </Card>
              );
            })}
          </div>
        </section>

        <section className="container pb-8 md:pb-10">
          <div className="mb-6 max-w-2xl space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-bocra-teal">
              Sector coverage
            </p>
            <h2 className="text-3xl font-semibold text-bocra-text-primary">
              What BOCRA regulates
            </h2>
            <p className="text-bocra-text-secondary">
              BOCRA’s remit spans the core systems and services that shape how
              Botswana communicates, connects, and participates in the digital
              economy.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {SECTOR_FOCUS.map((sector) => {
              const Icon = sector.icon;

              return (
                <Card
                  key={sector.title}
                  className="border-0 bg-white px-6 py-6 shadow-sm"
                >
                  <div className="flex items-start gap-4">
                    <div className="rounded-2xl bg-bocra-light-grey p-3 text-bocra-teal">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-bocra-text-primary">
                        {sector.title}
                      </h3>
                      <p className="mt-3 text-sm text-bocra-text-secondary">
                        {sector.description}
                      </p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </section>

        <section className="container pb-8 md:pb-10">
          <Card className="border-0 bg-white px-6 py-8 shadow-sm md:px-8">
            <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-bocra-teal">
                  Strategic pillars
                </p>
                <h2 className="mt-3 text-3xl font-semibold text-bocra-text-primary">
                  The priorities BOCRA uses to advance the sector
                </h2>
                <p className="mt-4 text-bocra-text-secondary">
                  BOCRA’s core business is organised around practical success
                  factors that support sustainable growth, better services, and
                  a digitally connected Botswana.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {STRATEGIC_PILLARS.map((pillar) => (
                  <div
                    key={pillar}
                    className="rounded-2xl border border-bocra-border bg-bocra-light-grey px-4 py-4 text-sm font-medium text-bocra-text-primary"
                  >
                    {pillar}
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </section>

        <section className="container pb-8 md:pb-10">
          <div className="mb-6 max-w-2xl space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-bocra-teal">
              Timeline
            </p>
            <h2 className="text-3xl font-semibold text-bocra-text-primary">
              A concise history of communication regulation in Botswana
            </h2>
            <p className="text-bocra-text-secondary">
              BOCRA’s role sits within a longer liberalisation and convergence
              journey that reshaped the communications sector over time.
            </p>
          </div>

          <div className="grid gap-4">
            {HISTORY_MILESTONES.map((item) => (
              <Card
                key={item.year}
                className="border-0 bg-white px-6 py-6 shadow-sm"
              >
                <div className="grid gap-4 md:grid-cols-[140px_1fr] md:items-start">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-bocra-dark-maroon">
                      {item.year}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-bocra-text-primary">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-sm text-bocra-text-secondary">
                      {item.description}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        <section className="container pb-12 md:pb-16">
          <Card className="border-0 bg-bocra-deep-teal px-6 py-8 text-white shadow-lg md:px-8 md:py-10">
            <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/70">
                  Continue exploring
                </p>
                <h2 className="mt-3 text-3xl font-bold">
                  Move from BOCRA’s profile into the services and channels that
                  matter
                </h2>
                <p className="mt-4 max-w-2xl text-white/80">
                  Use the services pages for operational pathways, the contact
                  page for direct follow-up, or BOCRA’s official website for
                  current governance and statutory source material.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Button
                    asChild
                    className="bg-white text-bocra-deep-teal hover:bg-white/90"
                  >
                    <a href="/services">
                      Explore Services
                      <ArrowRight className="h-4 w-4" />
                    </a>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="border-white/25 bg-transparent text-white hover:bg-white/10"
                  >
                    <a href="/contact">
                      Contact BOCRA
                      <ArrowRight className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </div>

              <div className="grid gap-4 text-sm">
                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="font-semibold">Official location</p>
                  <p className="mt-2 text-white/75">
                    {CONTACT_DETAILS.officeName}, {CONTACT_DETAILS.addressLines[0]},{' '}
                    {CONTACT_DETAILS.addressLines[1]}
                  </p>
                </div>
                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="font-semibold">Governance and board details</p>
                  <p className="mt-2 text-white/75">
                    View BOCRA’s current board and governance material on the
                    official BOCRA website.
                  </p>
                  <a
                    href="https://www.bocra.org.bw/board-of-directors"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-2 font-semibold text-white transition-all hover:gap-3"
                  >
                    Board of Directors
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="font-semibold">Source material</p>
                  <p className="mt-2 text-white/75">
                    The authority profile, mission, vision, values, strategic
                    pillars, and history summary on this page are based on the
                    current BOCRA official website.
                  </p>
                  <a
                    href="https://www.bocra.org.bw/about-us"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-2 font-semibold text-white transition-all hover:gap-3"
                  >
                    Official About Page
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          </Card>
        </section>
      </div>
    </>
  );
}
