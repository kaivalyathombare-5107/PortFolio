// Thin wrappers around fetch() for the /api/* serverless functions.
// Every call is same-origin (frontend and API are deployed together on
// Vercel), so no base URL or API key is needed.

async function parseJsonSafe(res) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

export async function fetchPortfolioData() {
  try {
    const res = await fetch('/api/data', { cache: 'no-store' });
    if (!res.ok) return null;
    return await parseJsonSafe(res);
  } catch {
    return null;
  }
}

export async function savePortfolioData(data) {
  const res = await fetch('/api/data', {
    method: 'PUT',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await parseJsonSafe(res);
    throw new Error(err?.error || 'Failed to save changes');
  }
  return true;
}

export async function unlockOwnerMode(passphrase) {
  const res = await fetch('/api/auth', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ passphrase }),
  });
  if (!res.ok) {
    const err = await parseJsonSafe(res);
    throw new Error(err?.error || 'Incorrect passphrase');
  }
  return true;
}

export async function exitOwnerMode() {
  try {
    await fetch('/api/auth', { method: 'DELETE', credentials: 'include' });
  } catch {
    // Not much to do if this fails — the cookie will simply expire later.
  }
}

export async function uploadImage(file) {
  const res = await fetch('/api/upload', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': file.type || 'application/octet-stream',
      'X-Filename': encodeURIComponent(file.name || 'upload'),
    },
    body: file,
  });
  if (!res.ok) {
    const err = await parseJsonSafe(res);
    throw new Error(err?.error || 'Upload failed');
  }
  const data = await parseJsonSafe(res);
  if (!data?.url) throw new Error('Upload failed');
  return data.url;
}

export async function fetchMessages() {
  const res = await fetch('/api/messages', { credentials: 'include', cache: 'no-store' });
  if (!res.ok) {
    const err = await parseJsonSafe(res);
    throw new Error(err?.error || 'Failed to load messages');
  }
  return (await parseJsonSafe(res)) || [];
}

export async function submitContactMessage(payload) {
  try {
    await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch {
    // Best-effort only — Formspree (configured in src/data.js) is the
    // primary delivery path to your inbox.
  }
}
