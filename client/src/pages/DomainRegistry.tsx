import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Globe, CheckCircle2, Clock, Shield, Lock, AlertCircle, Download, ArrowRight, Phone, BarChart3, Building2, Zap, Mail, FileText } from 'lucide-react';

export default function DomainRegistry() {
  const [searchDomain, setSearchDomain] = useState('');
  const [searchStatus, setSearchStatus] = useState<'' | 'available' | 'taken' | 'error'>('');

  const handleDomainSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchDomain.trim()) return;
    // Simulate domain lookup
    const randomStatus = Math.random() > 0.5 ? 'available' : 'taken';
    setSearchStatus(randomStatus);
  };

  const registrars = [
    {
      name: 'NIC Botswana',
      url: 'nic.bw',
      type: 'Registry Operator',
      status: 'Official',
    },
    {
      name: 'Domain.bw Solutions',
      url: 'domain.bw',
      type: 'Accredited Registrar',
      status: 'Active',
    },
    {
      name: 'BWNet Services',
      url: 'bwnet.bw',
      type: 'Accredited Registrar',
      status: 'Active',
    },
    {
      name: 'Hosting Botswana',
      url: 'hostingbw.bw',
      type: 'Accredited Registrar',
      status: 'Active',
    },
  ];

  const registrationProcess = [
    {
      step: 1,
      title: 'Check Availability',
      desc: 'Search for your desired domain name to see if it\'s available',
    },
    {
      step: 2,
      title: 'Choose Registrar',
      desc: 'Select from accredited registrars to register your domain',
    },
    {
      step: 3,
      title: 'Provide Details',
      desc: 'Submit registrant information and contact details',
    },
    {
      step: 4,
      title: 'Pay Registration',
      desc: 'Complete payment for the domain registration',
    },
    {
      step: 5,
      title: 'Configure DNS',
      desc: 'Set up nameservers or DNS records with your hosting provider',
    },
    {
      step: 6,
      title: 'Active Domain',
      desc: 'Your domain is now active and ready to use',
    },
  ];

  const domainPricing = [
    { period: '1 Year', price: 'BWP 100', renewal: 'BWP 100/year' },
    { period: '3 Years', price: 'BWP 280', renewal: 'BWP 100/year' },
    { period: '5 Years', price: 'BWP 450', renewal: 'BWP 100/year' },
    { period: '10 Years', price: 'BWP 850', renewal: 'BWP 100/year' },
  ];

  const domainFeatures = [
    {
      title: 'Domain Transfer',
      desc: 'Transfer your existing domain to Botswana or from another registrar',
      icon: ArrowRight,
    },
    {
      title: 'Domain Renewal',
      desc: 'Renew your domain before expiration to maintain your online presence',
      icon: Clock,
    },
    {
      title: 'WHOIS Lookup',
      desc: 'Look up domain registration information and contact details',
      icon: Search,
    },
    {
      title: 'Privacy Protection',
      desc: 'Hide your personal information from public WHOIS records',
      icon: Shield,
    },
    {
      title: 'DNS Management',
      desc: 'Manage DNS records and point your domain to your website',
      icon: Globe,
    },
    {
      title: 'Email Forwarding',
      desc: 'Set up professional email addresses with your domain',
      icon: Lock,
    },
  ];

  const faqItems = [
    {
      q: 'How do I register a .bw domain?',
      a: 'You can register a .bw domain through any accredited registrar listed on our website. Choose a registrar, search for your desired domain name, and follow their registration process.',
    },
    {
      q: 'Who owns a .bw domain?',
      a: 'The domain registrant (you) owns the domain for the duration of the registration period. After expiration, if not renewed, the domain becomes available for others to register.',
    },
    {
      q: 'Can I transfer my .bw domain to another registrar?',
      a: 'Yes, you can transfer your domain between accredited registrars. Contact your current registrar for an authorization code (EPP code) to initiate the transfer.',
    },
    {
      q: 'What is a domain renewal?',
      a: 'Domain renewal is the annual payment to maintain your domain registration. Domains expire annually and must be renewed to keep them active.',
    },
    {
      q: 'What is WHOIS information?',
      a: 'WHOIS contains the registrant\'s contact information for a domain. You can look up any domain\'s WHOIS information to see who owns it.',
    },
    {
      q: 'Can I protect my WHOIS information?',
      a: 'Yes, most registrars offer privacy protection services that hide your personal information from the public WHOIS database.',
    },
    {
      q: 'How long does registration take?',
      a: 'Most domains are registered instantly after payment. Your domain may take 24-48 hours to fully propagate across the internet.',
    },
    {
      q: 'What is the cost of a .bw domain?',
      a: 'Standard .bw domains cost approximately BWP 100 per year. Some registrars may offer introductory pricing for first-time registrations.',
    },
  ];

  const domainRules = [
    {
      rule: 'Minimum Length',
      detail: '3-63 characters for standard registrations',
    },
    {
      rule: 'Valid Characters',
      detail: 'Letters (a-z), numbers (0-9), and hyphens (-) only',
    },
    {
      rule: 'No Hyphens at Start/End',
      detail: 'Domain names cannot begin or end with a hyphen',
    },
    {
      rule: 'Second-Level Domains',
      detail: 'Specific rules apply for .co.bw, .org.bw, and other subdomains',
    },
    {
      rule: 'Reserved Names',
      detail: 'Some government and institutional names are reserved',
    },
    {
      rule: 'Renewal Required',
      detail: 'Domains must be renewed annually to remain active',
    },
  ];

  return (
    <>
      <Helmet>
        <title>Domain Registry | BOCRA</title>
        <meta name="description" content="Register .bw domains, search domain availability, and manage your Botswana web presence. Official .bw domain registry." />
      </Helmet>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-bocra-teal to-bocra-forest-green text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4">Domain Registry (.bw)</h1>
          <p className="text-xl text-white/90 max-w-2xl">
            Register and manage your .bw domain. Secure your Botswana web presence with an official country-code domain.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16 space-y-16">
        {/* Domain Search */}
        <section>
          <h2 className="text-3xl font-bold mb-8 text-bocra-text-primary">Check Domain Availability</h2>
          <Card className="border-2 border-bocra-teal/20">
            <CardContent className="pt-8">
              <form onSubmit={handleDomainSearch} className="space-y-4">
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      placeholder="Enter domain name (e.g., mycompany)"
                      value={searchDomain}
                      onChange={(e) => setSearchDomain(e.target.value)}
                      className="w-full px-4 py-3 pr-12 border border-bocra-border rounded-lg focus:ring-2 focus:ring-bocra-teal focus:border-transparent outline-none"
                    />
                    <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-bocra-text-secondary font-semibold">
                      .bw
                    </span>
                  </div>
                  <Button
                    type="submit"
                    className="bg-bocra-teal hover:bg-bocra-teal/90 gap-2 px-8"
                  >
                    <Search className="w-4 h-4" />
                    Search
                  </Button>
                </div>

                {searchStatus && (
                  <div className={`p-4 rounded-lg flex gap-3 items-center ${
                    searchStatus === 'available'
                      ? 'bg-green-50 border border-green-200'
                      : searchStatus === 'taken'
                      ? 'bg-orange-50 border border-orange-200'
                      : 'bg-red-50 border border-red-200'
                  }`}>
                    {searchStatus === 'available' ? (
                      <>
                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-green-900">
                            Good news! {searchDomain}.bw is available
                          </p>
                          <Button variant="outline" size="sm" className="mt-2 border-green-300 text-green-700 hover:bg-green-50">
                            Register Now
                          </Button>
                        </div>
                      </>
                    ) : searchStatus === 'taken' ? (
                      <>
                        <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-orange-900">
                            {searchDomain}.bw is already registered
                          </p>
                          <p className="text-sm text-orange-700 mt-1">Try a different name or contact the owner via WHOIS lookup</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                        <p className="font-semibold text-red-900">Search error. Please try again.</p>
                      </>
                    )}
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
        </section>

        {/* Quick Stats */}
        <section className="grid md:grid-cols-4 gap-6">
          {[
            { label: 'Registered Domains', value: '2,500+', icon: BarChart3 },
            { label: 'Active Registrars', value: '4', icon: Building2 },
            { label: 'Avg Registration Time', value: '5 mins', icon: Zap },
            { label: 'Domain Extension', value: '.bw', icon: Globe },
          ].map((stat, idx) => {
            const StatIcon = stat.icon;
            return (
            <Card key={idx}>
              <CardContent className="py-8 text-center">
                <StatIcon className="w-8 h-8 text-bocra-teal mx-auto mb-2" />
                <p className="text-bocra-text-secondary text-sm mb-2">{stat.label}</p>
                <p className="text-2xl font-bold text-bocra-teal">{stat.value}</p>
              </CardContent>
            </Card>
          );
          })}
        </section>

        {/* Domain Registration Process */}
        <section>
          <h2 className="text-3xl font-bold mb-8 text-bocra-text-primary">Registration Process</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {registrationProcess.map((step, idx) => (
              <div key={idx}>
                <Card className="text-center h-full">
                  <CardContent className="pt-8 pb-8">
                    <div className="text-4xl font-bold text-bocra-teal mb-3">{step.step}</div>
                    <h4 className="font-semibold text-bocra-text-primary mb-2">{step.title}</h4>
                    <p className="text-sm text-bocra-text-secondary">{step.desc}</p>
                  </CardContent>
                </Card>
                {idx < registrationProcess.length - 1 && (
                  <div className="hidden md:flex justify-center py-2 -mt-2">
                    <ArrowRight className="w-6 h-6 text-bocra-teal transform -rotate-90" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Domain Features */}
        <section>
          <h2 className="text-3xl font-bold mb-8 text-bocra-text-primary">Domain Management Services</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {domainFeatures.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.title} className="hover:shadow-lg transition-all">
                  <CardHeader>
                    <Icon className="w-8 h-8 text-bocra-teal mb-2" />
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-bocra-text-secondary text-sm">{feature.desc}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Registrars */}
        <section>
          <h2 className="text-3xl font-bold mb-8 text-bocra-text-primary">Accredited Registrars</h2>
          <p className="text-bocra-text-secondary mb-8 max-w-3xl">
            Register your .bw domain through any of these BOCRA-accredited registrars. Compare offerings and choose the one that best fits your needs.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {registrars.map((registrar) => (
              <Card key={registrar.url} className="hover:shadow-lg transition-all">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-lg">{registrar.name}</CardTitle>
                    <span className="text-xs font-semibold bg-bocra-teal/10 text-bocra-teal px-2 py-1 rounded">
                      {registrar.status}
                    </span>
                  </div>
                  <CardDescription>{registrar.type}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-bocra-bgLightGrey p-3 rounded">
                    <p className="text-sm text-bocra-text-secondary">Website URL</p>
                    <p className="font-semibold text-bocra-teal">{registrar.url}</p>
                  </div>
                  <Button variant="outline" className="w-full gap-2">
                    <Globe className="w-4 h-4" />
                    Visit Registrar
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Pricing */}
        <section>
          <h2 className="text-3xl font-bold mb-8 text-bocra-text-primary">Domain Pricing</h2>
          <Card>
            <CardHeader className="bg-bocra-bgLightGrey">
              <CardTitle>Registration & Renewal Fees</CardTitle>
              <CardDescription>Standard .bw domain registration and renewal pricing</CardDescription>
            </CardHeader>
            <CardContent className="pt-8">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-bocra-border">
                      <th className="text-left py-3 px-4 font-semibold text-bocra-text-primary">Registration Period</th>
                      <th className="text-right py-3 px-4 font-semibold text-bocra-text-primary">Initial Price</th>
                      <th className="text-right py-3 px-4 font-semibold text-bocra-text-primary">Annual Renewal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {domainPricing.map((pricing, idx) => (
                      <tr key={idx} className="border-b border-bocra-border hover:bg-bocra-bgLightGrey">
                        <td className="py-3 px-4 text-bocra-text-primary">{pricing.period}</td>
                        <td className="text-right py-3 px-4 font-semibold text-bocra-teal">{pricing.price}</td>
                        <td className="text-right py-3 px-4 text-bocra-text-secondary">{pricing.renewal}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-sm text-bocra-text-secondary mt-6">
                Prices shown are for standard .bw registrations. Some registrars may offer promotional pricing or bundle discounts. Domains must be renewed annually to remain active.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Domain Rules & Requirements */}
        <section>
          <h2 className="text-3xl font-bold mb-8 text-bocra-text-primary">Domain Rules & Requirements</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {domainRules.map((item, idx) => (
              <Card key={idx}>
                <CardHeader>
                  <CardTitle className="text-lg text-bocra-teal">{item.rule}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-bocra-text-secondary">{item.detail}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* WHOIS Lookup */}
        <section className="bg-bocra-bgLightGrey p-8 rounded-lg border border-bocra-teal/20">
          <h2 className="text-2xl font-bold mb-4 text-bocra-text-primary flex gap-2 items-center">
            <Search className="w-6 h-6 text-bocra-teal" />
            WHOIS Lookup
          </h2>
          <p className="text-bocra-text-secondary mb-6">
            Look up domain registration information including registrant details, registrar, and contact information.
          </p>
          <Button className="bg-bocra-teal hover:bg-bocra-teal/90 gap-2">
            Access WHOIS Database <ArrowRight className="w-4 h-4" />
          </Button>
        </section>

        {/* FAQ */}
        <section>
          <h2 className="text-3xl font-bold mb-8 text-bocra-text-primary">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {faqItems.map((faq, idx) => (
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

        {/* Important Notes */}
        <section className="bg-bocra-dark-maroon/5 border border-bocra-dark-maroon/20 p-8 rounded-lg">
          <div className="flex gap-4">
            <AlertCircle className="w-6 h-6 text-bocra-dark-maroon flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-bocra-text-primary mb-2">Important Information</h3>
              <ul className="space-y-2 text-sm text-bocra-text-secondary">
                <li>• Domain names are case-insensitive (example.bw = EXAMPLE.BW)</li>
                <li>• Domains automatically renew unless you disable auto-renewal</li>
                <li>• If not renewed within 30 days of expiration, the domain may be deleted</li>
                <li>• You can transfer your domain between registrars using the EPP code</li>
                <li>• BOCRA is the registry authority for all .bw domain extensions</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Support */}
        <section>
          <h2 className="text-3xl font-bold mb-8 text-bocra-text-primary">Need Assistance?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: 'Email Support',
                contact: 'domains@bocra.org.bw',
                icon: Mail,
              },
              {
                title: 'Phone Support',
                contact: '+267 XXX-XXXX',
                icon: Phone,
              },
              {
                title: 'Download Documentation',
                contact: 'Guidelines & Policies',
                icon: FileText,
              },
            ].map((support, idx) => {
              const SupportIcon = support.icon;
              return (
              <Card key={idx}>
                <CardContent className="py-8 text-center">
                  <SupportIcon className="w-8 h-8 text-bocra-teal mx-auto mb-3" />
                  <p className="font-semibold text-bocra-text-primary mb-2">{support.title}</p>
                  <p className="text-bocra-text-secondary font-mono">{support.contact}</p>
                </CardContent>
              </Card>
            );
            })}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-r from-bocra-teal/10 to-bocra-forest-green/10 py-12 px-8 rounded-lg text-center border border-bocra-teal/20">
          <h2 className="text-2xl font-bold mb-4 text-bocra-text-primary">Ready to Claim Your .bw Domain?</h2>
          <p className="text-bocra-text-secondary mb-8 max-w-2xl mx-auto">
            Search for availability above and connect with an accredited registrar to get your domain registered today.
          </p>
          <Button className="bg-bocra-teal hover:bg-bocra-teal/90 gap-2">
            Search Domains <Globe className="w-4 h-4" />
          </Button>
        </section>
      </div>
    </>
  );
}
