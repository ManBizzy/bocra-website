# BOCRA Website - Style & Code Guide

## UI/UX Standards

### Icons & Visual Elements

- **✗ NEVER use emoji characters** in the UI (e.g., 📊, 💰, ✉️, ☎️)
- **✓ ALWAYS use professional icon libraries** instead
  - Use `lucide-react` for all icons (already included in the project)
  - Import icons: `import { IconName } from 'lucide-react'`
  - Render icons as React components: `<IconName className="w-6 h-6" />`

### Icon Examples

- 📊 Data/Analytics → `BarChart3`, `TrendingUp`, `PieChart`
- 💰 Money/Billing → `DollarSign`, `CreditCard`, `Banknote`
- 👥 People/Users → `Users`, `User`, `UserCheck`
- ✉️ Email → `Mail`, `Send`, `MessageSquare`
- ☎️ Phone → `Phone`, `PhoneCall`
- 📄 Documents → `FileText`, `Document`, `FileCheck`
- 📂 Folders → `Folder`, `FolderOpen`
- ⚠️ Warning → `AlertTriangle`, `AlertCircle`
- ❓ Questions → `HelpCircle`, `MessageCircle`
- ✓ Check/Success → `CheckCircle2`, `Check`
- 🌐 Globe/Web → `Globe`, `World`
- ⚡ Speed/Fast → `Zap`, `Lightning`
- 🏢 Building/Company → `Building2`, `Building`
- 🔒 Security/Lock → `Lock`, `LockKeyhole`
- 📱 Mobile → `Smartphone`, `Phone`

## Color Standards

- **Primary Teal**: `#1B7F79` (class: `bg-bocra-teal`, `text-bocra-teal`)
- **Forest Green**: `#2D6A2D` (class: `bg-bocra-forest-green`, `text-bocra-forest-green`)
- **Dark Maroon**: `#8B1A1A` (class: `bg-bocra-dark-maroon`, `text-bocra-dark-maroon`)
- **Golden Yellow**: `#F0B429` (use sparingly for accents)

## Typography

- **Headings**: Use semantic HTML tags (h1, h2, h3, h4)
- **Font Classes**:
  - `font-bold` for emphasis
  - `font-semibold` for secondary emphasis
  - Use class names, not inline styles

## Component Usage

- Use provided UI components from `/components/ui/`
- Import from barrel exports: `import { Button, Card, etc } from '@/components/ui/[component]'`
- Apply Tailwind classes for styling, not inline styles
- Always add `aria-label` or accessible labels to interactive elements

## Form Standards

- All form inputs should have associated `<label>` tags
- Use Tailwind focus styles: `focus:ring-2 focus:ring-bocra-teal focus:border-transparent`
- Always mark required fields with an asterisk `*`
- Provide helpful placeholder text

## Responsive Design

- Use Tailwind responsive prefixes:
  - `md:` for medium screens (tablets)
  - `lg:` for large screens (desktops)
  - Mobile-first approach (no prefix = mobile)
- Test at 320px, 768px, 1024px, and 1440px breakpoints

## SEO Standards

- All pages must have `<Helmet>` with `<title>` and `<meta name="description">`
- Use semantic HTML: `<section>`, `<article>`, `<nav>`, `<footer>`
- Include proper heading hierarchy (one h1 per page)

## Code Style

- Use TypeScript for all components (`.tsx` files)
- Export default components: `export default function PageName() { ... }`
- Use proper destructuring for imports
- Keep components focused and single-responsibility
- Add comments for complex logic

## Testing Considerations

- All links should use `<Link href="/path">` from wouter router
- Form submissions should handle loading states
- Async operations should show loading indicators
- Error states should display user-friendly messages

## Accessibility (a11y)

- Use semantic HTML elements
- Add `alt` text to all images
- Use proper ARIA labels where needed
- Ensure color contrast meets WCAG AA standards
- Test keyboard navigation

---

**Last Updated**: March 22, 2026  
For issues or updates, create a PR with style guide changes.
