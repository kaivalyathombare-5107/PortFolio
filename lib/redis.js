// Thin wrapper around @upstash/redis so the rest of the API code doesn't
// have to think about which env var names Vercel's Upstash integration
// happens to use (this has changed names over time).
import { Redis } from '@upstash/redis';

let cachedClient;

export function getRedis() {
  if (cachedClient !== undefined) return cachedClient;

  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    cachedClient = null;
    return cachedClient;
  }

  cachedClient = new Redis({ url, token });
  return cachedClient;
}
