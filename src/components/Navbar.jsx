import { useEffect, useState } from 'react';

const LINKS = [
  { href: '#contact', label: 'Contact' },
];

export default function Navbar({ profile, isOwner }) {
  const [scrolled, setScrolled] = useState(false);
  const [contactVisible, setContactVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const section = document.querySelector('#contact');
    if (!section) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => setContactVisible(entry.isIntersecting),
      { threshold: 0.35 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  const firstName = profile.name.split(' ')[0];

  return (
    <nav className={`nav ${scrolled ? 'scrolled' : ''} ${contactVisible ? 'hidden' : ''}`}>
      <a href="#top" className="nav-logo">
        {firstName} Thombare
      </a>
      <div className="nav-links">
        {LINKS.map((link) => (
          <a key={link.href} href={link.href}>
            {link.label}
          </a>
        ))}
        {isOwner ? <span className="nav-editing-badge">Editing</span> : null}
      </div>
    </nav>
  );
}
