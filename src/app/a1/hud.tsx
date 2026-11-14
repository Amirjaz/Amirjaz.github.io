"use client";

import { useEffect, useRef, useState } from "react";

const sections = [
  { id: "work", label: "Work" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
] as const;

const pad = (n: number, length = 2) => String(Math.floor(n)).padStart(length, "0");

/** The camcorder frame: corner brackets, live fps, REC, today's date and a scroll timecode. */
export function Hud() {
  const fps = useRef<HTMLSpanElement>(null);
  const timecode = useRef<HTMLSpanElement>(null);
  const [dates, setDates] = useState<{ gregorian: string; jalali: string } | null>(null);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    // Today's date, in both calendars.
    const now = new Date();
    const gregorian = `${now.getFullYear()}/${pad(now.getMonth() + 1)}/${pad(now.getDate())}`;
    let jalali = "";
    try {
      const parts = new Intl.DateTimeFormat("en-u-ca-persian", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).formatToParts(now);
      const part = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
      jalali = `${part("year")}/${part("month")}/${part("day")}`;
    } catch {
      jalali = "";
    }
    setDates({ gregorian, jalali });

    // Real frames per second, averaged over half a second.
    let frame = 0;
    let count = 0;
    let since = performance.now();
    const loop = (time: number) => {
      count++;
      if (time - since >= 500) {
        const value = Math.min(240, Math.round((count * 1000) / (time - since)));
        if (fps.current) fps.current.textContent = String(value).padStart(3, "0");
        count = 0;
        since = time;
      }
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);

    // Timecode: the page plays at 24 frames per 100 pixels of scroll.
    const onScroll = () => {
      const frames = Math.floor(window.scrollY * 0.24);
      const seconds = Math.floor(frames / 24);
      if (timecode.current) {
        timecode.current.textContent = `${pad(seconds / 60)}:${pad(seconds % 60)}:${pad(frames % 24)}`;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    // Which section crosses the middle of the screen.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id === "top" ? null : entry.target.id);
        }
      },
      { rootMargin: "-50% 0px -50% 0px" },
    );
    for (const id of ["top", ...sections.map((s) => s.id)]) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
    };
  }, []);

  return (
    <div className="a1-hud">
      <span className="a1-hud-corner tl" aria-hidden="true" />
      <span className="a1-hud-corner tr" aria-hidden="true" />
      <span className="a1-hud-corner bl" aria-hidden="true" />
      <span className="a1-hud-corner br" aria-hidden="true" />

      <p className="a1-hud-label tl" aria-hidden="true">
        <span ref={fps}>000</span> fps
      </p>
      <p className="a1-hud-label tr" aria-hidden="true">
        <i className="a1-rec-dot" />
        REC
      </p>
      <p className="a1-hud-label bl" aria-hidden="true">
        [ {dates?.gregorian ?? "0000/00/00"} ]
        {dates?.jalali ? <span className="a1-hud-jalali"> [ {dates.jalali} ]</span> : null}
      </p>
      <p className="a1-hud-label br" aria-hidden="true">
        [ <span ref={timecode}>00:00:00</span> ]
      </p>

      <nav className="a1-pill" aria-label="Sections">
        {sections.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className={active === s.id ? "is-active" : undefined}
            aria-current={active === s.id ? "true" : undefined}
          >
            {s.label}
          </a>
        ))}
      </nav>
    </div>
  );
}
