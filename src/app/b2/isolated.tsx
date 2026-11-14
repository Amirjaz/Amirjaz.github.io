import type { ReactNode } from "react";

// A run of Persian letters, optionally with spaces and half-spaces (ZWNJ) inside it.
const PERSIAN_RUN = /([؀-ۿﭐ-﷿ﹰ-﻿](?:[؀-ۿﭐ-﷿ﹰ-﻿‌ ]*[؀-ۿﭐ-﷿ﹰ-﻿])?)/;

/** Wraps Persian words inside English copy in <bdi>, so the bidi algorithm can't reorder them. */
export function Isolated({ text }: { text: string }) {
  const parts = text.split(PERSIAN_RUN);
  if (parts.length === 1) return text;
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <bdi key={i} lang="fa" dir="rtl" className="b2-fa">
        {part}
      </bdi>
    ) : (
      part
    ),
  );
}

/** Marks a few key phrases of existing copy so the paragraph can be scanned quickly. */
export function Emphasised({ text, phrases }: { text: string; phrases: string[] }) {
  const found = phrases.filter((p) => text.includes(p));
  if (found.length === 0) return text;
  const escaped = found.map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const parts = text.split(new RegExp(`(${escaped.join("|")})`));
  const out: ReactNode[] = parts.map((part, i) => (i % 2 === 1 ? <strong key={i}>{part}</strong> : part));
  return out;
}
