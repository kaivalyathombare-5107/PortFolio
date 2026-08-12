import { getRedis } from '../lib/redis.js';
import { isOwnerRequest } from '../lib/auth.js';

const MESSAGES_KEY = 'portfolio:messages';
const MAX_MESSAGES = 200;

export default async function handler(req, res) {
  const redis = getRedis();

  if (req.method === 'POST') {
    const { name, email, message } = req.body || {};
    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // If no database is attached yet, don't error out the contact form —
    // Formspree (configured in src/data.js) is still the primary delivery
    // path to your inbox. This is just for the in-site Messages panel.
    if (!redis) {
      return res.status(200).json({ status: 'ok' });
    }

    const entry = {
      id: `message-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: String(name || '').slice(0, 200),
      email: String(email || '').slice(0, 200),
      message: String(message).slice(0, 5000),
      receivedAt: Date.now(),
    };

    const existing = (await redis.get(MESSAGES_KEY)) || [];
    const updated = [entry, ...existing].slice(0, MAX_MESSAGES);
    await redis.set(MESSAGES_KEY, updated);
    return res.status(200).json({ status: 'ok' });
  }

  if (req.method === 'GET') {
    if (!isOwnerRequest(req)) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    if (!redis) return res.status(200).json([]);
    const messages = (await redis.get(MESSAGES_KEY)) || [];
    return res.status(200).json(messages);
  }

  res.setHeader('Allow', 'GET, POST');
  return res.status(405).json({ error: 'Method not allowed' });
}
