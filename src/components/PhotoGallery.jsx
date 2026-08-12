import { useState } from 'react';
import useReveal from '../hooks/useReveal.js';
import Gallery from './Gallery.jsx';
import { uploadImage } from '../lib/api.js';

export default function PhotoGallery({ gallery, isOwner, onAddPhoto, onRemovePhoto, onReorderGallery }) {
  const [ref, visible] = useReveal();
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [date, setDate] = useState('');
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  function handleFileChange(event) {
    const selected = event.target.files?.[0];
    if (!selected) return;
    const accepted = ['image/jpeg', 'image/png', 'image/webp'];
    if (!accepted.includes(selected.type)) {
      setError('Only JPG, PNG, or WEBP images are allowed.');
      setFile(null);
      return;
    }
    setError('');
    setFile(selected);
  }

  async function handleAddPhoto() {
    if (!title.trim()) {
      setError('Title is required.');
      return;
    }
    if (!file) {
      setError('Please upload one image.');
      return;
    }

    const confirmed = window.confirm('Add this photo to the gallery?');
    if (!confirmed) return;

    setSaving(true);
    setError('');
    try {
      const url = await uploadImage(file);
      onAddPhoto({
        title: title.trim(),
        caption: caption.trim(),
        date: date.trim(),
        image: url,
      });
      setTitle('');
      setCaption('');
      setDate('');
      setFile(null);
    } catch (err) {
      setError(err.message || 'Upload failed. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <section id="gallery" className="section">
      <div ref={ref} className={`reveal ${visible ? 'is-visible' : ''}`}>
        <div className="section-heading-row">
          <div>
            <p className="eyebrow">Photos</p>
            <h2 className="section-title">Gallery</h2>
          </div>
          {isOwner ? (
            <button
              type="button"
              className="section-toggle-btn"
              onClick={() => setShowForm((prev) => !prev)}
            >
              {showForm ? 'Close' : '+ Add photo'}
            </button>
          ) : null}
        </div>
        <p className="section-sub">
          Events, workshops, and moments worth sharing — all inline, nothing
          to download.
        </p>
      </div>

      {isOwner && showForm ? (
        <div className="section-panel project-admin-panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Add photo</p>
              <h3 className="section-title panel-title">Add a new photo</h3>
            </div>
            <div className="upload-hint">Upload JPG, PNG or WEBP</div>
          </div>
          <div className="project-form-grid">
            <div className="form-field">
              <label htmlFor="gallery-title">Title</label>
              <input
                id="gallery-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="form-field">
              <label htmlFor="gallery-caption">Caption</label>
              <input
                id="gallery-caption"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
              />
            </div>
            <div className="form-field">
              <label htmlFor="gallery-date">Date</label>
              <input
                id="gallery-date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div className="form-field">
              <label htmlFor="gallery-file">Upload image</label>
              <input
                id="gallery-file"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
              />
            </div>
          </div>
          {error ? <p className="form-status form-status-error">{error}</p> : null}
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleAddPhoto}
            disabled={saving}
          >
            {saving ? 'Uploading…' : 'Add photo'}
          </button>
        </div>
      ) : null}

      <Gallery
        items={gallery}
        isOwner={isOwner}
        onReorder={onReorderGallery}
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
                      const confirmed = window.confirm('Remove this photo?');
                      if (confirmed) onRemovePhoto(item.id);
                    }}
                  >
                    Remove
                  </button>
                ) : null}
              </div>
              <p className="card-meta">
                {[item.caption, item.date].filter(Boolean).join(' · ')}
              </p>
            </div>
          </>
        )}
      />
    </section>
  );
}
