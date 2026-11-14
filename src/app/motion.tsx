"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import Lenis from "lenis";

/**
 * All motion for the page. The page itself is plain server-rendered HTML; this
 * component only adds behaviour, so with scripts off (or motion reduced) everything
 * is simply there.
 */
export function Motion() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".a5-root");
    if (!root) return;

    const undo: (() => void)[] = [];
    let alive = true;
    const $ = <T extends Element = HTMLElement>(sel: string) => root.querySelector<T>(sel);
    const $$ = <T extends Element = HTMLElement>(sel: string) => Array.from(root.querySelectorAll<T>(sel));
    const on = <K extends keyof HTMLElementEventMap>(
      el: HTMLElement | Window,
      type: K,
      fn: (e: HTMLElementEventMap[K]) => void,
      opts?: AddEventListenerOptions,
    ) => {
      el.addEventListener(type, fn as EventListener, opts);
      undo.push(() => el.removeEventListener(type, fn as EventListener, opts));
    };

    // Live Tehran time. Runs for everyone, motion or not.
    const clock = $("[data-a5-clock]");
    if (clock) {
      const fmt = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Tehran" });
      const tick = () => (clock.textContent = fmt.format(new Date()));
      tick();
      const id = window.setInterval(tick, 15_000);
      undo.push(() => window.clearInterval(id));
    }

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    if (reduce) {
      return () => undo.forEach((fn) => fn());
    }

    gsap.registerPlugin(ScrollTrigger, SplitText);

    // ---------- Smooth scroll, in step with ScrollTrigger ----------
    const lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 0.95 });
    lenis.on("scroll", ScrollTrigger.update);
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    undo.push(() => {
      gsap.ticker.remove(raf);
      lenis.destroy();
    });

    $$<HTMLAnchorElement>('a[href^="#"]').forEach((a) => {
      on(a, "click", (e) => {
        const target = root.querySelector<HTMLElement>(a.getAttribute("href") ?? "");
        if (!target) return;
        e.preventDefault();
        lenis.scrollTo(target, { duration: 1.5, easing: (t) => 1 - Math.pow(1 - t, 4) });
        history.replaceState(null, "", a.getAttribute("href"));
      });
    });

    const ctx = gsap.context(() => {
      // ---------- Preloader, then the hero settles in ----------
      const pre = $(".a5-preloader");
      const heroIn = $$("[data-hero-in]");
      const intro = gsap.timeline({ defaults: { ease: "power3.out" } });

      if (pre && getComputedStyle(pre).display !== "none") {
        const words = $$("[data-word]");
        const path = pre.querySelector("path");
        const w = window.innerWidth;
        const h = window.innerHeight;
        const bulged = `M0 0 L${w} 0 L${w} ${h} Q${w / 2} ${h + 300} 0 ${h} L0 0`;
        const flat = `M0 0 L${w} 0 L${w} ${h} Q${w / 2} ${h} 0 ${h} L0 0`;

        lenis.stop();
        window.scrollTo(0, 0);
        gsap.set(pre, { animation: "none" });
        gsap.set(path, { attr: { d: bulged } });
        gsap.set(heroIn, { y: 70, autoAlpha: 0 });

        intro.fromTo(words[0], { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.45, ease: "power1.out" }).to({}, { duration: 0.5 });
        words.slice(1).forEach((word, i) => {
          intro.set(words[i], { autoAlpha: 0 }).set(word, { autoAlpha: 1 }).to({}, { duration: 0.19 });
        });
        intro
          .to({}, { duration: 0.25 })
          .set(pre, { backgroundColor: "transparent" })
          .to(".a5-preloader-words", { autoAlpha: 0, y: -40, duration: 0.45, ease: "power2.in" })
          .to(pre, { y: () => -(window.innerHeight + 40), duration: 0.95, ease: "power4.inOut" }, "<0.05")
          .to(path, { attr: { d: flat }, duration: 0.8, ease: "power4.inOut" }, "<0.12")
          .add(() => lenis.start(), "<0.3")
          .to(heroIn, { y: 0, autoAlpha: 1, duration: 1.2, stagger: 0.09 }, "<")
          .set(pre, { display: "none" });
      }

      // ---------- Name marquee: drifts, and turns around with the scroll ----------
      const track = $(".a5-marquee-track");
      const item = track?.firstElementChild as HTMLElement | null;
      if (track && item) {
        const setX = gsap.quickSetter(track, "x", "px");
        let width = item.offsetWidth;
        let x = 0;
        let dir = -1;
        const ro = new ResizeObserver(() => (width = item.offsetWidth));
        ro.observe(item);
        undo.push(() => ro.disconnect());

        const drift = (_time: number, delta: number) => {
          if (!width) return;
          x += dir * (delta / 1000) * 95 - lenis.velocity * 0.32;
          x = ((x % width) - width) % width; // keep inside (-width, 0]
          setX(x);
        };
        gsap.ticker.add(drift);
        undo.push(() => gsap.ticker.remove(drift));

        ScrollTrigger.create({
          start: 0,
          end: "max",
          onUpdate: (self) => (dir = self.direction === 1 ? -1 : 1),
        });
      }

      // ---------- Compact nav drops in once the hero has gone ----------
      const dock = $(".a5-dock");
      const hero = $(".a5-hero");
      if (dock && hero) {
        gsap.set(dock, { yPercent: -180 });
        const show = (visible: boolean) =>
          gsap.to(dock, {
            yPercent: visible ? 0 : -180,
            autoAlpha: visible ? 1 : 0,
            duration: visible ? 0.7 : 0.4,
            ease: visible ? "power3.out" : "power2.in",
            overwrite: true,
          });
        ScrollTrigger.create({
          trigger: hero,
          start: "bottom top+=90",
          onEnter: () => show(true),
          onLeaveBack: () => show(false),
        });
      }

      // ---------- Rounded section edges flatten as they travel up ----------
      $$(".a5-curve").forEach((curve) => {
        gsap.to(curve, {
          scaleY: 0,
          ease: "none",
          scrollTrigger: { trigger: curve, start: "top 92%", end: "top 30%", scrub: true },
        });
      });

      // ---------- Blocks rise in ----------
      const blocks = $$("[data-a5-reveal]");
      gsap.set(blocks, { y: 48, autoAlpha: 0 });
      ScrollTrigger.batch(blocks, {
        start: "top 90%",
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, { y: 0, autoAlpha: 1, duration: 1.1, ease: "power3.out", stagger: 0.09, overwrite: true }),
      });

      // Case images breathe a little inside their frames.
      $$(".a5-case-media").forEach((frame) => {
        const panel = frame.querySelector(".a5-panel-cover img, .a5-panel-contain img");
        if (!panel) return;
        gsap.fromTo(
          panel,
          { yPercent: -4, scale: 1.08 },
          { yPercent: 4, scale: 1.08, ease: "none", scrollTrigger: { trigger: frame, start: "top bottom", end: "bottom top", scrub: true } },
        );
      });

      // Phone screenshots drift past each other, so the row reads as three layers.
      const phoneDrift = [4, -3, 5.5];
      $$(".a5-phones").forEach((row) => {
        Array.from(row.children).forEach((shot, i) => {
          const by = phoneDrift[i % phoneDrift.length];
          gsap.fromTo(
            shot,
            { yPercent: by },
            { yPercent: -by, ease: "none", scrollTrigger: { trigger: row, start: "top bottom", end: "bottom top", scrub: true } },
          );
        });
      });

      // The round "Selected work" button trails the text beside it.
      const drifter = $("[data-a5-drift]");
      if (drifter && fine) {
        gsap.fromTo(
          drifter,
          { y: 70 },
          { y: -50, ease: "none", scrollTrigger: { trigger: drifter, start: "top bottom", end: "bottom top", scrub: 0.6 } },
        );
      }

      // Footer: the content rises into place and the button slides along its line.
      const footer = $(".a5-footer");
      if (footer) {
        const st = { trigger: footer, start: "top bottom", end: "bottom bottom", scrub: true };
        gsap.fromTo(".a5-footer-inner", { yPercent: -18 }, { yPercent: 0, ease: "none", scrollTrigger: st });
        gsap.fromTo("[data-a5-slide]", { x: 160 }, { x: 0, ease: "none", scrollTrigger: { ...st } });
      }

      // ---------- Pointer extras: magnets and the work preview ----------
      if (fine) {
        $$("[data-magnetic]").forEach((el) => {
          const strength = Number(el.dataset.magnetic) || 0.35;
          const inner = el.querySelector<HTMLElement>("[data-magnetic-inner]");
          const spring = { duration: 1, ease: "elastic.out(1, 0.3)" };
          const xTo = gsap.quickTo(el, "x", spring);
          const yTo = gsap.quickTo(el, "y", spring);
          const ixTo = inner ? gsap.quickTo(inner, "x", spring) : null;
          const iyTo = inner ? gsap.quickTo(inner, "y", spring) : null;
          on(el, "mousemove", (e) => {
            const r = el.getBoundingClientRect();
            const dx = e.clientX - (r.left + r.width / 2);
            const dy = e.clientY - (r.top + r.height / 2);
            xTo(dx * strength);
            yTo(dy * strength);
            ixTo?.(dx * strength * 0.45);
            iyTo?.(dy * strength * 0.45);
          });
          on(el, "mouseleave", () => {
            xTo(0);
            yTo(0);
            ixTo?.(0);
            iyTo?.(0);
          });
        });

      }
    }, root);
    undo.push(() => ctx.revert());

    // ---------- Text set in lines, revealed line by line (after fonts settle) ----------
    const splits: SplitText[] = [];
    document.fonts.ready.then(() => {
      if (!alive) return;
      $$("[data-a5-lines]").forEach((el) => {
        splits.push(
          SplitText.create(el, {
            type: "lines",
            mask: "lines",
            autoSplit: true,
            onSplit: (self) =>
              gsap.from(self.lines, {
                yPercent: 108,
                duration: 1.05,
                ease: "power4.out",
                stagger: 0.075,
                scrollTrigger: { trigger: el, start: "top 86%", once: true },
              }),
          }),
        );
      });
      ScrollTrigger.refresh();
    });
    undo.push(() => splits.forEach((s) => s.revert()));

    return () => {
      alive = false;
      undo.reverse().forEach((fn) => fn());
    };
  }, []);

  return null;
}
