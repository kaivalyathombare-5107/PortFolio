// Owner authentication: a single passphrase (no username) unlocks a
// signed, HttpOnly session cookie. No database or user table involved —
// the passphrase lives only in the OWNER_PASSPHRASE environment variable
// on the server, never in the client bundle.
import crypto from 'crypto';

const COOKIE_NAME = 'portfolio_owner';
const SESSION_HOURS = 12;

function getAuthSecret() {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error('AUTH_SECRET environment variable is not configured');
  }
  return secret;
}

function sign(value) {
  return crypto.createHmac('sha256', getAuthSecret()).update(value).digest('hex');
}

function timingSafeStringEqual(a, b) {
  const bufA = Buffer.from(String(a));
  const bufB = Buffer.from(String(b));
  if (bufA.length !== bufB.length) {
    // Still do a comparison of equal length so failure timing doesn't
    // leak the expected length.
    crypto.timingSafeEqual(Buffer.alloc(bufB.length), Buffer.alloc(bufB.length));
    return false;
  }
  return crypto.timingSafeEqual(bufA, bufB);
}

export function verifyPassphrase(input) {
  const expected = process.env.OWNER_PASSPHRASE;
  if (!expected || typeof input !== 'string' || !input) return false;
  return timingSafeStringEqual(input, expected);
}

function cookieAttributes() {
  const attrs = ['Path=/', 'HttpOnly', 'SameSite=Strict'];
  if (process.env.NODE_ENV === 'production') attrs.push('Secure');
  return attrs;
}

export function setOwnerCookie(res) {
  const expiresAt = Date.now() + SESSION_HOURS * 60 * 60 * 1000;
  const payload = String(expiresAt);
  const token = `${payload}.${sign(payload)}`;
  const parts = [`${COOKIE_NAME}=${token}`, ...cookieAttributes(), `Max-Age=${SESSION_HOURS * 60 * 60}`];
  res.setHeader('Set-Cookie', parts.join('; '));
}

export function clearOwnerCookie(res) {
  const parts = [`${COOKIE_NAME}=`, ...cookieAttributes(), 'Max-Age=0'];
  res.setHeader('Set-Cookie', parts.join('; '));
}

export function isOwnerRequest(req) {
  const cookieHeader = req.headers.cookie || '';
  const raw = cookieHeader
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${COOKIE_NAME}=`));
  if (!raw) return false;

  const token = raw.slice(COOKIE_NAME.length + 1);
  const [payload, signature] = token.split('.');
  if (!payload || !signature) return false;

  let expectedSignature;
  try {
    expectedSignature = sign(payload);
  } catch {
    return false;
  }
  if (!timingSafeStringEqual(signature, expectedSignature)) return false;

  const expiresAt = Number(payload);
  if (!Number.isFinite(expiresAt) || Date.now() > expiresAt) return false;

  return true;
}
