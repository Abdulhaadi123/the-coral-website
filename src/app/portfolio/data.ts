export interface ProjectItem {
  slug: string;
  title: string;
  category: string;
  tags: string[];
  image: string | null;
  detailImage?: string | null;
  bg: string;
}

export const projects: ProjectItem[] = [
  // Row 1 (Boxes 1-4)
  {
    slug: 'elovira-packaging',
    title: 'Elovira Packaging',
    category: 'Branding',
    tags: ['ELOVIRA', 'FMCG'],
    image: '/images/featured/elovira.webp',
    detailImage: '/images/portfolio/elovira.webp',
    bg: '#1a1a1a',
  },
  { slug: 'veora-brand-identity',       title: 'Veora Brand Identity',             category: 'Branding',     tags: ['VEORA', 'BRAND'],          image: '/images/portfolio/veora.webp', detailImage: '/images/portfolio/vora-detail.webp', bg: '#0f1f0f' },
  { slug: 'mochae-brand-identity',      title: 'Mochae Brand Identity',            category: 'Branding',     tags: ['MOCHAE', 'CAFÉ'],          image: '/images/featured/mochae.webp', detailImage: '/images/portfolio/mochae-detail.webp', bg: '#2d1f0e' },
  { slug: 'ascent-brand-identity',      title: 'Ascent Brand Identity',            category: 'Branding',     tags: ['ASCENT', 'BRAND'],         image: '/images/portfolio/ascent.webp', detailImage: '/images/portfolio/ascent-detail.webp', bg: '#1a2030' },

  // Row 2 (Boxes 5-8)
  { slug: 'orgvrt-crm',                 title: 'Orgvrt CRM',                       category: 'Development',  tags: ['ORGVRT', 'CRM'],           image: '/images/portfolio/orgvrt.webp', detailImage: '/images/portfolio/orynt-detail.webp', bg: '#0d1520' },
  { slug: 'nomib-social-media',         title: 'Nomib Social Media',               category: 'Social Media', tags: ['NOMIB', 'SOCIAL'],         image: '/images/portfolio/nomib.webp', detailImage: '/images/portfolio/ronin-detail.webp', bg: '#1a1a2e' },
  { slug: 'aromero-website',            title: 'Aromero Website',                  category: 'Design',       tags: ['AROMERO', 'WEB'],          image: '/images/portfolio/Rectangle 504 (7).webp', detailImage: '/images/portfolio/arventra-detail.webp', bg: '#2e1a1a' },
  { slug: 'mochae-social-media',        title: 'Mochae Social Media',              category: 'Social Media', tags: ['MOCHAE', 'SOCIAL'],        image: '/images/portfolio/Rectangle 504 (8).webp', detailImage: '/images/portfolio/mochae-detail.webp', bg: '#1f1208' },

  // Row 3 (Boxes 9-12)
  { slug: 'noura-packaging',            title: 'Noura Packaging',                  category: 'Branding',     tags: ['NOURA', 'FMCG'],           image: '/images/portfolio/Rectangle 504 (9).webp', detailImage: '/images/portfolio/noura.webp', bg: '#12180a' },
  { slug: 'bhiram-packaging',           title: 'Bhiram Packaging',                 category: 'Branding',     tags: ['BHIRAM', 'PACKAGING'],     image: '/images/portfolio/Rectangle 504 (10).webp', detailImage: '/images/portfolio/evee-detail.webp', bg: '#1e1208' },
  { slug: 'kaelvo-brand-identity',      title: 'Kaelvo Brand Identity',            category: 'Branding',     tags: ['KAELVO', 'FASHION'],       image: '/images/portfolio/Rectangle 504 (11).webp', detailImage: '/images/portfolio/kaelvo-detail.webp', bg: '#0f0f1a' },
  { slug: 'crewtix-brand-identity',     title: 'Crewtix Brand Identity',           category: 'Branding',     tags: ['CREWTIX', 'BRAND'],        image: '/images/portfolio/Rectangle 504 (12).webp', detailImage: '/images/portfolio/crewtix-detail.webp', bg: '#0a1018' },

  // Row 4 (Boxes 13-16)
  { slug: 'cookie-co-brand-identity',   title: 'Cookie & Co Brand Identity',       category: 'Branding',     tags: ['COOKIE & CO', 'F&B'],      image: '/images/portfolio/Rectangle 504 (13).webp', detailImage: '/images/portfolio/cookie-and-co-detail.webp', bg: '#201408' },
  { slug: 'holiv-brand-identity',       title: 'Holiv & Brand Identity',           category: 'Branding',     tags: ['HOLIV', 'BRAND'],          image: '/images/portfolio/Rectangle 504 (14).webp', detailImage: '/images/portfolio/holix-detail.webp', bg: '#101820' },
  { slug: 'thiks-smart-banking',        title: 'Thiks Smart Banking',              category: 'Development',  tags: ['THIKS', 'BANKING'],        image: '/images/portfolio/Rectangle 504 (15).webp', detailImage: '/images/portfolio/finora-detail.webp', bg: '#0a1628' },
  { slug: 'omnix-project-management',   title: 'Omnix Project Management',         category: 'Development',  tags: ['OMNIX', 'SAAS'],           image: '/images/portfolio/Rectangle 504 (16).webp', detailImage: '/images/portfolio/omnix-detail.webp', bg: '#0d1a1a' },

  // Row 5 (Boxes 17-20)
  { slug: 'kisara-ai-finance-crm',      title: 'Kisara AI Finance CRM',            category: 'Development',  tags: ['KISARA', 'AI', 'FINTECH'], image: '/images/portfolio/Rectangle 504 (17).webp', detailImage: '/images/portfolio/finlo-detail.webp', bg: '#0a0f18' },
  { slug: 'the-vertical-launch',        title: 'V3 Launch Campaign',               category: 'Marketing',    tags: ['THE VERTICAL', 'LAUNCH'],  image: '/images/portfolio/Rectangle 504 (18).webp', detailImage: '/images/portfolio/v3-detail.webp', bg: '#111' },
  { slug: 'ascent-website',             title: 'Ascent Website',                   category: 'Design',       tags: ['ASCENT', 'WEB'],           image: '/images/portfolio/Rectangle 504 (19).webp', detailImage: '/images/portfolio/ascent-detail.webp', bg: '#182030' },
  { slug: 'space-social-media',         title: 'Space Social Media',               category: 'Social Media', tags: ['SPACE', 'SOCIAL'],         image: '/images/portfolio/Rectangle 504 (20).webp', detailImage: '/images/portfolio/space-detail.webp', bg: '#08080f' },

  // Row 6 (Boxes 21-24)
  { slug: 'veora-social-media',         title: 'Veora Social Media',               category: 'Social Media', tags: ['VEORA', 'SOCIAL'],         image: '/images/portfolio/Rectangle 504 (21).webp', detailImage: '/images/portfolio/vora-detail.webp', bg: '#0f1f0f' },
  { slug: 'cookie-co-social-media',     title: 'Cookie & Co Social Media',         category: 'Social Media', tags: ['COOKIE & CO', 'SOCIAL'],   image: '/images/portfolio/Rectangle 504 (22).webp', detailImage: '/images/portfolio/cookie-and-co-detail.webp', bg: '#201408' },
  { slug: 'vision-school-website',      title: 'Vision School Website',            category: 'Design',       tags: ['VISION', 'EDU'],           image: '/images/portfolio/Rectangle 504 (23).webp', detailImage: '/images/portfolio/vision-detail.webp', bg: '#0d1520' },
  { slug: 'chiq-social-media',          title: 'Chiq Social Media',                category: 'Social Media', tags: ['CHIQ', 'SOCIAL'],          image: '/images/portfolio/Rectangle 504 (24).webp', detailImage: '/images/portfolio/chiq-detail.webp', bg: '#180818' },

  // Row 7 (Boxes 25-28)
  { slug: 'azvrum-website',             title: 'Azvrum Website',                   category: 'Design',       tags: ['AZVRUM', 'WEB'],           image: '/images/portfolio/Rectangle 504 (25).webp', detailImage: '/images/portfolio/aevum-detail.webp', bg: '#0d1a2e' },
  { slug: 'civso-social-media',         title: 'Civso Social Media',               category: 'Social Media', tags: ['CIVSO', 'SOCIAL'],         image: '/images/portfolio/Rectangle 504 (26).webp', detailImage: '/images/portfolio/trego-detail.webp', bg: '#1a1a0d' },
  { slug: 'dessort-counter-social',     title: 'Dessort Counter Social Media',     category: 'Social Media', tags: ['DESSORT', 'F&B'],          image: '/images/portfolio/Rectangle 504 (27).webp', detailImage: '/images/portfolio/dessert-counter-detail.webp', bg: '#201010' },
  {
    slug: 'daddy-waddy-brand',
    title: 'Daddy Waddy Brand Identity',
    category: 'Branding',
    tags: ['DADDY WADDY', 'F&B'],
    image: '/images/portfolio/Rectangle 504 (28).webp',
    detailImage: '/images/portfolio/daddy-waddy-detail.webp',
    bg: '#201808',
  },

  // Row 8 (Boxes 29-32)
  { slug: 'mr-champions-social',        title: 'Mr. Champions Social Media',       category: 'Social Media', tags: ['MR. CHAMPIONS', 'SOCIAL'], image: '/images/portfolio/Rectangle 504 (29).webp', detailImage: '/images/portfolio/mr.-chompers-detail.webp', bg: '#101010' },
  {
    slug: 'elovira-packaging-2',
    title: 'Elovira Packaging',
    category: 'Branding',
    tags: ['ELOVIRA', 'FMCG'],
    image: '/images/portfolio/Rectangle 504 (30).webp',
    detailImage: '/images/portfolio/elovira.webp',
    bg: '#1a1a1a',
  },
  { slug: 'shinure-packaging',          title: 'Shinure Packaging',                category: 'Branding',     tags: ['SHINURE', 'FMCG'],         image: '/images/featured/elovira.webp', detailImage: '/images/portfolio/shinure.webp', bg: '#0f0d00' },
  {
    slug: 'elovira-packaging-3',
    title: 'Elovira Packaging',
    category: 'Branding',
    tags: ['ELOVIRA', 'FMCG'],
    image: '/images/featured/elovira.webp',
    detailImage: '/images/portfolio/elovira.webp',
    bg: '#1a1a1a',
  },
];
