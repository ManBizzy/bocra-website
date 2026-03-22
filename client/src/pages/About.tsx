import { Helmet } from 'react-helmet-async';
import { SITE_FULL_NAME, REGULATORY_AREAS, HOMEPAGE_STATS } from '@/const';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Users, Target, Globe } from 'lucide-react';
import { Link } from 'wouter';

export default function About() {
  return (
    <>
      <Helmet>
        <title>About | BOCRA</title>
        <meta name="description" content="Learn more about the Botswana Communications Regulatory Authority and our mandate." />
      </Helmet>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-bocra-teal to-bocra-forest-green text-black py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4 text-black">About BOCRA</h1>
          <p className="text-xl text-black/90 max-w-2xl">
            Regulating telecommunications, broadcasting, postal, and internet services in Botswana in the public interest.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16 space-y-16">
        {/* Mission & Mandate */}
        <section>
          <h2 className="text-3xl font-bold mb-8 text-bocra-text-primary">Our Mission & Mandate</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <Target className="w-8 h-8 text-bocra-teal mb-2" />
                <CardTitle>Mission</CardTitle>
              </CardHeader>
              <CardContent className="text-bocra-text-secondary">
                <p>
                  To regulate telecommunications, broadcasting, postal, and internet services in Botswana in a manner that promotes competition, innovation, and quality service delivery while protecting consumers and ensuring efficient spectrum management.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Globe className="w-8 h-8 text-bocra-forest-green mb-2" />
                <CardTitle>Vision</CardTitle>
              </CardHeader>
              <CardContent className="text-bocra-text-secondary">
                <p>
                  To be a world-class regulatory authority that fosters a competitive, innovative, and inclusive digital ecosystem that enhances quality of life for all Botswanans.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Regulatory Areas */}
        <section>
          <h2 className="text-3xl font-bold mb-8 text-bocra-text-primary">Regulatory Areas</h2>
          <p className="text-bocra-text-secondary mb-8 max-w-3xl">
            BOCRA oversees regulation across multiple sectors to ensure fair competition, quality service standards, and consumer protection.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {REGULATORY_AREAS.map((area) => (
              <Card key={area.title} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-bocra-teal">{area.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-bocra-text-secondary">{area.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Key Statistics */}
        <section>
          <h2 className="text-3xl font-bold mb-8 text-bocra-text-primary">By The Numbers</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {HOMEPAGE_STATS.map((stat) => (
              <Card key={stat.label} className="text-center">
                <CardContent className="py-8">
                  <div className="text-4xl font-bold text-bocra-teal mb-2">{stat.value}</div>
                  <p className="text-bocra-text-secondary">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Core Values */}
        <section>
          <h2 className="text-3xl font-bold mb-8 text-bocra-text-primary">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: 'Transparency',
                description: 'We operate with openness and accountability in all regulatory decisions and processes.',
                icon: CheckCircle2,
              },
              {
                title: 'Fairness',
                description: 'We ensure equitable treatment of all stakeholders and promote competitive market practices.',
                icon: CheckCircle2,
              },
              {
                title: 'Excellence',
                description: 'We strive for the highest standards in regulation and service delivery to all Botswanans.',
                icon: CheckCircle2,
              },
              {
                title: 'Innovation',
                description: 'We encourage technological advancement and industry development while maintaining consumer protection.',
                icon: CheckCircle2,
              },
              {
                title: 'Accountability',
                description: 'We take responsibility for our actions and decisions, answerable to the public and government.',
                icon: CheckCircle2,
              },
              {
                title: 'Inclusivity',
                description: 'We ensure all sectors of society benefit from reliable and affordable telecommunications services.',
                icon: CheckCircle2,
              },
            ].map((value) => {
              const Icon = value.icon;
              return (
                <Card key={value.title}>
                  <CardHeader>
                    <Icon className="w-6 h-6 text-bocra-teal mb-2" />
                    <CardTitle className="text-lg">{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-bocra-text-secondary">{value.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Organization Structure */}
        <section>
          <h2 className="text-3xl font-bold mb-8 text-bocra-text-primary">Organization Structure</h2>
          <Card>
            <CardHeader>
              <Users className="w-6 h-6 text-bocra-teal mb-2" />
              <CardTitle>Leadership & Departments</CardTitle>
              <CardDescription>BOCRA is led by a Board of Directors and managed by an executive team overseeing key departments.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { title: 'Office of the Director General', desc: 'Strategic oversight and organizational leadership' },
                  { title: 'Licensing & Numbering', desc: 'Managing licenses and telecommunications numbering' },
                  { title: 'Spectrum Management', desc: 'Radio frequency spectrum allocation and management' },
                  { title: 'Consumer Affairs', desc: 'Consumer protection and complaint resolution' },
                  { title: 'Market Intelligence', desc: 'Market monitoring and competitive analysis' },
                  { title: 'Corporate Services', desc: 'Finance, HR, and administrative functions' },
                ].map((dept) => (
                  <div key={dept.title} className="border-l-4 border-bocra-teal pl-4">
                    <h4 className="font-semibold text-bocra-text-primary">{dept.title}</h4>
                    <p className="text-sm text-bocra-text-secondary">{dept.desc}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Call to Action */}
        <section className="bg-bocra-bgLightGrey py-12 px-8 rounded-lg text-center">
          <h2 className="text-2xl font-bold mb-4">Want to Learn More?</h2>
          <p className="text-bocra-text-secondary mb-6 max-w-2xl mx-auto">
            Explore our services, check licensing requirements, or get in touch with our team for more information.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/services">
              <Button variant="default" className="bg-bocra-teal hover:bg-bocra-teal/90">
                Explore Services
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline">
                Contact Us
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
