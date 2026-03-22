export type ServiceAccent = 'teal' | 'forest' | 'maroon' | 'gold';

export interface ServiceChannel {
  label: string;
  href: string;
  description: string;
  external?: boolean;
}

export interface ServiceArea {
  slug: string;
  title: string;
  eyebrow: string;
  icon: string;
  accent: ServiceAccent;
  summary: string;
  description: string;
  responsibilities: string[];
  useCases: string[];
  channels: ServiceChannel[];
}

export const SERVICE_AREAS: ServiceArea[] = [
  {
    slug: 'spectrum',
    title: 'Spectrum Management',
    eyebrow: 'Telecommunications',
    icon: 'Radio',
    accent: 'teal',
    summary:
      'Planning and managing Botswana’s radio frequency resources, assignments, standards, and equipment conformity.',
    description:
      'BOCRA manages the national radio frequency plan, allocates spectrum, monitors occupancy, and works to avoid harmful interference. The same service area also oversees equipment type approval so radio and telecommunications devices used in Botswana align with applicable technical standards.',
    responsibilities: [
      'National radio frequency planning and coordination',
      'Frequency allocation, assignment, and apparatus licensing support',
      'Interference prevention, monitoring, and technical standards',
      'Type approval for radio and telecommunications equipment',
    ],
    useCases: [
      'When an operator needs radio frequency resources or planning guidance',
      'When equipment needs approval before being connected or used locally',
      'When stakeholders need formal spectrum-planning and standards references',
    ],
    channels: [
      {
        label: 'Radio Spectrum Planning',
        href: 'https://www.bocra.org.bw/radio-spectrum-planning',
        description:
          'Review BOCRA’s official spectrum-planning responsibilities and mandate.',
        external: true,
      },
      {
        label: 'Type Approval',
        href: 'https://www.bocra.org.bw/type-approval',
        description:
          'Understand equipment approval requirements and consumer-protection safeguards.',
        external: true,
      },
      {
        label: 'Type Approval Database',
        href: 'https://www.bocra.org.bw/type-approval-database-0',
        description: 'Open the published equipment approval database.',
        external: true,
      },
    ],
  },
  {
    slug: 'licensing',
    title: 'Licensing',
    eyebrow: 'Market Entry',
    icon: 'FileCheck',
    accent: 'forest',
    summary:
      'Application, issuance, and framework guidance for broadcasting, telecommunications, internet, postal, and radio communications licences.',
    description:
      'BOCRA processes licence and permit applications across the regulated communications sectors. The licensing framework supports converged services, technology-neutral market participation, and formal authorisations for providers operating in Botswana.',
    responsibilities: [
      'Processing licence, permit, and authority applications',
      'Maintaining the licensing framework for regulated communications sectors',
      'Supporting market entry for telecommunications and broadcasting operators',
      'Providing licence verification and operator-facing service channels',
    ],
    useCases: [
      'When a provider is preparing a new licence or permit application',
      'When stakeholders need to understand the licensing framework',
      'When a licence or operator status needs verification',
    ],
    channels: [
      {
        label: 'Licensing Framework',
        href: 'https://www.bocra.org.bw/licensing',
        description: 'Review BOCRA’s licensing framework and sector coverage.',
        external: true,
      },
      {
        label: 'BOCRA Portal',
        href: 'https://op-web.bocra.org.bw',
        description:
          'Access BOCRA’s operator portal and related service workflows.',
        external: true,
      },
      {
        label: 'Licence Verification',
        href: 'https://customerportal.bocra.org.bw',
        description: 'Verify published licence information.',
        external: true,
      },
    ],
  },
  {
    slug: 'complaints',
    title: 'Consumer Complaints',
    eyebrow: 'Consumer Protection',
    icon: 'MessageSquare',
    accent: 'maroon',
    summary:
      'Complaint intake, escalation guidance, and consumer protection support when communications services do not meet expected standards.',
    description:
      'BOCRA investigates consumer complaints against service providers where there is sufficient evidence to establish a prima facie case. This service area covers complaint filing, complaint-handling guidance, and quality-of-service references for consumers and regulated providers.',
    responsibilities: [
      'Complaint intake and escalation against service providers',
      'Complaint-handling guidance for consumers and operators',
      'Quality-of-service reference material and service expectations',
      'Consumer protection support when provider channels are exhausted',
    ],
    useCases: [
      'When a service provider has not resolved a consumer complaint',
      'When a user needs the formal BOCRA complaint process',
      'When teams need complaint-handling or quality-of-service guidance',
    ],
    channels: [
      {
        label: 'File A Complaint',
        href: 'https://www.bocra.org.bw/file-complaint',
        description: 'Open BOCRA’s official complaint filing page.',
        external: true,
      },
      {
        label: 'Complaints Handling Procedure',
        href: 'https://www.bocra.org.bw/complaints-handling-procedure',
        description:
          'Review the formal complaint-handling procedure used by BOCRA.',
        external: true,
      },
      {
        label: 'Quality of Service Guidelines',
        href: 'https://www.bocra.org.bw/quality-service-guidelines',
        description:
          'Check service-quality guidance relevant to complaint review.',
        external: true,
      },
    ],
  },
  {
    slug: 'domain-registry',
    title: 'Domain Registry (.bw)',
    eyebrow: 'Internet Governance',
    icon: 'Globe',
    accent: 'gold',
    summary:
      'Public guidance on .bw administration, policy, and the official external registry workflow.',
    description:
      'BOCRA manages and oversees the .bw ccTLD as a national resource. This page is informational: it explains BOCRA policy and routes visitors to the official external registry website for live registration or domain-management actions.',
    responsibilities: [
      'Administering the .bw ccTLD and its second-level domains',
      'Maintaining operational stability and utility of the .bw namespace',
      'Providing policy guidance for registration and acceptable use',
      'Directing registrants to the official external .bw registry workflow',
    ],
    useCases: [
      'When a registrant needs BOCRA guidance before using the external .bw registry',
      'When a registrant needs to open the live nic.net.bw registration workflow',
      'When stakeholders need .bw policy or terms-and-conditions documents',
      'When teams need BOCRA’s official ccTLD mandate and governance context',
    ],
    channels: [
      {
        label: 'bw ccTLD',
        href: 'https://www.bocra.org.bw/bw-cctld',
        description: 'Read BOCRA’s official mandate and responsibilities for .bw.',
        external: true,
      },
      {
        label: 'Open nic.net.bw',
        href: 'https://nic.net.bw',
        description: 'Use the official external registry website for live .bw registration and management.',
        external: true,
      },
      {
        label: '.bw Terms and Conditions',
        href: 'https://www.bocra.org.bw/botswana-domain-name-bw-registration-terms-and-conditions',
        description: 'Review the published .bw registration terms and conditions.',
        external: true,
      },
    ],
  },
  {
    slug: 'broadcasting',
    title: 'Broadcasting Regulation',
    eyebrow: 'Broadcasting',
    icon: 'Tv',
    accent: 'teal',
    summary:
      'Regulation of broadcasting, subscription management, re-broadcasting activities, and related licence compliance.',
    description:
      'BOCRA regulates broadcasting services in Botswana, including subscription management services and re-broadcasting activities outside state broadcasting. This service area covers regulatory expectations, licence obligations, and guidance for broadcasting operators and stakeholders.',
    responsibilities: [
      'Broadcasting and re-broadcasting regulatory oversight',
      'Broadcasting licence guidance and regulatory references',
      'Content and local-content compliance expectations',
      'Operator-facing documents for broadcast-sector requirements',
    ],
    useCases: [
      'When a broadcaster needs regulatory or licence guidance',
      'When a stakeholder needs the broadcasting regulations or sector overview',
      'When teams need published broadcasting obligations and references',
    ],
    channels: [
      {
        label: 'Broadcasting Overview',
        href: 'https://www.bocra.org.bw/broadcasting',
        description: 'Review BOCRA’s broadcasting-sector overview.',
        external: true,
      },
      {
        label: 'Broadcasting Regulation',
        href: 'https://www.bocra.org.bw/broadcasting-regulation',
        description: 'Open the published broadcasting regulation reference.',
        external: true,
      },
      {
        label: 'Broadcasting Licence',
        href: 'https://www.bocra.org.bw/broadcasting-licence',
        description: 'Access the broadcasting licence information page.',
        external: true,
      },
    ],
  },
  {
    slug: 'cybersecurity',
    title: 'Cybersecurity Advisory',
    eyebrow: 'Security and Trust',
    icon: 'Shield',
    accent: 'forest',
    summary:
      'Communications-sector cybersecurity coordination, digital trust services, and public security reference material.',
    description:
      'BOCRA hosts the communications-sector CIRT function and also carries responsibilities under Botswana’s electronic transactions and electronic evidence framework. This service area is the right entry point for cybersecurity guidance, digital trust references, and sector-level response coordination context.',
    responsibilities: [
      'Communications-sector cybersecurity focal-point coordination',
      'bw CIRT guidance and reference material',
      'Electronic communications transactions and trust-service oversight',
      'Electronic evidence certification references and related standards',
    ],
    useCases: [
      'When organisations need communications-sector cybersecurity guidance',
      'When teams need digital trust, electronic transactions, or evidence references',
      'When stakeholders need BOCRA’s published cybersecurity and CIRT context',
    ],
    channels: [
      {
        label: 'bw CIRT',
        href: 'https://www.bocra.org.bw/bw-cirt',
        description: 'Review BOCRA’s communications-sector CIRT role and mandate.',
        external: true,
      },
      {
        label: 'Electronic Communications Transactions',
        href: 'https://www.bocra.org.bw/electronic-communications-transactions',
        description:
          'Access BOCRA’s published material on electronic transactions and secure signatures.',
        external: true,
      },
      {
        label: 'Electronic Evidence',
        href: 'https://www.bocra.org.bw/electronic-evidence',
        description:
          'Review electronic evidence certification and admissibility references.',
        external: true,
      },
    ],
  },
];

export const SERVICE_PORTALS = [
  {
    label: 'BOCRA Portal',
    href: 'https://op-web.bocra.org.bw',
    description: 'Operator-facing portal and service workflows',
  },
  {
    label: 'Licence Verification',
    href: 'https://customerportal.bocra.org.bw',
    description: 'Published licence verification channel',
  },
  {
    label: 'Telecoms Statistics',
    href: 'https://www.bocra.org.bw/telecoms-statistics',
    description: 'Latest published sector statistics and trends',
  },
  {
    label: 'Register BW',
    href: 'https://nic.net.bw',
    description: 'Live .bw registration and registry access',
  },
] as const;

export function getServiceAreaBySlug(slug: string) {
  return SERVICE_AREAS.find((service) => service.slug === slug);
}

export function getAccentClasses(accent: ServiceAccent) {
  switch (accent) {
    case 'forest':
      return {
        text: 'text-bocra-forest-green',
        soft: 'bg-bocra-forest-green/10 text-bocra-forest-green',
        border: 'border-bocra-forest-green',
        button: 'bg-bocra-forest-green text-white hover:bg-bocra-forest-green/90',
      };
    case 'maroon':
      return {
        text: 'text-bocra-dark-maroon',
        soft: 'bg-bocra-dark-maroon/10 text-bocra-dark-maroon',
        border: 'border-bocra-dark-maroon',
        button: 'bg-bocra-dark-maroon text-white hover:bg-bocra-dark-maroon/90',
      };
    case 'gold':
      return {
        text: 'text-bocra-deep-teal',
        soft: 'bg-bocra-golden-yellow/25 text-bocra-deep-teal',
        border: 'border-bocra-golden-yellow',
        button: 'bg-bocra-golden-yellow text-bocra-text-primary hover:bg-bocra-golden-yellow/90',
      };
    case 'teal':
    default:
      return {
        text: 'text-bocra-teal',
        soft: 'bg-bocra-teal/10 text-bocra-teal',
        border: 'border-bocra-teal',
        button: 'bg-bocra-teal text-white hover:bg-bocra-teal/90',
      };
  }
}
