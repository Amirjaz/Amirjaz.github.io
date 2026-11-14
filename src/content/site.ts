// Everything the page says lives in this file. To add a project, add one entry to `projects`.

export type Link = { label: string; href: string };

export type Badge = { label: string; tone: "green" | "blue" | "yellow" | "red" };

export type Visual =
  | { kind: "image"; src: string; alt: string; width: number; height: number; frame?: "dark" | "light" }
  | { kind: "bidi" }
  | { kind: "pipeline"; caption: string; steps: { label: string; owner?: boolean }[] }
  | {
      /** A short terminal session, set in type instead of shown as a screenshot. */
      kind: "terminal";
      alt: string;
      command: string;
      context: string;
      fixes: { from: string; to: string; where: string }[];
      result: string;
      note: string;
    };

export type Project = {
  name: string;
  kicker: string;
  badge?: Badge;
  summary: string;
  points: string[];
  stack: string[];
  links: Link[];
  visual: Visual;
  /** A related, smaller project shown inside the same section. */
  also?: { name: string; summary: string; links: Link[] };
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
    "Software engineer in Tehran. I build web products end to end: the interface, the API behind it, and the PostgreSQL database under both.",
  /** One short line for the hero. */
  pitch: "I build web products end to end.",
  intro: [
    "I build web products end to end: the interface, the API behind it, and the PostgreSQL database under both.",
    "I study Computer Engineering at Sharif University of Technology and work as a full-stack engineer at Nisatech. My background is frontend; these days I spend most of my time on backend and AI engineering.",
  ],
  facts: [
    { value: "300+", label: "installs of Letterboxd Toolkit across Chrome and Firefox" },
    { value: "4", label: "open-source libraries and tools on npm, PyPI and GitHub" },
    { value: "6", label: "live medical-practice websites I maintain" },
    { value: "7", label: "course-semesters as a teaching assistant at Sharif" },
  ],
};

export const projects: Project[] = [
  {
    name: "Letterboxd Toolkit",
    kicker: "Browser extension for Chrome and Firefox",
    badge: { label: "300+ installs", tone: "green" },
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
    name: "rtl-doctor",
    kicker: "ESLint plugin and command-line tool",
    badge: { label: "On npm", tone: "green" },
    summary:
      "Finds right-to-left bugs in React, Tailwind and CSS code, and fixes the ones that have a single correct answer, without changing how the page looks today.",
    points: [
      'Fixes depend on direction: on a right-to-left page text-left becomes text-end, and inside a dir="ltr" phone input the same class becomes text-start.',
      "Checked on a production Persian site: after 18 fixes, 0 of 6,058 elements moved across 9 pages at two widths. Mirroring every class moved 402.",
      "Reads the Tailwind version, because the right fix changed between 3 and 4. The rules are tested against real Tailwind 3.4 and 4.3.",
    ],
    stack: ["TypeScript", "ESLint", "PostCSS", "Vitest"],
    links: [
      { label: "npm", href: "https://www.npmjs.com/package/rtl-doctor" },
      { label: "GitHub", href: "https://github.com/Amirjaz/rtl-doctor" },
    ],
    visual: {
      kind: "terminal",
      alt: "a terminal run of rtl-doctor with the fix flag on a production Persian site. It fixes 18 problems in 8 files, and the same class gets a different fix on the right-to-left page and inside a left-to-right input.",
      command: "npx rtl-doctor . --fix",
      context: "Persian, right-to-left, Tailwind 4.3, 53 files",
      fixes: [
        { from: "text-left", to: "text-end", where: "right-to-left page" },
        { from: "text-left", to: "text-start", where: 'inside dir="ltr"' },
        { from: "border-l", to: "border-e", where: "right-to-left page" },
      ],
      result: "Fixed 18 problems in 8 files.",
      note: "0 of 6,058 elements moved.",
    },
    size: "full",
  },
  {
    name: "gsc-pulse",
    kicker: "Python command-line tool",
    badge: { label: "On PyPI", tone: "blue" },
    summary:
      "Turns Google Search Console exports into one HTML report: what grew, what dropped and why, and the five things to do next.",
    points: [
      "Four detectors: bot-click bursts, traffic shifts matched to Google's dated updates, CTR gaps, and queries within reach of the first page.",
      "Every number is computed from your own exports, and every recommendation shows the formula behind its estimate.",
      "The report is one self-contained file that works offline and with JavaScript turned off.",
    ],
    stack: ["Python", "pandas", "NumPy", "Jinja2"],
    links: [
      { label: "PyPI", href: "https://pypi.org/project/gsc-pulse/" },
      { label: "GitHub", href: "https://github.com/Amirjaz/gsc-pulse" },
    ],
    visual: {
      kind: "image",
      src: "/images/gsc-pulse.webp",
      alt: "The top of a gsc-pulse report for a fictional demo site. The headline reads: Real clicks fell 2.5%. A bot burst added 1,584 clicks that made it look like +28.6%.",
      width: 1600,
      height: 1000,
      frame: "light",
    },
    size: "full",
  },
  {
    name: "Shamsi-Calendar",
    kicker: "Open-source React libraries",
    badge: { label: "On npm", tone: "yellow" },
    summary:
      "A Jalali date picker for React that matches shadcn/ui. It reads your theme's CSS variables, so colours and dark mode work with no setup.",
    points: [
      "No Tailwind needed at runtime, and no configuration: it picks up the theme the app already has.",
      "Right-to-left by default, with full keyboard support.",
    ],
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
    also: {
      name: "persian-ui",
      summary:
        "A companion set of React components and utilities for Persian products: inputs for national ID, mobile, Sheba and prices, digit and date helpers, and validators with real checksums.",
      links: [{ label: "persian-ui on GitHub", href: "https://github.com/Amirjaz/persian-ui" }],
    },
    size: "full",
  },
];

/** Left off the site for now. Move an entry back into `projects` to show it again. */
export const shelved: Project[] = [
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
