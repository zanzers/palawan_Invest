"use client";

import { useEffect, useRef } from "react";

const EASE = 0.15;

export default function WheelRow({ label, children }: { label: string; children: React.ReactNode }) {
  const ref = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const found = ref.current;
    if(!found) return;
    const el: HTMLUListElement = found;


    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let target = el.scrollLeft;
    let raf = 0;

    const maxScroll = () => el.scrollWidth - el.clientWidth;

    function step() {
      const diff = target - el.scrollLeft;
      if (Math.abs(diff) < 1) {
        el.scrollLeft = target;
        raf = 0;
        return;
      }
     
      el.scrollLeft += Math.sign(diff) * Math.max(1, Math.abs(diff) * EASE);
      raf = requestAnimationFrame(step);
    }

    function stop() {
      cancelAnimationFrame(raf);
      raf = 0;
    }

    function onWheel(e: WheelEvent) {
      
      if (e.ctrlKey || Math.abs(e.deltaX) >= Math.abs(e.deltaY)) return;

      const limit = maxScroll();
      if (limit <= 0) return;

     
      if (!raf) target = el.scrollLeft;

      const atStart = target <= 0 && e.deltaY < 0;
      const atEnd = target >= limit - 1 && e.deltaY > 0;
      if (atStart || atEnd) return; // hand the wheel back to the page

      e.preventDefault();
      const unit = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? el.clientWidth : 1;
      target = Math.min(limit, Math.max(0, target + e.deltaY * unit));

      if (reduceMotion) {
        el.scrollLeft = target;
        return;
      }
      if (!raf) raf = requestAnimationFrame(step);
    }

    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("pointerdown", stop); 
    return () => {
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("pointerdown", stop);
      stop();
    };
  }, []);

  return (
    <ul ref={ref} aria-label={label} className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto overflow-y-hidden overscroll-x-contain scroll-px-4 px-4 pb-3 pt-1 scrollbar-none [&::-webkit-scrollbar]:hidden pointer-fine:snap-none">
      {children}
    </ul>
  );
}