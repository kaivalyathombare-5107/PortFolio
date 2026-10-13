import { useCallback, useRef } from 'react';

const MAX_TILT = 8; // degrees
const EASE_BACK_MS = 600;

// Returns { onMouseMove, onMouseLeave, ref } to spread onto a card container.
// Updates CSS vars and 3-D transform directly on the DOM node — zero React
// re-renders on every mouse-move event.
export default function useSpotlight() {
  const elRef = useRef(null);
  const rafRef = useRef(null);

  const onMouseMove = useCallback((e) => {
    const el = elRef.current;
    if (!el) return;

    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Normalized 0→1 within the card
      const nx = x / rect.width;
      const ny = y / rect.height;

      // Tilt: center is 0, edges are ±MAX_TILT
      const tiltX = (ny - 0.5) * -MAX_TILT;
      const tiltY = (nx - 0.5) * MAX_TILT;

      el.style.setProperty('--spotlight-x', `${x}px`);
      el.style.setProperty('--spotlight-y', `${y}px`);
      el.style.setProperty('--spotlight-opacity', '1');
      el.style.transform = `perspective(700px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-4px) scale(1.018)`;
      el.style.transition = 'box-shadow 0.25s ease, border-color 0.25s ease';
    });
  }, []);

  const onMouseLeave = useCallback(() => {
    const el = elRef.current;
    if (!el) return;
    cancelAnimationFrame(rafRef.current);
    el.style.setProperty('--spotlight-opacity', '0');
    el.style.transform = '';
    el.style.transition = `transform ${EASE_BACK_MS}ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.35s ease, border-color 0.35s ease`;
  }, []);

  return { ref: elRef, onMouseMove, onMouseLeave };
}
