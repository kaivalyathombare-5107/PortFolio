import { useEffect, useState } from 'react';
import useReveal from '../hooks/useReveal.js';

export default function WelcomeIntro({ onComplete }) {
  const [ref, visible] = useReveal();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((current) => {
        if (current >= 100) {
          clearInterval(interval);
          return 100;
        }
        return current + 1;
      });
    }, 25);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress !== 100) return;
    const timer = setTimeout(() => {
      onComplete();
    }, 800);
    return () => clearTimeout(timer);
  }, [progress, onComplete]);

  return (
    <main className="welcome-page">
      <div className="welcome-backdrop" aria-hidden="true" />
      <div className="welcome-container">
        <div ref={ref} className={`welcome-card reveal ${visible ? 'is-visible' : ''}`}>
          <p className="eyebrow welcome-eyebrow">Welcome!!</p>
          <div className="welcome-progress">
            <div className="welcome-progress-counter">{progress}%</div>
          </div>
          <div className="welcome-meter">
            <div className="welcome-meter-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>
    </main>
  );
}
