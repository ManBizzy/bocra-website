import { Helmet } from 'react-helmet-async';
import { QUICK_SERVICES } from '@/const';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Radio, FileCheck, MessageSquare, Globe, Tv, Shield, ArrowRight, CheckCircle } from 'lucide-react';
import { Link } from 'wouter';

export default function Services() {
  const detailedServices = [
    {
      id: 'spectrum',
      title: 'Spectrum Management',
      icon: Radio,
      description: 'Efficient allocation and management of radio frequency spectrum for telecommunications operators.',
      details: [
        'Frequency band allocation and assignment',
        'Spectrum licensing and renewal',
        'Interference management and dispute resolution',
        'Spectrum audit and compliance monitoring',
        'International coordination on frequency use',
      ],
      how: 'Operators apply for spectrum licenses through our licensing portal with technical specifications. BOCRA conducts technical feasibility assessments and grants licenses for the requested frequencies.',
      duration: '30-60 days',
      fee: 'Based on allocated spectrum bands',
    },
    {
      id: 'licensing',
      title: 'Operator Licensing',
      icon: FileCheck,
      description: 'Comprehensive licensing framework for telecommunications and broadcasting operators.',
      details: [
        'National Operator License (NOL) issuance',
        'Class licenses for specialized services',
        'License renewal and modification applications',
        'Conditions of service monitoring',
        'Performance standard compliance verification',
      ],
      how: 'Prospective operators submit detailed applications with business plans, technical infrastructure plans, and financial viability assessments. BOCRA evaluates and grants licenses for qualified applicants.',
      duration: '60-90 days',
      fee: 'Annual license fees vary by operator class and revenue',
    },
    {
      id: 'complaints',
      title: 'Consumer Complaints',
      icon: MessageSquare,
      description: 'Dedicated mechanism to resolve consumer disputes and complaints against licensed operators.',
      details: [
        'Complaint lodging and tracking system',
        'Investigation and dispute resolution',
        'Mediation between consumers and operators',
        'Consumer protection enforcement',
        'Quality of Service (QoS) monitoring',
      ],
      how: 'Consumers file complaints through our online portal, phone, or in person. BOCRA investigates and works with operators to resolve issues fairly and expeditiously.',
      duration: '20-45 days standard resolution',
      fee: 'Free for consumers',
    },
    {
      id: 'domain',
      title: 'Domain Registry (.bw)',
      icon: Globe,
      description: 'Registration and management of .bw domain names for Botswana internet presence.',
      details: [
        'Domain name registration and renewal',
        'Domain management and DNS configuration',
        'WHOIS information and registrant data',
        'Domain dispute resolution',
        'Bulk registration and institutional services',
      ],
      how: 'Organizations register .bw domains through accredited registrars. Registration ensures secure and trusted Botswana internet presence.',
      duration: '1-3 days',
      fee: 'BWP 100-500 per domain annually',
    },
    {
      id: 'broadcasting',
      title: 'Broadcasting Regulation',
      icon: Tv,
      description: 'Licensing and regulation of television and radio broadcasting services in Botswana.',
      details: [
        'Broadcasting license issuance and renewal',
        'Content standards and compliance monitoring',
        'Technical broadcast standards enforcement',
        'Advertising standards regulation',
        'Public broadcasting service oversight',
      ],
      how: 'Broadcasters apply for licenses with programming plans and technical specifications. BOCRA monitors ongoing compliance with content and technical standards.',
      duration: '45-60 days initial license',
      fee: 'Varies by broadcasting license class',
    },
    {
      id: 'cybersecurity',
      title: 'Cybersecurity Advisory',
      icon: Shield,
      description: 'Guidance and advisory services for cybersecurity best practices and incident response.',
      details: [
        'Cybersecurity policy recommendations',
        'Risk assessment consulting',
        'Incident reporting and response coordination',
        'Security awareness training resources',
        'Best practices documentation and guidance',
      ],
      how: 'Organizations can request cybersecurity guidance through our advisory services. BOCRA provides recommendations based on international best practices.',
      duration: 'Varies by request scope',
      fee: 'Complimentary advisory services',
    },
  ];

  const serviceProcess = [
    { step: 1, title: 'Submit Application', desc: 'Complete application form with required documentation' },
    { step: 2, title: 'Initial Review', desc: 'BOCRA reviews application for completeness' },
    { step: 3, title: 'Assessment', desc: 'Technical and financial evaluation conducted' },
    { step: 4, title: 'Approval/Decision', desc: 'License granted or feedback provided' },
    { step: 5, title: 'Issuance', desc: 'License issued with conditions and requirements' },
  ];

  return (
    <>
      <Helmet>
        <title>Services | BOCRA</title>
        <meta name="description" content="Explore BOCRA services including spectrum management, licensing, complaints resolution, and more." />
      </Helmet>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-bocra-telecom to-bocra-internet text-black py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4 text-black">Our Services</h1>
          <p className="text-xl text-black/90 max-w-2xl">
            Comprehensive regulatory services supporting telecommunications, broadcasting, and internet infrastructure in Botswana.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16 space-y-16">
        {/* Quick Access Services */}
        <section>
          <h2 className="text-3xl font-bold mb-8 text-bocra-text-primary">Quick Access Services</h2>
          <p className="text-bocra-text-secondary mb-8 max-w-3xl">
            Our most frequently used services. Click to learn more or navigate directly to access them.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {detailedServices.map((service) => {
              const Icon = service.icon;
              return (
                <Card key={service.id} className="hover:shadow-lg transition-all hover:border-bocra-teal">
                  <CardHeader>
                    <Icon className="w-8 h-8 text-bocra-teal mb-2" />
                    <CardTitle className="text-lg">{service.title}</CardTitle>
                    <CardDescription>{service.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link href={`/services#${service.id}`}>
                      <Button variant="outline" className="w-full gap-2">
                        Learn More <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Detailed Services */}
        <section>
          <h2 className="text-3xl font-bold mb-12 text-bocra-text-primary">Service Details</h2>
          <div className="space-y-8">
            {detailedServices.map((service, idx) => {
              const Icon = service.icon;
              return (
                <div key={service.id} id={service.id} className="scroll-mt-20">
                  <Card className="overflow-hidden">
                    <CardHeader className="bg-bocra-bgLightGrey border-b">
                      <div className="flex items-start gap-4">
                        <div className="bg-white p-3 rounded-lg">
                          <Icon className="w-8 h-8 text-bocra-teal" />
                        </div>
                        <div className="flex-1">
                          <div className="text-sm text-bocra-text-secondary mb-1">Service {idx + 1} of {detailedServices.length}</div>
                          <CardTitle className="text-2xl">{service.title}</CardTitle>
                          <CardDescription className="text-base mt-2">{service.description}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-8">
                      <div className="grid md:grid-cols-2 gap-8">
                        {/* What's Included */}
                        <div>
                          <h4 className="font-semibold text-bocra-text-primary mb-4">What's Included</h4>
                          <ul className="space-y-3">
                            {service.details.map((detail, i) => (
                              <li key={i} className="flex gap-3">
                                <CheckCircle className="w-5 h-5 text-bocra-teal flex-shrink-0 mt-0.5" />
                                <span className="text-bocra-text-secondary">{detail}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* How It Works & Details */}
                        <div className="space-y-6">
                          <div>
                            <h4 className="font-semibold text-bocra-text-primary mb-2">How It Works</h4>
                            <p className="text-bocra-text-secondary">{service.how}</p>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-bocra-bgLightGrey p-4 rounded-lg">
                              <p className="text-sm text-bocra-text-secondary mb-1">Processing Time</p>
                              <p className="font-semibold text-bocra-text-primary">{service.duration}</p>
                            </div>
                            <div className="bg-bocra-bgLightGrey p-4 rounded-lg">
                              <p className="text-sm text-bocra-text-secondary mb-1">Service Fee</p>
                              <p className="font-semibold text-bocra-text-primary">{service.fee}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Apply Button */}
                      <div className="mt-8 pt-6 border-t">
                        <Link href="/contact">
                          <Button className="bg-bocra-teal hover:bg-bocra-teal/90 gap-2">
                            Apply for This Service <ArrowRight className="w-4 h-4" />
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>
        </section>

        {/* Service Process */}
        <section>
          <h2 className="text-3xl font-bold mb-8 text-bocra-text-primary">Application Process</h2>
          <p className="text-bocra-text-secondary mb-12 max-w-3xl">
            Most of our services follow a similar application and approval process. Here's what to expect.
          </p>
          <div className="grid md:grid-cols-5 gap-4">
            {serviceProcess.map((item, idx) => (
              <div key={idx} className="relative">
                <Card className="text-center h-full">
                  <CardContent className="pt-8 pb-8">
                    <div className="text-4xl font-bold text-bocra-teal mb-3">{item.step}</div>
                    <h4 className="font-semibold text-bocra-text-primary mb-2">{item.title}</h4>
                    <p className="text-sm text-bocra-text-secondary">{item.desc}</p>
                  </CardContent>
                </Card>
                {idx < serviceProcess.length - 1 && (
                  <div className="hidden md:flex absolute top-1/2 -right-5 transform -translate-y-1/2 z-10">
                    <ArrowRight className="w-6 h-6 text-bocra-teal" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Service Levels */}
        <section>
          <h2 className="text-3xl font-bold mb-8 text-bocra-text-primary">Service Commitments</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: 'Transparency',
                desc: 'Clear application requirements and transparent decision-making processes',
              },
              {
                title: 'Efficiency',
                desc: 'Timely processing of applications with predictable timelines',
              },
              {
                title: 'Support',
                desc: 'Dedicated support team to guide applicants through all stages',
              },
            ].map((commitment) => (
              <Card key={commitment.title}>
                <CardHeader>
                  <CardTitle className="text-bocra-teal">{commitment.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-bocra-text-secondary">{commitment.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* FAQ Preview */}
        <section>
          <h2 className="text-3xl font-bold mb-8 text-bocra-text-primary">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { q: 'How do I apply for a service?', a: 'Visit our contact page or download the application form. Submit with required supporting documents.' },
              { q: 'What documents do I need?', a: 'Required documents vary by service. Check the specific service details above or contact us for a complete list.' },
              { q: 'Can I track my application?', a: 'Yes, use our online portal to track application status in real-time.' },
              { q: 'What if my application is rejected?', a: 'We provide detailed feedback on rejections. You can reapply after addressing the concerns.' },
            ].map((faq, idx) => (
              <Card key={idx}>
                <CardHeader>
                  <CardTitle className="text-base">{faq.q}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-bocra-text-secondary text-sm">{faq.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-bocra-teal/10 to-bocra-forest-green/10 py-12 px-8 rounded-lg text-center border border-bocra-teal/20">
          <h2 className="text-2xl font-bold mb-4 text-bocra-text-primary">Ready to Get Started?</h2>
          <p className="text-bocra-text-secondary mb-8 max-w-2xl mx-auto">
            Browse our services above or reach out to our dedicated support team for guidance on the right service for your needs.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/contact">
              <Button className="bg-bocra-teal hover:bg-bocra-teal/90 gap-2">
                Contact Us <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/licensing">
              <Button variant="outline">
                Licensing Portal
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
