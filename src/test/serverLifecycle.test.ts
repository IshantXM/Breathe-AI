// @vitest-environment node
import { once } from 'node:events';
import type { Server } from 'node:http';
import express from 'express';
import { afterEach, expect, it, vi } from 'vitest';
import { safeErrorHandler } from '../../server/middleware';

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

async function endpoint(server: Server) {
  if (!server.listening) await once(server, 'listening');
  const address = server.address();
  if (!address || typeof address === 'string') throw new Error('Expected a TCP address');
  return `http://localhost:${address.port}`;
}

it('starts the Express entry point and explains how to build if the SPA is unavailable', async () => {
  vi.stubEnv('NODE_ENV', 'development');
  vi.stubEnv('PORT', '0');
  vi.stubEnv('GEMINI_API_KEY', '');
  const log = vi.spyOn(console, 'log').mockImplementation(() => {});
  const listen = vi.spyOn(express.application, 'listen');
  const { app } = await import('../../server');
  const server: Server = listen.mock.results[0].value;
  try {
    const base = await endpoint(server);
    expect((await fetch(`${base}/api/health`)).status).toBe(200);
    expect(log).toHaveBeenCalledWith(expect.stringContaining('Backend listening'));

    // Simulate a missing frontend build without touching the real dist directory.
    vi.spyOn(app.response, 'sendFile').mockImplementation((_path, options, done) => {
      const callback = typeof options === 'function' ? options : done;
      callback?.(new Error('Build unavailable'));
    });
    const fallback = await fetch(`${base}/workspace/example`);
    expect(await fallback.text()).toContain('Build frontend with `npm run build`');
  } finally {
    await new Promise<void>((resolve) => server.close(() => resolve()));
  }
});

it('returns a generic 500 without exposing unexpected exception details', async () => {
  const log = vi.spyOn(console, 'error').mockImplementation(() => {});
  const app = express();
  app.get('/failing-service', () => { throw new Error('Internal implementation detail'); });
  app.use(safeErrorHandler);
  const server = app.listen(0);
  try {
    const base = await endpoint(server);
    const response = await fetch(`${base}/failing-service`);
    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ error: 'Internal Server Error' });
    expect(log).toHaveBeenCalledWith('[BreatheWay] Unexpected request error');
  } finally {
    await new Promise<void>((resolve) => server.close(() => resolve()));
  }
});
