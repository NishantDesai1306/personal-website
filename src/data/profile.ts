// Single source of truth for the portfolio's content.
// Copy is carried over from the previous React site; do not add roles,
// results or claims here that are not backed by the résumé.

export interface Link {
  label: string;
  href: string;
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

export const profile = {
  name: 'Nishant Desai',
  role: 'Senior Frontend Developer',
  tagline: 'Senior Frontend Developer building fast React and Next.js apps',
  intro:
    "I'm a software engineer working in Canada. Since 2016 I have built web apps, scalable backends and React Native mobile apps, with a focus on performance and clean, intuitive UI.",
  country: 'Canada',
  since: 2016,
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
    "Hello! I'm Nishant Desai, a software engineer who loves creating new and exciting web-based apps. I develop apps with intuitive, pixel-perfect UIs and efficient backends.",
    'Shortly after graduating from Uka Tarsadia University, I joined JumpByte (now AppGambit) where I worked on a wide variety of projects on a daily basis.',
    'I specialize in the MEAN and MERN stacks for web apps, and I have built mobile apps with React Native and Flutter.',
    "I'm always interested in improving myself as a developer, and in meeting interesting people.",
  ],
  contact:
    "I welcome opportunities to discuss potential collaborations, whether it's a job opportunity, project proposal, or technical discussion. I'm committed to providing thoughtful responses to all professional inquiries.",
} as const;

export const technologies: Link[] = [
  { label: 'NextJS', href: 'https://nextjs.org/' },
  { label: 'React', href: 'https://react.dev/' },
  { label: 'NodeJS', href: 'https://nodejs.org/en/' },
  { label: 'Angular', href: 'https://angular.dev/' },
  { label: 'Meteor', href: 'https://www.meteor.com' },
  { label: 'React Native', href: 'https://reactnative.dev/' },
  { label: 'Flutter', href: 'https://flutter.dev' },
  { label: 'MySQL', href: 'https://www.mysql.com' },
  { label: 'MongoDB', href: 'https://www.mongodb.com' },
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
      'Worked on a NextJS-based web application that connects users with car dealers or with other users who want to sell their cars.',
      'Debugged and resolved a Google Ads issue that had been plaguing the app for months.',
      'Streamlined the Google Ads implementation, eliminating cases where Google would serve empty ads.',
      'Led the migration of Material UI from v4 to v5.',
      'Helped migrate from the Pages Router to the App Router in NextJS.',
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
