// Frozen copy of the first content, used only by the designs that were not chosen (current, A1, B2).

export type Link = { label: string; href: string };

export type Badge = { label: string; tone: "green" | "blue" | "yellow" | "red" };

export type Visual =
  | { kind: "image"; src: string; alt: string; width: number; height: number; frame?: "dark" | "light" }
  | { kind: "bidi" }
  | { kind: "pipeline"; caption: string; steps: { label: string; owner?: boolean }[] };

export type Project = {
  name: string;
  kicker: string;
  badge?: Badge;
  summary: string;
  points: string[];
  stack: string[];
  links: Link[];
  visual: Visual;
  /** full = whole row, wide = 7 of 12 columns, narrow = 5 of 12 */
  size: "full" | "wide" | "narrow";
};

export type Role = {
  period: string;
  title: string;
  org: string;
  points: string[];
};

export const site = {
  name: "Amir Mohammad Jazayeri",
  shortName: "Amir Jazayeri",
  role: "Software engineer",
  location: "Tehran",
  url: "https://amirjaz.github.io",
  email: "amir.jazayeri4@gmail.com",
  github: "https://github.com/Amirjaz",
  linkedin: "https://www.linkedin.com/in/amir-jazayeri613026298",
  description:
    "Software engineer in Tehran. I build web products for Persian-speaking users: right-to-left React components, browser extensions and the PostgreSQL services behind them.",
  intro: [
    "I build web products for Persian-speaking users: right-to-left React components, browser extensions, and the PostgreSQL services behind them.",
    "I study Computer Engineering at Sharif University of Technology and work as a full-stack engineer at Nisatech. My background is frontend; these days I spend most of my time on backend and AI engineering.",
  ],
  facts: [
    { value: "100+", label: "installs of Letterboxd Toolkit across Chrome and Firefox" },
    { value: "2", label: "open-source React libraries for Persian products" },
    { value: "6", label: "live medical-practice websites I maintain" },
    { value: "7", label: "course-semesters as a teaching assistant at Sharif" },
  ],
};

export const projects: Project[] = [
  {
    name: "Letterboxd Toolkit",
    kicker: "Browser extension for Chrome and Firefox",
    badge: { label: "100+ installs", tone: "green" },
    summary:
      "Native-looking tools for Letterboxd, each switched on separately: a recap of your whole film diary, how the people you follow rated a film, progress rings on lists, and outside scores on film pages.",
    points: [
      "Three tiers: the extension, a stateless API and a cache server.",
      "A normalized PostgreSQL replica of TMDB, about 30 tables, queried with typed SQL through Kysely.",
      "Private by design: the API only receives film slugs and ratings, and stores nothing.",
    ],
    stack: ["TypeScript", "Vite", "Manifest V3", "Node.js", "PostgreSQL", "Kysely"],
    links: [{ label: "lttr.ir", href: "https://lttr.ir" }],
    visual: {
      kind: "image",
      src: "/images/letterboxd-toolkit.webp",
      alt: "Letterboxd Toolkit store image: the A Life in Film recap, with a marquee title and a ticket showing 1,124 films, 2,031 hours and 584 directors",
      width: 1280,
      height: 800,
      frame: "dark",
    },
    size: "full",
  },
  {
    name: "persian-ui",
    kicker: "Open-source React library",
    badge: { label: "Open source", tone: "blue" },
    summary:
      "Persian-first React components and utilities that get the hard parts right: right-to-left layout, numbers inside Persian text, Jalali dates, Persian digits, and Iranian ID, mobile and Sheba validators with real checksums.",
    points: [
      "Logical CSS properties only; every component is tested under both dir=\"rtl\" and dir=\"ltr\".",
      "Bidi fixes are verified by measuring glyph positions in a real browser, not by reading markup.",
      "Zero runtime dependencies, tree-shakeable ESM and CJS, React 18 and 19.",
    ],
    stack: ["React", "TypeScript", "Vitest", "Playwright"],
    links: [{ label: "GitHub", href: "https://github.com/Amirjaz/persian-ui" }],
    visual: { kind: "bidi" },
    size: "wide",
  },
  {
    name: "Shamsi-Calendar",
    kicker: "npm package",
    badge: { label: "On npm", tone: "yellow" },
    summary:
      "A Jalali date picker for React that matches shadcn/ui. It reads your theme's CSS variables, so dark mode and colours work with no setup. RTL by default, full keyboard support.",
    points: [],
    stack: ["React", "TypeScript", "jalaali-js"],
    links: [
      { label: "npm", href: "https://www.npmjs.com/package/shamsi-calendar" },
      { label: "GitHub", href: "https://github.com/Amirjaz/Shamsi-Calendar" },
    ],
    visual: {
      kind: "image",
      src: "/images/shamsi-calendar.webp",
      alt: "Shamsi-Calendar date picker open on Farvardin 1405, with Nowruz holidays marked in red and the 13th selected",
      width: 344,
      height: 462,
      frame: "light",
    },
    size: "narrow",
  },
  {
    name: "SinGo",
    kicker: "Persian karaoke app, built by two people",
    badge: { label: "Early stage", tone: "yellow" },
    summary:
      "Pick a song, sing over the instrumental with synced lyrics, then record and share your take. I own the native Android recorder, the backend and the release builds; my teammate owns the player and the catalogue.",
    points: [
      "Catalogue API in FastAPI on PostgreSQL, with a job queue that uses leases and retries.",
      "A Python pipeline turns one MP3 into an instrumental, synced lyrics and word-level timings.",
      "Persian search that reads each half-space as both a space and nothing, so «بی‌احساس», «بی احساس» and «بیاحساس» find the same song.",
    ],
    stack: ["Android", "Python", "FastAPI", "PostgreSQL", "Whisper"],
    links: [],
    visual: {
      kind: "pipeline",
      caption: "From one MP3 to a recorded take. Highlighted steps are mine.",
      steps: [
        { label: "MP3" },
        { label: "Instrumental + vocals" },
        { label: "Lyrics + word timings", owner: true },
        { label: "Catalogue + job queue", owner: true },
        { label: "Record on device", owner: true },
        { label: "Mix + share" },
      ],
    },
    size: "full",
  },
];

export const experience: Role[] = [
  {
    period: "2025 to now",
    title: "Software Engineer",
    org: "Nisatech",
    points: [
      "Build and ship full-stack features across Next.js, Express and PostgreSQL, owning both the interface and the services behind it.",
      "Design the REST APIs behind those features, then profile and fix the endpoints that are slowest under load.",
      "Work across teams on architecture and code quality, and debug production issues in the frontend and API layers.",
    ],
  },
  {
    period: "2025",
    title: "Frontend Developer, internship",
    org: "Danesh Solutions",
    points: [
      "Built a real-time chart system that streams live backend data into interactive charts.",
      "Helped build an admin panel that sends messages to Telegram, Eita and other platforms, with views for reviewing what was sent.",
    ],
  },
  {
    period: "2023 to now",
    title: "Web and SEO Engineer",
    org: "Freelance",
    points: [
      "Maintain six live medical-practice websites, owning technical SEO, page performance and content.",
      "Ran a Search Console audit across all six and worked through the fix list: crawl errors, indexing gaps, Core Web Vitals.",
      "Built client sites from scratch in React and Next.js, including an industrial workshop site and an animated café menu.",
    ],
  },
  {
    period: "2024 to 2026",
    title: "Teaching Assistant",
    org: "Sharif University of Technology",
    points: [
      "Seven course-semesters, including Web Programming and Software Engineering, twice each.",
    ],
  },
];

export const education = {
  degree: "B.Sc. Computer Engineering, software engineering track",
  school: "Sharif University of Technology",
  period: "2022 to 2027 (expected February)",
  interests: "Software engineering, developer tools, and AI for software engineering.",
};

export const skills: { group: string; items: string[] }[] = [
  { group: "Languages", items: ["TypeScript", "JavaScript", "Python", "SQL"] },
  { group: "Frontend", items: ["React", "Next.js", "Vue", "Tailwind CSS"] },
  { group: "Backend", items: ["Node.js", "Express", "Django", "FastAPI", "REST APIs"] },
  { group: "Data", items: ["PostgreSQL", "Kysely"] },
  { group: "Tools", items: ["Docker", "Git", "Claude Code", "OpenAI API"] },
];
