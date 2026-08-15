import { useState } from 'react';
import useReveal from '../hooks/useReveal.js';
import Gallery from './Gallery.jsx';
import { uploadImage } from '../lib/api.js';

export default function Achievements({ achievements, isOwner, onAddAchievement, onRemoveAchievement, onReorderAchievements }) {
  const [ref, visible] = useReveal();
  const [title, setTitle] = useState('');
  const [issuer, setIssuer] = useState('');
  const [date, setDate] = useState('');
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  function handleFileChange(event) {
    const selected = event.target.files?.[0];
    if (!selected) return;
    const accepted = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!accepted.includes(selected.type)) {
      setError('Only JPG, PNG, or PDF uploads are allowed.');
      setFile(null);
      return;
    }
    setError('');
    setFile(selected);
  }

  async function handleAddAchievement() {
    if (!title.trim()) {
      setError('Title is required.');
      return;
    }
    if (!file) {
      setError('Please upload one image or PDF file.');
      return;
    }

    const confirmed = window.confirm('Add this achievement to the portfolio?');
    if (!confirmed) return;

    setSaving(true);
    setError('');
    try {
      const url = await uploadImage(file);
      onAddAchievement({
        title: title.trim(),
        issuer: issuer.trim(),
        date: date.trim(),
        image: url,
      });
      setTitle('');
      setIssuer('');
      setDate('');
      setFile(null);
    } catch (err) {
      setError(err.message || 'Upload failed. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <section id="achievements" className="section">
      <div ref={ref} className={`reveal ${visible ? 'is-visible' : ''}`}>
        <div className="section-heading-row">
          <div>
            <p className="eyebrow">Certifications &amp; achievements</p>
            <h2 className="section-title">Achievements</h2>
          </div>
          {isOwner ? (
            <button
              type="button"
              className="section-toggle-btn"
              onClick={() => setShowForm((prev) => !prev)}
            >
              {showForm ? 'Close' : '+ Add achievement'}
            </button>
          ) : null}
        </div>
        <p className="section-sub">
          Every certificate shows up as an image right here — no files to
          open.
        </p>
      </div>

      {isOwner && showForm ? (
        <div className="section-panel project-admin-panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Add achievement</p>
              <h3 className="section-title panel-title">Add a new achievement</h3>
            </div>
            <div className="upload-hint">Upload JPG, PNG or PDF</div>
          </div>
          <div className="project-form-grid">
            <div className="form-field">
              <label htmlFor="achievement-title">Title</label>
              <input
                id="achievement-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="form-field">
              <label htmlFor="achievement-issuer">Issuer</label>
              <input
                id="achievement-issuer"
                value={issuer}
                onChange={(e) => setIssuer(e.target.value)}
              />
            </div>
            <div className="form-field">
              <label htmlFor="achievement-date">Date</label>
              <input
                id="achievement-date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div className="form-field">
              <label htmlFor="achievement-file">Upload image or PDF</label>
              <input
                id="achievement-file"
                type="file"
                accept="image/jpeg,image/png,application/pdf"
                onChange={handleFileChange}
              />
            </div>
          </div>
          {error ? <p className="form-status form-status-error">{error}</p> : null}
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleAddAchievement}
            disabled={saving}
          >
            {saving ? 'Uploading…' : 'Add achievement'}
          </button>
        </div>
      ) : null}

      <Gallery
        items={achievements}
        isOwner={isOwner}
        onReorder={onReorderAchievements}
        renderCard={(item) => (
          <>
            <div className="card-media">
              <img src={item.image} alt={item.title} loading="lazy" />
            </div>
            <div className="card-body">
              <div className="card-body-top">
                <h3 className="card-title">{item.title}</h3>
                {isOwner ? (
                  <button
                    type="button"
                    className="item-remove-btn card-remove-btn"
                    onClick={() => {
                      const confirmed = window.confirm('Remove this achievement?');
                      if (confirmed) onRemoveAchievement(item.id);
                    }}
                  >
                    Remove
                  </button>
                ) : null}
              </div>
              <p className="card-meta">
                {[item.issuer, item.date].filter(Boolean).join(' · ')}
              </p>
            </div>
          </>
        )}
      />
    </section>
  );
}
