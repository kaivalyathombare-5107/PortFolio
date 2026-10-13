import useReveal from '../hooks/useReveal.js';
import HeroCanvas from './HeroCanvas.jsx';
import TextScramble from './TextScramble.jsx';

// Role phrases cycled by the scramble effect. The first entry matches the
// profile tagline so the initial render is coherent even before the effect
// kicks in. The remaining phrases rotate automatically.
const HERO_PHRASES = [
  'Second-Year Computer Engineering Student',
  'Aspiring Software Developer',
  'Applied AI & ML Explorer',
  'Data Structures & Algorithms Enthusiast',
  'Full-Stack Web Developer',
  'Building Real Things That Ship',
];

export default function Hero({ profile }) {
  const [ref, visible] = useReveal();

  return (
    <header id="top" className="hero">
      <div className="hero-photo" aria-hidden="true" />
      <div className="hero-orb" aria-hidden="true" />
      <div className="hero-grid" aria-hidden="true" />

      {/* Interactive particle canvas sits above grid, below content */}
      <HeroCanvas />

      <div
        ref={ref}
        className={`hero-content reveal ${visible ? 'is-visible' : ''}`}
      >
        <p className="eyebrow">Available for opportunities</p>
        <h1 className="hero-name">{profile.name}</h1>
        <p className="hero-tagline">
          <TextScramble phrases={HERO_PHRASES} scrambleDuration={850} holdDuration={2800} />
        </p>
      </div>

      <div className="scroll-cue" aria-hidden="true" />
      <p className="scroll-label" aria-hidden="true">Scroll Down</p>
    </header>
  );
}
