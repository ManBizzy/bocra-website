import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, CheckCircle2, Clock, Shield, Phone, Mail, MessageSquare, FileText, ArrowRight, Send, Signal, DollarSign, Users, AlertTriangle, HelpCircle, TrendingUp, Folder } from 'lucide-react';

export default function Complaints() {
  const [formData, setFormData] = useState({
    complaintType: '',
    operator: '',
    description: '',
    dateOccurred: '',
    yourName: '',
    phone: '',
    email: '',
    reference: '',
  });

  const complaintTypes = [
    {
      id: 'quality',
      title: 'Quality of Service',
      desc: 'Poor voice/data quality, frequent disconnections, slow speeds',
      icon: Signal,
    },
    {
      id: 'billing',
      title: 'Billing Issues',
      desc: 'Overcharging, disputed bill amounts, incorrect invoices',
      icon: DollarSign,
    },
    {
      id: 'customer',
      title: 'Customer Service',
      desc: 'Poor customer support, unresolved issues, rude staff',
      icon: Users,
    },
    {
      id: 'contract',
      title: 'Contract Violations',
      desc: 'Breach of service agreement, unfair terms, unauthorized charges',
      icon: FileText,
    },
    {
      id: 'coverage',
      title: 'Coverage Issues',
      desc: 'No signal, poor coverage in specific areas',
      icon: AlertCircle,
    },
    {
      id: 'harassment',
      title: 'Harassment/Harassment',
      desc: 'Unwanted calls, SMS, or other abusive communication',
      icon: AlertTriangle,
    },
    {
      id: 'refund',
      title: 'Refund Requests',
      desc: 'Service credit requests, refund claims',
      icon: DollarSign,
    },
    {
      id: 'other',
      title: 'Other',
      desc: 'Any other complaints not listed above',
      icon: HelpCircle,
    },
  ];

  const operators = [
    'Botswana Telecommunications Corporation (BTC)',
    'Teledynamics',
    'Mascom Wireless',
    'Orange Botswana',
    'Afrimax',
    'Other (specify in description)',
  ];

  const processSteps = [
    {
      step: 1,
      title: 'Complaint Received',
      desc: 'Your complaint is logged and a reference number is issued',
      timeline: 'Immediate',
    },
    {
      step: 2,
      title: 'Initial Review',
      desc: 'BOCRA reviews complaint for completeness and admissibility',
      timeline: '3-5 days',
    },
    {
      step: 3,
      title: 'Investigation',
      desc: 'Operator is requested to provide information and respond to complaint',
      timeline: '10-14 days',
    },
    {
      step: 4,
      title: 'Mediation',
      desc: 'BOCRA works with both parties to find resolution',
      timeline: '15-21 days',
    },
    {
      step: 5,
      title: 'Resolution',
      desc: 'Final decision is communicated to complainant',
      timeline: '20-30 days',
    },
  ];

  const resolutionChannels = [
    {
      channel: 'Live Chat',
      icon: MessageSquare,
      availability: 'Monday - Friday, 8:00 AM - 5:00 PM',
      desc: 'Chat with our support team in real-time',
    },
    {
      channel: 'Phone',
      icon: Phone,
      availability: '+267 XXX-XXXX',
      desc: 'Call our complaints hotline for immediate assistance',
    },
    {
      channel: 'Email',
      icon: Mail,
      availability: 'complaints@bocra.org.bw',
      desc: 'Send detailed complaint emails with attachments',
    },
    {
      channel: 'Online Form',
      icon: FileText,
      availability: 'Available 24/7',
      desc: 'Submit complaints using our secure online form',
    },
  ];

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    // Handle form submission
    console.log('Complaint submitted:', formData);
  };

  return (
    <>
      <Helmet>
        <title>File a Complaint | BOCRA</title>
        <meta name="description" content="File a complaint against telecommunications operators with BOCRA. Easy online submission, real-time tracking." />
      </Helmet>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-bocra-postal to-bocra-broadcast text-black py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4 text-black">File a Complaint</h1>
          <p className="text-xl text-black/90 max-w-2xl">
            We're here to help. If you have an issue with your telecom provider, BOCRA will investigate and work toward resolution.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16 space-y-16">
        {/* Quick Stats */}
        <section className="grid md:grid-cols-4 gap-6">
          {[
            { label: 'Complaints Resolved', value: '500+', icon: CheckCircle2 },
            { label: 'Avg Resolution Time', value: '21 days', icon: Clock },
            { label: 'Success Rate', value: '85%', icon: TrendingUp },
            { label: 'Active Cases', value: '45', icon: Folder },
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

        {/* Why BOCRA */}
        <section>
          <h2 className="text-3xl font-bold mb-8 text-bocra-text-primary">Why File a Complaint with BOCRA?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: 'Independent Regulator',
                desc: 'BOCRA is an independent authority that regulates all telecom operators fairly and impartially.',
                icon: Shield,
              },
              {
                title: 'No Cost to Consumers',
                desc: 'Complaint filing and investigation are completely free. You pay nothing to get help.',
                icon: CheckCircle2,
              },
              {
                title: 'Proven Results',
                desc: 'We have successfully mediated and resolved thousands of consumer complaints.',
                icon: CheckCircle2,
              },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <Card key={idx}>
                  <CardHeader>
                    <Icon className="w-8 h-8 text-bocra-forest-green mb-2" />
                    <CardTitle>{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-bocra-text-secondary">{item.desc}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Complaint Types */}
        <section>
          <h2 className="text-3xl font-bold mb-8 text-bocra-text-primary">Types of Complaints We Handle</h2>
          <p className="text-bocra-text-secondary mb-8 max-w-3xl">
            BOCRA investigates complaints across all areas of telecommunications, broadcasting, and postal services.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {complaintTypes.map((type) => {
              const TypeIcon = type.icon;
              return (
              <Card key={type.id} className="hover:shadow-lg transition-all hover:border-bocra-teal">
                <CardHeader>
                  <TypeIcon className="w-8 h-8 text-bocra-teal mb-2" />
                  <CardTitle className="text-lg">{type.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-bocra-text-secondary">{type.desc}</p>
                </CardContent>
              </Card>
            );
            })}
          </div>
        </section>

        {/* Resolution Channels */}
        <section>
          <h2 className="text-3xl font-bold mb-8 text-bocra-text-primary">How to Reach Us</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {resolutionChannels.map((item, idx) => {
              const Icon = item.icon;
              return (
                <Card key={idx}>
                  <CardHeader>
                    <Icon className="w-6 h-6 text-bocra-teal mb-2" />
                    <CardTitle>{item.channel}</CardTitle>
                    <CardDescription>{item.availability}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-bocra-text-secondary">{item.desc}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Complaint Form */}
        <section>
          <h2 className="text-3xl font-bold mb-8 text-bocra-text-primary">File Your Complaint Online</h2>
          <Card className="border-2 border-bocra-teal/20">
            <CardHeader className="bg-bocra-bgLightGrey">
              <CardTitle>Complaint Form</CardTitle>
              <CardDescription>Fill in all required fields. BOCRA will contact you within 2 business days.</CardDescription>
            </CardHeader>
            <CardContent className="pt-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Complaint Type */}
                  <div>
                    <label className="block text-sm font-semibold text-bocra-text-primary mb-2">
                      Complaint Category *
                    </label>
                    <select
                      name="complaintType"
                      value={formData.complaintType}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-bocra-border rounded-lg focus:ring-2 focus:ring-bocra-teal focus:border-transparent outline-none"
                    >
                      <option value="">Select a category</option>
                      {complaintTypes.map((type) => (
                        <option key={type.id} value={type.id}>
                          {type.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Operator */}
                  <div>
                    <label className="block text-sm font-semibold text-bocra-text-primary mb-2">
                      Service Provider *
                    </label>
                    <select
                      name="operator"
                      value={formData.operator}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-bocra-border rounded-lg focus:ring-2 focus:ring-bocra-teal focus:border-transparent outline-none"
                    >
                      <option value="">Select service provider</option>
                      {operators.map((op) => (
                        <option key={op} value={op}>
                          {op}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Date Occurred */}
                  <div>
                    <label className="block text-sm font-semibold text-bocra-text-primary mb-2">
                      When did this occur? *
                    </label>
                    <input
                      type="date"
                      name="dateOccurred"
                      value={formData.dateOccurred}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-bocra-border rounded-lg focus:ring-2 focus:ring-bocra-teal focus:border-transparent outline-none"
                    />
                  </div>

                  {/* Reference Number */}
                  <div>
                    <label className="block text-sm font-semibold text-bocra-text-primary mb-2">
                      Reference Number (if applicable)
                    </label>
                    <input
                      type="text"
                      name="reference"
                      placeholder="e.g., complaint #, case #"
                      value={formData.reference}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-bocra-border rounded-lg focus:ring-2 focus:ring-bocra-teal focus:border-transparent outline-none"
                    />
                  </div>
                </div>

                {/* Complaint Description */}
                <div>
                  <label className="block text-sm font-semibold text-bocra-text-primary mb-2">
                    Complaint Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    placeholder="Please provide detailed information about your complaint..."
                    rows={6}
                    className="w-full px-4 py-2 border border-bocra-border rounded-lg focus:ring-2 focus:ring-bocra-teal focus:border-transparent outline-none resize-none"
                  />
                  <p className="text-xs text-bocra-text-secondary mt-2">
                    Include dates, times, and any evidence supporting your complaint.
                  </p>
                </div>

                {/* Personal Information */}
                <div className="bg-bocra-bgLightGrey p-6 rounded-lg">
                  <h4 className="font-semibold text-bocra-text-primary mb-4">Your Information</h4>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-bocra-text-primary mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="yourName"
                        value={formData.yourName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-bocra-border rounded-lg focus:ring-2 focus:ring-bocra-teal focus:border-transparent outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-bocra-text-primary mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        placeholder="+267..."
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-bocra-border rounded-lg focus:ring-2 focus:ring-bocra-teal focus:border-transparent outline-none"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-bocra-text-primary mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-bocra-border rounded-lg focus:ring-2 focus:ring-bocra-teal focus:border-transparent outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Consent & Submit */}
                <div className="space-y-4">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" required className="w-5 h-5 mt-1 text-bocra-teal rounded" />
                    <span className="text-sm text-bocra-text-secondary">
                      I understand that BOCRA will investigate my complaint and contact me with findings.
                    </span>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" required className="w-5 h-5 mt-1 text-bocra-teal rounded" />
                    <span className="text-sm text-bocra-text-secondary">
                      I consent to BOCRA using the information provided for complaint investigation and resolution.
                    </span>
                  </label>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-bocra-teal hover:bg-bocra-teal/90 text-white gap-2 h-12 text-base"
                >
                  <Send className="w-4 h-4" />
                  Submit Complaint
                </Button>
              </form>
            </CardContent>
          </Card>
        </section>

        {/* What Happens Next */}
        <section>
          <h2 className="text-3xl font-bold mb-8 text-bocra-text-primary">What Happens After You Complain?</h2>
          <div className="space-y-4">
            {processSteps.map((step, idx) => (
              <div key={idx}>
                <Card className="overflow-hidden">
                  <div className="flex items-start gap-6 p-6 md:p-8">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-bocra-forest-green text-white font-bold">
                        {step.step}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-bocra-text-primary mb-2">{step.title}</h4>
                      <p className="text-bocra-text-secondary mb-3">{step.desc}</p>
                      <div className="text-sm text-bocra-text-secondary bg-bocra-bgLightGrey px-3 py-2 rounded inline-flex gap-2 items-center">
                        <Clock className="w-4 h-4" />
                        {step.timeline}
                      </div>
                    </div>
                  </div>
                </Card>
                {idx < processSteps.length - 1 && (
                  <div className="flex justify-center py-2">
                    <div className="w-1 h-4 bg-bocra-forest-green/30"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Complaint Tracking */}
        <section className="bg-bocra-bgLightGrey p-8 rounded-lg border border-bocra-teal/20">
          <h2 className="text-2xl font-bold mb-4 text-bocra-text-primary flex gap-2 items-center">
            <FileText className="w-6 h-6 text-bocra-teal" />
            Track Your Complaint
          </h2>
          <p className="text-bocra-text-secondary mb-6">
            Once you submit your complaint, you'll receive a reference number via email. Use this number to track your complaint status at any time.
          </p>
          <Button className="bg-bocra-teal hover:bg-bocra-teal/90 gap-2">
            Track Complaint Status <ArrowRight className="w-4 h-4" />
          </Button>
        </section>

        {/* FAQ */}
        <section>
          <h2 className="text-3xl font-bold mb-8 text-bocra-text-primary">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                q: 'How long does complaint investigation take?',
                a: 'Most complaints are resolved within 20-30 days. Complex cases may take longer.',
              },
              {
                q: 'Do I need to try complaining to the operator first?',
                a: 'No, you may file with BOCRA directly. However, most operators have internal complaint procedures first.',
              },
              {
                q: 'What if the operator disagrees with BOCRAs findings?',
                a: 'BOCRA decisions are binding. Operators must comply or face penalties.',
              },
              {
                q: 'Can I file a complaint anonymously?',
                a: 'No, we need your contact information to communicate progress. We protect your privacy.',
              },
              {
                q: 'Is there a deadline for filing complaints?',
                a: 'Complaints should ideally be filed within 3 months of the issue. We may accept later complaints on a case-by-case basis.',
              },
              {
                q: 'What compensation can I receive?',
                a: 'This depends on the complaint. Compensation may include service credits, refunds, or other remedies.',
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

        {/* Important Info */}
        <section className="bg-bocra-dark-maroon/5 border border-bocra-dark-maroon/20 p-8 rounded-lg">
          <div className="flex gap-4">
            <AlertCircle className="w-6 h-6 text-bocra-dark-maroon flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-bocra-text-primary mb-2">Important Information</h3>
              <ul className="space-y-2 text-sm text-bocra-text-secondary">
                <li>• All information provided in complaints is kept confidential</li>
                <li>• Complaints are investigated impartially by BOCRA staff</li>
                <li>• You will not be penalized for filing a complaint</li>
                <li>• Investigation results will be communicated to you in writing</li>
                <li>• Frivolous or malicious complaints may be rejected</li>
              </ul>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-r from-bocra-forest-green/10 to-bocra-dark-maroon/10 py-12 px-8 rounded-lg text-center border border-bocra-forest-green/20">
          <h2 className="text-2xl font-bold mb-4 text-bocra-text-primary">Need Help with Your Complaint?</h2>
          <p className="text-bocra-text-secondary mb-8 max-w-2xl mx-auto">
            Our complaints team is ready to assist. Contact us via phone, email, or live chat for guidance.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button className="bg-bocra-forest-green hover:bg-bocra-forest-green/90 gap-2">
              Call Our Hotline <Phone className="w-4 h-4" />
            </Button>
            <Button variant="outline">
              Email Us
            </Button>
          </div>
        </section>
      </div>
    </>
  );
}
