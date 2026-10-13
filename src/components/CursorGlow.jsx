import { useEffect, useRef } from 'react';

const LERP = 0.085; // smoothing factor — smaller = lazier/smoother follow

export default function CursorGlow() {
  const glowRef = useRef(null);
  const posRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const targetRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const rafRef = useRef(null);

  useEffect(() => {
    // Skip on touch-only devices
    if (!window.matchMedia('(hover: hover)').matches) return;
    // Skip on reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const el = glowRef.current;
    if (!el) return;

    function onMouseMove(e) {
      targetRef.current.x = e.clientX;
      targetRef.current.y = e.clientY;
    }
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    function animate() {
      rafRef.current = requestAnimationFrame(animate);
      posRef.current.x += (targetRef.current.x - posRef.current.x) * LERP;
      posRef.current.y += (targetRef.current.y - posRef.current.y) * LERP;

      // Update via CSS vars on the element directly — no React re-render
      el.style.transform = `translate(${posRef.current.x}px, ${posRef.current.y}px) translate(-50%, -50%)`;
    }
    animate();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  return (
    <div
      ref={glowRef}
      className="cursor-glow"
      aria-hidden="true"
    />
  );
}
