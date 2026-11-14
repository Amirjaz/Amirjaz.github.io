import "@fontsource-variable/antonio";
import "@fontsource/chakra-petch/400.css";
import "@fontsource/chakra-petch/500.css";
import "@fontsource/chakra-petch/600.css";
import "lenis/dist/lenis.css";
import "./a1.css";

import type { CSSProperties, ReactNode } from "react";
import type { Metadata } from "next";
import { CompareBar } from "@/components/compare-bar";
import { media } from "@/content/media";
import { education, experience, projects, site, skills, type Project } from "@/content/site-v1";
import { Hud } from "./hud";
import { Motion } from "./motion";
import { StaticScreen } from "./static-screen";

export const metadata: Metadata = {
  title: `${site.name}, ${site.role}`,
  description: site.description,
  robots: { index: false },
};

type ScreenKind = "letterboxd" | "bidi" | "persian-ui" | "shamsi" | "singo" | "static" | "bars";

const two = (n: number) => String(n).padStart(2, "0");

/** Which picture each project's channel plays. */
const channelScreen: Record<string, ScreenKind> = {
  "Letterboxd Toolkit": "letterboxd",
  "persian-ui": "bidi",
  "Shamsi-Calendar": "shamsi",
  SinGo: "singo",
};

const channelOf = (name: string) => projects.findIndex((p) => p.name === name) + 1;

/** The hero wall. Positions are a share of the screen, depth (z) is in pixels. */
const wall: {
  kind: ScreenKind;
  project?: string;
  x: number;
  y: number;
  w: number;
  z: number;
  ry: number;
  rz: number;
  blur: number;
  lum: number;
}[] = [
  { kind: "static", x: 2, y: 9, w: 17, z: -300, ry: 16, rz: -1.5, blur: 2.4, lum: 0.5 },
  { kind: "static", x: 28, y: 7, w: 12, z: -430, ry: 6, rz: 1, blur: 3.2, lum: 0.4 },
  { kind: "shamsi", project: "Shamsi-Calendar", x: 79, y: 8, w: 15, z: -170, ry: -14, rz: 1.5, blur: 1.3, lum: 0.78 },
  { kind: "bars", x: 83, y: 53, w: 16, z: -90, ry: -16, rz: -1, blur: 1, lum: 0.72 },
  { kind: "persian-ui", project: "persian-ui", x: 8, y: 43, w: 21, z: -20, ry: 12, rz: -1, blur: 0.5, lum: 0.95 },
  { kind: "letterboxd", project: "Letterboxd Toolkit", x: 51, y: 36, w: 27, z: 60, ry: -4, rz: 0.4, blur: 0, lum: 1 },
  { kind: "singo", project: "SinGo", x: 33, y: 51, w: 15, z: 120, ry: 8, rz: -1.5, blur: 0.6, lum: 0.95 },
];

export default function A1() {
  return (
    <div className="a1-root">
      <a href="#work" className="a1-skip">
        Skip to the work
      </a>
      <Hud />

      <main>
        <header className="a1-hero" id="top">
          <div className="a1-hero-head">
            <p className="a1-eyebrow">
              <span className="a1-tag">{site.role}</span>
              <span className="a1-tag">{site.location}</span>
            </p>
            <h1>{site.name}</h1>
          </div>

          <div className="a1-scene">
            <div className="a1-tilt">
              <div className="a1-dolly">
                {wall.map((tv, i) => {
                  const channel = tv.project ? channelOf(tv.project) : 0;
                  const style = {
                    "--o": channel || 9,
                    "--x": `${tv.x}%`,
                    "--y": `${tv.y}%`,
                    "--w": `${tv.w}vw`,
                    "--wn": tv.w,
                    "--z": `${tv.z}px`,
                    "--ry": `${tv.ry}deg`,
                    "--rz": `${tv.rz}deg`,
                    "--blur": `${tv.blur}px`,
                    "--lum": tv.lum,
                    "--i": i,
                  } as CSSProperties;
                  const body = (
                    <Tv label={tv.project ? `CH ${two(channel)}` : tv.kind === "bars" ? "TEST" : "NO SIGNAL"} on={Boolean(tv.project)}>
                      <Screen kind={tv.kind} />
                    </Tv>
                  );
                  return tv.project ? (
                    <a key={i} href={`#ch-${channel}`} className="a1-tv" style={style} aria-label={`${tv.project}: go to channel ${channel}`}>
                      {body}
                    </a>
                  ) : (
                    <div key={i} className="a1-tv" data-prop="" style={style} aria-hidden="true">
                      {body}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="a1-hero-foot">
            <p>{site.intro[0]}</p>
            <div className="a1-actions">
              <a href="#work" className="a1-btn a1-btn-solid">
                Watch the work
              </a>
              <a href="#contact" className="a1-btn">
                Contact
              </a>
            </div>
          </div>

          <div className="a1-hero-veil" aria-hidden="true" />
          <div className="a1-ident" aria-hidden="true">
            <span className="a1-tag">Work</span>
            <p className="a1-ident-title">{two(projects.length)} channels</p>
          </div>
        </header>

        <section className="a1-work" id="work" aria-label="Work">
          {projects.map((project, i) => (
            <Channel key={project.name} project={project} index={i} />
          ))}
        </section>

        <section className="a1-about" id="about" aria-labelledby="a1-about-title">
          <div className="a1-section-head" data-a1-rise="">
            <p className="a1-label">
              <span className="a1-tag">About</span>
            </p>
            <h2 id="a1-about-title">Behind the camera</h2>
          </div>

          <div className="a1-lit">
            {site.intro.map((paragraph) => (
              <p key={paragraph} data-a1-lit="">
                {paragraph.split(" ").map((word, i) => (
                  <span key={i} className="a1-word">
                    {word}{" "}
                  </span>
                ))}
              </p>
            ))}
          </div>

          <dl className="a1-facts">
            {site.facts.map((fact) => (
              <div key={fact.label} data-a1-rise="">
                <dt className="a1-sr">{fact.label}</dt>
                <dd>
                  <span className="a1-fact-value">{fact.value}</span>
                  <span className="a1-fact-label">{fact.label}</span>
                </dd>
              </div>
            ))}
          </dl>

          <div className="a1-block">
            <h3 className="a1-block-title" data-a1-rise="">
              Experience
            </h3>
            <ol className="a1-roles">
              {experience.map((role) => {
                const live = role.period.includes("now");
                return (
                  <li key={role.org + role.title} className="a1-role" data-a1-rise="">
                    <p className="a1-timecode">
                      {live ? <i className="a1-rec-dot" aria-hidden="true" /> : null}
                      {role.period.replace(" to ", " : ")}
                    </p>
                    <div>
                      <h4>
                        {role.title} <span>{role.org}</span>
                      </h4>
                      <ul>
                        {role.points.map((point) => (
                          <li key={point}>{point}</li>
                        ))}
                      </ul>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>

          <div className="a1-block">
            <h3 className="a1-block-title" data-a1-rise="">
              Education and skills
            </h3>
            <div className="a1-edu" data-a1-rise="">
              <p className="a1-timecode">{education.period.replace(" to ", " : ")}</p>
              <div>
                <h4>
                  {education.degree} <span>{education.school}</span>
                </h4>
                <p className="a1-edu-note">Interests: {education.interests}</p>
              </div>
            </div>
            <dl className="a1-skills">
              {skills.map((group) => (
                <div key={group.group} data-a1-rise="">
                  <dt>{group.group}</dt>
                  <dd>
                    {group.items.map((item) => (
                      <span key={item} className="a1-tag">
                        {item}
                      </span>
                    ))}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section className="a1-contact" id="contact" aria-labelledby="a1-contact-title">
          <p className="a1-label" data-a1-rise="">
            <span className="a1-tag">Contact</span>
          </p>
          <h2 id="a1-contact-title" className="a1-sr">
            Contact
          </h2>
          <a href={`mailto:${site.email}`} className="a1-email" data-a1-rise="">
            {site.email}
          </a>
          <div className="a1-contact-row" data-a1-rise="">
            <p>Email is the best way to reach me.</p>
            <div className="a1-actions">
              <a href={site.github} target="_blank" rel="noopener noreferrer" className="a1-btn">
                GitHub <Arrow />
              </a>
              <a href={site.linkedin} target="_blank" rel="noopener noreferrer" className="a1-btn">
                LinkedIn <Arrow />
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="a1-footer">
        <p>
          &copy; {new Date().getFullYear()} {site.name}
        </p>
        <p>End of tape</p>
      </footer>

      <Motion />
      <CompareBar current="a1" />
    </div>
  );
}

function Channel({ project, index }: { project: Project; index: number }) {
  const kind = channelScreen[project.name] ?? "static";
  const number = two(index + 1);
  const caption =
    kind === "bidi"
      ? "Rendered live by your browser: the same sentence, without and with isolation."
      : project.visual.kind === "pipeline"
        ? project.visual.caption
        : null;

  return (
    <article className="a1-channel" id={`ch-${index + 1}`} data-a1-channel="">
      <div className="a1-channel-tv">
        <div className="a1-tv a1-tv-lg">
          <Tv label={`CH ${number}`} on>
            <Screen kind={kind} project={project} large />
          </Tv>
        </div>
        {caption ? <p className="a1-caption">{caption}</p> : null}
      </div>

      <div className="a1-channel-copy">
        <p className="a1-ch-no">
          CH {number} <span>/ {two(projects.length)}</span>
        </p>
        <p className="a1-kicker">{project.kicker}</p>
        <h2>{project.name}</h2>
        {project.badge ? (
          <p className="a1-badge">
            <span className="a1-tag">{project.badge.label}</span>
          </p>
        ) : null}
        <p className="a1-summary">
          <Isolated text={project.summary} />
        </p>
        {project.points.length > 0 ? (
          <ul className="a1-points">
            {project.points.map((point) => (
              <li key={point}>
                <Isolated text={point} />
              </li>
            ))}
          </ul>
        ) : null}
        <ul className="a1-stack" aria-label="Built with">
          {project.stack.map((tech) => (
            <li key={tech} className="a1-tag">
              {tech}
            </li>
          ))}
        </ul>
        {project.links.length > 0 ? (
          <div className="a1-actions">
            {project.links.map((link, i) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={i === 0 ? "a1-btn a1-btn-solid" : "a1-btn"}
              >
                {link.label} <Arrow />
                <span className="a1-sr">(opens in a new tab)</span>
              </a>
            ))}
          </div>
        ) : null}
      </div>
    </article>
  );
}

/** A CRT set: plastic body, curved screen with scanlines, a label strip and two knobs. */
function Tv({ label, on, children }: { label: string; on?: boolean; children: ReactNode }) {
  return (
    <div className="a1-tv-body">
      <div className="a1-screen">
        <div className="a1-screen-content">{children}</div>
        <div className="a1-flash" aria-hidden="true" />
      </div>
      <div className="a1-tv-meta" aria-hidden="true">
        <span>{label}</span>
        <span className="a1-knobs">
          <i className={on ? "is-on" : undefined} />
          <i />
        </span>
      </div>
    </div>
  );
}

function Screen({ kind, project, large }: { kind: ScreenKind; project?: Project; large?: boolean }) {
  const alt = large && project?.visual.kind === "image" ? project.visual.alt : "";

  switch (kind) {
    case "letterboxd":
      return (
        <div className="a1-slides">
          {media.letterboxd.map((src, i) => (
            <img
              key={src}
              src={src}
              alt={i === 0 ? alt : ""}
              width={1280}
              height={800}
              loading={large ? "lazy" : "eager"}
              decoding="async"
              style={{ "--i": i } as CSSProperties}
            />
          ))}
        </div>
      );

    case "persian-ui":
      return <img className="a1-cover a1-cover-top" src={media.persianUi[0]} alt="" width={784} height={828} decoding="async" />;

    case "shamsi":
      return (
        <img
          className="a1-contain"
          src={media.shamsi.dark}
          alt={large ? "Shamsi-Calendar date picker in its dark theme, open on Farvardin 1405 with the 13th selected" : ""}
          width={344}
          height={462}
          loading={large ? "lazy" : "eager"}
          decoding="async"
        />
      );

    case "bidi":
      return (
        <div className="a1-bidi">
          <p className="a1-bidi-label">
            01 Plain text <span>broken</span>
          </p>
          <p className="a1-bidi-line" dir="rtl" lang="fa">
            تماس: +98 912 345 6789، ساعت ۱۰-۲۰
          </p>
          <p className="a1-bidi-label">
            02 {"<PersianText>"} <span className="is-ok">fixed</span>
          </p>
          <p className="a1-bidi-line" dir="rtl" lang="fa">
            تماس: <bdi dir="ltr">+98 912 345 6789</bdi>، ساعت <bdi dir="ltr">۱۰-۲۰</bdi>
          </p>
        </div>
      );

    case "singo": {
      const steps = large && project?.visual.kind === "pipeline" ? project.visual.steps : null;
      return (
        <div className={steps ? "a1-kara has-steps" : "a1-kara"}>
          <div className="a1-kara-stage" aria-hidden="true">
            <div className="a1-kara-wave">
              {Array.from({ length: 26 }, (_, i) => (
                <i key={i} style={{ "--i": i } as CSSProperties} />
              ))}
            </div>
            <div className="a1-kara-line">
              {[17, 25, 13, 21].map((w, i) => (
                <span key={i} style={{ "--w": w, "--i": i } as CSSProperties} />
              ))}
            </div>
            <div className="a1-kara-line is-next">
              {[22, 15, 26].map((w, i) => (
                <span key={i} style={{ "--w": w, "--i": i } as CSSProperties} />
              ))}
            </div>
          </div>
          {steps ? (
            <ol className="a1-steps">
              {steps.map((step, i) => (
                <li key={step.label} className={step.owner ? "is-mine" : undefined}>
                  <span>{two(i + 1)}</span>
                  {step.label}
                </li>
              ))}
            </ol>
          ) : null}
        </div>
      );
    }

    case "bars":
      return (
        <div className="a1-bars">
          <div>
            {["#c4c4c4", "#c4c400", "#00c4c4", "#00c400", "#c400c4", "#c40000", "#0000c4"].map((color) => (
              <i key={color} style={{ background: color }} />
            ))}
          </div>
          <div>
            {["#0000c4", "#131313", "#c400c4", "#131313", "#00c4c4", "#131313", "#c4c4c4"].map((color, i) => (
              <i key={i} style={{ background: color }} />
            ))}
          </div>
        </div>
      );

    case "static":
      return <StaticScreen />;
  }
}

function Arrow() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.25} strokeLinecap="square" aria-hidden="true">
      <path d="M7 17 17 7M9 7h8v8" />
    </svg>
  );
}

// A run of Persian letters, optionally with spaces and half-spaces (ZWNJ) inside it.
const PERSIAN_RUN = /([؀-ۿﭐ-﷿ﹰ-﻿](?:[؀-ۿﭐ-﷿ﹰ-﻿‌ ]*[؀-ۿﭐ-﷿ﹰ-﻿])?)/;

/** Wraps Persian words inside English copy in <bdi>, so the bidi algorithm cannot reorder them. */
function Isolated({ text }: { text: string }) {
  const parts = text.split(PERSIAN_RUN);
  if (parts.length === 1) return text;
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <bdi key={i} lang="fa" dir="rtl" className="a1-fa">
        {part}
      </bdi>
    ) : (
      part
    ),
  );
}
