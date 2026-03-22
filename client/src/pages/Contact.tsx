import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, AlertCircle, CheckCircle2, Linkedin, Facebook, Twitter } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// BOCRA office locations
const OFFICE_LOCATIONS = [
  {
    id: 1,
    name: 'Head Office',
    address: 'Unit 5, Digital Park, Tonota Road',
    city: 'Gaborone',
    phone: '+267-3640800',
    email: 'info@bocra.org.bw',
    hours: 'Monday - Friday: 8:00 AM - 5:00 PM',
    icon: MapPin,
  },
  {
    id: 2,
    name: 'Northern Region Office',
    address: 'Plot 4566, Main Street',
    city: 'Francistown',
    phone: '+267-2410450',
    email: 'francistown@bocra.org.bw',
    hours: 'Monday - Friday: 8:00 AM - 4:30 PM',
    icon: MapPin,
  },
  {
    id: 3,
    name: 'Eastern Region Office',
    address: 'Office Complex, Industrial Area',
    city: 'Maun',
    phone: '+267-6800220',
    email: 'maun@bocra.org.bw',
    hours: 'Monday - Friday: 8:00 AM - 4:30 PM',
    icon: MapPin,
  },
];

// Contact channels
const CONTACT_CHANNELS = [
  {
    id: 1,
    label: 'Telephone',
    value: '+267-3640800 (Toll-Free: 1800)',
    icon: Phone,
    description: 'Call our main office for general inquiries',
  },
  {
    id: 2,
    label: 'Email',
    value: 'info@bocra.org.bw',
    icon: Mail,
    description: 'Send detailed inquiries or documents',
  },
  {
    id: 3,
    label: 'Complaints',
    value: '+267-3640800 ext. 2010',
    icon: AlertCircle,
    description: 'Dedicated complaints line available',
  },
];

// Social media
const SOCIAL_MEDIA = [
  {
    name: 'Facebook',
    icon: Facebook,
    url: 'https://facebook.com/bocrabw',
    color: 'text-blue-600',
  },
  {
    name: 'Twitter',
    icon: Twitter,
    url: 'https://twitter.com/bocrabw',
    color: 'text-blue-400',
  },
  {
    name: 'LinkedIn',
    icon: Linkedin,
    url: 'https://linkedin.com/company/bocra',
    color: 'text-blue-700',
  },
];

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    // Simulate form submission
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });

      // Reset success message after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false);
      }, 5000);
    }, 1500);
  };

  return (
    <>
      <Helmet>
        <title>Contact Us | BOCRA</title>
        <meta name="description" content="Get in touch with the Botswana Communications Regulatory Authority. Find office locations, phone numbers, and contact information." />
        <meta property="og:title" content="Contact BOCRA" />
        <meta property="og:description" content="Contact information and office locations for BOCRA" />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="w-full">
        {/* Hero Section */}
        <section className="w-full bg-gradient-to-r from-bocra-teal to-bocra-forest-green py-16 md:py-20">
          <div className="container">
            <h1 className="text-4xl md:text-5xl font-bold text-black mb-4">Contact Us</h1>
            <p className="text-xl text-black/90">Get in touch with BOCRA for inquiries, complaints, or feedback</p>
          </div>
        </section>

        {/* Quick Contact Channels */}
        <section className="w-full bg-white py-12 md:py-16">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {CONTACT_CHANNELS.map((channel) => {
                const Icon = channel.icon;
                return (
                  <Card key={channel.id} className="p-6 text-center hover:shadow-lg transition-shadow">
                    <Icon className="w-8 h-8 text-bocra-teal mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-bocra-text-primary mb-2">{channel.label}</h3>
                    <p className="text-bocra-text-secondary text-sm mb-2">{channel.description}</p>
                    <p className="font-medium text-bocra-teal">{channel.value}</p>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Contact Form & Office Locations */}
        <section className="w-full bg-bocra-light-grey py-12 md:py-16">
          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Contact Form */}
              <div className="lg:col-span-2">
                <Card className="p-8">
                  <h2 className="text-2xl font-bold text-bocra-text-primary mb-6">Send us a Message</h2>

                  {isSubmitted && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-green-700">Message sent successfully!</h4>
                        <p className="text-green-600 text-sm">Thank you for contacting BOCRA. We will respond within 24 hours.</p>
                      </div>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name */}
                    <div>
                      <label className="block text-sm font-medium text-bocra-text-primary mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your full name"
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-bocra-teal focus:border-transparent transition-all ${
                          errors.name ? 'border-red-500 bg-red-50' : 'border-bocra-light-grey'
                        }`}
                      />
                      {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-bocra-text-primary mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="your.email@example.com"
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-bocra-teal focus:border-transparent transition-all ${
                          errors.email ? 'border-red-500 bg-red-50' : 'border-bocra-light-grey'
                        }`}
                      />
                      {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-medium text-bocra-text-primary mb-2">
                        Phone Number (Optional)
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+267 76 500 200"
                        className="w-full px-4 py-3 border border-bocra-light-grey rounded-lg focus:outline-none focus:ring-2 focus:ring-bocra-teal focus:border-transparent transition-all"
                      />
                    </div>

                    {/* Subject */}
                    <div>
                      <label className="block text-sm font-medium text-bocra-text-primary mb-2">
                        Subject *
                      </label>
                      <select
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-bocra-teal focus:border-transparent transition-all ${
                          errors.subject ? 'border-red-500 bg-red-50' : 'border-bocra-light-grey'
                        }`}
                      >
                        <option value="">Select a subject</option>
                        <option value="complaint">File a Complaint</option>
                        <option value="licensing">Licensing Inquiry</option>
                        <option value="domain">Domain Registry Question</option>
                        <option value="spectrum">Spectrum Allocation</option>
                        <option value="regulation">Regulatory Question</option>
                        <option value="other">Other Inquiry</option>
                      </select>
                      {errors.subject && <p className="text-red-600 text-sm mt-1">{errors.subject}</p>}
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-sm font-medium text-bocra-text-primary mb-2">
                        Message *
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Please provide details about your inquiry..."
                        rows={6}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-bocra-teal focus:border-transparent transition-all resize-none ${
                          errors.message ? 'border-red-500 bg-red-50' : 'border-bocra-light-grey'
                        }`}
                      />
                      {errors.message && <p className="text-red-600 text-sm mt-1">{errors.message}</p>}
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4">
                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-bocra-teal text-white hover:bg-bocra-forest-green transition-colors flex items-center justify-center gap-2 font-semibold py-3"
                      >
                        {isLoading ? (
                          <>
                            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            Send Message
                          </>
                        )}
                      </Button>
                    </div>

                    <p className="text-xs text-bocra-text-muted text-center">
                      * Required fields. We'll respond within 24 hours.
                    </p>
                  </form>
                </Card>
              </div>

              {/* Office Locations */}
              <div className="lg:col-span-1 space-y-6">
                <h2 className="text-2xl font-bold text-bocra-text-primary">Office Locations</h2>

                {OFFICE_LOCATIONS.map((office) => (
                  <Card key={office.id} className="p-6 hover:shadow-lg transition-shadow">
                    <h3 className="font-semibold text-bocra-text-primary mb-4">{office.name}</h3>

                    <div className="space-y-3 text-sm">
                      {/* Address */}
                      <div className="flex gap-3">
                        <MapPin className="w-4 h-4 text-bocra-teal flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-bocra-text-secondary">{office.address}</p>
                          <p className="text-bocra-text-secondary">{office.city}</p>
                        </div>
                      </div>

                      {/* Phone */}
                      <div className="flex gap-3">
                        <Phone className="w-4 h-4 text-bocra-teal flex-shrink-0 mt-0.5" />
                        <a href={`tel:${office.phone}`} className="text-bocra-teal hover:underline">
                          {office.phone}
                        </a>
                      </div>

                      {/* Email */}
                      <div className="flex gap-3">
                        <Mail className="w-4 h-4 text-bocra-teal flex-shrink-0 mt-0.5" />
                        <a href={`mailto:${office.email}`} className="text-bocra-teal hover:underline break-all">
                          {office.email}
                        </a>
                      </div>

                      {/* Hours */}
                      <div className="flex gap-3">
                        <Clock className="w-4 h-4 text-bocra-forest-green flex-shrink-0 mt-0.5" />
                        <p className="text-bocra-text-secondary">{office.hours}</p>
                      </div>
                    </div>
                  </Card>
                ))}

                {/* Social Media */}
                <div className="pt-4 border-t border-bocra-light-grey">
                  <h4 className="font-semibold text-bocra-text-primary mb-4">Follow BOCRA</h4>
                  <div className="flex gap-4">
                    {SOCIAL_MEDIA.map((social) => {
                      const Icon = social.icon;
                      return (
                        <a
                          key={social.name}
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`${social.color} hover:opacity-70 transition-opacity`}
                          title={social.name}
                        >
                          <Icon className="w-6 h-6" />
                        </a>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Additional Information */}
        <section className="w-full bg-white py-12 md:py-16">
          <div className="container">
            <h2 className="text-3xl font-bold text-bocra-text-primary mb-8">Contacting BOCRA</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-bocra-text-primary mb-4">For Complaints</h3>
                <p className="text-bocra-text-secondary mb-3">
                  If you have a complaint about a telecommunications service provider, please visit our dedicated complaints portal or call our complaints line:
                </p>
                <ul className="space-y-2 text-sm text-bocra-text-secondary">
                  <li>• <strong>Phone:</strong> +267-3640800 ext. 2010</li>
                  <li>• <strong>Email:</strong> complaints@bocra.org.bw</li>
                  <li>• <strong>Online Portal:</strong> complaints.bocra.org.bw</li>
                  <li>• <strong>Office Hours:</strong> Monday - Friday, 8:00 AM - 5:00 PM</li>
                </ul>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold text-bocra-text-primary mb-4">For Licensing Inquiries</h3>
                <p className="text-bocra-text-secondary mb-3">
                  For telecommunications operator licensing, spectrum allocation, or domain registration inquiries:
                </p>
                <ul className="space-y-2 text-sm text-bocra-text-secondary">
                  <li>• <strong>Email:</strong> licensing@bocra.org.bw</li>
                  <li>• <strong>Phone:</strong> +267-3640800</li>
                  <li>• <strong>Department:</strong> Licensing & Authorizations</li>
                  <li>• <strong>Response Time:</strong> 5 business days</li>
                </ul>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold text-bocra-text-primary mb-4">For General Inquiries</h3>
                <p className="text-bocra-text-secondary mb-3">
                  For general questions about BOCRA services, regulations, or to request information:
                </p>
                <ul className="space-y-2 text-sm text-bocra-text-secondary">
                  <li>• <strong>Email:</strong> info@bocra.org.bw</li>
                  <li>• <strong>Phone:</strong> +267-3640800</li>
                  <li>• <strong>Visit:</strong> Head office in Gaborone</li>
                  <li>• <strong>Response Time:</strong> 3-5 business days</li>
                </ul>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold text-bocra-text-primary mb-4">Privacy & Data Protection</h3>
                <p className="text-bocra-text-secondary mb-3">
                  When contacting BOCRA, your personal information is handled according to our privacy policy:
                </p>
                <ul className="space-y-2 text-sm text-bocra-text-secondary">
                  <li>• Data is only used for inquiry resolution</li>
                  <li>• Information is kept confidential</li>
                  <li>• We comply with data protection laws</li>
                  <li>• <strong>Privacy Policy:</strong> bocra.org.bw/privacy</li>
                </ul>
              </Card>
            </div>
          </div>
        </section>

        {/* Map Section (Placeholder) */}
        <section className="w-full bg-bocra-light-grey py-12 md:py-16">
          <div className="container">
            <h2 className="text-3xl font-bold text-bocra-text-primary mb-8">Visit Our Offices</h2>
            <Card className="bg-white p-0 overflow-hidden h-96">
              <div className="w-full h-full bg-gradient-to-br from-bocra-light-grey to-bocra-light-grey flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-bocra-teal mx-auto mb-3 opacity-50" />
                  <p className="text-bocra-text-muted">Interactive map would be displayed here</p>
                  <p className="text-sm text-bocra-text-secondary mt-2">
                    Visit one of our three regional offices across Botswana
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </section>
      </div>
    </>
  );
}
