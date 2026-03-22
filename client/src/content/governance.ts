const BOCRA_ROOT = 'https://www.bocra.org.bw';

const assetUrl = (path: string) => `${BOCRA_ROOT}${path}`;

export const GOVERNANCE_SOURCES = {
  boardOfDirectors: `${BOCRA_ROOT}/board-of-directors`,
  executiveManagement: `${BOCRA_ROOT}/index.php/executive-management`,
} as const;

export type BoardMemberProfile = {
  name: string;
  role: string;
  imageUrl: string;
  summary: string;
  highlights: string[];
};

export type ExecutiveMemberProfile = {
  name: string;
  title: string;
  imageUrl: string;
};

export const BOARD_APPOINTMENT_NOTE =
  'The official BOCRA Board of Directors page states that the current board took effect on 1 August 2025 and consists of seven non-executive directors, with the Chief Executive serving as the Ex-Officio member.';

export const BOARD_MEMBERS: BoardMemberProfile[] = [
  {
    name: 'Dr. Bokamoso Basutli, PhD',
    role: 'Chairperson',
    imageUrl: assetUrl(
      '/sites/default/files/people/Dr.%20Bokamoso%20Basutli%20%20-%20Chairperson.jpg'
    ),
    summary:
      'Professional engineer and IEEE Senior Member who leads Electrical and Communications Systems Engineering at BIUST. His work spans satellite communications, digital signal processing, artificial intelligence, and advanced communications research.',
    highlights: [
      'Head of department at BIUST',
      'IEEE Senior Member and CertiAIEd Assessor',
      "Originator and Principal Investigator of BotswanaSat-1",
    ],
  },
  {
    name: 'Mr. Moabi Pusumane',
    role: 'Vice Chairperson',
    imageUrl: assetUrl(
      '/sites/default/files/people/Mr.%20Moabi%20Pusumane%20%20-%20Vice%20Chairperson.jpg'
    ),
    summary:
      'Commercial executive with more than 15 years of leadership experience across telecommunications, market intelligence, project management, and route-to-market strategy. He currently serves as Commercial Director at Coca-Cola Beverages Botswana.',
    highlights: [
      'Commercial Director at Coca-Cola Beverages Botswana',
      'Experience in telecoms and market strategy',
      'Led award-winning growth and portfolio campaigns',
    ],
  },
  {
    name: 'Ms. Montle Phuthego',
    role: 'Board Member',
    imageUrl: assetUrl(
      '/sites/default/files/people/Ms.%20Montle%20Phuthego%20-%20Member.jpg'
    ),
    summary:
      'Economist and enterprise development leader with more than two decades of experience in trade, investment, and business development. She has held senior positions across SPEDU, Botswana Development Corporation, BITC, CEDA, and TechnoServe.',
    highlights: [
      'MSc Economics, University of Warwick',
      'Senior leadership across public enterprise institutions',
      'Country Director for TechnoServe in Botswana',
    ],
  },
  {
    name: 'Ms. Alta Dimpho Seleka',
    role: 'Board Member',
    imageUrl: assetUrl(
      '/sites/default/files/people/Ms.%20Alta%20Dimpho%20Seleka%20-%20Member.jpg'
    ),
    summary:
      'Finance leader with more than two decades in public financial management and fiscal governance. As Acting Commissioner for Finance and Administration at BURS, she oversees revenue, expenditure, shared services, and financial reform programmes.',
    highlights: [
      'Acting Commissioner at BURS',
      'FCCA and FCPA-BICA fellow',
      'Led major finance automation and accountability reforms',
    ],
  },
  {
    name: 'Ms. Lebogang George',
    role: 'Board Member',
    imageUrl: assetUrl(
      '/sites/default/files/people/Ms%20Lebogang%20George%20-%20Member.jpg'
    ),
    summary:
      'Commercial and ICT lawyer at AJA/MCL with experience across procurement, IT governance, commercial agreements, and data protection law in Botswana, South Africa, and the EU. She also contributes to governance education and public legal awareness.',
    highlights: [
      'Partner at AJA/MCL',
      'Specialist in ICT, privacy, and compliance law',
      'Active board and governance committee contributor',
    ],
  },
  {
    name: 'Mr. Ronald Kgafela, CODP',
    role: 'Board Member',
    imageUrl: assetUrl(
      '/sites/default/files/people/Mr.%20Ronald%20Kgafela%20-%20Member.jpg'
    ),
    summary:
      'Human capital and organisational development leader with over 20 years of experience across HR, employment relations, change management, and transformation. He currently serves as Head of HR at NBFIRA.',
    highlights: [
      'Head of HR at NBFIRA',
      '20+ years across HR and organisational development',
      'Advanced qualifications in strategy and labour law',
    ],
  },
  {
    name: 'Dr. Kennedy Ramojela',
    role: 'Board Member',
    imageUrl: assetUrl(
      '/sites/default/files/people/Dr.%20Kennedy%20Ramojela%20-%20Member.jpg'
    ),
    summary:
      'Media and communications academic and senior executive with advanced degrees from RMIT, Southampton, Emerson College, and Columbia College Chicago. He lectures at the University of Botswana and has extensive experience across digital media, broadcasting, and strategy.',
    highlights: [
      'PhD in Media and Communications from RMIT',
      'University of Botswana lecturer in digital media',
      '20+ years across media, broadcasting, and technology',
    ],
  },
];

export const EXECUTIVE_MANAGEMENT: ExecutiveMemberProfile[] = [
  {
    name: 'Mr. Martin Mokgware',
    title: 'Chief Executive',
    imageUrl: assetUrl('/sites/default/files/people/Martin_mokgware.jpg'),
  },
  {
    name: 'Mr. Murphy Setshwane',
    title: 'Director Business Development',
    imageUrl: assetUrl('/sites/default/files/people/Murphy_setshwane.jpg'),
  },
  {
    name: 'Mr. Peter Tladinyane',
    title: 'Director Corporate Services',
    imageUrl: assetUrl('/sites/default/files/people/Peter_tladinyane.jpg'),
  },
  {
    name: 'Ms. Bonny Mine',
    title: 'Director Finance',
    imageUrl: assetUrl('/sites/default/files/people/Bonnie_mine.jpg'),
  },
  {
    name: 'Mr. Bathopi Luke',
    title: 'Director Technical Services',
    imageUrl: assetUrl('/sites/default/files/people/Bathopi_luke.jpg'),
  },
  {
    name: 'Ms. Tebogo Mmoshe',
    title: 'Director of Licensing',
    imageUrl: assetUrl('/sites/default/files/people/Tebogo_mmoshe.jpg'),
  },
  {
    name: 'Ms. Maitseo Ratladi',
    title: 'Director Broadband and Universal Service',
    imageUrl: assetUrl('/sites/default/files/people/Maitseo_ratladi.jpg'),
  },
  {
    name: 'Ms. Joyce Isa-Molwane',
    title: 'Director Legal, Compliance & Board Secretary',
    imageUrl: assetUrl('/sites/default/files/people/Joyce-Isa-molwane.jpg'),
  },
];
