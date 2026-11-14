"use client";

import { useEffect, useState } from "react";

export type NavItem = { id: string; label: string };

/** Sidebar nav. The line grows for the section currently in view. */
export function SectionNav({ items }: { items: NavItem[] }) {
  const [active, setActive] = useState(items[0]?.id ?? "");

  useEffect(() => {
    let raf = 0;
    const measure = () => {
      raf = 0;
      const line = window.innerHeight * 0.38;
      let current = items[0]?.id ?? "";
      for (const item of items) {
        const el = document.getElementById(item.id);
        if (el && el.getBoundingClientRect().top <= line) current = item.id;
      }
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
      if (atBottom) current = items[items.length - 1]?.id ?? current;
      setActive(current);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [items]);

  return (
    <nav className="b2-nav" aria-label="Sections">
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <a href={`#${item.id}`} aria-current={active === item.id ? "true" : undefined}>
              <span className="b2-nav-line" />
              <span className="b2-nav-text">{item.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/** A very faint light that follows the cursor on desktop. Off for touch and reduced motion. */
export function Spotlight() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".b2-root");
    if (!root) return;
    const desktop = window.matchMedia("(hover: hover) and (pointer: fine) and (min-width: 1024px)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let raf = 0;
    let x = 0;
    let y = 0;
    const apply = () => {
      raf = 0;
      root.style.setProperty("--b2-mx", `${x}px`);
      root.style.setProperty("--b2-my", `${y}px`);
      root.setAttribute("data-spot", "");
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || !desktop.matches || reduced.matches) return;
      x = e.clientX;
      y = e.clientY;
      if (!raf) raf = requestAnimationFrame(apply);
    };
    const onLeave = () => root.removeAttribute("data-spot");
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return <div className="b2-spot" aria-hidden="true" />;
}
