import { useRef, useState, useCallback, useEffect } from 'react';

// Drives a horizontal-scroll gallery: exposes a ref for the scroll track,
// the current scroll progress (0-1) for the underline bar, and prev/next
// functions for the arrow buttons.
export default function useCarousel() {
  const trackRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const updateProgress = useCallback(() => {
    const node = trackRef.current;
    if (!node) return;
    const max = node.scrollWidth - node.clientWidth;
    const value = max > 0 ? node.scrollLeft / max : 0;
    setProgress(value);
    setAtStart(node.scrollLeft <= 4);
    setAtEnd(node.scrollLeft >= max - 4);
  }, []);

  useEffect(() => {
    const node = trackRef.current;
    if (!node) return;
    updateProgress();
    node.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);
    return () => {
      node.removeEventListener('scroll', updateProgress);
      window.removeEventListener('resize', updateProgress);
    };
  }, [updateProgress]);

  const scrollByCard = (direction) => {
    const node = trackRef.current;
    if (!node) return;
    const card = node.querySelector('[data-card]');
    const step = card ? card.offsetWidth + 24 : node.clientWidth * 0.8;
    node.scrollBy({ left: direction * step, behavior: 'smooth' });
  };

  return {
    trackRef,
    progress,
    atStart,
    atEnd,
    prev: () => scrollByCard(-1),
    next: () => scrollByCard(1),
  };
}
