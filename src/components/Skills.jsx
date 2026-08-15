import { useRef, useEffect, useState } from 'react';
import useReveal from '../hooks/useReveal.js';
import useDragReorder from '../hooks/useDragReorder.js';

// Each card observes itself so cards animate in independently as they
// scroll into view. This prevents the glitch where stopping mid-section
// causes all cards to flash simultaneously because they all shared one
// parent observer.
function SkillCard({ skill, delayIndex, isOwner, onRemove, dragProps, dropProps, isOver }) {
  const [ref, visible] = useReveal();

  return (
    <div
      ref={ref}
      className={`skill-card reveal${visible ? ' is-visible' : ''}${isOwner ? ' draggable-card' : ''}${isOver ? ' drag-over' : ''}`}
      style={{ transitionDelay: visible ? `${delayIndex * 50}ms` : '0ms' }}
      {...dragProps}
      {...dropProps}
    >
      {isOwner && (
        <div className="drag-handle skill-drag-handle" aria-hidden="true">
          <DragHandleIcon />
        </div>
      )}
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

export default function Skills({ skills, isOwner, onAddSkill, onRemoveSkill, onReorderSkills }) {
  const [ref, visible] = useReveal();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [group, setGroup] = useState('');
  const [error, setError] = useState('');

  const { getDragProps, getDropProps, overIndex } = useDragReorder(onReorderSkills || (() => {}));
  const canReorder = isOwner && typeof onReorderSkills === 'function';

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

      {canReorder && (
        <p className="reorder-hint">
          <DragIcon /> Drag cards to reorder
        </p>
      )}

      <div className="skills-grid">
        {skills.map((skill, i) => (
          <SkillCard
            key={skill.id || `${skill.name}-${i}`}
            skill={skill}
            delayIndex={i}
            isOwner={isOwner}
            isOver={canReorder && overIndex === i}
            dragProps={canReorder ? getDragProps(i) : {}}
            dropProps={canReorder ? getDropProps(i) : {}}
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

function DragHandleIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <circle cx="9" cy="6" r="1.5" />
      <circle cx="15" cy="6" r="1.5" />
      <circle cx="9" cy="12" r="1.5" />
      <circle cx="15" cy="12" r="1.5" />
      <circle cx="9" cy="18" r="1.5" />
      <circle cx="15" cy="18" r="1.5" />
    </svg>
  );
}

function DragIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      style={{ display: 'inline', marginRight: 5, verticalAlign: 'middle' }}
      aria-hidden="true"
    >
      <path d="M5 9l-3 3 3 3M9 5l3-3 3 3M15 19l-3 3-3-3M19 9l3 3-3 3M2 12h20M12 2v20" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
