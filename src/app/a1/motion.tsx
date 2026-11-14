"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

const DESKTOP = "(min-width: 1024px) and (hover: hover)";
const MOTION = "(prefers-reduced-motion: no-preference)";

/**
 * All scroll and pointer motion for the A1 page. Renders nothing: it finds the
 * server-rendered markup and animates it, so the page reads fine without it.
 */
export function Motion() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".a1-root");
    if (!root) return;

    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();
    let lenis: Lenis | null = null;

    // In-page links: glide with Lenis when it is running, plain jump otherwise.
    const onClick = (event: MouseEvent) => {
      const link = (event.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
      const id = link?.getAttribute("href")?.slice(1);
      const target = id ? document.getElementById(id) : null;
      if (!target || !id) return;
      event.preventDefault();
      if (lenis) lenis.scrollTo(target, { duration: 1.3 });
      else target.scrollIntoView({ block: "start" });
      history.replaceState(null, "", `#${id}`);
    };
    root.addEventListener("click", onClick);

    // Desktop with a mouse: smooth scroll, the cursor-driven camera and the push into the wall.
    mm.add(`${DESKTOP} and ${MOTION}`, () => {
      const smooth = new Lenis({ lerp: 0.11 });
      lenis = smooth;
      smooth.on("scroll", ScrollTrigger.update);
      const tick = (time: number) => smooth.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);

      const hero = root.querySelector<HTMLElement>(".a1-hero");
      const tilt = root.querySelector<HTMLElement>(".a1-tilt");
      const dolly = root.querySelector<HTMLElement>(".a1-dolly");
      const head = root.querySelector<HTMLElement>(".a1-hero-head");
      const foot = root.querySelector<HTMLElement>(".a1-hero-foot");
      const veil = root.querySelector<HTMLElement>(".a1-hero-veil");
      const ident = root.querySelector<HTMLElement>(".a1-ident");
      const scene = root.querySelector<HTMLElement>(".a1-scene");
      let onMove: ((event: PointerEvent) => void) | null = null;

      if (hero && tilt && dolly && head && foot && veil && ident && scene) {
        // The camera drifts after the cursor.
        const quick = { duration: 1.1, ease: "power3.out" };
        const rotateX = gsap.quickTo(tilt, "rotationX", quick);
        const rotateY = gsap.quickTo(tilt, "rotationY", quick);
        const moveX = gsap.quickTo(tilt, "x", quick);
        const moveY = gsap.quickTo(tilt, "y", quick);
        onMove = (event: PointerEvent) => {
          const nx = (event.clientX / window.innerWidth) * 2 - 1;
          const ny = (event.clientY / window.innerHeight) * 2 - 1;
          rotateY(nx * 4.5);
          rotateX(-ny * 3.2);
          moveX(-nx * 26);
          moveY(-ny * 16);
        };
        hero.addEventListener("pointermove", onMove);

        // Scrolling pushes the camera through the wall and into the Letterboxd set.
        gsap
          .timeline({
            defaults: { ease: "none" },
            scrollTrigger: { trigger: hero, start: "top top", end: "+=150%", scrub: 0.6, pin: true, anticipatePin: 1 },
          })
          .to(dolly, { z: 900, ease: "power2.in", duration: 1 }, 0)
          .fromTo(head, { autoAlpha: 1, yPercent: 0 }, { autoAlpha: 0, yPercent: -35, ease: "power1.in", duration: 0.32 }, 0)
          .fromTo(foot, { autoAlpha: 1, y: 0 }, { autoAlpha: 0, y: 28, ease: "power1.in", duration: 0.22 }, 0)
          .fromTo(veil, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.11, immediateRender: false }, 0.84)
          .fromTo(
            ident,
            { autoAlpha: 0, scale: 1.08 },
            { autoAlpha: 1, scale: 1, ease: "power2.out", duration: 0.08, immediateRender: false },
            0.92,
          )
          .set(scene, { visibility: "hidden" }, 1);
      }

      return () => {
        if (hero && onMove) hero.removeEventListener("pointermove", onMove);
        gsap.ticker.remove(tick);
        smooth.destroy();
        lenis = null;
      };
    });

    // Everyone who has not asked for reduced motion: screens switch on, copy rises, words light up.
    mm.add(MOTION, () => {
      gsap.utils.toArray<HTMLElement>("[data-a1-channel]", root).forEach((channel) => {
        const picture = channel.querySelector(".a1-screen-content");
        const flash = channel.querySelector(".a1-flash");
        const copy = channel.querySelectorAll(".a1-channel-copy > *");
        const first = channel.matches(":first-child");
        const timeline = gsap.timeline({
          scrollTrigger: { trigger: channel, start: first ? "top 88%" : "top 68%", once: true },
        });
        if (picture) timeline.from(picture, { scaleY: 0.004, scaleX: 0.3, duration: 0.6, ease: "power3.out" }, 0);
        if (flash) {
          timeline.fromTo(
            flash,
            { autoAlpha: 0.85 },
            { autoAlpha: 0, duration: 0.8, ease: "power2.out", immediateRender: false },
            0.04,
          );
        }
        timeline.from(copy, { y: 28, autoAlpha: 0, duration: 0.8, ease: "power3.out", stagger: 0.07 }, 0.15);
      });

      gsap.utils.toArray<HTMLElement>("[data-a1-lit]", root).forEach((paragraph) => {
        gsap.fromTo(
          paragraph.querySelectorAll(".a1-word"),
          { opacity: 0.2 },
          {
            opacity: 1,
            ease: "none",
            stagger: 0.08,
            scrollTrigger: { trigger: paragraph, start: "top 82%", end: "bottom 48%", scrub: 0.4 },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>("[data-a1-rise]", root).forEach((el) => {
        gsap.from(el, {
          y: 26,
          autoAlpha: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        });
      });
    });

    // Fonts and images change heights, so measure again once they are in.
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    document.fonts?.ready.then(refresh).catch(() => undefined);

    return () => {
      window.removeEventListener("load", refresh);
      root.removeEventListener("click", onClick);
      mm.revert();
    };
  }, []);

  return null;
}
