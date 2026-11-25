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
      // ---------- Intro: the hero builds itself ----------
      // The giant name rises out of its line word by word, then the nav and the copy settle in.
      // It plays only if the scripts arrived before the CSS failsafe (page.css) started fading the
      // hero in on its own. Later than that, replaying it would hide what is already on screen.
      const heroIn = $$("[data-hero-in]");
      const failsafe = heroIn[0]
        ?.getAnimations?.()
        .find((a) => (a as CSSAnimation).animationName === "a5-hero-failsafe");
      const failsafeAt = Number(failsafe?.currentTime ?? Infinity);
      if (heroIn.length && failsafeAt < 1800) {
        const marquee = $(".a5-marquee");
        const rest = heroIn.filter((el) => el !== marquee);
        gsap.set(heroIn, { animation: "none" });
        gsap.set(rest, { autoAlpha: 0, y: 26 });

        const intro = gsap.timeline();
        if (marquee) {
          const split = SplitText.create(marquee.querySelectorAll(".a5-marquee-name"), { type: "words" });
          // Words and the accent dots between them, in reading order.
          const pieces = Array.from(marquee.querySelectorAll<HTMLElement>(".a5-marquee-name > div, .a5-marquee-item > i"));
          const lift = (marquee.querySelector<HTMLElement>(".a5-marquee-item")?.offsetHeight ?? 200) * 1.05;
          gsap.set(marquee, { autoAlpha: 1 });
          intro.from(pieces, { y: lift, duration: 1.15, ease: "power4.out", stagger: 0.07, onComplete: () => split.revert() });
        }
        intro.to(rest, { autoAlpha: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: 0.08 }, 0.3);
      }

      // ---------- Load line: fills while the page is still loading, then fades ----------
      const bar = $(".a5-loadbar");
      if (bar && document.readyState !== "complete") {
        gsap.set(bar, { autoAlpha: 1, scaleX: 0 });
        const creep = gsap.to(bar, { scaleX: 0.85, duration: 6, ease: "power3.out" });
        on(
          window,
          "load",
          () => {
            creep.kill();
            gsap
              .timeline()
              .to(bar, { scaleX: 1, duration: 0.3, ease: "power2.out" })
              .to(bar, { autoAlpha: 0, duration: 0.45, ease: "power1.out" });
          },
          { once: true },
        );
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
