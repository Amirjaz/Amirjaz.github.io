"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

export type Channel = { id: string; no: string; label: string } & (
  | { kind: "idle"; name: string; role: string }
  | { kind: "images"; srcs: string[] }
  | { kind: "bidi" }
  | { kind: "karaoke"; steps: string[] }
  | { kind: "card"; meta: string; title: string; sub: string }
);

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return reduced;
}

/**
 * The sidebar TV. It shows the row under the cursor, or failing that the row nearest the
 * middle of the viewport. Rows opt in with a `data-ch="<channel id>"` attribute.
 */
export function Tv({ channels }: { channels: Channel[] }) {
  const idle = channels[0];
  const [shown, setShown] = useState(idle.id);
  const [staticOn, setStaticOn] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();
  const reducedRef = useRef(false);

  useEffect(() => {
    reducedRef.current = reduced;
  }, [reduced]);

  // Decide which channel should be on, and cut to it through a short burst of static.
  useEffect(() => {
    const ids = new Set(channels.map((c) => c.id));
    let hovered: string | null = null;
    let focused: string | null = null;
    let nearest: string | null = null;
    let current = idle.id;
    let debounce = 0;
    let swap = 0;
    let clear = 0;
    let raf = 0;

    const tune = (id: string) => {
      if (id === current) return;
      current = id;
      window.clearTimeout(swap);
      window.clearTimeout(clear);
      if (reducedRef.current) {
        setStaticOn(false);
        setShown(id);
        return;
      }
      setStaticOn(true);
      swap = window.setTimeout(() => setShown(id), 90);
      clear = window.setTimeout(() => setStaticOn(false), 230);
    };

    const request = (delay: number) => {
      window.clearTimeout(debounce);
      debounce = window.setTimeout(() => tune(hovered ?? focused ?? nearest ?? idle.id), delay);
    };

    const onOver = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const row = e.target instanceof Element ? e.target.closest<HTMLElement>("[data-ch]") : null;
      const id = row?.dataset.ch ?? null;
      if (id === hovered || (id !== null && !ids.has(id))) return;
      hovered = id;
      request(id ? 70 : 180);
    };

    const onLeave = () => {
      if (hovered === null) return;
      hovered = null;
      request(180);
    };

    // Keyboard: tabbing into a row tunes the TV the same way hovering does.
    const onFocus = (e: FocusEvent) => {
      const row = e.target instanceof Element ? e.target.closest<HTMLElement>("[data-ch]") : null;
      const id = row?.dataset.ch ?? null;
      if (id === focused || (id !== null && !ids.has(id))) return;
      focused = id;
      request(70);
    };
    const onBlur = () => {
      if (focused === null) return;
      focused = null;
      request(180);
    };

    const measure = () => {
      raf = 0;
      const mid = window.innerHeight * 0.42;
      let best: string | null = null;
      let bestDistance = window.innerHeight * 0.3;
      if (window.scrollY > 120) {
        document.querySelectorAll<HTMLElement>("[data-ch]").forEach((row) => {
          const box = row.getBoundingClientRect();
          if (box.height === 0) return;
          const inside = box.top <= mid && box.bottom >= mid;
          const distance = inside ? 0 : Math.min(Math.abs(box.top - mid), Math.abs(box.bottom - mid));
          if (distance < bestDistance) {
            bestDistance = distance;
            best = row.dataset.ch ?? null;
          }
        });
      }
      if (best !== nearest) {
        nearest = best;
        if (hovered === null && focused === null) request(140);
      }
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };

    measure();
    document.addEventListener("pointerover", onOver);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("focusin", onFocus);
    document.addEventListener("focusout", onBlur);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.clearTimeout(debounce);
      window.clearTimeout(swap);
      window.clearTimeout(clear);
      cancelAnimationFrame(raf);
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("focusin", onFocus);
      document.removeEventListener("focusout", onBlur);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [channels, idle.id]);

  // Mark the row that is on air, so its channel label can light up.
  useEffect(() => {
    document.querySelectorAll<HTMLElement>("[data-ch]").forEach((row) => {
      row.toggleAttribute("data-onair", row.dataset.ch === shown);
    });
  }, [shown]);

  // Static: random grey pixels on a tiny canvas, scaled up without smoothing.
  useEffect(() => {
    if (!staticOn) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const frame = ctx.createImageData(canvas.width, canvas.height);
    let raf = 0;
    const draw = () => {
      const data = frame.data;
      for (let i = 0; i < data.length; i += 4) {
        const v = (Math.random() * 255) | 0;
        data[i] = v;
        data[i + 1] = v;
        data[i + 2] = v;
        data[i + 3] = 255;
      }
      ctx.putImageData(frame, 0, 0);
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, [staticOn]);

  // Warm the cache so the first cut to an image channel is not a black frame.
  useEffect(() => {
    const timer = window.setTimeout(() => {
      for (const c of channels) {
        if (c.kind === "images" && c.srcs[0]) new Image().src = c.srcs[0];
      }
    }, 1200);
    return () => window.clearTimeout(timer);
  }, [channels]);

  const channel = channels.find((c) => c.id === shown) ?? idle;

  return (
    <div className="b2-tv" aria-hidden="true">
      <div className="b2-tv-body">
        <div className="b2-screen">
          <div className="b2-screen-content" key={channel.id}>
            <Screen channel={channel} />
          </div>
          <canvas ref={canvasRef} className="b2-static" width={96} height={72} data-on={staticOn ? "" : undefined} />
          <div className="b2-scanlines" />
          <div className="b2-glass" />
        </div>
        <div className="b2-tv-strip">
          <span className="b2-tv-label">
            <b>CH {channel.no}</b>
            {channel.label}
          </span>
          <span className="b2-tv-knobs">
            <i />
            <i />
            <em />
          </span>
        </div>
      </div>
    </div>
  );
}

function Screen({ channel }: { channel: Channel }) {
  switch (channel.kind) {
    case "idle":
      return (
        <div className="b2-scr-idle">
          <div className="b2-bars">
            <i />
            <i />
            <i />
            <i />
            <i />
            <i />
            <i />
          </div>
          <div className="b2-idle-card">
            <strong>{channel.name}</strong>
            <span>{channel.role}</span>
          </div>
        </div>
      );
    case "images":
      return <ImagesScreen srcs={channel.srcs} />;
    case "bidi":
      return <BidiScreen />;
    case "karaoke":
      return <KaraokeScreen steps={channel.steps} />;
    case "card":
      return (
        <div className="b2-scr-card">
          <span className="b2-card-meta">{channel.meta}</span>
          <strong className="b2-card-title" data-long={channel.title.length > 14 ? "" : undefined}>
            {channel.title}
          </strong>
          <span className="b2-card-sub">{channel.sub}</span>
        </div>
      );
  }
}

/** One image, or a slow cycle through several. Wide images sit letterboxed on the 4:3 screen. */
function ImagesScreen({ srcs }: { srcs: string[] }) {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reduced || srcs.length < 2) return;
    const timer = window.setInterval(() => setIndex((n) => (n + 1) % srcs.length), 2600);
    return () => window.clearInterval(timer);
  }, [reduced, srcs.length]);

  return (
    <div className="b2-scr-images">
      {srcs.map((src, n) => (
        // Decorative: the row beside the TV carries the text.
        <img key={src} src={src} alt="" data-on={n === index ? "" : undefined} decoding="async" />
      ))}
    </div>
  );
}

/** The bug persian-ui fixes, rendered live: the same Persian sentence, plain and isolated. */
export function BidiScreen() {
  return (
    <div className="b2-scr-bidi">
      <p className="b2-bidi-label" data-tone="bad">
        Plain text
      </p>
      <p className="b2-bidi-line" dir="rtl" lang="fa">
        تماس: +98 912 345 6789، ساعت ۱۰-۲۰
      </p>
      <p className="b2-bidi-label" data-tone="good">
        {"<PersianText>"}
      </p>
      <p className="b2-bidi-line" dir="rtl" lang="fa">
        تماس: <bdi dir="ltr">+98 912 345 6789</bdi>، ساعت <bdi dir="ltr">۱۰-۲۰</bdi>
      </p>
    </div>
  );
}

/** SinGo has no screenshot, so its channel sings through the pipeline steps instead. */
export function KaraokeScreen({ steps }: { steps: string[] }) {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reduced || steps.length < 2) return;
    const timer = window.setInterval(() => setIndex((n) => (n + 1) % steps.length), 2200);
    return () => window.clearInterval(timer);
  }, [reduced, steps.length]);

  const count = steps.length;
  const two = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="b2-scr-karaoke">
      <p className="b2-k-count">
        {two(index + 1)} / {two(count)}
      </p>
      <div className="b2-k-lines">
        <p className="b2-k-dim">{index > 0 ? steps[index - 1] : " "}</p>
        <p className="b2-k-now" key={index}>
          <span>{steps[index]}</span>
        </p>
        <p className="b2-k-dim">{index < count - 1 ? steps[index + 1] : " "}</p>
      </div>
      <div className="b2-k-wave">
        {Array.from({ length: 18 }, (_, n) => (
          <i key={n} style={{ "--n": n } as CSSProperties} />
        ))}
      </div>
    </div>
  );
}
