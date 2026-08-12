import { useEffect, useState } from 'react';
import useReveal from '../hooks/useReveal.js';
import { fetchMessages } from '../lib/api.js';

export default function Messages() {
  const [ref, visible] = useReveal();
  const [messages, setMessages] = useState([]);
  const [status, setStatus] = useState('loading'); // loading | ready | error

  useEffect(() => {
    let cancelled = false;
    fetchMessages()
      .then((data) => {
        if (cancelled) return;
        setMessages(data);
        setStatus('ready');
      })
      .catch(() => {
        if (!cancelled) setStatus('error');
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section id="messages" className="section">
      <div ref={ref} className={`reveal ${visible ? 'is-visible' : ''}`}>
        <p className="eyebrow">Messages</p>
        <h2 className="section-title">Viewer messages</h2>
        <p className="section-sub">
          Messages submitted through the portfolio contact form are shown here.
        </p>
      </div>

      {status === 'loading' ? (
        <div className={`messages-empty reveal ${visible ? 'is-visible' : ''}`}>
          <p>Loading messages…</p>
        </div>
      ) : status === 'error' ? (
        <div className={`messages-empty reveal ${visible ? 'is-visible' : ''}`}>
          <p>Couldn't load messages. Try refreshing.</p>
        </div>
      ) : messages.length === 0 ? (
        <div className={`messages-empty reveal ${visible ? 'is-visible' : ''}`}>
          <p>No messages received yet.</p>
        </div>
      ) : (
        <div className="messages-grid">
          {messages.map((message) => (
            <article key={message.id} className={`message-card reveal ${visible ? 'is-visible' : ''}`}>
              <div className="message-card-header">
                <h3>{message.name || 'Anonymous'}</h3>
                <span>{message.email}</span>
              </div>
              <p>{message.message}</p>
              <div className="message-meta">
                <span>{new Date(message.receivedAt).toLocaleString()}</span>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
