import { useEffect, useRef, useState } from 'react';

// Characters used during the scramble animation (visible set)
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*';

function randomChar() {
  return CHARS[Math.floor(Math.random() * CHARS.length)];
}

// Decodes `target` string character by character over `durationMs` ms.
// Returns via `onDone` when finished.
function scramble(target, onFrame, onDone, durationMs = 1000) {
  const totalFrames = Math.round(durationMs / 16); // ~60 fps
  const resolvePerFrame = target.length / totalFrames;
  let frame = 0;
  let resolved = 0;
  let raf;

  function tick() {
    resolved = Math.min(target.length, frame * resolvePerFrame);
    const display = target
      .split('')
      .map((char, i) => {
        if (char === ' ') return ' ';
        if (i < resolved) return char;
        return randomChar();
      })
      .join('');
    onFrame(display);
    frame++;
    if (resolved >= target.length) {
      onFrame(target);
      onDone();
      return;
    }
    raf = requestAnimationFrame(tick);
  }

  raf = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(raf);
}

// A pause-then-scramble-out then scramble-in cycle across `phrases`.
export default function TextScramble({
  phrases,
  scrambleDuration = 900,
  holdDuration = 2600,
}) {
  const [display, setDisplay] = useState(phrases[0] || '');
  const indexRef = useRef(0);
  const cancelRef = useRef(null);

  useEffect(() => {
    // Respect reduced-motion — just static text
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplay(phrases[0]);
      return;
    }

    let alive = true;

    function cycle() {
      if (!alive) return;
      const next = phrases[(indexRef.current + 1) % phrases.length];

      // Hold current phrase, then animate in the next
      const holdTimer = setTimeout(() => {
        if (!alive) return;
        cancelRef.current = scramble(
          next,
          (text) => alive && setDisplay(text),
          () => {
            if (!alive) return;
            indexRef.current = (indexRef.current + 1) % phrases.length;
            cycle();
          },
          scrambleDuration
        );
      }, holdDuration);

      return () => clearTimeout(holdTimer);
    }

    // Kick off the first scramble in on mount
    cancelRef.current = scramble(
      phrases[0],
      (text) => alive && setDisplay(text),
      () => alive && cycle(),
      scrambleDuration
    );

    return () => {
      alive = false;
      if (cancelRef.current) cancelRef.current();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <span
      className="text-scramble"
      aria-live="polite"
      aria-label={phrases[indexRef.current]}
    >
      {display}
    </span>
  );
}
