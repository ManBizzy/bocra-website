# BOCRA Website - Project TODO

## Phase 1: Design System & Core Components

- [x] Configure Tailwind with BOCRA brand colors
- [x] Create constants file with colors, nav links, and site metadata
- [x] Create Supabase client configuration
- [x] Create TypeScript types for all Supabase tables
- [x] Create custom hooks (useAuth, useNews, useLicences, useComplaints, useDomains)
- [x] Create Zustand auth store

## Phase 2: Layout Components

- [x] Build Header component with sticky nav, search overlay, mobile drawer
- [x] Build Footer component with links and branding
- [x] Build responsive navigation with active link styling
- [x] Implement mobile navigation drawer with focus trap
- [x] Create layout wrapper for public pages

## Phase 3: Homepage Sections

- [x] Hero section with gradient background and animations
- [x] Quick Services strip with 6 service cards
- [x] About BOCRA section with mandate and regulatory areas
- [x] Self-Service Portal Highlight section
- [x] Latest News section with ticker and news cards (Supabase integration)
- [x] Events section (Supabase integration)
- [x] Consultation section with CTA

## Phase 4: Public Pages

- [x] About page with full BOCRA information
- [x] Services page with detailed service descriptions
- [x] Licensing page with application info
- [x] Complaints page with submission form
- [x] Domain Registry page with search functionality
- [x] News listing page with filters
- [x] News article detail page
- [x] Publications page with document listing
- [ ] Contact page with contact form

## Phase 5: Citizen Portal

- [ ] Portal login page
- [ ] Portal dashboard with user info
- [ ] License applications section
- [ ] Complaint submissions section
- [ ] Domain registration section
- [ ] Application tracking section

## Phase 6: Admin Panel

- [ ] Admin login page
- [ ] Admin dashboard with maroon accent theme
- [ ] Admin sidebar navigation
- [ ] News management (CRUD)
- [ ] Publications management (CRUD)
- [ ] Licenses management (CRUD)
- [ ] Complaints management (CRUD)
- [ ] Domains management (CRUD)
- [ ] Consultations management (CRUD)

## Phase 7: Database Schema & Integration

- [ ] Create Supabase tables (news, publications, licenses, complaints, domains, consultations, events)
- [ ] Create tRPC procedures for all data operations
- [ ] Implement Supabase authentication
- [ ] Create database query helpers

## Phase 8: SEO & Accessibility

- [ ] Add react-helmet-async to all pages
- [ ] Create robots.txt
- [ ] Create sitemap.xml
- [ ] Add ARIA labels to all interactive elements
- [ ] Implement focus management and keyboard navigation
- [ ] Add loading skeletons for all data-fetching states
- [ ] Add toast notifications for form submissions

## Phase 9: Polish & Optimization

- [ ] Add Framer Motion animations
- [ ] Implement lazy loading for images
- [ ] Add blur placeholders for images
- [ ] Optimize performance and code splitting
- [ ] Test responsive design across breakpoints
- [ ] Final accessibility audit
- [ ] Test all forms and submissions
