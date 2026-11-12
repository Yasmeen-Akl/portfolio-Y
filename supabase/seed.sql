-- Seed content: the text of the original page, word for word (same as src/data/seed.js).
-- Run once, after the migrations. Re-running adds duplicate list rows (profile is upserted).

insert into public.profile (
  id, full_name, kicker_line, hero_headline, hero_lead, availability_text, cv_url,
  hero_photo_url, about_photo_url, about_photo_caption, about_heading, about_paragraphs,
  soft_skills, languages, email, phone, linkedin_url, behance_url,
  contact_heading, contact_text, footer_role_line
) values (
  1,
  'Yasmeen Ahmed Akl',
  'UI/UX designer for web & mobile',
  array['Designing Digital', 'Experiences That', 'Feel Right.'],
  'I design intuitive digital experiences for startups and businesses, from first wireframes to high-fidelity UI in Figma.',
  'Open to freelance & internships',
  '',
  '',
  '',
  'Yasmeen · UI/UX ✦',
  'Designing with *Purpose.*',
  array[
    'I’m a ==UI/UX designer== and a graduate of Delta University for Science and Technology, Faculty of Artificial Intelligence, with a background in ==technology== and a passion for creating ==intuitive and user-centered== experiences.',
    'I design user interfaces and experiences for web and mobile applications using tools like Figma and AI tools. My process focuses on user research, user flows, information architecture, wireframes, and high-fidelity prototypes to create products that are both functional and visually appealing.',
    'My goal is to help clients turn their ideas into digital products that provide a smooth and meaningful user experience.'
  ],
  array['Communication', 'Problem Solving', 'Creativity', 'Detail-Oriented'],
  array['Arabic – Native', 'English – Good'],
  '', '', '', '',
  'Have an Idea? *Let’s Make It Happen.*',
  'I’m open to freelance projects, internship opportunities, and collaborations. Whether you have a product idea, need a design review, or want to talk UX — feel free to reach out.',
  'UI/UX Designer · Web & Mobile'
)
on conflict (id) do update set
  full_name = excluded.full_name,
  kicker_line = excluded.kicker_line,
  hero_headline = excluded.hero_headline,
  hero_lead = excluded.hero_lead,
  availability_text = excluded.availability_text,
  about_photo_caption = excluded.about_photo_caption,
  about_heading = excluded.about_heading,
  about_paragraphs = excluded.about_paragraphs,
  soft_skills = excluded.soft_skills,
  languages = excluded.languages,
  contact_heading = excluded.contact_heading,
  contact_text = excluded.contact_text,
  footer_role_line = excluded.footer_role_line;

insert into public.stats (placement, value_number, value_text, suffix, label, icon, sort_order) values
  ('strip', 2,    null,    '+', 'Projects Completed',  'devices',  0),
  ('strip', 120,  null,    'h', 'Internship Hours',    'ring',     1),
  ('strip', null, 'Figma', '',  'Primary Design Tool', 'swatches', 2),
  ('strip', null, 'AI',    '',  'Academic Background', 'network',  3),
  ('about', 30,   null,    '+', 'Design Projects',     'none',     4),
  ('about', 120,  null,    'h', 'Internship Hours',    'none',     5),
  ('about', null, 'Figma', '',  'Primary Design Tool', 'none',     6),
  ('about', null, 'AI',    '',  'Faculty Background',  'none',     7);

insert into public.education (badge, title, institution, details, status_label, is_current, is_featured, sort_order) values
  ('Postgraduate Studies', 'Pre-Master’s Program', 'Faculty of Computers and Information, Mansoura University', 'Department of Computer Science', 'Currently Enrolled', true, true, 0),
  ('Bachelor’s Degree', 'Artificial Intelligence', 'Delta University For Science And Technology', 'Faculty of Artificial Intelligence · 2021 – 2025', 'Degree earned', false, false, 1),
  ('MaharaTech', 'UX Design Fundamentals', '', 'Foundational UX principles and methodology', 'Completed', false, false, 2),
  ('FreeCodeCamp', 'UI/UX Tutorial', '', 'Practical interface design fundamentals', 'Completed', false, false, 3),
  ('Coursera', 'Learn Figma for UI/UX Design', '', 'Completed a two financial app screens design task', 'Completed', false, false, 4);

insert into public.journey (period, title, organization, description, tags, is_current, sticker_text, sort_order) values
  ('2021 – 2025', 'Bachelor’s Degree — Artificial Intelligence', 'Delta University For Science And Technology', 'Four years in the Faculty of AI built the technology foundation behind how I design smart, user-centred products.', array['AI', 'Technology'], false, '', 0),
  ('Along the way', 'Learning UX, step by step', 'MaharaTech · FreeCodeCamp · Coursera', 'UX fundamentals, UI/UX basics, and a Figma course that ended with a two-screen financial app design task.', array['UX', 'UI', 'Figma'], false, '', 1),
  ('Ramadan 2025', 'Volunteer — Community Food Distribution', 'Community Service', 'Helped distribute food packages to families in need during charity and Ramadan initiatives.', array['Community', 'Teamwork'], false, '', 2),
  ('2026 – Present', 'UI/UX Designer Intern — NTI Creativa', 'National Telecommunications Institute · Innovation Hub', 'A 120-hour internship on real-world interface design projects, applying user research, personas, wireframing, and interactive prototyping in Figma.', array['Research', 'Personas', 'Wireframes', 'Prototyping'], true, '120 hours', 3);

insert into public.skill_lanes (number_label, title, subtitle, items, sort_order) values
  ('01', 'Understand', 'Research & structure', array['UX Research', 'User Personas', 'User Flows', 'User Journey Mapping', 'Information Architecture', 'Usability Testing'], 0),
  ('02', 'Design', 'Shape & polish', array['Wireframing', 'Low-Fi Mockups', 'High-Fi Mockups', 'Visual Design', 'Interaction Design', 'Design Systems'], 1),
  ('03', 'Deliver', 'Prototype & hand-off', array['Figma', 'Prototyping', 'Responsive Mockups', 'Canva'], 2);

insert into public.service_groups (slug, name, lead, sort_order) values
  ('design',   'Product design',     'Interfaces people understand at first glance.', 0),
  ('research', 'Research & content', 'The thinking and writing behind the screens.', 1),
  ('systems',  'Systems & handoff',  'Everything a team needs to build and keep it consistent.', 2);

insert into public.services (group_id, name, description, sort_order)
select g.id, s.name, s.description, s.sort_order
from (values
  ('design',   'Mobile App Design',      'Pixel-perfect iOS and Android interfaces built for real users.', 0),
  ('design',   'Web Design',             'Responsive web designs centered on usability and visual clarity.', 1),
  ('design',   'Landing Page Design',    'High-converting landing pages that make a strong first impression.', 2),
  ('design',   'Responsive Design',      'Designs that work beautifully across all screen sizes and devices.', 3),
  ('design',   'Redesign',               'Improve existing interfaces with fresh, user-centered design approaches.', 4),
  ('research', 'UX Research',            'User interviews, surveys, personas, and actionable insight synthesis.', 5),
  ('research', 'UX Writing',             'Clear, purposeful copy that guides users through digital experiences.', 6),
  ('research', 'UX Case Study Creation', 'In-depth case studies documenting research, process, and design decisions.', 7),
  ('systems',  'Design Systems',         'Scalable component libraries and style guides for consistent products.', 8),
  ('systems',  'Prototyping',            'Interactive high-fidelity Figma prototypes ready for user testing.', 9),
  ('systems',  'Templates',              'Ready-to-use, polished design templates for quick product launches.', 10)
) as s (slug, name, description, sort_order)
join public.service_groups g on g.slug = s.slug;

insert into public.projects (title, tag, description, cover_url, screen_urls, case_study_url, is_published, sort_order) values
  ('CareMate', 'Mobile App · Healthcare', 'A healthcare app combining medication delivery and home nursing services in one intuitive platform.', '', '{}', '', true, 0),
  ('Attark', 'Mobile App · Herbal Wellness', 'A digital herbal store where users discover safe natural remedies, search by symptoms, and connect with specialists.', '', '{}', '', true, 1);

insert into public.contact_topics (label, sort_order) values
  ('Freelance project', 0),
  ('Internship', 1),
  ('Collaboration', 2),
  ('Design review', 3);
