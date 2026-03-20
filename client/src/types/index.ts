/**
 * TypeScript types for all Supabase tables
 */

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'citizen' | 'admin';
  created_at: string;
  updated_at: string;
}

export interface News {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: 'announcement' | 'consultation' | 'regulation' | 'update';
  featured_image_url?: string;
  published_at: string;
  created_at: string;
  updated_at: string;
}

export interface Publication {
  id: string;
  title: string;
  slug: string;
  description: string;
  file_url: string;
  file_type: 'pdf' | 'doc' | 'docx' | 'xlsx' | 'pptx';
  category: string;
  published_at: string;
  created_at: string;
  updated_at: string;
}

export interface License {
  id: string;
  user_id: string;
  license_type: string;
  operator_name: string;
  service_area: string;
  status: 'pending' | 'approved' | 'rejected' | 'expired';
  issued_date?: string;
  expiry_date?: string;
  application_date: string;
  created_at: string;
  updated_at: string;
}

export interface Complaint {
  id: string;
  user_id: string;
  title: string;
  description: string;
  category: string;
  status: 'open' | 'in_review' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high';
  submitted_date: string;
  resolved_date?: string;
  created_at: string;
  updated_at: string;
}

export interface Domain {
  id: string;
  user_id?: string;
  domain_name: string;
  registrant_name: string;
  registrant_email: string;
  status: 'available' | 'registered' | 'pending' | 'expired';
  registration_date?: string;
  expiry_date?: string;
  created_at: string;
  updated_at: string;
}

export interface Consultation {
  id: string;
  title: string;
  description: string;
  document_url?: string;
  start_date: string;
  end_date: string;
  status: 'open' | 'closed' | 'archived';
  created_at: string;
  updated_at: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  event_date: string;
  location?: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'responded';
  created_at: string;
  updated_at: string;
}

/**
 * API Response types
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * Form submission types
 */
export interface LicenseApplicationForm {
  licenseType: string;
  operatorName: string;
  serviceArea: string;
  description: string;
  attachments?: File[];
}

export interface ComplaintForm {
  title: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  attachments?: File[];
}

export interface DomainRegistrationForm {
  domainName: string;
  registrantName: string;
  registrantEmail: string;
  registrantPhone: string;
  registrantAddress: string;
}

export interface ContactForm {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}
