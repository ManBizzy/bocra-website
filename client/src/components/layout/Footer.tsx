import { Mail, Phone, MapPin } from 'lucide-react';
import { CONTACT_DETAILS, SITE_FULL_NAME } from '@/const';
import BrandLogo from '@/components/branding/BrandLogo';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-bocra-deep-teal text-white">
      {/* Main Footer Content */}
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* About Section */}
          <div>
            <div className="mb-4">
              <BrandLogo framed imageClassName="h-10" />
            </div>
            <p className="text-sm text-white/80 leading-relaxed">
              {SITE_FULL_NAME} regulates telecommunications, broadcasting, postal, and internet services in Botswana.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/" className="text-white/80 hover:text-bocra-golden-yellow transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="/about" className="text-white/80 hover:text-bocra-golden-yellow transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="/services" className="text-white/80 hover:text-bocra-golden-yellow transition-colors">
                  Services
                </a>
              </li>
              <li>
                <a href="/news" className="text-white/80 hover:text-bocra-golden-yellow transition-colors">
                  News
                </a>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/services/licensing" className="text-white/80 hover:text-bocra-golden-yellow transition-colors">
                  Licensing
                </a>
              </li>
              <li>
                <a href="/services/complaints" className="text-white/80 hover:text-bocra-golden-yellow transition-colors">
                  File Complaint
                </a>
              </li>
              <li>
                <a href="/services/domain-registry" className="text-white/80 hover:text-bocra-golden-yellow transition-colors">
                  Domain Registry
                </a>
              </li>
              <li>
                <a href="/publications" className="text-white/80 hover:text-bocra-golden-yellow transition-colors">
                  Publications
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-bocra-golden-yellow" />
                <span className="text-white/80">
                  {CONTACT_DETAILS.addressLines[0]}
                  <br />
                  {CONTACT_DETAILS.addressLines[1]}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="w-4 h-4 mt-0.5 flex-shrink-0 text-bocra-golden-yellow" />
                <a href={CONTACT_DETAILS.phoneHref} className="text-white/80 hover:text-bocra-golden-yellow transition-colors">
                  {CONTACT_DETAILS.phoneDisplay}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="w-4 h-4 mt-0.5 flex-shrink-0 text-bocra-golden-yellow" />
                <a href={CONTACT_DETAILS.emailHref} className="text-white/80 hover:text-bocra-golden-yellow transition-colors">
                  {CONTACT_DETAILS.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 pt-8">
          {/* Bottom Footer */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/70">
            <p>&copy; {currentYear} BOCRA. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <a href="#" className="hover:text-bocra-golden-yellow transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-bocra-golden-yellow transition-colors">
                Terms of Service
              </a>
              <a href="#" className="hover:text-bocra-golden-yellow transition-colors">
                Accessibility
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
