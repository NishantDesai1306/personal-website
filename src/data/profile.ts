// Single source of truth for the portfolio's content.
// Do not add roles, results or claims here that are not backed by the résumé
// or confirmed by Nishant. No invented metrics.

export interface Link {
  label: string;
  href: string;
}

export interface SkillGroup {
  name: string;
  items: string[];
}

export interface CaseStudy {
  id: string;
  title: string;
  company: string;
  summary: string;
  /** Short, technically accurate dependency chain shown as a diagram. */
  chain: string[];
  sections: { heading: string; body: string }[];
  stack: string[];
}

export interface Job {
  id: string;
  company: string;
  url: string;
  title: string;
  start: { year: number; month: number };
  /** Omit for the current role. */
  end?: { year: number; month: number };
  duration: string;
  points: (string | { main: string; subPoints: string[] })[];
}

export interface ProjectPart {
  name: string;
  description: string;
  stack: string[];
  links?: Link[];
}

export interface Project {
  id: string;
  name: string;
  kind: string;
  summary: string;
  stack: string[];
  links: Link[];
  parts?: ProjectPart[];
}

/** Matches the résumé PDF; update both together. */
const yearsOfExperience = 10;

export const profile = {
  name: 'Nishant Desai',
  /** Current job title (used in structured data). */
  role: 'Senior Frontend Developer',
  tagline: 'Senior Frontend Engineer · Architecture & migrations',
  intro:
    `I build fast, maintainable React and Next.js applications and help teams through larger technical changes: framework migrations, architecture decisions and performance work. I've been doing this for ${yearsOfExperience} years, and I work in Canada.`,
  country: 'Canada',
  since: 2016,
  yearsOfExperience,
  email: 'nishantdesai1306@gmail.com',
  resume: '/Nishant_Desai_Resume.pdf',
  site: 'https://nishantdesai1306.github.io/',
  photo: { width: 420, height: 480 },
  links: {
    github: 'https://github.com/NishantDesai1306',
    linkedin: 'https://www.linkedin.com/in/nishant-desai-706018105/',
    upwork: 'https://www.upwork.com/o/profiles/users/_~0138e4c1eefd3394a6/',
    facebook: 'https://www.facebook.com/nishant.desai.1306',
  },
  about: [
    `I'm a frontend-focused software engineer with ${yearsOfExperience} years of experience building and maintaining complex web applications. Beyond shipping features, I've helped make architecture decisions, co-led framework migrations, and written the guidelines that help teams deliver consistently.`,
    'Most of my recent work is in React, Next.js and Material UI. At J.D. Power I improved the Core Web Vitals of jdpower.com over several months, and tracked down a Google Ads issue that had been affecting the site for months.',
    'I have also worked across the stack: Node.js backends, a horizontally scalable server provisioning system and a two-tier cache that halved S3 costs at modd.io, plus mobile apps in React Native and Flutter.',
    'I started at JumpByte (now AppGambit) shortly after graduating from Uka Tarsadia University, working on a wide variety of projects.',
  ],
  contact:
    "I welcome opportunities to discuss potential collaborations, whether it's a job opportunity, project proposal, or technical discussion. I'm committed to providing thoughtful responses to all professional inquiries.",
} as const;

/** Grouped by competency; only skills backed by the résumé or the jobs below. */
export const skillGroups: SkillGroup[] = [
  { name: 'Frontend engineering', items: ['React', 'Next.js', 'Material UI', 'JavaScript', 'HTML', 'CSS'] },
  {
    name: 'Technical leadership',
    items: ['Framework migrations', 'Architecture decisions', 'Technical documentation', 'Developer guidelines'],
  },
  { name: 'Performance', items: ['Core Web Vitals', 'Web performance', 'Production debugging'] },
  { name: 'Backend & infrastructure', items: ['Node.js', 'Express', 'MongoDB', 'MySQL', 'AWS S3', 'Auto-scaling game servers'] },
  { name: 'Mobile & earlier work', items: ['React Native', 'Flutter', 'Angular', 'Meteor'] },
];

export const skills = skillGroups.flatMap((group) => group.items);

export const caseStudies: CaseStudy[] = [
  {
    id: 'frontend-migration',
    title: 'Leading a multi-framework frontend migration',
    company: 'J.D. Power',
    summary:
      'What started as a Next.js upgrade on jdpower.com turned into a coordinated migration across Next.js, React and Material UI. I co-led the effort with the team.',
    chain: ['Next.js upgrade', 'newer React', 'Material UI v4 → v5'],
    sections: [
      { heading: 'Problem', body: 'The jdpower.com frontend needed a Next.js upgrade to keep the stack current.' },
      {
        heading: 'Discovery',
        body: 'Upgrading Next.js meant upgrading React, and that in turn required moving Material UI from v4 to v5. The Material UI migration proved to be a much larger undertaking than the original upgrade.',
      },
      {
        heading: 'Decision',
        body: 'As a team, we decided to tackle the Material UI migration first. I took part in that architectural decision and helped set the implementation approach and timeline.',
      },
      {
        heading: 'My contribution',
        body: 'I documented the easiest migration paths and the technical issues developers were likely to hit, wrote guidelines for current and future development, and guided other developers through the migration.',
      },
      {
        heading: 'Outcome',
        body: 'Material UI and Next.js were upgraded, and the guidelines remained in place for later frontend work.',
      },
    ],
    stack: ['Next.js', 'React', 'Material UI'],
  },
];

/** Core Web Vitals results at J.D. Power (Search Console URL counts). */
export const vitals = [
  { viewport: 'Mobile', good: 197, poor: 96 },
  { viewport: 'Desktop', good: 168, poor: 21 },
] as const;

export const jobs: Job[] = [
  {
    id: 'jdpower',
    company: 'J.D. Power',
    url: 'https://jdpower.com',
    title: 'Senior Frontend Developer',
    start: { year: 2022, month: 11 },
    duration: 'November 2022 - Present',
    points: [
      'Maintained jdpower.com, a Next.js web application that connects users with car dealers or with other users who want to sell their cars.',
      'Co-led the Material UI v4 → v5 and Next.js upgrades: helped decide to tackle the larger Material UI migration first, set the approach and timeline, documented migration paths and likely issues, and guided other developers through the work.',
      'Wrote frontend guidelines for future development as part of the migration.',
      'Helped migrate from the Pages Router to the App Router in Next.js.',
      'Debugged a Google Ads issue that had affected the site for months, and streamlined the implementation so Google no longer served empty ads.',
      'Helped choose and integrate the analytics tools used in production.',
      {
        main: 'Improved the overall performance and Core Web Vitals of the application by carefully optimizing the codebase over several months.',
        subPoints: [
          'Mobile: increased "Good" URLs by 197% and reduced "Poor" URLs by 96%.',
          'Desktop: increased "Good" URLs by 168% and reduced "Poor" URLs by 21%.',
        ],
      },
    ],
  },
  {
    id: 'foodx',
    company: 'FoodX',
    url: 'https://www.foodxtech.com/',
    title: 'Fullstack Developer (on Contract)',
    start: { year: 2020, month: 9 },
    end: { year: 2022, month: 9 },
    duration: 'September 2020 - September 2022',
    points: [
      'Worked on a React-based web application that lets users manage orders and products online.',
      'Designed UI/UX solutions based on what was most feasible for a given task.',
      'Took the lead in designing and implementing multiple company-wide features.',
    ],
  },
  {
    id: 'moddio',
    company: 'modd.io',
    url: 'https://www.modd.io/',
    title: 'Application Developer',
    start: { year: 2018, month: 1 },
    end: { year: 2020, month: 9 },
    duration: 'January 2018 - September 2020',
    points: [
      'Worked on a React-based web application that lets users build their own multiplayer games.',
      'Reduced S3 costs by 50% through a two-tier caching system.',
      'Designed and built a horizontally scalable provisioning and communication system among servers.',
      'Hosted and auto-scaled games on game servers to provide a smooth UX.',
      'Deployed private servers that let users create game sessions only people with invite links can join.',
      'Designed and developed hybrid apps for clients using React Native.',
    ],
  },
  {
    id: 'appgambit',
    company: 'AppGambit',
    url: 'https://appgambit.com/',
    title: 'AppGambit (formerly JumpByte)',
    start: { year: 2016, month: 5 },
    end: { year: 2017, month: 12 },
    duration: 'May 2016 - December 2017',
    points: [
      'Developed and maintained a notification server built on top of Meteor.',
      'Developed and managed multiple projects on both the frontend and the backend.',
      'Manually tested web apps in various browsers to ensure cross-browser compatibility.',
      'Worked on a native Android app used for internal communication.',
    ],
  },
];

export const projects: Project[] = [
  {
    id: 'smart-copy',
    name: 'Smart Copy',
    kind: 'Android · Web · Mobile',
    summary:
      'Smart Copy explores one problem across native and cross-platform apps: keeping copied text and notes accessible wherever you work. I built Android, Angular, React, and React Native implementations, including a Node.js backend and a Firebase-backed PWA.',
    stack: ['Android', 'Angular', 'React', 'React Native', 'Firebase'],
    links: [
      { label: 'Demo', href: 'https://www.youtube.com/watch?v=BB-6VMgOwFc' },
      { label: 'Code', href: 'https://github.com/NishantDesai1306/react-native-smart-copy' },
    ],
    parts: [
      {
        name: 'Android (Native)',
        description:
          "Smart Copy started from this project. On native Android I used the platform's floating window, so whenever a user double-clicks any input field in any app, a dismissible floating bubble pops up showing all copied items in a floating list.",
        stack: ['Android', 'Java'],
      },
      {
        name: 'Angular App',
        description:
          'A mobile-responsive web companion to the mobile app, built with Angular v6. It connects to the same database, so everything you copy in the Android app is also accessible on the web. I also wrote the NodeJS backend server that serves the data to the app.',
        stack: ['Angular', 'Angular Material', 'NodeJS', 'ExpressJS', 'MongoDB', 'Mongoose'],
      },
      {
        name: 'React App',
        description:
          'Another mobile-responsive web companion to the original Smart Copy app, built with React. It is also a PWA, so you can install it on other smartphones or as a desktop app. It uses Firebase for file storage (profile pictures) and Firestore as the backend to store and retrieve items.',
        stack: ['React', 'Material UI', 'Firebase', 'Workbox'],
      },
      {
        name: 'React Native',
        description:
          'A simple React Native mobile app that supports user accounts and shows a list of items you can edit or delete. I started this project to learn more about hybrid mobile frameworks that let me build the same app for Android and iOS.',
        stack: ['React Native'],
        links: [{ label: 'Code', href: 'https://github.com/NishantDesai1306/react-native-smart-copy' }],
      },
    ],
  },
  {
    id: 'chess',
    name: 'Chess',
    kind: 'Web',
    summary:
      'A chess application built with React and Node.js. I integrated Stockfish 15 to show a position evaluation bar alongside the board, combining a focused interface with chess-engine feedback.',
    stack: ['React', 'NodeJS', 'Bootstrap', 'Stockfish 15'],
    links: [{ label: 'Code', href: 'https://github.com/NishantDesai1306/chess' }],
  },
  {
    id: 'chatzz',
    name: 'Chatzz',
    kind: 'Library',
    summary:
      'Chatzz is a Socket.io-based chat framework: a reusable Node.js foundation for adding real-time messaging to a chat application.',
    stack: ['Socket.io', 'NodeJS'],
    links: [{ label: 'Code', href: 'https://github.com/NishantDesai1306/chatzz' }],
  },
  {
    id: 'yt-sub-counter',
    name: 'YouTube Subscriber Counter',
    kind: 'Mobile',
    summary:
      'A cross-platform Flutter app for comparing the subscriber counts of two YouTube channels, exploring a shared mobile UI framework.',
    stack: ['Flutter'],
    links: [
      { label: 'Demo', href: 'https://www.youtube.com/watch?v=RwFfTf3dJww' },
      { label: 'Code', href: 'https://github.com/NishantDesai1306/youtube_channel_sub_counter/tree/master' },
    ],
  },
];
