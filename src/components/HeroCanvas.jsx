import { useEffect, useRef } from 'react';

// Particle count — enough for density without taxing mid-range hardware
const PARTICLE_COUNT = 55;
const MAX_CONNECTION_DIST = 130;
const MOUSE_REPEL_DIST = 90;
const PARTICLE_SPEED = 0.38;

function randomBetween(a, b) {
  return a + Math.random() * (b - a);
}

export default function HeroCanvas() {
  const canvasRef = useRef(null);
  const stateRef = useRef({
    particles: [],
    mouse: { x: -9999, y: -9999 },
    raf: null,
    running: true,
  });

  useEffect(() => {
    // Respect reduced-motion preference — skip the whole thing
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const state = stateRef.current;

    // ── Sizing ────────────────────────────────────────────────────────────────
    function resize() {
      const { width, height } = canvas.parentElement.getBoundingClientRect();
      canvas.width = width;
      canvas.height = height;
    }

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas.parentElement);

    // ── Particle init ─────────────────────────────────────────────────────────
    function makeParticles() {
      state.particles = Array.from({ length: PARTICLE_COUNT }, () => ({
        x: randomBetween(0, canvas.width),
        y: randomBetween(0, canvas.height),
        vx: randomBetween(-PARTICLE_SPEED, PARTICLE_SPEED),
        vy: randomBetween(-PARTICLE_SPEED, PARTICLE_SPEED),
        r: randomBetween(1.2, 2.6),
        // Alternate between accent colours
        hue: Math.random() > 0.55 ? 182 : 255, // cyan ≈ 182, violet ≈ 255
      }));
    }
    makeParticles();

    // ── Mouse tracking ────────────────────────────────────────────────────────
    function onMouseMove(e) {
      const rect = canvas.getBoundingClientRect();
      state.mouse.x = e.clientX - rect.left;
      state.mouse.y = e.clientY - rect.top;
    }
    function onMouseLeave() {
      state.mouse.x = -9999;
      state.mouse.y = -9999;
    }
    canvas.parentElement.addEventListener('mousemove', onMouseMove);
    canvas.parentElement.addEventListener('mouseleave', onMouseLeave);

    // ── Animation loop ────────────────────────────────────────────────────────
    function draw() {
      if (!state.running) return;
      state.raf = requestAnimationFrame(draw);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const { particles, mouse } = state;
      const W = canvas.width;
      const H = canvas.height;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Mouse repulsion
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MOUSE_REPEL_DIST && dist > 0) {
          const force = (MOUSE_REPEL_DIST - dist) / MOUSE_REPEL_DIST;
          p.vx += (dx / dist) * force * 0.28;
          p.vy += (dy / dist) * force * 0.28;
        }

        // Speed cap
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (speed > PARTICLE_SPEED * 3) {
          p.vx = (p.vx / speed) * PARTICLE_SPEED * 3;
          p.vy = (p.vy / speed) * PARTICLE_SPEED * 3;
        }

        // Drift (slow return to base speed)
        p.vx += (Math.random() - 0.5) * 0.02;
        p.vy += (Math.random() - 0.5) * 0.02;

        p.x += p.vx;
        p.y += p.vy;

        // Wrap edges
        if (p.x < -8) p.x = W + 8;
        if (p.x > W + 8) p.x = -8;
        if (p.y < -8) p.y = H + 8;
        if (p.y > H + 8) p.y = -8;

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle =
          p.hue === 182
            ? 'rgba(92, 225, 230, 0.75)'
            : 'rgba(139, 124, 246, 0.65)';
        ctx.fill();

        // Draw connections to nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const cdx = p.x - q.x;
          const cdy = p.y - q.y;
          const d = Math.sqrt(cdx * cdx + cdy * cdy);
          if (d < MAX_CONNECTION_DIST) {
            const alpha = (1 - d / MAX_CONNECTION_DIST) * 0.35;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            // Blend colour based on the two particles
            const r1 = p.hue === 182 ? 92 : 139;
            const g1 = p.hue === 182 ? 225 : 124;
            const b1 = p.hue === 182 ? 230 : 246;
            ctx.strokeStyle = `rgba(${r1},${g1},${b1},${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }
    }

    state.running = true;
    draw();

    // ── Intersection observer — pause when hero not visible ───────────────────
    const observer = new IntersectionObserver(
      ([entry]) => {
        state.running = entry.isIntersecting;
        if (state.running) draw();
      },
      { threshold: 0.1 }
    );
    observer.observe(canvas.parentElement);

    return () => {
      state.running = false;
      cancelAnimationFrame(state.raf);
      ro.disconnect();
      observer.disconnect();
      canvas.parentElement.removeEventListener('mousemove', onMouseMove);
      canvas.parentElement.removeEventListener('mouseleave', onMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="hero-particle-canvas"
      aria-hidden="true"
    />
  );
}
