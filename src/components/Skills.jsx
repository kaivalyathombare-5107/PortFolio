import { useState } from 'react';
import useReveal from '../hooks/useReveal.js';

function SkillCard({ skill, visible, delayIndex, isOwner, onRemove }) {
  return (
    <div
      className={`skill-card reveal ${visible ? 'is-visible' : ''}`}
      style={{ transitionDelay: visible ? `${delayIndex * 60}ms` : '0ms' }}
    >
      <div className="skill-head">
        <div>
          <div className="skill-name">{skill.name}</div>
          <div className="skill-group">{skill.group}</div>
        </div>
        {isOwner ? (
          <button type="button" className="item-remove-btn" onClick={() => onRemove(skill.id)}>
            Remove
          </button>
        ) : null}
      </div>
    </div>
  );
}

export default function Skills({ skills, isOwner, onAddSkill, onRemoveSkill }) {
  const [ref, visible] = useReveal();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [group, setGroup] = useState('');
  const [error, setError] = useState('');

  function handleAddSkill() {
    if (!name.trim()) {
      setError('Skill name is required.');
      return;
    }

    const confirmed = window.confirm('Add this skill to the portfolio?');
    if (!confirmed) return;

    onAddSkill({ name: name.trim(), group: group.trim() || 'General', level: 0 });
    setName('');
    setGroup('');
    setError('');
  }

  return (
    <section id="skills" className="section">
      <div ref={ref} className={`reveal ${visible ? 'is-visible' : ''}`}>
        <div className="section-heading-row">
          <div>
            <p className="eyebrow">Skills</p>
            <h2 className="section-title">Specified Skills</h2>
          </div>
          {isOwner ? (
            <button
              type="button"
              className="section-toggle-btn"
              onClick={() => setShowForm((prev) => !prev)}
            >
              {showForm ? 'Close' : '+ Add skill'}
            </button>
          ) : null}
        </div>
      </div>

      {isOwner && showForm ? (
        <div className="section-panel skill-admin-panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Add skill</p>
              <h3 className="section-title panel-title">New skill entry</h3>
            </div>
          </div>
          <div className="project-form-grid">
            <div className="form-field">
              <label htmlFor="skill-name">Name</label>
              <input
                id="skill-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="form-field">
              <label htmlFor="skill-group">Group</label>
              <input
                id="skill-group"
                value={group}
                onChange={(e) => setGroup(e.target.value)}
              />
            </div>
          </div>
          {error ? <p className="form-status form-status-error">{error}</p> : null}
          <button type="button" className="btn btn-primary" onClick={handleAddSkill}>
            Add skill
          </button>
        </div>
      ) : null}

      <div className="skills-grid">
        {skills.map((skill, i) => (
          <SkillCard
            key={skill.id || `${skill.name}-${i}`}
            skill={skill}
            visible={visible}
            delayIndex={i}
            isOwner={isOwner}
            onRemove={(id) => {
              const confirmed = window.confirm('Remove this skill?');
              if (confirmed) onRemoveSkill(id);
            }}
          />
        ))}
      </div>
    </section>
  );
}
