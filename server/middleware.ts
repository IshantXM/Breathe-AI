// ============================================================
// server/middleware.ts
// Security headers, dynamic CORS, rate limiters, and error handlers
// ============================================================

import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import type { Request, Response, NextFunction } from 'express';

const DEVELOPMENT_ORIGINS = process.env.NODE_ENV === 'production'
  ? []
  : ['http://localhost:5173', 'http://localhost:4173'];
const ALLOWED_ORIGINS = new Set([
  ...DEVELOPMENT_ORIGINS,
  ...(process.env.CORS_ORIGINS || '').split(',').map((origin) => origin.trim()).filter(Boolean),
]);

export const helmetMiddleware = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      imgSrc: ["'self'", 'data:'],
        connectSrc: ["'self'"],
        objectSrc: ["'none'"],
        baseUri: ["'self'"],
        formAction: ["'self'"],
        frameAncestors: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
});

export const corsMiddleware = cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    return callback(null, ALLOWED_ORIGINS.has(origin));
  },
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
  credentials: false,
});

export function rejectUnlistedOrigin(req: Request, res: Response, next: NextFunction): void {
  const origin = req.get('origin');
  if (origin && origin !== `${req.protocol}://${req.get('host')}` && !ALLOWED_ORIGINS.has(origin)) {
    res.status(403).json({ error: 'Origin not allowed.' });
    return;
  }
  next();
}

export const aiRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again in a minute.' },
});

export function safeErrorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction): void {
  const parserError = (err ?? {}) as { status?: number; statusCode?: number; type?: string };
  if (parserError.type === 'entity.too.large' || parserError.status === 413 || parserError.statusCode === 413) {
    res.status(413).json({ error: 'Request body too large.' });
    return;
  }
  if (parserError.type === 'entity.parse.failed' || parserError.status === 400 || parserError.statusCode === 400) {
    res.status(400).json({ error: 'Invalid request body.' });
    return;
  }
  console.error('[BreatheWay] Unexpected request error');
  res.status(500).json({ error: 'Internal Server Error' });
}
