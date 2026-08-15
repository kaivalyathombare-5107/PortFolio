import { useState } from 'react';
import useReveal from '../hooks/useReveal.js';
import Gallery from './Gallery.jsx';
import { uploadImage } from '../lib/api.js';

export default function Projects({ projects, isOwner, onAddProject, onRemoveProject, onReorderProjects }) {
  const [ref, visible] = useReveal();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
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

  async function handleAddProject() {
    if (!title.trim() || !description.trim()) {
      setError('Title and description are required.');
      return;
    }
    if (!file) {
      setError('Please upload one image or PDF file.');
      return;
    }

    const confirmed = window.confirm('Add this project to the portfolio?');
    if (!confirmed) return;

    setSaving(true);
    setError('');
    try {
      const url = await uploadImage(file);
      onAddProject({
        title: title.trim(),
        description: description.trim(),
        tags: tags.split(',').map((tag) => tag.trim()).filter(Boolean),
        image: url,
        link: '',
      });
      setTitle('');
      setDescription('');
      setTags('');
      setFile(null);
    } catch (err) {
      setError(err.message || 'Upload failed. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <section id="projects" className="section">
      <div ref={ref} className={`reveal ${visible ? 'is-visible' : ''}`}>
        <div className="section-heading-row">
          <div>
            <p className="eyebrow">Projects</p>
            <h2 className="section-title">Things I've built</h2>
          </div>
          {isOwner ? (
            <button
              type="button"
              className="section-toggle-btn"
              onClick={() => setShowForm((prev) => !prev)}
            >
              {showForm ? 'Close' : '+ Add project'}
            </button>
          ) : null}
        </div>
        <p className="section-sub">
          Scroll right for more — everything's visible inline, nothing to
          download.
        </p>
      </div>

      {isOwner && showForm ? (
        <div className="section-panel project-admin-panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Add project</p>
              <h3 className="section-title panel-title">Create a new project</h3>
            </div>
            <div className="upload-hint">Upload JPG, PNG or PDF</div>
          </div>
          <div className="project-form-grid">
            <div className="form-field">
              <label htmlFor="project-title">Title</label>
              <input
                id="project-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="form-field">
              <label htmlFor="project-desc">Description</label>
              <textarea
                id="project-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="form-field">
              <label htmlFor="project-tags">Tags (comma separated)</label>
              <input
                id="project-tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
            </div>
            <div className="form-field">
              <label htmlFor="project-file">Upload image or PDF</label>
              <input
                id="project-file"
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
            onClick={handleAddProject}
            disabled={saving}
          >
            {saving ? 'Uploading…' : 'Add project'}
          </button>
        </div>
      ) : null}

      <Gallery
        items={projects}
        isOwner={isOwner}
        onReorder={onReorderProjects}
        renderCard={(project) => (
          <>
            <div className="card-media">
              <img src={project.image} alt={project.title} loading="lazy" />
            </div>
            <div className="card-progress">
              <div className="card-progress-fill" />
            </div>
            <div className="card-body">
              <div className="card-body-top">
                <h3 className="card-title">{project.title}</h3>
                {isOwner ? (
                  <button
                    type="button"
                    className="item-remove-btn card-remove-btn"
                    onClick={() => {
                      const confirmed = window.confirm('Remove this project?');
                      if (confirmed) onRemoveProject(project.id);
                    }}
                  >
                    Remove
                  </button>
                ) : null}
              </div>
              <p className="card-desc">{project.description}</p>
              <div className="tag-row">
                {project.tags.map((tag) => (
                  <span className="tag" key={tag}>
                    {tag}
                  </span>
                ))}
              </div>
              {project.link ? (
                <p className="card-meta" style={{ marginTop: 10 }}>
                  <a href={project.link} target="_blank" rel="noreferrer">
                    View live ↗
                  </a>
                </p>
              ) : null}
            </div>
          </>
        )}
      />
    </section>
  );
}
