// Local seed content — word for word from the original HTML, and mirrored in supabase/seed.sql.
// The site renders this instantly and keeps using it until Supabase is connected.

let n = 0;
const id = (prefix) => `seed-${prefix}-${++n}`;
const ordered = (prefix, rows) => rows.map((row, i) => ({ id: id(prefix), ...row, sort_order: i }));

const profile = {
  id: 1,
  full_name: 'Yasmeen Ahmed Akl',
  kicker_line: 'UI/UX designer for web & mobile',
  // Three lines; the last one is the italic accent.
  hero_headline: ['Designing Digital', 'Experiences That', 'Feel Right.'],
  hero_lead:
    'I design intuitive digital experiences for startups and businesses, from first wireframes to high-fidelity UI in Figma.',
  availability_text: 'Open to freelance & internships',
  cv_url: '',
  hero_photo_url: '',
  about_photo_url: '',
  about_photo_caption: 'Yasmeen · UI/UX ✦',
  // *text* marks the italic accent part of a heading.
  about_heading: 'Designing with *Purpose.*',
  // ==text== marks the animated highlights (first paragraph only).
  about_paragraphs: [
    'I’m a ==UI/UX designer== and a graduate of Delta University for Science and Technology, Faculty of Artificial Intelligence, with a background in ==technology== and a passion for creating ==intuitive and user-centered== experiences.',
    'I design user interfaces and experiences for web and mobile applications using tools like Figma and AI tools. My process focuses on user research, user flows, information architecture, wireframes, and high-fidelity prototypes to create products that are both functional and visually appealing.',
    'My goal is to help clients turn their ideas into digital products that provide a smooth and meaningful user experience.',
  ],
  soft_skills: ['Communication', 'Problem Solving', 'Creativity', 'Detail-Oriented'],
  languages: ['Arabic – Native', 'English – Good'],
  email: '',
  phone: '',
  linkedin_url: '',
  behance_url: '',
  contact_heading: 'Have an Idea? *Let’s Make It Happen.*',
  contact_text:
    'I’m open to freelance projects, internship opportunities, and collaborations. Whether you have a product idea, need a design review, or want to talk UX — feel free to reach out.',
  footer_role_line: 'UI/UX Designer · Web & Mobile',
};

const stat = (placement, value_number, value_text, suffix, label, icon) => ({
  placement,
  value_number,
  value_text,
  suffix,
  label,
  icon,
});

const stats = ordered('stat', [
  stat('strip', 2, null, '+', 'Projects Completed', 'devices'),
  stat('strip', 120, null, 'h', 'Internship Hours', 'ring'),
  stat('strip', null, 'Figma', '', 'Primary Design Tool', 'swatches'),
  stat('strip', null, 'AI', '', 'Academic Background', 'network'),
  stat('about', 30, null, '+', 'Design Projects', 'none'),
  stat('about', 120, null, 'h', 'Internship Hours', 'none'),
  stat('about', null, 'Figma', '', 'Primary Design Tool', 'none'),
  stat('about', null, 'AI', '', 'Faculty Background', 'none'),
]);

const edu = (badge, title, institution, details, status_label, is_current = false, is_featured = false) => ({
  badge,
  title,
  institution,
  details,
  status_label,
  is_current,
  is_featured,
});

const education = ordered('edu', [
  edu(
    'Postgraduate Studies',
    'Pre-Master’s Program',
    'Faculty of Computers and Information, Mansoura University',
    'Department of Computer Science',
    'Currently Enrolled',
    true,
    true,
  ),
  edu(
    'Bachelor’s Degree',
    'Artificial Intelligence',
    'Delta University For Science And Technology',
    'Faculty of Artificial Intelligence · 2021 – 2025',
    'Degree earned',
  ),
  edu('MaharaTech', 'UX Design Fundamentals', '', 'Foundational UX principles and methodology', 'Completed'),
  edu('FreeCodeCamp', 'UI/UX Tutorial', '', 'Practical interface design fundamentals', 'Completed'),
  edu(
    'Coursera',
    'Learn Figma for UI/UX Design',
    '',
    'Completed a two financial app screens design task',
    'Completed',
  ),
]);

const step = (period, title, organization, description, tags, is_current = false, sticker_text = '') => ({
  period,
  title,
  organization,
  description,
  tags,
  is_current,
  sticker_text,
});

const journey = ordered('journey', [
  step(
    '2021 – 2025',
    'Bachelor’s Degree — Artificial Intelligence',
    'Delta University For Science And Technology',
    'Four years in the Faculty of AI built the technology foundation behind how I design smart, user-centred products.',
    ['AI', 'Technology'],
  ),
  step(
    'Along the way',
    'Learning UX, step by step',
    'MaharaTech · FreeCodeCamp · Coursera',
    'UX fundamentals, UI/UX basics, and a Figma course that ended with a two-screen financial app design task.',
    ['UX', 'UI', 'Figma'],
  ),
  step(
    'Ramadan 2025',
    'Volunteer — Community Food Distribution',
    'Community Service',
    'Helped distribute food packages to families in need during charity and Ramadan initiatives.',
    ['Community', 'Teamwork'],
  ),
  step(
    '2026 – Present',
    'UI/UX Designer Intern — NTI Creativa',
    'National Telecommunications Institute · Innovation Hub',
    'A 120-hour internship on real-world interface design projects, applying user research, personas, wireframing, and interactive prototyping in Figma.',
    ['Research', 'Personas', 'Wireframes', 'Prototyping'],
    true,
    '120 hours',
  ),
]);

const skillLanes = ordered('lane', [
  {
    number_label: '01',
    title: 'Understand',
    subtitle: 'Research & structure',
    items: [
      'UX Research',
      'User Personas',
      'User Flows',
      'User Journey Mapping',
      'Information Architecture',
      'Usability Testing',
    ],
  },
  {
    number_label: '02',
    title: 'Design',
    subtitle: 'Shape & polish',
    items: [
      'Wireframing',
      'Low-Fi Mockups',
      'High-Fi Mockups',
      'Visual Design',
      'Interaction Design',
      'Design Systems',
    ],
  },
  {
    number_label: '03',
    title: 'Deliver',
    subtitle: 'Prototype & hand-off',
    items: ['Figma', 'Prototyping', 'Responsive Mockups', 'Canva'],
  },
]);

const serviceGroups = ordered('group', [
  { slug: 'design', name: 'Product design', lead: 'Interfaces people understand at first glance.' },
  { slug: 'research', name: 'Research & content', lead: 'The thinking and writing behind the screens.' },
  {
    slug: 'systems',
    name: 'Systems & handoff',
    lead: 'Everything a team needs to build and keep it consistent.',
  },
]);

const groupId = (slug) => serviceGroups.find((g) => g.slug === slug).id;
const service = (slug, name, description) => ({ group_id: groupId(slug), name, description });

const services = ordered('service', [
  service('design', 'Mobile App Design', 'Pixel-perfect iOS and Android interfaces built for real users.'),
  service('design', 'Web Design', 'Responsive web designs centered on usability and visual clarity.'),
  service('design', 'Landing Page Design', 'High-converting landing pages that make a strong first impression.'),
  service('design', 'Responsive Design', 'Designs that work beautifully across all screen sizes and devices.'),
  service('design', 'Redesign', 'Improve existing interfaces with fresh, user-centered design approaches.'),
  service('research', 'UX Research', 'User interviews, surveys, personas, and actionable insight synthesis.'),
  service('research', 'UX Writing', 'Clear, purposeful copy that guides users through digital experiences.'),
  service(
    'research',
    'UX Case Study Creation',
    'In-depth case studies documenting research, process, and design decisions.',
  ),
  service('systems', 'Design Systems', 'Scalable component libraries and style guides for consistent products.'),
  service('systems', 'Prototyping', 'Interactive high-fidelity Figma prototypes ready for user testing.'),
  service('systems', 'Templates', 'Ready-to-use, polished design templates for quick product launches.'),
]);

const project = (title, tag, description) => ({
  title,
  tag,
  description,
  cover_url: '',
  screen_urls: [],
  case_study_url: '',
  is_published: true,
});

const projects = ordered('project', [
  project(
    'CareMate',
    'Mobile App · Healthcare',
    'A healthcare app combining medication delivery and home nursing services in one intuitive platform.',
  ),
  project(
    'Attark',
    'Mobile App · Herbal Wellness',
    'A digital herbal store where users discover safe natural remedies, search by symptoms, and connect with specialists.',
  ),
]);

const contactTopics = ordered(
  'topic',
  ['Freelance project', 'Internship', 'Collaboration', 'Design review'].map((label) => ({ label })),
);

export const seed = {
  profile,
  stats,
  education,
  journey,
  skillLanes,
  serviceGroups,
  services,
  projects,
  contactTopics,
};
