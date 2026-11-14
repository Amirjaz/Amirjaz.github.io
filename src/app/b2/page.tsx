import "@fontsource-variable/antonio";
import "@fontsource/chakra-petch/500.css";
import "@fontsource/chakra-petch/600.css";
import "./b2.css";

import type { Metadata } from "next";
import { CompareBar } from "@/components/compare-bar";
import { ArrowUpRight, GitHubIcon, LinkedInIcon, MailIcon } from "@/components/icons";
import { media } from "@/content/media";
import { education, experience, projects, site, skills } from "@/content/site-v1";
import { SectionNav, Spotlight, type NavItem } from "./chrome";
import { Emphasised, Isolated } from "./isolated";
import { BidiScreen, KaraokeScreen, Tv, type Channel } from "./tv";

// A design candidate, not the live home page.
export const metadata: Metadata = { robots: { index: false } };

const two = (n: number) => String(n).padStart(2, "0");

const nav: NavItem[] = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "education", label: "Education" },
];

// Every row on the right is a channel on the sidebar TV.
const idleChannel: Channel = { id: "idle", no: "00", label: site.shortName, kind: "idle", name: site.shortName, role: `${site.role}, ${site.location}` };

const experienceChannels: Channel[] = experience.map((role, i) => ({
  id: `exp-${i}`,
  no: two(i + 1),
  label: role.org,
  kind: "card",
  meta: role.period,
  title: role.org,
  sub: role.title,
}));

const projectChannels: Channel[] = projects.map((project, i) => {
  const base = { id: `proj-${i}`, no: two(experience.length + i + 1), label: project.name };
  const visual = project.visual;
  if (visual.kind === "bidi") return { ...base, kind: "bidi" };
  if (visual.kind === "pipeline") return { ...base, kind: "karaoke", steps: visual.steps.map((s) => s.label) };
  if (visual.src.includes("letterboxd")) return { ...base, kind: "images", srcs: [...media.letterboxd] };
  if (visual.src.includes("shamsi")) return { ...base, kind: "images", srcs: [media.shamsi.dark] };
  return { ...base, kind: "images", srcs: [visual.src] };
});

const educationChannel: Channel = {
  id: "edu",
  no: two(experience.length + projects.length + 1),
  label: "Sharif",
  kind: "card",
  meta: education.period,
  title: education.school,
  sub: education.degree,
};

const channels: Channel[] = [idleChannel, ...experienceChannels, ...projectChannels, educationChannel];

// Existing phrases worth catching on a 30-second read. Styling only, no new copy.
const keyPhrases = ["Persian-speaking users", "Sharif University of Technology", "Nisatech", "backend and AI engineering"];

// The sidebar pitch is the first clause of the intro.
const pitch = `${site.intro[0].split(":")[0]}.`;

export default function Page() {
  return (
    <div className="b2-root">
      <Spotlight />
      <a href="#content" className="b2-skip">
        Skip to content
      </a>

      <div className="b2-shell">
        <header className="b2-side">
          <div className="b2-side-top">
            <h1 className="b2-name">
              <a href="/b2/">{site.name}</a>
            </h1>
            <p className="b2-role">
              {site.role} <span>in {site.location}</span>
            </p>
            <p className="b2-pitch">{pitch}</p>
            <SectionNav items={nav} />
          </div>

          <Tv channels={channels} />

          <ul className="b2-social" aria-label="Contact and profiles">
            <li>
              <a href={site.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub (opens in a new tab)">
                <GitHubIcon className="b2-icon" />
              </a>
            </li>
            <li>
              <a href={site.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn (opens in a new tab)">
                <LinkedInIcon className="b2-icon" />
              </a>
            </li>
            <li>
              <a href={`mailto:${site.email}`} aria-label={`Email ${site.email}`}>
                <MailIcon className="b2-icon" />
              </a>
            </li>
          </ul>
        </header>

        <main id="content" className="b2-main">
          <section id="about" className="b2-section" aria-labelledby="about-label">
            <h2 id="about-label" className="b2-section-label">
              About
            </h2>
            <div className="b2-prose">
              {site.intro.map((paragraph) => (
                <p key={paragraph}>
                  <Emphasised text={paragraph} phrases={keyPhrases} />
                </p>
              ))}
            </div>
            <dl className="b2-facts">
              {site.facts.map((fact) => (
                <div key={fact.label}>
                  <dt>{fact.label}</dt>
                  <dd>{fact.value}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section id="experience" className="b2-section" aria-labelledby="experience-label">
            <h2 id="experience-label" className="b2-section-label">
              Experience
            </h2>
            <ol className="b2-list">
              {experience.map((role, i) => (
                <li key={role.org + role.title} className="b2-row" data-ch={experienceChannels[i].id}>
                  <div className="b2-aside">
                    <span className="b2-period">{role.period}</span>
                    <span className="b2-ch">CH {experienceChannels[i].no}</span>
                  </div>
                  <div className="b2-body">
                    <h3 className="b2-title">
                      {role.title} <span className="b2-dot">·</span> {role.org}
                    </h3>
                    <ul className="b2-points">
                      {role.points.map((point) => (
                        <li key={point}>
                          <Isolated text={point} />
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section id="projects" className="b2-section" aria-labelledby="projects-label">
            <h2 id="projects-label" className="b2-section-label">
              Projects
            </h2>
            <ul className="b2-list">
              {projects.map((project, i) => {
                const channel = projectChannels[i];
                const [primary, ...moreLinks] = project.links;
                return (
                  <li key={project.name} className="b2-row b2-row-wide" data-ch={channel.id}>
                    <div className="b2-aside">
                      <span className="b2-ch b2-ch-lead">CH {channel.no}</span>
                    </div>
                    <div className="b2-body">
                      <div className="b2-inline" data-kind={channel.kind}>
                        {channel.kind === "bidi" && <BidiScreen />}
                        {channel.kind === "karaoke" && <KaraokeScreen steps={channel.steps} />}
                        {channel.kind === "images" && project.visual.kind === "image" && (
                          <img
                            src={channel.srcs[0]}
                            alt={project.visual.alt}
                            width={project.visual.width}
                            height={project.visual.height}
                            data-fit={project.visual.width < project.visual.height ? "contain" : "cover"}
                            loading="lazy"
                            decoding="async"
                          />
                        )}
                      </div>

                      <p className="b2-kicker">{project.kicker}</p>
                      <h3 className="b2-title">
                        {primary ? (
                          <a href={primary.href} target="_blank" rel="noopener noreferrer" className="b2-title-link">
                            {project.name}
                            <ArrowUpRight className="b2-arrow" />
                            <span className="b2-sr">(opens {primary.label} in a new tab)</span>
                          </a>
                        ) : (
                          project.name
                        )}
                        {project.badge && <span className="b2-tag b2-badge">{project.badge.label}</span>}
                      </h3>
                      <p className="b2-summary">
                        <Isolated text={project.summary} />
                      </p>
                      {project.points.length > 0 && (
                        <ul className="b2-points">
                          {project.points.map((point) => (
                            <li key={point}>
                              <Isolated text={point} />
                            </li>
                          ))}
                        </ul>
                      )}
                      <ul className="b2-tags" aria-label="Built with">
                        {project.stack.map((tech) => (
                          <li key={tech} className="b2-tag">
                            {tech}
                          </li>
                        ))}
                      </ul>
                      {moreLinks.length > 0 && (
                        <p className="b2-links">
                          {moreLinks.map((link) => (
                            <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer" className="b2-link">
                              {link.label}
                              <ArrowUpRight className="b2-arrow" />
                              <span className="b2-sr">(opens in a new tab)</span>
                            </a>
                          ))}
                        </p>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>

          <section id="education" className="b2-section" aria-labelledby="education-label">
            <h2 id="education-label" className="b2-section-label">
              Education and skills
            </h2>
            <ul className="b2-list">
              <li className="b2-row" data-ch={educationChannel.id}>
                <div className="b2-aside">
                  <span className="b2-period">{education.period}</span>
                  <span className="b2-ch">CH {educationChannel.no}</span>
                </div>
                <div className="b2-body">
                  <h3 className="b2-title">{education.degree}</h3>
                  <p className="b2-summary">{education.school}</p>
                  <p className="b2-summary">
                    <span className="b2-quiet">Interests: </span>
                    {education.interests}
                  </p>
                </div>
              </li>
            </ul>
            <dl className="b2-skills">
              {skills.map((group) => (
                <div key={group.group}>
                  <dt>{group.group}</dt>
                  <dd>
                    {group.items.map((item) => (
                      <span key={item} className="b2-tag">
                        {item}
                      </span>
                    ))}
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          <footer className="b2-foot">
            <p>
              Email is the best way to reach me:{" "}
              <a href={`mailto:${site.email}`} className="b2-link">
                {site.email}
              </a>
            </p>
            <p className="b2-credit">Built with Next.js, hosted on GitHub Pages.</p>
          </footer>
        </main>
      </div>

      <CompareBar current="b2" />
    </div>
  );
}
