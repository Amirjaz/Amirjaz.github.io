import type { CSSProperties } from "react";
import type { Project, Visual } from "@/content/site-v1";
import { ArrowUpRight } from "./icons";

const span: Record<Project["size"], string> = {
  full: "lg:col-span-12",
  wide: "lg:col-span-7",
  narrow: "lg:col-span-5",
};

export function ProjectCard({ project, index }: { project: Project; index: number }) {
  const full = project.size === "full";

  return (
    <article
      className={`card reveal flex flex-col overflow-hidden rounded-lg border border-line bg-surface ${span[project.size]} ${
        full ? "lg:grid lg:grid-cols-12" : ""
      }`}
      style={{ "--i": index % 2 } as CSSProperties}
    >
      <div className={`flex flex-col p-6 sm:p-8 ${full ? "lg:col-span-5" : ""}`}>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <p className="font-mono text-[0.6875rem] tracking-[0.08em] text-muted uppercase">{project.kicker}</p>
          {project.badge && <span className={`badge badge-${project.badge.tone}`}>{project.badge.label}</span>}
        </div>

        <h3 className="mt-3 font-serif text-[1.875rem] leading-[1.1] tracking-[-0.02em] text-ink">{project.name}</h3>
        <p className="mt-3 text-[0.9375rem] text-ink-2">
          <Isolated text={project.summary} />
        </p>

        {project.points.length > 0 && (
          <ul className="ticks mt-5 space-y-2 text-[0.9375rem] text-ink-2">
            {project.points.map((point) => (
              <li key={point}>
                <Isolated text={point} />
              </li>
            ))}
          </ul>
        )}

        <div className="mt-auto pt-6">
          <ul className="flex flex-wrap gap-1.5" aria-label="Built with">
            {project.stack.map((tech) => (
              <li key={tech} className="rounded-[4px] border border-line px-2 py-0.5 font-mono text-xs text-muted">
                {tech}
              </li>
            ))}
          </ul>

          {project.links.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
              {project.links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-underline inline-flex items-center gap-1 text-sm font-medium text-ink"
                >
                  {link.label}
                  <ArrowUpRight />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className={`border-t border-line ${full ? "lg:col-span-7 lg:border-t-0 lg:border-l" : "mt-auto"}`}>
        <ProjectVisual visual={project.visual} full={full} />
      </div>
    </article>
  );
}

// A run of Persian letters, optionally with spaces and half-spaces (ZWNJ) inside it.
const PERSIAN_RUN = /([؀-ۿﭐ-﷿ﹰ-﻿](?:[؀-ۿﭐ-﷿ﹰ-﻿‌ ]*[؀-ۿﭐ-﷿ﹰ-﻿])?)/;

/** Wraps Persian words inside English copy in <bdi>, so the bidi algorithm can't reorder them. */
function Isolated({ text }: { text: string }) {
  const parts = text.split(PERSIAN_RUN);
  if (parts.length === 1) return text;
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <bdi key={i} lang="fa" dir="rtl" className="font-fa">
        {part}
      </bdi>
    ) : (
      part
    ),
  );
}

function ProjectVisual({ visual, full }: { visual: Visual; full: boolean }) {
  switch (visual.kind) {
    case "image":
      if (visual.frame === "dark") {
        return (
          <div className="flex h-full items-center bg-shot-dark">
            <img
              src={visual.src}
              alt={visual.alt}
              width={visual.width}
              height={visual.height}
              loading="lazy"
              decoding="async"
              className="block h-auto w-full"
            />
          </div>
        );
      }
      return (
        <div className="flex h-full items-center justify-center bg-chip px-6 py-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={visual.src}
            alt={visual.alt}
            width={visual.width}
            height={visual.height}
            loading="lazy"
            decoding="async"
            className="block h-auto w-full max-w-[17rem] rounded-md border border-line"
          />
        </div>
      );

    case "bidi":
      return <BidiDemo />;

    case "pipeline":
      return (
        <div className={`flex h-full flex-col justify-center bg-chip px-6 py-8 sm:px-10 ${full ? "lg:py-10" : ""}`}>
          <ol className="relative space-y-2.5">
            {visual.steps.map((step, i) => (
              <li key={step.label} className="relative grid grid-cols-[2.25rem_1fr] items-center">
                <span className="font-mono text-xs text-muted">{String(i + 1).padStart(2, "0")}</span>
                <span
                  className={`rounded-md border px-3.5 py-2.5 font-mono text-[0.8125rem] ${
                    step.owner ? "border-ink bg-ink text-bg" : "border-line bg-surface text-ink-2"
                  }`}
                >
                  {step.label}
                </span>
              </li>
            ))}
          </ol>
          <p className="mt-5 text-xs text-muted">{visual.caption}</p>
        </div>
      );
  }
}

/**
 * The bug persian-ui exists to fix, rendered live: digit groups in a Persian sentence
 * get reordered by the Unicode bidi algorithm unless each Latin run is isolated.
 */
function BidiDemo() {
  return (
    <div className="bg-chip px-6 py-7 sm:px-8">
      <p className="text-xs text-muted">The same Persian sentence, rendered live by your browser:</p>

      <div className="mt-4 space-y-4">
        <figure>
          <figcaption className="flex items-center gap-2 font-mono text-[0.6875rem] tracking-[0.06em] text-muted uppercase">
            <span className="badge badge-red">Broken</span>
            Plain text
          </figcaption>
          <p
            dir="rtl"
            lang="fa"
            className="mt-2 rounded-md border border-line bg-surface px-4 py-3 font-fa text-[0.9375rem] leading-8 text-ink sm:text-[1.0625rem]"
          >
            تماس: +98 912 345 6789، ساعت ۱۰-۲۰
          </p>
        </figure>

        <figure>
          <figcaption className="flex items-center gap-2 font-mono text-[0.6875rem] tracking-[0.06em] text-muted uppercase">
            <span className="badge badge-green">Fixed</span>
            {"<PersianText>"}
          </figcaption>
          <p
            dir="rtl"
            lang="fa"
            className="mt-2 rounded-md border border-line bg-surface px-4 py-3 font-fa text-[0.9375rem] leading-8 text-ink sm:text-[1.0625rem]"
          >
            تماس: <bdi dir="ltr">+98 912 345 6789</bdi>، ساعت <bdi dir="ltr">۱۰-۲۰</bdi>
          </p>
        </figure>
      </div>

      <p className="mt-4 text-xs leading-relaxed text-muted">
        In the plain line the phone number&apos;s groups swap places, the + jumps to the far end and the range reads
        backwards. PersianText isolates each left-to-right run with <code className="font-mono">{'<bdi dir="ltr">'}</code>.
      </p>
    </div>
  );
}
