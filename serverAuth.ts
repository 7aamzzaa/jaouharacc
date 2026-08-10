import crypto from 'crypto';
import type { Request, Response, NextFunction } from 'express';

const COOKIE_NAME = 'ccjaouhara_admin_session';
const SESSION_TTL_MS = 12 * 60 * 60 * 1000; // 12 hours
const LOGIN_MAX_FAILURES = 5;
const LOGIN_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

const loginFailures = new Map<string, { count: number; windowStart: number }>();

function getSessionSecret(): string {
  return process.env.ADMIN_SESSION_SECRET || '';
}

function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD || '';
}

function b64url(buf: Buffer): string {
  return buf.toString('base64url');
}

function signToken(payload: string): string {
  const secret = getSessionSecret();
  const sig = crypto.createHmac('sha256', secret).update(payload).digest();
  return payload + '.' + b64url(sig);
}

export function createAdminToken(): { token: string; expiresAt: number } {
  const now = Date.now();
  const expiresAt = now + SESSION_TTL_MS;
  const payload = b64url(Buffer.from(JSON.stringify({ sub: 'admin', iat: now, exp: expiresAt })));
  return { token: signToken(payload), expiresAt };
}

export function verifyToken(token: string | undefined): boolean {
  if (!token) return false;
  const parts = token.split('.');
  if (parts.length !== 2) return false;
  const [payload, providedSig] = parts;
  const expected = crypto.createHmac('sha256', getSessionSecret()).update(payload).digest();
  const provided = Buffer.from(providedSig, 'base64url');
  if (expected.length !== provided.length) return false;
  if (!crypto.timingSafeEqual(expected, provided)) return false;
  try {
    const raw = Buffer.from(payload, 'base64url').toString('utf8');
    const data = JSON.parse(raw);
    if (data.sub !== 'admin') return false;
    if (typeof data.exp !== 'number' || data.exp < Date.now()) return false;
    return true;
  } catch {
    return false;
  }
}

export function getAdminToken(req: Request): string | undefined {
  const header = req.headers.cookie;
  if (!header) return undefined;
  for (const part of header.split(';')) {
    const idx = part.indexOf('=');
    if (idx === -1) continue;
    const name = part.slice(0, idx).trim();
    const value = part.slice(idx + 1).trim();
    if (name === COOKIE_NAME) return decodeURIComponent(value);
  }
  return undefined;
}

export function isAdminRequest(req: Request): boolean {
  return verifyToken(getAdminToken(req));
}

export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  if (!isAdminRequest(req)) {
    res.set('Cache-Control', 'no-store');
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  next();
}

export function verifyPassword(attempt: string): boolean {
  const configured = getAdminPassword();
  if (!configured) return false;
  const a = crypto.createHash('sha256').update(configured, 'utf8').digest();
  const b = crypto.createHash('sha256').update(attempt, 'utf8').digest();
  return crypto.timingSafeEqual(a, b);
}

export function isLoginAllowed(ip: string): boolean {
  const now = Date.now();
  const rec = loginFailures.get(ip);
  if (!rec || now - rec.windowStart >= LOGIN_WINDOW_MS) {
    loginFailures.set(ip, { count: 0, windowStart: now });
    return true;
  }
  return rec.count < LOGIN_MAX_FAILURES;
}

export function recordLoginFailure(ip: string): void {
  const now = Date.now();
  const rec = loginFailures.get(ip);
  if (!rec || now - rec.windowStart >= LOGIN_WINDOW_MS) {
    loginFailures.set(ip, { count: 1, windowStart: now });
  } else {
    rec.count += 1;
  }
}

export function resetLoginFailures(ip: string): void {
  loginFailures.delete(ip);
}

export const ADMIN_COOKIE_NAME = COOKIE_NAME;
export const SESSION_TTL_MS_VALUE = SESSION_TTL_MS;

export function assertAuthConfigured(): void {
  if (!getAdminPassword()) {
    throw new Error('ADMIN_PASSWORD environment variable is not set.');
  }
  if (!getSessionSecret()) {
    throw new Error('ADMIN_SESSION_SECRET environment variable is not set.');
  }
}