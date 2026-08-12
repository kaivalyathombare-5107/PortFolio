import { put } from '@vercel/blob';
import { isOwnerRequest } from '../lib/auth.js';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'application/pdf'];
const MAX_BYTES = 4.5 * 1024 * 1024; // Vercel serverless function body limit

function sanitizeFilename(name) {
  return String(name || 'upload')
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .slice(0, 80);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!isOwnerRequest(req)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return res.status(500).json({
      error: 'File storage is not configured. Create a Blob store in the Vercel Storage tab and connect it to this project.',
    });
  }

  const contentType = req.headers['content-type'] || 'application/octet-stream';
  if (!ALLOWED_TYPES.includes(contentType)) {
    return res.status(400).json({ error: 'Only JPG, PNG, WEBP, SVG, or PDF uploads are allowed.' });
  }

  const buffer = Buffer.isBuffer(req.body) ? req.body : Buffer.from(req.body || '');
  if (!buffer.length) {
    return res.status(400).json({ error: 'Empty file' });
  }
  if (buffer.length > MAX_BYTES) {
    return res.status(413).json({ error: 'File is too large (max 4.5MB).' });
  }

  const filenameHeader = req.headers['x-filename'];
  const filename = sanitizeFilename(
    filenameHeader ? decodeURIComponent(filenameHeader) : `upload-${Date.now()}`
  );

  try {
    const blob = await put(`portfolio/${Date.now()}-${filename}`, buffer, {
      access: 'public',
      contentType,
    });
    return res.status(200).json({ url: blob.url });
  } catch (error) {
    console.error('Blob upload failed:', error);
    return res.status(500).json({ error: 'Upload failed' });
  }
}
