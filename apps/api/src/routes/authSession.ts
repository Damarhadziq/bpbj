import { Router } from 'express';
import { randomBytes } from 'crypto';
import { and, eq } from 'drizzle-orm';
import { verifyPassword } from '@better-auth/utils/password';
import { db } from '../config/db';
import { account, session, user } from '../db/schema';

const router = Router();
const cookieName = 'bpbj_admin_session';
const sessionMaxAgeMs = 1000 * 60 * 60 * 24 * 7;

const parseCookies = (cookieHeader = '') => Object.fromEntries(
  cookieHeader
    .split(';')
    .map((cookie) => cookie.trim())
    .filter(Boolean)
    .map((cookie) => {
      const [key, ...value] = cookie.split('=');
      return [key, decodeURIComponent(value.join('='))];
    })
);

const getCookieOptions = (maxAge: number) => [
  `${cookieName}=`,
  'Path=/',
  'HttpOnly',
  'SameSite=Lax',
  `Max-Age=${Math.floor(maxAge / 1000)}`,
].join('; ');

const publicUserFields = {
  id: user.id,
  name: user.name,
  email: user.email,
  image: user.image,
  role: user.role,
};

router.get('/session', async (req, res) => {
  try {
    const token = parseCookies(req.headers.cookie)[cookieName];
    if (!token) return res.json(null);

    const rows = await db.select({
      sessionId: session.id,
      expiresAt: session.expiresAt,
      user: publicUserFields,
    })
      .from(session)
      .innerJoin(user, eq(session.userId, user.id))
      .where(eq(session.token, token))
      .limit(1);

    if (rows.length === 0 || rows[0].expiresAt <= new Date()) {
      res.setHeader('Set-Cookie', getCookieOptions(0));
      return res.json(null);
    }

    return res.json({ user: rows[0].user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Session check failed' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : '';
    const password = typeof req.body?.password === 'string' ? req.body.password : '';

    if (!email || !password) {
      return res.status(400).json({ error: 'Email dan password wajib diisi.' });
    }

    const rows = await db.select({
      user: publicUserFields,
      password: account.password,
      providerId: account.providerId,
    })
      .from(user)
      .innerJoin(account, eq(account.userId, user.id))
      .where(and(eq(user.email, email), eq(account.providerId, 'credential')))
      .limit(1);

    if (rows.length === 0 || !rows[0].password) {
      return res.status(401).json({ error: 'Email atau password salah.' });
    }

    const isPasswordValid = await verifyPassword(rows[0].password, password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Email atau password salah.' });
    }

    const now = new Date();
    const expiresAt = new Date(now.getTime() + sessionMaxAgeMs);
    const token = randomBytes(32).toString('hex');
    const sessionId = randomBytes(16).toString('hex');

    await db.delete(session).where(eq(session.userId, rows[0].user.id));

    await db.insert(session).values({
      id: sessionId,
      token,
      userId: rows[0].user.id,
      expiresAt,
      createdAt: now,
      updatedAt: now,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    res.setHeader('Set-Cookie', `${cookieName}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${Math.floor(sessionMaxAgeMs / 1000)}`);
    return res.json({ user: rows[0].user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Login gagal diproses.' });
  }
});

router.post('/logout', async (req, res) => {
  try {
    const token = parseCookies(req.headers.cookie)[cookieName];
    if (token) await db.delete(session).where(eq(session.token, token));
    res.setHeader('Set-Cookie', getCookieOptions(0));
    return res.json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Logout gagal diproses.' });
  }
});

export { cookieName, parseCookies };
export default router;
