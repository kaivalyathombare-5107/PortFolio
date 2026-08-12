import { getRedis } from '../lib/redis.js';
import { isOwnerRequest } from '../lib/auth.js';

const CONTENT_KEY = 'portfolio:content';

export default async function handler(req, res) {
  const redis = getRedis();

  if (req.method === 'GET') {
    if (!redis) {
      // No database attached yet — the frontend falls back to the
      // defaults in src/data.js until one is connected.
      return res.status(200).json(null);
    }
    const content = await redis.get(CONTENT_KEY);
    return res.status(200).json(content || null);
  }

  if (req.method === 'PUT' || req.method === 'POST') {
    if (!isOwnerRequest(req)) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    if (!redis) {
      return res.status(500).json({
        error: 'Database not configured. Attach an Upstash Redis database in the Vercel Storage tab.',
      });
    }

    const { profile, skills, projects, achievements, gallery } = req.body || {};
    const valid =
      profile &&
      typeof profile === 'object' &&
      Array.isArray(skills) &&
      Array.isArray(projects) &&
      Array.isArray(achievements) &&
      Array.isArray(gallery);

    if (!valid) {
      return res.status(400).json({ error: 'Invalid or missing fields in payload' });
    }

    const content = { profile, skills, projects, achievements, gallery };
    await redis.set(CONTENT_KEY, content);
    return res.status(200).json({ status: 'ok' });
  }

  res.setHeader('Allow', 'GET, PUT');
  return res.status(405).json({ error: 'Method not allowed' });
}
