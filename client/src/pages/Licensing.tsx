import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileCheck, CheckCircle2, Clock, DollarSign, Download, AlertCircle, ArrowRight } from 'lucide-react';
import { Link } from 'wouter';

export default function Licensing() {
  const licenseTypes = [
    {
      id: 'nol',
      name: 'National Operator License (NOL)',
      type: 'Full Service',
      desc: 'For telecommunications operators providing nationwide services',
      includes: [
        'Full network infrastructure rights',
        'Voice and data services',
        'International connectivity',
        'Spectrum allocation',
      ],
      validity: '5 years',
      fee: 'BWP 500,000 - 2,000,000',
    },
    {
      id: 'class-a',
      name: 'Class A License',
      type: 'Specialized',
      desc: 'For regional or specialized telecommunications services',
      includes: [
        'Regional or limited service scope',
        'Specific technology focus',
        'Data services',
        'Internet services',
      ],
      validity: '3 years',
      fee: 'BWP 100,000 - 500,000',
    },
    {
      id: 'class-b',
      name: 'Class B License',
      type: 'Infrastructure',
      desc: 'For infrastructure operators (towers, fiber, etc.)',
      includes: [
        'Infrastructure provision',
        'Passive sharing rights',
        'Site procurement',
        'Maintenance services',
      ],
      validity: '3 years',
      fee: 'BWP 50,000 - 200,000',
    },
    {
      id: 'broadcasting',
      name: 'Broadcasting License',
      type: 'Media',
      desc: 'For television and radio broadcasters',
      includes: [
        'TV or radio broadcasting rights',
        'Frequency allocation',
        'Content standards compliance',
        'Audience reach options',
      ],
      validity: '5 years',
      fee: 'BWP 50,000 - 300,000',
    },
    {
      id: 'postal',
      name: 'Postal Service License',
      type: 'Universal Service',
      desc: 'For postal and mail delivery services',
      includes: [
        'Postal service delivery',
        'Mail collection and distribution',
        'Universal service obligation',
        'Service standards compliance',
      ],
      validity: '3 years',
      fee: 'BWP 30,000 - 150,000',
    },
    {
      id: 'vno',
      name: 'Virtual Network Operator',
      type: 'Alternative',
      desc: 'For operators using existing infrastructure',
      includes: [
        'Network access from NOL operators',
        'Retail services provision',
        'Limited capital requirements',
        'Faster deployment',
      ],
      validity: '2 years',
      fee: 'BWP 20,000 - 100,000',
    },
  ];

  const requirements = [
    {
      category: 'Legal & Administrative',
      items: [
        'Valid business registration',
        'Tax compliance certificate',
        'Board of directors information',
        'Organizational structure',
        'Ultimate beneficial owner disclosure',
      ],
    },
    {
      category: 'Financial',
      items: [
        'Proof of financial capacity',
        'Bank statements (last 2 years)',
        'Audited financial statements',
        'Business plan with revenue projections',
        'Financing proof for capital expenditure',
      ],
    },
    {
      category: 'Technical',
      items: [
        'Network architecture plan',
        'Technology specifications',
        'Service coverage maps',
        'Infrastructure documentation',
        'Quality of service commitments',
      ],
    },
    {
      category: 'Compliance',
      items: [
        'Spectrum usage plan',
        'Environmental impact assessment',
        'Security protocols',
        'Customer service procedures',
        'Consumer protection measures',
      ],
    },
  ];

  const applicationProcess = [
    {
      step: 1,
      title: 'Preliminary Inquiry',
      desc: 'Contact BOCRA to clarify requirements and discuss your project',
      docs: 'Basic company info',
    },
    {
      step: 2,
      title: 'Application Submission',
      desc: 'Submit complete application with all required documentation',
      docs: 'All required documents',
    },
    {
      step: 3,
      title: 'Initial Review',
      desc: 'BOCRA reviews application for completeness and compliance',
      docs: 'Clarifications if needed',
    },
    {
      step: 4,
      title: 'Technical Assessment',
      desc: 'Detailed evaluation of technical plans and feasibility',
      docs: 'Technical documentation',
    },
    {
      step: 5,
      title: 'Financial Assessment',
      desc: 'Review of financial capacity and business viability',
      docs: 'Financial proof',
    },
    {
      step: 6,
      title: 'Site Inspection',
      desc: 'Physical verification of facilities and equipment (if applicable)',
      docs: 'Facility access',
    },
    {
      step: 7,
      title: 'License Issuance',
      desc: 'Approval and license certificate issuance with conditions',
      docs: 'License agreement signing',
    },
  ];

  const requiredDocuments = [
    'Form BOCRA-001 (License Application Form)',
    'Company registration certificate',
    'Tax clearance certificate',
    'Board of directors credentials',
    'Audited financial statements (last 2 years)',
    'Business plan and financial projections',
    'Network architecture and technical specifications',
    'Service coverage maps',
    'Environmental impact assessment',
    'Security and safety protocols',
    'Consumer complaint handling procedure',
    'Evidence of capital availability',
    'Spectrum usage plan (if applicable)',
    'Legal opinion on licensing requirements',
    'CVs of key technical personnel',
  ];

  const processingTimelines = [
    { type: 'National Operator License', timeline: '60-90 days' },
    { type: 'Class A License', timeline: '45-60 days' },
    { type: 'Class B License', timeline: '30-45 days' },
    { type: 'Broadcasting License', timeline: '45-60 days' },
    { type: 'Postal Service License', timeline: '30-45 days' },
    { type: 'Virtual Network Operator', timeline: '20-30 days' },
  ];

  const renewalInfo = [
    {
      aspect: 'Renewal Timing',
      detail: 'Applications must be submitted 90 days before license expiry',
    },
    {
      aspect: 'Requirements',
      detail: 'Similar to initial application with updated financial and technical information',
    },
    {
      aspect: 'Fees',
      detail: 'Renewal fees are similar to initial licensing with compliance record consideration',
    },
    {
      aspect: 'Conditions',
      detail: 'May include new or modified conditions based on regulatory changes',
    },
  ];

  return (
    <>
      <Helmet>
        <title>Licensing | BOCRA</title>
        <meta name="description" content="Learn about BOCRA licensing requirements, application process, and license types for telecommunications and broadcasting operators." />
      </Helmet>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-bocra-telecom to-bocra-broadcast text-black py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4 text-black">Operator Licensing</h1>
          <p className="text-xl text-black/90 max-w-2xl">
            Transparent licensing framework for telecommunications, broadcasting, postal, and internet service operators in Botswana.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16 space-y-16">
        {/* Quick Stats */}
        <section className="grid md:grid-cols-4 gap-6">
          {[
            { label: 'License Types', value: '6' },
            { label: 'Avg Processing', value: '30-90 days' },
            { label: 'Active Licenses', value: '50+' },
            { label: 'License Validity', value: '2-5 years' },
          ].map((stat, idx) => (
            <Card key={idx}>
              <CardContent className="py-8 text-center">
                <p className="text-bocra-text-secondary text-sm mb-2">{stat.label}</p>
                <p className="text-3xl font-bold text-bocra-teal">{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </section>

        {/* License Types */}
        <section>
          <h2 className="text-3xl font-bold mb-8 text-bocra-text-primary">License Types</h2>
          <p className="text-bocra-text-secondary mb-8 max-w-3xl">
            BOCRA offers multiple license categories to meet the diverse needs of operators across different service sectors.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {licenseTypes.map((license) => (
              <Card key={license.id} className="hover:shadow-lg transition-all hover:border-bocra-teal">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-lg">{license.name}</CardTitle>
                    <span className="text-xs font-semibold bg-bocra-teal/10 text-bocra-teal px-2 py-1 rounded">
                      {license.type}
                    </span>
                  </div>
                  <CardDescription>{license.desc}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-xs text-bocra-text-secondary font-semibold mb-2">INCLUDES:</p>
                    <ul className="space-y-1 text-sm">
                      {license.includes.slice(0, 2).map((item, i) => (
                        <li key={i} className="flex gap-2">
                          <CheckCircle2 className="w-4 h-4 text-bocra-teal flex-shrink-0 mt-0.5" />
                          <span className="text-bocra-text-secondary">{item}</span>
                        </li>
                      ))}
                      {license.includes.length > 2 && (
                        <li className="text-xs text-bocra-teal font-semibold">+{license.includes.length - 2} more</li>
                      )}
                    </ul>
                  </div>
                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-bocra-text-secondary">Validity:</span>
                      <span className="font-semibold text-bocra-text-primary">{license.validity}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-bocra-text-secondary">License Fee:</span>
                      <span className="font-semibold text-bocra-teal">{license.fee}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Eligibility Requirements */}
        <section>
          <h2 className="text-3xl font-bold mb-8 text-bocra-text-primary">Eligibility Requirements</h2>
          <p className="text-bocra-text-secondary mb-8 max-w-3xl">
            All applicants must meet the following requirements across multiple categories.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {requirements.map((req, idx) => (
              <Card key={idx}>
                <CardHeader>
                  <CardTitle className="text-bocra-teal">{req.category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {req.items.map((item, i) => (
                      <li key={i} className="flex gap-2 text-sm">
                        <CheckCircle2 className="w-5 h-5 text-bocra-forest-green flex-shrink-0 mt-0.5" />
                        <span className="text-bocra-text-secondary">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Required Documents */}
        <section>
          <h2 className="text-3xl font-bold mb-8 text-bocra-text-primary">Required Documents Checklist</h2>
          <Card>
            <CardContent className="py-8">
              <div className="grid md:grid-cols-2 gap-4">
                {requiredDocuments.map((doc, idx) => (
                  <div key={idx} className="flex gap-3 p-3 hover:bg-bocra-bgLightGrey rounded transition-colors">
                    <input type="checkbox" className="w-5 h-5 text-bocra-teal rounded flex-shrink-0 cursor-pointer" />
                    <span className="text-bocra-text-secondary text-sm">{doc}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8 pt-6 border-t">
                <Button variant="outline" className="gap-2">
                  <Download className="w-4 h-4" />
                  Download Full Checklist PDF
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Application Process */}
        <section>
          <h2 className="text-3xl font-bold mb-8 text-bocra-text-primary">Application Process</h2>
          <div className="space-y-4">
            {applicationProcess.map((step, idx) => (
              <div key={idx}>
                <Card className="overflow-hidden">
                  <div className="flex items-start gap-6 p-6 md:p-8">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-bocra-teal text-white font-bold">
                        {step.step}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-bocra-text-primary mb-2">{step.title}</h4>
                      <p className="text-bocra-text-secondary mb-3">{step.desc}</p>
                      <div className="text-sm text-bocra-text-secondary bg-bocra-bgLightGrey px-3 py-2 rounded inline-block">
                        📋 {step.docs}
                      </div>
                    </div>
                  </div>
                </Card>
                {idx < applicationProcess.length - 1 && (
                  <div className="flex justify-center py-2">
                    <div className="w-1 h-4 bg-bocra-teal/30"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Processing Times & Fees */}
        <section>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold mb-6 text-bocra-text-primary flex gap-2">
                <Clock className="w-6 h-6 text-bocra-teal" />
                Processing Timelines
              </h2>
              <div className="space-y-3">
                {processingTimelines.map((item, idx) => (
                  <Card key={idx}>
                    <CardContent className="py-4">
                      <p className="text-sm font-semibold text-bocra-text-primary mb-1">{item.type}</p>
                      <p className="text-sm text-bocra-teal font-bold">{item.timeline}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-6 text-bocra-text-primary flex gap-2">
                <AlertCircle className="w-6 h-6 text-bocra-forest-green" />
                Important Notes
              </h2>
              <div className="space-y-4">
                <Card className="border-bocra-forest-green/20 bg-bocra-forest-green/5">
                  <CardContent className="py-4">
                    <p className="font-semibold text-bocra-text-primary text-sm mb-2">📅 Timeline Starts</p>
                    <p className="text-sm text-bocra-text-secondary">
                      Processing timeline begins after complete application submission and initial review.
                    </p>
                  </CardContent>
                </Card>
                <Card className="border-bocra-teal/20 bg-bocra-teal/5">
                  <CardContent className="py-4">
                    <p className="font-semibold text-bocra-text-primary text-sm mb-2">⏸️ Timeline Extension</p>
                    <p className="text-sm text-bocra-text-secondary">
                      Timeline may extend if additional information or site inspections are required.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* License Renewal */}
        <section>
          <h2 className="text-3xl font-bold mb-8 text-bocra-text-primary">License Renewal</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {renewalInfo.map((info, idx) => (
              <Card key={idx}>
                <CardHeader>
                  <CardTitle className="text-lg">{info.aspect}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-bocra-text-secondary">{info.detail}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* License Obligations */}
        <section className="bg-bocra-bgLightGrey p-8 rounded-lg border">
          <h2 className="text-2xl font-bold mb-6 text-bocra-text-primary">License Holder Obligations</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              'Comply with all license conditions and BOCRA regulations',
              'Maintain network quality standards as specified',
              'Report any material changes to BOCRA within 30 days',
              'Participate in regulatory consultations',
              'Submit audited financial statements annually',
              'Maintain service availability levels (minimum 99%)',
              'Implement consumer protection procedures',
              'Pay license fees and regulatory charges on time',
            ].map((obligation, idx) => (
              <div key={idx} className="flex gap-3">
                <FileCheck className="w-5 h-5 text-bocra-teal flex-shrink-0 mt-0.5" />
                <span className="text-bocra-text-secondary">{obligation}</span>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section>
          <h2 className="text-3xl font-bold mb-8 text-bocra-text-primary">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                q: 'How much does a license cost?',
                a: 'License fees vary by type, ranging from BWP 20,000 to 2,000,000. See the license types section for specific amounts.',
              },
              {
                q: 'How long is a license valid?',
                a: 'Most licenses are valid for 2-5 years depending on the type. Renewal applications must be submitted 90 days before expiry.',
              },
              {
                q: 'Can I apply for multiple license types?',
                a: 'Yes, you can hold multiple licenses if you meet the requirements for each. A separate application is required for each license type.',
              },
              {
                q: 'What happens if I cannot meet a deadline?',
                a: 'Contact BOCRA immediately. Extensions may be granted for valid reasons. Failure to respond may result in application rejection.',
              },
              {
                q: 'Can I transfer my license to another person?',
                a: 'License transfers require BOCRA approval and may be subject to new technical and financial assessments.',
              },
              {
                q: 'What are the penalties for non-compliance?',
                a: 'Violations can result in fines, license suspension, or revocation depending on the severity and nature of the breach.',
              },
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
          <h2 className="text-2xl font-bold mb-4 text-bocra-text-primary">Ready to Apply?</h2>
          <p className="text-bocra-text-secondary mb-8 max-w-2xl mx-auto">
            Download our application forms and detailed guidelines, or contact our licensing team for guidance on the right license for your business.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/contact">
              <Button className="bg-bocra-teal hover:bg-bocra-teal/90 gap-2">
                Start Your Application <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Download Forms
            </Button>
          </div>
        </section>
      </div>
    </>
  );
}
