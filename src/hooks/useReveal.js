import { useEffect, useRef, useState } from 'react';

// Adds an "is-visible" class as an element scrolls into the viewport, and
// removes it again once the element scrolls back out of view. Panels
// animate in AND out as you scroll up/down, like a level loading and
// unloading in a game, instead of a document that prints each block once
// and then sits there static (the "PDF" feel). Respects
// prefers-reduced-motion by revealing everything immediately, no motion.
export default function useReveal(options = {}) {
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

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      // Trigger a little before the element fully enters/leaves so the
      // motion feels anticipatory rather than late, like scenery loading
      // in just ahead of the player.
      { threshold: 0.12, rootMargin: '-6% 0px -6% 0px', ...options }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [options]);

  return [ref, visible];
}