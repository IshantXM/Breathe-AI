// ============================================================
// server/cache.ts
// In-Memory SHA-256 LRU Response Cache (100 Entries)
// ============================================================

import { createHash } from 'crypto';

export interface CacheEntry {
  data: unknown;
  cachedAt: number;
}

export const insightCache = new Map<string, CacheEntry>();
const MAX_CACHE_ENTRIES = 100;
const CACHE_TTL_MS = 5 * 60 * 1000;

/**
 * Creates a deterministic 16-character SHA-256 hex digest for an input payload.
 */
export function hashPayload(obj: unknown): string {
  return createHash('sha256').update(JSON.stringify(obj) ?? 'undefined').digest('hex');
}

export function pruneCache(): void {
  const now = Date.now();
  for (const [key, entry] of insightCache) {
    if (now - entry.cachedAt >= CACHE_TTL_MS) insightCache.delete(key);
  }
  while (insightCache.size >= MAX_CACHE_ENTRIES) {
    const oldestKey = insightCache.keys().next().value;
    if (oldestKey === undefined) break;
    insightCache.delete(oldestKey);
  }
}

export function getCachedInsight(key: string): unknown | undefined {
  const entry = insightCache.get(key);
  if (!entry) return undefined;
  if (Date.now() - entry.cachedAt >= CACHE_TTL_MS) {
    insightCache.delete(key);
    return undefined;
  }
  // Map insertion order is the LRU order: refresh the key after a hit.
  insightCache.delete(key);
  insightCache.set(key, entry);
  return entry.data;
}

export function setCachedInsight(key: string, data: unknown): void {
  insightCache.delete(key);
  pruneCache();
  insightCache.set(key, { data, cachedAt: Date.now() });
}
