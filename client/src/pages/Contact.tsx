import { type FormEvent, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  ArrowRight,
  CheckCircle2,
  Mail,
  MapPin,
  Phone,
  Printer,
  SendHorizontal,
} from 'lucide-react';
import { CONTACT_DETAILS, SITE_DESCRIPTION } from '@/const';
import { submitContactForm } from '@/lib/supabase';
import type { ContactForm } from '@/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

const INITIAL_FORM: ContactForm = {
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
};

export default function Contact() {
  const [form, setForm] = useState<ContactForm>(INITIAL_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const updateField = (field: keyof ContactForm, value: string) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone?.trim() || undefined,
      subject: form.subject.trim(),
      message: form.message.trim(),
    };

    if (!payload.name || !payload.email || !payload.subject || !payload.message) {
      toast.error('Please complete all required fields.');
      return;
    }

    setIsSubmitting(true);

    try {
      await submitContactForm(payload);
      setForm(INITIAL_FORM);
      setHasSubmitted(true);
      toast.success('Your message has been sent.');
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'We could not send your message.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Contact | BOCRA</title>
        <meta
          name="description"
          content="Contact BOCRA for general enquiries, licensing questions, consultations, and service guidance."
        />
        <meta property="og:title" content="Contact | BOCRA" />
        <meta
          property="og:description"
          content="Contact BOCRA for general enquiries, licensing questions, consultations, and service guidance."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${window.location.origin}/contact`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Contact | BOCRA" />
        <meta name="twitter:description" content={SITE_DESCRIPTION} />
      </Helmet>

      <div className="bg-bocra-light-grey">
        <section className="border-b border-bocra-border bg-white">
          <div className="container py-12 md:py-16">
            <div className="max-w-3xl space-y-4">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-bocra-teal">
                Get In Touch
              </p>
              <h1 className="text-4xl font-bold text-bocra-text-primary md:text-5xl">
                Contact BOCRA
              </h1>
              <p className="text-lg text-bocra-text-secondary">
                Send a general enquiry, request guidance on BOCRA services, or
                use the office details and map below to visit the BOCRA head
                office in Gaborone.
              </p>
            </div>
          </div>
        </section>

        <section className="container py-8 md:py-10">
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            <Card className="border-0 bg-white p-6 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-bocra-teal/10 text-bocra-teal">
                <Mail className="h-5 w-5" />
              </div>
              <h2 className="mt-4 text-xl font-semibold text-bocra-text-primary">
                Email
              </h2>
              <p className="mt-2 text-sm text-bocra-text-secondary">
                General enquiries and requests for follow-up.
              </p>
              <a
                href={CONTACT_DETAILS.emailHref}
                className="mt-4 inline-flex items-center gap-2 font-semibold text-bocra-teal hover:text-bocra-forest-green"
              >
                {CONTACT_DETAILS.email}
                <ArrowRight className="h-4 w-4" />
              </a>
            </Card>

            <Card className="border-0 bg-white p-6 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-bocra-forest-green/10 text-bocra-forest-green">
                <Phone className="h-5 w-5" />
              </div>
              <h2 className="mt-4 text-xl font-semibold text-bocra-text-primary">
                Phone
              </h2>
              <p className="mt-2 text-sm text-bocra-text-secondary">
                Speak to BOCRA for immediate assistance during office hours.
              </p>
              <a
                href={CONTACT_DETAILS.phoneHref}
                className="mt-4 inline-flex items-center gap-2 font-semibold text-bocra-forest-green hover:text-bocra-teal"
              >
                {CONTACT_DETAILS.phoneDisplay}
                <ArrowRight className="h-4 w-4" />
              </a>
            </Card>

            <Card className="border-0 bg-white p-6 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-bocra-dark-maroon/10 text-bocra-dark-maroon">
                <Printer className="h-5 w-5" />
              </div>
              <h2 className="mt-4 text-xl font-semibold text-bocra-text-primary">
                Fax
              </h2>
              <p className="mt-2 text-sm text-bocra-text-secondary">
                Send formal documents or reference material by fax if required.
              </p>
              <a
                href={CONTACT_DETAILS.faxHref}
                className="mt-4 inline-flex items-center gap-2 font-semibold text-bocra-dark-maroon hover:text-bocra-teal"
              >
                {CONTACT_DETAILS.faxDisplay}
                <ArrowRight className="h-4 w-4" />
              </a>
            </Card>

            <Card className="border-0 bg-white p-6 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-bocra-golden-yellow/20 text-bocra-deep-teal">
                <MapPin className="h-5 w-5" />
              </div>
              <h2 className="mt-4 text-xl font-semibold text-bocra-text-primary">
                Location
              </h2>
              <p className="mt-2 text-sm text-bocra-text-secondary">
                Official BOCRA contact point in Botswana.
              </p>
              <div className="mt-4 space-y-1 text-sm text-bocra-text-primary">
                <p className="font-semibold">{CONTACT_DETAILS.officeName}</p>
                {CONTACT_DETAILS.addressLines.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
              <a
                href={CONTACT_DETAILS.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 font-semibold text-bocra-deep-teal hover:text-bocra-teal"
              >
                Open in Google Maps
                <ArrowRight className="h-4 w-4" />
              </a>
            </Card>
          </div>
        </section>

        <section className="container pb-12 md:pb-16">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_360px]">
            <Card className="border-0 bg-white p-6 shadow-sm md:p-8">
              <div className="max-w-2xl">
                <h2 className="text-2xl font-semibold text-bocra-text-primary">
                  Send an Enquiry
                </h2>
                <p className="mt-3 text-bocra-text-secondary">
                  Use this form for general enquiries. For specialized issues,
                  use the direct BOCRA service routes listed on this page.
                </p>
              </div>

              {hasSubmitted && (
                <div className="mt-6 rounded-2xl border border-bocra-forest-green/20 bg-bocra-forest-green/5 p-4 text-sm text-bocra-text-secondary">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 text-bocra-forest-green" />
                    <div>
                      <p className="font-semibold text-bocra-text-primary">
                        Message received
                      </p>
                      <p className="mt-1">
                        BOCRA now has your enquiry in the contact queue. You
                        can send another message below if needed.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="contact-name">Full Name</Label>
                    <Input
                      id="contact-name"
                      type="text"
                      placeholder="Your full name"
                      value={form.name}
                      onChange={(event) => updateField('name', event.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contact-email">Email Address</Label>
                    <Input
                      id="contact-email"
                      type="email"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={(event) => updateField('email', event.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_220px]">
                  <div className="space-y-2">
                    <Label htmlFor="contact-subject">Subject</Label>
                    <Input
                      id="contact-subject"
                      type="text"
                      placeholder="What do you need help with?"
                      value={form.subject}
                      onChange={(event) =>
                        updateField('subject', event.target.value)
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contact-phone">Phone Number</Label>
                    <Input
                      id="contact-phone"
                      type="tel"
                      placeholder="+267..."
                      value={form.phone}
                      onChange={(event) => updateField('phone', event.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact-message">Message</Label>
                  <Textarea
                    id="contact-message"
                    placeholder="Describe your enquiry in enough detail for follow-up."
                    value={form.message}
                    onChange={(event) => updateField('message', event.target.value)}
                    className="min-h-40"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="bg-bocra-teal text-white hover:bg-bocra-teal/90"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                  <SendHorizontal className="h-4 w-4" />
                </Button>
              </form>
            </Card>

            <div className="space-y-6">
              <Card className="border-0 bg-bocra-deep-teal p-6 text-white shadow-sm">
                <h2 className="text-xl font-semibold">Before You Submit</h2>
                <p className="mt-3 text-sm text-white/80">
                  Route specialized requests directly to the right BOCRA
                  service area for faster handling.
                </p>
                <div className="mt-6 space-y-4 text-sm">
                  <a
                    href="/services/complaints"
                    className="flex items-center justify-between rounded-xl bg-white/10 px-4 py-3 transition-colors hover:bg-white/15"
                  >
                    <span>Consumer complaints</span>
                    <ArrowRight className="h-4 w-4" />
                  </a>
                  <a
                    href="/services/licensing"
                    className="flex items-center justify-between rounded-xl bg-white/10 px-4 py-3 transition-colors hover:bg-white/15"
                  >
                    <span>Licensing queries</span>
                    <ArrowRight className="h-4 w-4" />
                  </a>
                  <a
                    href="/consultations"
                    className="flex items-center justify-between rounded-xl bg-white/10 px-4 py-3 transition-colors hover:bg-white/15"
                  >
                    <span>Public consultations</span>
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              </Card>

              <Card className="border-0 bg-white p-6 shadow-sm">
                <div className="overflow-hidden rounded-2xl border border-bocra-border">
                  <div className="aspect-[4/3] bg-bocra-light-grey">
                    <iframe
                      title="BOCRA office location map"
                      src={CONTACT_DETAILS.mapsEmbedUrl}
                      className="h-full w-full border-0"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>
                </div>
                <h2 className="mt-6 text-xl font-semibold text-bocra-text-primary">
                  Visit BOCRA
                </h2>
                <div className="mt-4 space-y-2 text-sm text-bocra-text-secondary">
                  <p className="font-semibold text-bocra-text-primary">
                    {CONTACT_DETAILS.officeName}
                  </p>
                  {CONTACT_DETAILS.addressLines.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                  <p>
                    Tel:{' '}
                    <a
                      href={CONTACT_DETAILS.phoneHref}
                      className="font-medium text-bocra-teal hover:text-bocra-forest-green"
                    >
                      {CONTACT_DETAILS.phoneDisplay}
                    </a>
                  </p>
                  <p>Fax: {CONTACT_DETAILS.faxDisplay}</p>
                </div>
                <a
                  href={CONTACT_DETAILS.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center gap-2 font-semibold text-bocra-teal transition-all hover:gap-3"
                >
                  Get Directions
                  <ArrowRight className="h-4 w-4" />
                </a>
              </Card>

              <Card className="border-0 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-bocra-text-primary">
                  What To Include
                </h2>
                <div className="mt-4 space-y-3 text-sm text-bocra-text-secondary">
                  <p>Use a clear subject that matches the service area.</p>
                  <p>Include relevant dates, reference numbers, or operator names.</p>
                  <p>Leave a phone number if you want BOCRA to follow up by call.</p>
                </div>
              </Card>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
