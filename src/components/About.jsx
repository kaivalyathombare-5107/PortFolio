import { useState } from 'react';
import useReveal from '../hooks/useReveal.js';

export default function About({ profile, isOwner, onUpdateProfile }) {
  const [ref, visible] = useReveal();
  const [showForm, setShowForm] = useState(false);
  const [bio, setBio] = useState(profile.bio);
  const [location, setLocation] = useState(profile.location);
  const [stats, setStats] = useState(profile.stats);
  const [error, setError] = useState('');

  function handleSave() {
    if (!bio.trim()) {
      setError('Bio cannot be empty.');
      return;
    }

    onUpdateProfile({ bio: bio.trim(), location: location.trim(), stats });
    setError('');
    setShowForm(false);
  }

  function updateStat(index, key, value) {
    setStats((current) =>
      current.map((item, i) => (i === index ? { ...item, [key]: value } : item))
    );
  }

  return (
    <section id="about" className="section">
      <div ref={ref} className={`reveal ${visible ? 'is-visible' : ''}`}>
        <div className="section-heading-row">
          <div>
            <p className="eyebrow">About</p>
            <h2 className="section-title">A bit about how I work</h2>
          </div>
          {isOwner ? (
            <button
              type="button"
              className="section-toggle-btn"
              onClick={() => setShowForm((prev) => !prev)}
            >
              {showForm ? 'Close' : 'Edit'}
            </button>
          ) : null}
        </div>
      </div>

      {isOwner && showForm ? (
        <div className="section-panel about-admin-panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Edit profile</p>
              <h3 className="section-title panel-title">About section</h3>
            </div>
          </div>
          <div className="project-form-grid">
            <div className="form-field">
              <label htmlFor="about-bio">Bio</label>
              <textarea
                id="about-bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={5}
              />
            </div>
            <div className="form-field">
              <label htmlFor="about-location">Location</label>
              <input
                id="about-location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            {stats.map((stat, index) => (
              <div className="form-field" key={stat.label || index}>
                <label htmlFor={`stat-${index}-label`}>Stat label</label>
                <input
                  id={`stat-${index}-label`}
                  value={stat.label}
                  onChange={(e) => updateStat(index, 'label', e.target.value)}
                />
                <label htmlFor={`stat-${index}-value`}>Stat value</label>
                <input
                  id={`stat-${index}-value`}
                  value={stat.value}
                  onChange={(e) => updateStat(index, 'value', e.target.value)}
                />
              </div>
            ))}
          </div>
          {error ? <p className="form-status form-status-error">{error}</p> : null}
          <button type="button" className="btn btn-primary" onClick={handleSave}>
            Save profile
          </button>
        </div>
      ) : null}

      <div className="about-grid">
        <p className={`about-body reveal reveal-delay-1 ${visible ? 'is-visible' : ''}`}>
          {profile.bio}
        </p>

        <div className={`about-facts reveal reveal-delay-2 ${visible ? 'is-visible' : ''}`}>
          <div className="about-fact">
            <span>Location</span>
            <span>{profile.location}</span>
          </div>
          {profile.stats.map((stat) => (
            <div className="about-fact" key={stat.label}>
              <span>{stat.label}</span>
              <span>{stat.value}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
