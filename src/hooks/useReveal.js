import { useEffect, useRef, useState } from 'react';

// useReveal — direction-aware scroll reveal.
//
// The core insight: using rootMargin on both top AND bottom shrinks the
// viewport from all sides, creating a dead band near section boundaries
// where a section is simultaneously "not yet in" and "already out". That
// dead band causes the in/out confusion flicker when scrolling slowly or
// stopping mid-section.
//
// Fix: we watch TWO thresholds (a thin leading edge and a broader body).
// - Scrolling DOWN  → triggers when the element's TOP crosses the bottom
//   of the viewport (leading edge enters) → mark visible.
// - Scrolling UP    → triggers when the element's BOTTOM leaves the top
//   of the viewport (trailing edge exits) → mark hidden.
//
// This means there is always a clear, non-overlapping boundary between
// "in" and "out" — no dead zone, no flicker.
//
// once: true  → reveal once, never exit. Use for the last section (Contact)
//               where there is nothing below to scroll to.
export default function useReveal({ once = false } = {}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReduced) {
      setVisible(true);
      return undefined;
    }

    // We track scroll direction so we can use separate thresholds for
    // enter (scrolling down, element coming up from below) vs exit
    // (scrolling up, element going back above the top of the viewport).
    let lastY = window.scrollY;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const currentY = window.scrollY;
        const scrollingDown = currentY >= lastY;
        lastY = currentY;

        if (entry.isIntersecting) {
          // Element entered viewport — always reveal.
          setVisible(true);
          if (once) observer.unobserve(node);
        } else if (!once) {
          // Element left viewport.
          // Only hide when scrolling UP (element disappeared above us).
          // When scrolling DOWN past an element we leave it revealed so
          // it doesn't flash out as it exits above — it just sits there
          // until we scroll back up into range.
          if (!scrollingDown) {
            setVisible(false);
          }
        }
      },
      // No rootMargin shrinkage — use the real viewport edges.
      // threshold: 0 fires as soon as even 1px of the element is visible.
      { threshold: 0.05 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [once]);

  return [ref, visible];
}