import { useEffect } from 'react';

// Drives the "scrolling game" feel: instead of a document that just sits
// there, this continuously writes the current scroll position onto the
// <html> element as CSS custom properties every frame while the user
// scrolls. CSS elsewhere reads --scroll-y / --scroll-progress to build
// parallax depth, a HUD-style progress bar, and glow effects that move
// smoothly with the page instead of only firing once.
export default function useScrollProgress() {
  useEffect(() => {
    const root = document.documentElement;
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    let ticking = false;

    function update() {
      ticking = false;
      const scrollTop = window.scrollY || root.scrollTop || 0;
      const max = Math.max(1, root.scrollHeight - window.innerHeight);
      const progress = Math.min(1, Math.max(0, scrollTop / max));
      root.style.setProperty('--scroll-y', scrollTop.toFixed(1));
      root.style.setProperty('--scroll-progress', progress.toFixed(4));
    }

    // Set initial values immediately so the first frame isn't at 0.
    update();

    if (prefersReduced) {
      // Keep the progress bar / anchors accurate, just skip the
      // continuous parallax repaint work for reduced-motion users.
      root.style.setProperty('--scroll-parallax-mult', '0');
      return undefined;
    }

    root.style.setProperty('--scroll-parallax-mult', '1');

    function onScroll() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);
}