import { useState } from 'react';
import { contact } from '../data.js';
import useReveal from '../hooks/useReveal.js';
import { submitContactMessage } from '../lib/api.js';

export default function Contact() {
  const [ref, visible] = useReveal();
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error

  async function handleSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const messagePayload = {
      name: formData.get('name')?.toString() || '',
      email: formData.get('email')?.toString() || '',
      message: formData.get('message')?.toString() || '',
    };

    setStatus('sending');

    // Always save to the in-site Messages panel (visible in Edit Mode),
    // regardless of whether Formspree is configured yet.
    submitContactMessage(messagePayload);

    if (!contact.formEndpoint || contact.formEndpoint.includes('your-form-id')) {
      setStatus('sent');
      form.reset();
      return;
    }

    try {
      const res = await fetch(contact.formEndpoint, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: formData,
      });

      if (res.ok) {
        setStatus('sent');
        form.reset();
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  }

  return (
    <section id="contact" className="section">
      <div ref={ref} className={`reveal ${visible ? 'is-visible' : ''}`}>
        <p className="eyebrow">Contact</p>
        <h2 className="section-title">Let's talk</h2>
      </div>

      <div className="contact-grid">
        <div className={`contact-links reveal reveal-delay-1 ${visible ? 'is-visible' : ''}`}>
          <a className="contact-link" href={`mailto:${contact.email}`}>
            <span>
              <span className="contact-link-label">Email</span>
              <br />
              {contact.email}
            </span>
            <span>↗</span>
          </a>
          <a
            className="contact-link"
            href={contact.linkedin}
            target="_blank"
            rel="noreferrer"
          >
            <span>
              <span className="contact-link-label">LinkedIn</span>
              <br />
              Kaivalya Thombare
            </span>
            <span>↗</span>
          </a>
          <a
            className="contact-link"
            href={contact.github}
            target="_blank"
            rel="noreferrer"
          >
            <span>
              <span className="contact-link-label">GitHub</span>
              <br />
              View repositories
            </span>
            <span>↗</span>
          </a>
          {contact.resumeUrl ? (
            <a
              className="contact-link"
              href={contact.resumeUrl}
              target="_blank"
              rel="noreferrer"
            >
              <span>
                <span className="contact-link-label">Resume</span>
                <br />
                View online
              </span>
              <span>↗</span>
            </a>
          ) : null}
        </div>

        <form
          className={`reveal reveal-delay-2 ${visible ? 'is-visible' : ''}`}
          onSubmit={handleSubmit}
        >
          <p className="section-sub contact-helper-text">
            👇Send Message directly below.👇
          </p>
          <div className="form-field">
            <label htmlFor="name">Name</label>
            <input id="name" name="name" type="text" required />
          </div>
          <div className="form-field">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" required />
          </div>
          <div className="form-field">
            <label htmlFor="message">Message</label>
            <textarea id="message" name="message" required />
          </div>
          <button type="submit" className="btn btn-primary" disabled={status === 'sending'}>
            {status === 'sending' ? 'Sending…' : 'Send message'}
          </button>
          {status === 'sent' && (
            <p className="form-status">Message sent — thanks!</p>
          )}
          {status === 'error' && (
            <p className="form-status" style={{ color: 'var(--accent-pink)' }}>
              Something went wrong. Try emailing directly instead.
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
