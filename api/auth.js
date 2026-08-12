import { verifyPassphrase, setOwnerCookie, clearOwnerCookie } from '../lib/auth.js';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { passphrase } = req.body || {};

    if (!process.env.OWNER_PASSPHRASE || !process.env.AUTH_SECRET) {
      return res.status(500).json({
        error: 'Owner access is not configured yet. Set OWNER_PASSPHRASE and AUTH_SECRET in Vercel project settings.',
      });
    }

    if (!verifyPassphrase(passphrase)) {
      return res.status(401).json({ error: 'Incorrect passphrase' });
    }

    setOwnerCookie(res);
    return res.status(200).json({ status: 'ok' });
  }

  if (req.method === 'DELETE') {
    clearOwnerCookie(res);
    return res.status(200).json({ status: 'ok' });
  }

  res.setHeader('Allow', 'POST, DELETE');
  return res.status(405).json({ error: 'Method not allowed' });
}
