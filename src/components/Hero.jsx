import useReveal from '../hooks/useReveal.js';

export default function Hero({ profile }) {
  const [ref, visible] = useReveal();

  return (
    <header id="top" className="hero">
      <div className="hero-photo" aria-hidden="true" />
      <div className="hero-orb" aria-hidden="true" />
      <div className="hero-grid" aria-hidden="true" />

      <div
        ref={ref}
        className={`hero-content reveal ${visible ? 'is-visible' : ''}`}
      >
        <p className="eyebrow">Available for opportunities</p>
        <h1 className="hero-name">{profile.name}</h1>
        <p className="hero-tagline">{profile.tagline}</p>
      </div>

      <div className="scroll-cue" aria-hidden="true" />
      <p className="scroll-label" aria-hidden="true">Scroll Down</p>
    </header>
  );
}
