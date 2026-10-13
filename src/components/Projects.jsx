import { useState } from 'react';
import useReveal from '../hooks/useReveal.js';
import Gallery from './Gallery.jsx';
import { uploadImage } from '../lib/api.js';

// ── Inline edit panel for a single project card ──────────────────────────────
function ProjectEditPanel({ project, onSave, onCancel }) {
  const [title, setTitle] = useState(project.title);
  const [description, setDescription] = useState(project.description);
  const [tags, setTags] = useState((project.tags || []).join(', '));
  const [githubLink, setGithubLink] = useState(project.githubLink || '');
  const [websiteLink, setWebsiteLink] = useState(project.websiteLink || project.link || '');
  const [error, setError] = useState('');

  function handleSave() {
    if (!title.trim() || !description.trim()) {
      setError('Title and description are required.');
      return;
    }
    onSave({
      ...project,
      title: title.trim(),
      description: description.trim(),
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
      githubLink: githubLink.trim(),
      websiteLink: websiteLink.trim(),
      link: websiteLink.trim(), // keep legacy `link` field in sync
    });
  }

  return (
    <div className="project-inline-edit">
      <div className="project-form-grid">
        <div className="form-field">
          <label>Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div className="form-field">
          <label>Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div className="form-field">
          <label>Tags (comma separated)</label>
          <input value={tags} onChange={(e) => setTags(e.target.value)} />
        </div>
        <div className="form-field">
          <label>GitHub Repository URL</label>
          <input
            type="url"
            placeholder="https://github.com/you/repo"
            value={githubLink}
            onChange={(e) => setGithubLink(e.target.value)}
          />
        </div>
        <div className="form-field">
          <label>Website / Live Demo URL</label>
          <input
            type="url"
            placeholder="https://yourproject.com"
            value={websiteLink}
            onChange={(e) => setWebsiteLink(e.target.value)}
          />
        </div>
      </div>
      {error ? <p className="form-status form-status-error">{error}</p> : null}
      <div className="inline-edit-actions">
        <button type="button" className="btn btn-primary" onClick={handleSave}>
          Save changes
        </button>
        <button type="button" className="btn btn-ghost" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
}

// ── Main Projects section ─────────────────────────────────────────────────────
export default function Projects({
  projects,
  isOwner,
  onAddProject,
  onRemoveProject,
  onUpdateProject,
  onReorderProjects,
}) {
  const [ref, visible] = useReveal();

  // Add-project form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [githubLink, setGithubLink] = useState('');
  const [websiteLink, setWebsiteLink] = useState('');
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  // Track which card (by id) is in edit mode
  const [editingId, setEditingId] = useState(null);

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
        githubLink: githubLink.trim(),
        websiteLink: websiteLink.trim(),
        link: websiteLink.trim(), // legacy field kept in sync
      });
      setTitle('');
      setDescription('');
      setTags('');
      setGithubLink('');
      setWebsiteLink('');
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
              <label htmlFor="project-github">GitHub Repository URL</label>
              <input
                id="project-github"
                type="url"
                placeholder="https://github.com/you/repo"
                value={githubLink}
                onChange={(e) => setGithubLink(e.target.value)}
              />
            </div>
            <div className="form-field">
              <label htmlFor="project-website">Website / Live Demo URL</label>
              <input
                id="project-website"
                type="url"
                placeholder="https://yourproject.com"
                value={websiteLink}
                onChange={(e) => setWebsiteLink(e.target.value)}
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
                  <div className="card-admin-actions">
                    <button
                      type="button"
                      className="item-edit-btn"
                      onClick={() =>
                        setEditingId(editingId === project.id ? null : project.id)
                      }
                    >
                      {editingId === project.id ? 'Cancel' : 'Edit'}
                    </button>
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
                  </div>
                ) : null}
              </div>

              {/* Inline edit panel */}
              {isOwner && editingId === project.id ? (
                <ProjectEditPanel
                  project={project}
                  onSave={(updated) => {
                    onUpdateProject(updated);
                    setEditingId(null);
                  }}
                  onCancel={() => setEditingId(null)}
                />
              ) : (
                <>
                  <p className="card-desc">{project.description}</p>
                  <div className="tag-row">
                    {project.tags.map((tag) => (
                      <span className="tag" key={tag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                  {/* Link buttons */}
                  {(project.githubLink || project.websiteLink || project.link) ? (
                    <div className="card-links">
                      {project.githubLink ? (
                        <a
                          href={project.githubLink}
                          target="_blank"
                          rel="noreferrer"
                          className="card-link-btn card-link-github"
                        >
                          <GitHubIcon /> GitHub
                        </a>
                      ) : null}
                      {(project.websiteLink || project.link) ? (
                        <a
                          href={project.websiteLink || project.link}
                          target="_blank"
                          rel="noreferrer"
                          className="card-link-btn card-link-website"
                        >
                          <ExternalLinkIcon /> Live demo
                        </a>
                      ) : null}
                    </div>
                  ) : null}
                </>
              )}
            </div>
          </>
        )}
      />
    </section>
  );
}

// ── Inline SVG icons ──────────────────────────────────────────────────────────
function GitHubIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      style={{ display: 'inline', marginRight: 5, verticalAlign: 'middle' }}
    >
      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.167 6.839 9.49.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
    </svg>
  );
}

function ExternalLinkIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={{ display: 'inline', marginRight: 5, verticalAlign: 'middle' }}
    >
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}
