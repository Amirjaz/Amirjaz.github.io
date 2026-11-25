import type { CSSProperties, ReactNode } from "react";
import { media } from "@/content/media";
import { placeholders } from "@/content/placeholders";
import { education, experience, projects, site, skills, type Project } from "@/content/site";
import { Motion } from "./motion";
import "./page.css";

const slug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

// A run of Persian letters, optionally with spaces and half-spaces (ZWNJ) inside it.
const PERSIAN_RUN = /([؀-ۿﭐ-﷿ﹰ-﻿](?:[؀-ۿﭐ-﷿ﹰ-﻿‌ ]*[؀-ۿﭐ-﷿ﹰ-﻿])?)/;

/** Wraps Persian words inside English copy in <bdi>, so the bidi algorithm can't reorder them. */
function Isolated({ text }: { text: string }) {
  const parts = text.split(PERSIAN_RUN);
  if (parts.length === 1) return text;
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <bdi key={i} lang="fa" dir="rtl" className="a5-fa">
        {part}
      </bdi>
    ) : (
      part
    ),
  );
}

/**
 * The blurred preview behind an image until the image itself arrives. The previews are made by
 * scripts/placeholders.mjs and are about a kilobyte each, inlined in the page.
 */
function blur(src: string): { style?: CSSProperties; "data-blur"?: "" } {
  const background = placeholders[src];
  return background ? { style: { backgroundImage: background }, "data-blur": "" } : {};
}

// Marks each image once it has loaded, so its blur can clear. It runs as the page is parsed,
// not with the scripts, so a slow script download can never leave an image blurred.
const markLoaded =
  'document.querySelectorAll("img[data-blur]").forEach(function(i){' +
  'function d(){i.setAttribute("data-loaded","")}' +
  'if(i.complete){d()}else{i.addEventListener("load",d);i.addEventListener("error",d)}})';

// Deterministic bar heights for the SinGo panel (no randomness, so server and client agree).
const bars = Array.from({ length: 22 }, (_, i) => 0.28 + (((i * 37) % 100) / 100) * 0.62);

/** The picture for a project: a real product image where one exists, a panel set in type otherwise. */
function ProjectPanel({ project, eager = false }: { project: Project; eager?: boolean }) {
  const loading = eager ? "eager" : "lazy";
  switch (project.name) {
    case "Letterboxd Toolkit":
      return (
        <div className="a5-panel a5-panel-cover">
          <img
            src={media.letterboxd[0]}
            {...blur(media.letterboxd[0])}
            alt={project.visual.kind === "image" ? project.visual.alt : "Letterboxd Toolkit"}
            width={1280}
            height={800}
            loading={loading}
            decoding="async"
          />
        </div>
      );
    case "Shamsi-Calendar":
      // The date picker leads; the persian-ui inputs sit beside it, smaller.
      return (
        <div className="a5-panel a5-panel-duo">
          <img
            src={media.shamsi.light}
            {...blur(media.shamsi.light)}
            alt={project.visual.kind === "image" ? project.visual.alt : "Shamsi-Calendar date picker"}
            width={344}
            height={462}
            loading={loading}
            decoding="async"
          />
          <img
            src={media.persianUi[0]}
            {...blur(media.persianUi[0])}
            alt="persian-ui form inputs: a national ID field with a validation error, a mobile number, a Sheba number and a price field with a toman and rial switch"
            width={784}
            height={828}
            loading={loading}
            decoding="async"
          />
        </div>
      );
    default: {
      const visual = project.visual;
      if (visual.kind === "terminal") {
        return (
          <div className="a5-panel a5-term" role="img" aria-label={`${project.name}: ${visual.alt}`}>
            <div className="a5-term-body" aria-hidden="true">
              <p className="a5-term-cmd">
                <b>$</b>
                {visual.command}
              </p>
              <p className="a5-term-dim">{visual.context}</p>
              <ul>
                {visual.fixes.map((fix) => (
                  <li key={fix.from + fix.to}>
                    <s>{fix.from}</s>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="square">
                      <path d="M4 12h15M14 7l5 5-5 5" />
                    </svg>
                    <span>{fix.to}</span>
                    <em>{fix.where}</em>
                  </li>
                ))}
              </ul>
              <p>
                {visual.result}
                <span className="a5-term-dim">{visual.note}</span>
              </p>
            </div>
          </div>
        );
      }
      if (visual.kind === "phones") {
        return (
          <div className="a5-panel a5-phones">
            {visual.shots.map((shot) => (
              <img
                key={shot.src}
                src={shot.src}
                {...blur(shot.src)}
                alt={shot.alt}
                width={shot.width}
                height={shot.height}
                loading={loading}
                decoding="async"
              />
            ))}
          </div>
        );
      }
      if (visual.kind === "image") {
        return (
          <div className="a5-panel a5-panel-contain">
            <img src={visual.src} {...blur(visual.src)} alt={visual.alt} width={visual.width} height={visual.height} loading={loading} decoding="async" />
          </div>
        );
      }
      const steps = project.visual.kind === "pipeline" ? project.visual.steps : [];
      const caption = project.visual.kind === "pipeline" ? project.visual.caption : project.name;
      return (
        <div className="a5-panel a5-singo" role="img" aria-label={`${project.name}: ${caption}`}>
          <div className="a5-singo-bars" aria-hidden="true">
            {bars.map((h, i) => (
              <i key={i} style={{ "--n": i, "--h": h.toFixed(2) } as CSSProperties} />
            ))}
          </div>
          {steps.length > 0 && (
            <ol aria-hidden="true">
              {steps.map((step) => (
                <li key={step.label} data-owner={step.owner ? "" : undefined}>
                  {step.label}
                </li>
              ))}
            </ol>
          )}
        </div>
      );
    }
  }
}

function Arrow() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="square" aria-hidden="true">
      <path d="M7 17 17 7M9 7h8v8" />
    </svg>
  );
}

function Curve({ tone }: { tone: "ink" | "paper" }) {
  return (
    <div className={`a5-curve ${tone === "paper" ? "a5-curve-paper" : ""}`} aria-hidden="true">
      <i />
    </div>
  );
}

function ExternalPill({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a className="a5-pill" href={href} target="_blank" rel="noopener noreferrer" data-magnetic="0.25">
      <span>{children}</span>
      <Arrow />
      <span className="a5-sr">(opens in a new tab)</span>
    </a>
  );
}

export default function Page() {
  const name = site.name;
  const pitch = site.pitch;
  const year = new Date().getFullYear();

  return (
    <div className="a5-root">
      {/* A hairline in the accent colour that fills as the page loads. Only the script shows it. */}
      <div className="a5-loadbar" aria-hidden="true" />

      <header className="a5-hero a5-dark">
        <nav className="a5-nav" aria-label="Sections" data-hero-in>
          <a className="a5-link a5-brand" href="#top" data-magnetic="0.3">
            {site.shortName}
          </a>
          <ul>
            <li>
              <a className="a5-link" href="#work" data-magnetic="0.4">
                Work
              </a>
            </li>
            <li>
              <a className="a5-link" href="#about" data-magnetic="0.4">
                About
              </a>
            </li>
            <li>
              <a className="a5-link" href="#contact" data-magnetic="0.4">
                Contact
              </a>
            </li>
          </ul>
        </nav>

        <div className="a5-hero-mid" id="top">
          <p className="a5-location" data-hero-in>
            <span className="a5-globe" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <circle cx="12" cy="12" r="9" />
                <path d="M3 12h18M5.2 7h13.6M5.2 17h13.6" />
                <ellipse cx="12" cy="12" rx="9" ry="9" />
                <ellipse cx="12" cy="12" rx="9" ry="9" />
              </svg>
            </span>
            <span>
              Based in
              <b style={{ display: "block", fontWeight: 500, color: "var(--on-ink)" }}>{site.location}</b>
            </span>
          </p>

          <div className="a5-hero-role" data-hero-in>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="square" aria-hidden="true">
              <path d="M6 6l12 12M8 18h10V8" />
            </svg>
            <p className="a5-role">{site.role}</p>
            <p className="a5-pitch">{pitch}</p>
          </div>
        </div>

        <h1 className="a5-sr">
          {name}, {site.role.toLowerCase()} in {site.location}
        </h1>
        <div className="a5-marquee" aria-hidden="true" data-hero-in>
          <div className="a5-marquee-track">
            {[0, 1, 2, 3].map((i) => (
              <span className="a5-marquee-item" key={i}>
                {/* Its own box, so the spaces survive when the intro splits it into words. */}
                <span className="a5-marquee-name">{name}</span>
                <i />
              </span>
            ))}
          </div>
        </div>
      </header>

      <nav className="a5-dock" aria-label="Quick navigation">
        <a href="#work">Work</a>
        <a href="#about">About</a>
        <a href="#contact">Contact</a>
      </nav>

      <main>
        <Curve tone="ink" />

        <section className="a5-section a5-intro" aria-label="Introduction">
          <p className="a5-intro-lead" data-a5-lines>
            {site.intro[0]}
          </p>
          <div className="a5-intro-side">
            <p data-a5-lines>{site.intro[1]}</p>
            <div data-a5-drift>
              <a className="a5-round" href="#work" data-magnetic="0.45">
                <span data-magnetic-inner>Selected work</span>
              </a>
            </div>
          </div>
        </section>

        <section className="a5-section" style={{ paddingTop: 0 }} aria-label="In numbers">
          <dl className="a5-facts" style={{ marginTop: 0 }}>
            {site.facts.map((fact) => (
              <div key={fact.label} data-a5-reveal>
                <dt className="a5-sr">{fact.label}</dt>
                <dd>
                  <b>{fact.value}</b>
                  <span>{fact.label}</span>
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="a5-section a5-work" id="work" aria-labelledby="a5-work-title">
          <div className="a5-work-head">
            <h2 className="a5-label" id="a5-work-title">
              Selected work
            </h2>
            <p className="a5-label" style={{ margin: 0 }}>
              {String(projects.length).padStart(2, "0")} projects
            </p>
          </div>

          <div className="a5-cases">
            {projects.map((project, i) => (
              <article className="a5-case" id={`case-${slug(project.name)}`} key={project.name}>
                <div className="a5-case-media" data-a5-reveal>
                  <ProjectPanel project={project} />
                </div>
                <div className="a5-case-text" data-a5-reveal>
                  <div className="a5-case-top">
                    <span className="a5-label">
                      {String(i + 1).padStart(2, "0")} / {project.kicker}
                    </span>
                    {project.badge && <span className="a5-badge">{project.badge.label}</span>}
                  </div>
                  <h3>{project.name}</h3>
                  <p className="a5-case-summary">
                    <Isolated text={project.summary} />
                  </p>
                  {project.points.length > 0 && (
                    <ul className="a5-points">
                      {project.points.map((point) => (
                        <li key={point}>
                          <Isolated text={point} />
                        </li>
                      ))}
                    </ul>
                  )}
                  <ul className="a5-stack" aria-label="Built with">
                    {project.stack.map((tech) => (
                      <li key={tech}>{tech}</li>
                    ))}
                  </ul>
                  {project.links.length > 0 && (
                    <div className="a5-case-links">
                      {project.links.map((link) => (
                        <ExternalPill key={link.href} href={link.href}>
                          {link.label}
                        </ExternalPill>
                      ))}
                    </div>
                  )}
                  {project.also && (
                    <div className="a5-also">
                      <span className="a5-label">Also</span>
                      <h4>{project.also.name}</h4>
                      <p>{project.also.summary}</p>
                      <div className="a5-case-links">
                        {project.also.links.map((link) => (
                          <ExternalPill key={link.href} href={link.href}>
                            {link.label}
                          </ExternalPill>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="a5-split" id="about" aria-labelledby="a5-exp-title">
          <h2 id="a5-exp-title" data-a5-reveal>
            Experience
          </h2>
          <ol>
            {experience.map((role) => (
              <li className="a5-role-row" key={role.org + role.title} data-a5-reveal>
                <p className="a5-period" style={{ margin: 0 }}>
                  {role.period}
                </p>
                <div>
                  <h3>
                    {role.title} <span>at {role.org}</span>
                  </h3>
                  <ul>
                    {role.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="a5-split" aria-labelledby="a5-edu-title">
          <h2 id="a5-edu-title" data-a5-reveal>
            Education and skills
          </h2>
          <div>
            <div className="a5-edu" data-a5-reveal>
              <p className="a5-period" style={{ margin: 0 }}>
                {education.period}
              </p>
              <h3>{education.degree}</h3>
              <p>{education.school}</p>
              <p>Interests: {education.interests}</p>
            </div>
            <dl className="a5-skills" data-a5-reveal>
              {skills.map((group) => (
                <div key={group.group}>
                  <dt>{group.group}</dt>
                  <dd>{group.items.join(", ")}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      </main>

      <footer className="a5-footer a5-dark" id="contact">
        <Curve tone="paper" />
        <div className="a5-footer-inner">
          <p className="a5-label">Contact</p>
          <h2 data-a5-lines>Let&apos;s work together</h2>

          <div className="a5-footer-line">
            <div className="a5-footer-cta" data-a5-slide>
              <a className="a5-round a5-round-accent" href={`mailto:${site.email}`} data-magnetic="0.45">
                <span data-magnetic-inner>Get in touch</span>
              </a>
            </div>
          </div>

          <div className="a5-footer-pills">
            <a className="a5-pill" href={`mailto:${site.email}`} data-magnetic="0.2">
              <span>{site.email}</span>
            </a>
          </div>

          <div className="a5-footer-bottom">
            <div>
              <div>
                <span className="a5-label">Site</span>
                <p>&copy; {year} {site.shortName}</p>
              </div>
              <div>
                <span className="a5-label">Local time in {site.location}</span>
                <p>
                  <span data-a5-clock>--:--</span> GMT+3:30
                </p>
              </div>
            </div>
            <div>
              <div>
                <span className="a5-label">Elsewhere</span>
                <ul>
                  <li>
                    <a className="a5-link" href={site.github} target="_blank" rel="noopener noreferrer" data-magnetic="0.4">
                      GitHub
                    </a>
                  </li>
                  <li>
                    <a className="a5-link" href={site.linkedin} target="_blank" rel="noopener noreferrer" data-magnetic="0.4">
                      LinkedIn
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <script dangerouslySetInnerHTML={{ __html: markLoaded }} />
      <Motion />
    </div>
  );
}
