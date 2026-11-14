import type { CSSProperties, ReactNode } from "react";
import { CompareBar } from "@/components/compare-bar";
import { ProjectCard } from "@/components/project-card";
import { ArrowUpRight, GitHubIcon, LinkedInIcon, MailIcon } from "@/components/icons";
import { education, experience, projects, site, skills } from "@/content/site-v1";

const container = "mx-auto w-full max-w-[68rem] px-4 sm:px-6 lg:px-8";

export default function Home() {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded focus:bg-ink focus:px-3 focus:py-2 focus:text-sm focus:text-bg"
      >
        Skip to content
      </a>

      <Header />

      <main id="main">
        <Hero />

        <Section id="work" title="Selected work" meta={`${projects.length} projects`}>
          <div className="grid gap-5 lg:grid-cols-12">
            {projects.map((project, i) => (
              <ProjectCard key={project.name} project={project} index={i} />
            ))}
          </div>
        </Section>

        <Section id="experience" title="Experience">
          <ol>
            {experience.map((role, i) => (
              <li
                key={role.org + role.title}
                className="reveal grid gap-2 border-t border-line py-7 first:border-t-0 first:pt-0 md:grid-cols-[13rem_1fr] md:gap-8"
                style={{ "--i": i % 2 } as CSSProperties}
              >
                <p className="font-mono text-[0.8125rem] text-muted md:pt-1">{role.period}</p>
                <div>
                  <h3 className="text-lg leading-snug font-medium text-ink">
                    {role.title}
                    <span className="text-muted"> at {role.org}</span>
                  </h3>
                  <ul className="ticks mt-3 max-w-[44rem] space-y-1.5 text-[0.9375rem] text-ink-2">
                    {role.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ol>
        </Section>

        <Section id="about" title="Education and skills">
          <div className="grid gap-10 md:grid-cols-[13rem_1fr] md:gap-8">
            <p className="font-mono text-[0.8125rem] text-muted md:pt-1">Education</p>
            <div className="reveal">
              <h3 className="text-lg leading-snug font-medium text-ink">{education.degree}</h3>
              <p className="mt-1 text-[0.9375rem] text-ink-2">
                {education.school}, {education.period}
              </p>
              <p className="mt-4 max-w-[44rem] text-[0.9375rem] text-ink-2">
                <span className="text-muted">Interests: </span>
                {education.interests}
              </p>
            </div>

            <p className="font-mono text-[0.8125rem] text-muted md:pt-1">Skills</p>
            <dl className="reveal grid gap-x-8 gap-y-4 sm:grid-cols-[7rem_1fr]">
              {skills.map((s) => (
                <div key={s.group} className="contents">
                  <dt className="text-sm text-muted sm:pt-px">{s.group}</dt>
                  <dd className="-mt-3 text-[0.9375rem] text-ink sm:mt-0">{s.items.join(", ")}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Section>

        <Contact />
      </main>

      <Footer />
      <CompareBar current="current" />
    </>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/85 backdrop-blur-md">
      <div className={`${container} flex h-14 items-center justify-between gap-4`}>
        <a href="#" className="text-[0.9375rem] font-medium tracking-[-0.01em] text-ink">
          {site.shortName}
        </a>
        <nav aria-label="Sections">
          <ul className="flex items-center gap-4 text-sm text-muted sm:gap-6">
            <li><a className="transition-colors hover:text-ink" href="#work">Work</a></li>
            <li><a className="transition-colors hover:text-ink" href="#experience">Experience</a></li>
            <li className="hidden sm:block"><a className="transition-colors hover:text-ink" href="#about">About</a></li>
            <li><a className="transition-colors hover:text-ink" href="#contact">Contact</a></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className={`${container} pt-16 pb-20 sm:pt-24 sm:pb-28`}>
      <p className="rise font-mono text-xs tracking-[0.08em] text-muted uppercase">
        {site.role} in {site.location}
      </p>
      <h1
        className="rise mt-5 max-w-[14ch] font-serif text-[clamp(2.75rem,8vw,5.5rem)] leading-[1.02] font-[420] tracking-[-0.03em] text-ink"
        style={{ "--i": 1 } as CSSProperties}
      >
        {site.name}
      </h1>

      <div className="rise mt-8 max-w-[40rem] space-y-4 text-lg leading-relaxed text-ink-2 sm:text-[1.1875rem]" style={{ "--i": 2 } as CSSProperties}>
        {site.intro.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>

      <div className="rise mt-9 flex flex-wrap items-center gap-3" style={{ "--i": 3 } as CSSProperties}>
        <a
          href={`mailto:${site.email}`}
          className="inline-flex items-center gap-2 rounded-md bg-ink px-4 py-2.5 text-sm font-medium text-bg transition-[transform,opacity] hover:opacity-85 active:scale-[0.98]"
        >
          <MailIcon />
          Email me
        </a>
        <ButtonLink href={site.github} icon={<GitHubIcon />}>GitHub</ButtonLink>
        <ButtonLink href={site.linkedin} icon={<LinkedInIcon />}>LinkedIn</ButtonLink>
      </div>

      <dl className="mt-16 grid grid-cols-2 gap-x-6 gap-y-8 sm:mt-20 md:grid-cols-4">
        {site.facts.map((fact, i) => (
          <div key={fact.label} className="rise border-t border-line pt-4" style={{ "--i": i + 4 } as CSSProperties}>
            <dt className="sr-only">{fact.label}</dt>
            <dd>
              <span className="block font-serif text-[2.25rem] leading-none tracking-[-0.02em] text-ink">{fact.value}</span>
              <span className="mt-2 block text-sm leading-snug text-muted">{fact.label}</span>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function ButtonLink({ href, icon, children }: { href: string; icon: ReactNode; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 rounded-md border border-line-strong px-4 py-2.5 text-sm font-medium text-ink transition-[background-color,transform] hover:bg-chip active:scale-[0.98]"
    >
      {icon}
      {children}
      <span className="sr-only">(opens in a new tab)</span>
    </a>
  );
}

function Section({ id, title, meta, children }: { id: string; title: string; meta?: string; children: ReactNode }) {
  return (
    <section id={id} className={`${container} py-16 sm:py-24`} aria-labelledby={`${id}-title`}>
      <div className="mb-10 flex items-end justify-between gap-4 border-b border-line pb-4">
        <h2 id={`${id}-title`} className="font-serif text-[2rem] leading-[1.1] tracking-[-0.02em] text-ink sm:text-[2.5rem]">
          {title}
        </h2>
        {meta && <p className="pb-1 font-mono text-xs text-muted">{meta}</p>}
      </div>
      {children}
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className={`${container} py-16 sm:py-24`} aria-labelledby="contact-title">
      <div className="reveal rounded-lg border border-line bg-surface p-6 sm:p-12">
        <h2 id="contact-title" className="font-serif text-[2rem] leading-[1.1] tracking-[-0.02em] text-ink sm:text-[2.5rem]">
          Contact
        </h2>
        <p className="mt-4 max-w-[36rem] text-[1.0625rem] text-ink-2">
          Email is the best way to reach me. My code is on GitHub, and my work history is on LinkedIn.
        </p>
        <a
          href={`mailto:${site.email}`}
          className="link-underline mt-8 inline-block font-serif text-[clamp(1.375rem,4.2vw,2.25rem)] leading-tight tracking-[-0.01em] break-all text-ink"
        >
          {site.email}
        </a>
        <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium">
          <a href={site.github} target="_blank" rel="noopener noreferrer" className="link-underline inline-flex items-center gap-1 text-ink">
            github.com/Amirjaz <ArrowUpRight />
          </a>
          <a href={site.linkedin} target="_blank" rel="noopener noreferrer" className="link-underline inline-flex items-center gap-1 text-ink">
            LinkedIn <ArrowUpRight />
          </a>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-line">
      <div className={`${container} flex flex-col gap-2 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between`}>
        <p>&copy; {new Date().getFullYear()} {site.name}</p>
        <p>
          Built with Next.js, hosted on GitHub Pages.{" "}
          <a href={`${site.github}/Amirjaz.github.io`} className="link-underline text-ink-2">
            Source
          </a>
        </p>
      </div>
    </footer>
  );
}
