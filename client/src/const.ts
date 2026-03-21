export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

/**
 * Site-wide constants, branding, and configuration
 */

export const SITE_NAME = 'BOCRA';
export const SITE_FULL_NAME = 'Botswana Communications Regulatory Authority';
export const SITE_DESCRIPTION = 'BOCRA is mandated to regulate telecommunications, broadcasting, postal, and internet services in Botswana in the public interest.';

/**
 * BOCRA Brand Colors
 */
export const COLORS = {
  // Primary brand colors
  teal: '#1B7F79',
  forestGreen: '#2D6A2D',
  goldenYellow: '#F0B429',
  darkMaroon: '#8B1A1A',
  grey: '#808080',

  // Backgrounds
  bgWhite: '#FFFFFF',
  bgLightGrey: '#F7F8FA',
  bgDeepTeal: '#0F4F4B',

  // Text colors
  textPrimary: '#1A1A2E',
  textSecondary: '#4A5568',
  textMuted: '#718096',

  // Borders
  border: '#E2E8F0',

  // Admin theme
  adminMaroon: '#8B1A1A',
};

/**
 * Navigation links for the header
 */
export const NAV_LINKS = [
  { label: 'Home', href: '/', icon: 'Home' },
  { label: 'About', href: '/about', icon: 'Info' },
  { label: 'Services', href: '/services', icon: 'Briefcase' },
  { label: 'Licensing', href: '/licensing', icon: 'FileCheck' },
  { label: 'Complaints', href: '/complaints', icon: 'MessageSquare' },
  { label: 'Domain Registry', href: '/domain-registry', icon: 'Globe' },
  { label: 'News', href: '/news', icon: 'Newspaper' },
  { label: 'Publications', href: '/publications', icon: 'BookOpen' },
  { label: 'Contact', href: '/contact', icon: 'Mail' },
];

/**
 * Quick services for homepage strip
 */
export const QUICK_SERVICES = [
  {
    id: 'spectrum',
    label: 'Spectrum Management',
    href: '/services/spectrum',
    icon: 'Radio',
  },
  {
    id: 'licensing',
    label: 'Operator Licensing',
    href: '/licensing',
    icon: 'FileCheck',
  },
  {
    id: 'complaints',
    label: 'Consumer Complaints',
    href: '/complaints',
    icon: 'MessageSquare',
  },
  {
    id: 'domain',
    label: 'Domain Registry (.bw)',
    href: '/domain-registry',
    icon: 'Globe',
  },
  {
    id: 'broadcasting',
    label: 'Broadcasting Regulation',
    href: '/services/broadcasting',
    icon: 'Tv',
  },
  {
    id: 'cybersecurity',
    label: 'Cybersecurity Advisory',
    href: '/services/cybersecurity',
    icon: 'Shield',
  },
];

/**
 * BOCRA's core regulatory areas
 */
export const REGULATORY_AREAS = [
  {
    title: 'Telecommunications',
    description: 'Ensuring fair, affordable access to voice and data services',
  },
  {
    title: 'Broadcasting',
    description: 'Regulating TV and radio content standards and licensing',
  },
  {
    title: 'Postal Services',
    description: 'Overseeing postal operators and service quality',
  },
  {
    title: 'Internet Governance',
    description: 'Managing .bw domains and internet infrastructure',
  },
];

/**
 * Homepage statistics
 */
export const HOMEPAGE_STATS = [
  { value: '15+', label: 'Years Regulating' },
  { value: '50+', label: 'Licensed Operators' },
  { value: '200K+', label: 'Citizens Served' },
  { value: '6', label: 'Core Service Areas' },
];

/**
 * News categories with colors
 */
export const NEWS_CATEGORIES = {
  announcement: { label: 'Announcement', color: 'bg-bocra-teal' },
  consultation: { label: 'Consultation', color: 'bg-bocra-forest-green' },
  regulation: { label: 'Regulation', color: 'bg-bocra-dark-maroon' },
  update: { label: 'Update', color: 'bg-bocra-teal' },
};

/**
 * Portal and Admin URLs
 */
export const PORTAL_LOGIN_URL = '/portal/login';
export const ADMIN_LOGIN_URL = '/admin/login';
export const CITIZEN_PORTAL_URL = '/portal/dashboard';
export const ADMIN_DASHBOARD_URL = '/admin/dashboard';

/**
 * Form validation messages
 */
export const VALIDATION_MESSAGES = {
  required: 'This field is required',
  email: 'Please enter a valid email address',
  phone: 'Please enter a valid phone number',
  minLength: (min: number) => `Minimum ${min} characters required`,
  maxLength: (max: number) => `Maximum ${max} characters allowed`,
};

/**
 * Toast notification types
 */
export const TOAST_TYPES = {
  success: 'success',
  error: 'error',
  info: 'info',
  warning: 'warning',
};

// Supabase uses built-in auth - no external portal needed
export const getLoginUrl = () => {
  return PORTAL_LOGIN_URL;
};
