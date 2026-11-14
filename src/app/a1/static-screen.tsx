"use client";

import { useEffect, useRef } from "react";

/** TV static: a tiny canvas of random grey pixels, redrawn about 15 times a second. */
export function StaticScreen() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const image = ctx.createImageData(canvas.width, canvas.height);
    const pixels = new Uint32Array(image.data.buffer);
    const draw = () => {
      for (let i = 0; i < pixels.length; i++) {
        const v = (Math.random() * 255) | 0;
        pixels[i] = (255 << 24) | (v << 16) | (v << 8) | v;
      }
      ctx.putImageData(image, 0, 0);
    };
    draw();

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    let last = 0;
    let visible = true;
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    observer.observe(canvas);

    const loop = (time: number) => {
      if (visible && time - last > 66) {
        draw();
        last = time;
      }
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);

  return <canvas ref={ref} width={96} height={72} className="a1-static" aria-hidden="true" />;
}
