import { Router } from 'express';
import { db } from '../config/db';
import { account, news, session, user } from '../db/schema';
import { and, eq } from 'drizzle-orm';
import { verifyAuth, requireRole } from '../middlewares/auth';
import { auth } from '../auth/auth';
import { fromNodeHeaders } from 'better-auth/node';
import { hashPassword, verifyPassword } from '@better-auth/utils/password';

const router = Router();

// Require superadmin for all routes in this file
router.use(verifyAuth, requireRole(['superadmin']));

// GET all users
router.get('/', async (req, res) => {
  try {
    const allUsers = await db.select({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }).from(user);
    
    return res.json(allUsers);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// POST create new admin user
router.post('/', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    const existingUser = await db.select().from(user).where(eq(user.email, email.toLowerCase())).limit(1);
    if (existingUser.length > 0) {
      return res.status(409).json({ error: 'Email already exists' });
    }

    const result = await auth.api.signUpEmail({
      body: {
        name,
        email,
        password,
        rememberMe: false,
      },
      headers: fromNodeHeaders(req.headers),
    });

    const createdUser = await db.update(user)
      .set({ role: 'admin', updatedAt: new Date() })
      .where(eq(user.id, result.user.id))
      .returning({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      });

    return res.status(201).json(createdUser[0]);
  } catch (error: any) {
    console.error(error);
    return res.status(error?.statusCode || 500).json({
      error: error?.body?.message || error?.message || 'Internal server error',
    });
  }
});

// PUT update role
router.put('/:id/role', async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    
    if (!['admin', 'superadmin'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }
    
    const updated = await db.update(user)
      .set({ role, updatedAt: new Date() })
      .where(eq(user.id, id))
      .returning({ id: user.id, name: user.name, role: user.role });
      
    if (updated.length === 0) return res.status(404).json({ error: 'User not found' });
    
    return res.json(updated[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT change current superadmin password
router.put('/me/password', async (req, res) => {
  try {
    const currentUser = (req as any).user;
    const { currentPassword, password, confirmPassword } = req.body;

    if (!currentPassword || !password || !confirmPassword) {
      return res.status(400).json({ error: 'Current password, new password, and confirmation are required' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Password confirmation does not match' });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    if (currentPassword === password) {
      return res.status(400).json({ error: 'New password must be different from current password' });
    }

    const credentialAccount = await db.select()
      .from(account)
      .where(and(eq(account.userId, currentUser.id), eq(account.providerId, 'credential')))
      .limit(1);

    if (credentialAccount.length === 0 || !credentialAccount[0].password) {
      return res.status(404).json({ error: 'Credential account not found' });
    }

    const isCurrentPasswordValid = await verifyPassword(credentialAccount[0].password, currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    const hashedPassword = await hashPassword(password);
    await db.update(account)
      .set({ password: hashedPassword, updatedAt: new Date() })
      .where(and(eq(account.userId, currentUser.id), eq(account.providerId, 'credential')));

    await db.delete(session).where(eq(session.userId, currentUser.id));
    await db.update(user).set({ updatedAt: new Date() }).where(eq(user.id, currentUser.id));

    return res.json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT change user password
router.put('/:id/password', async (req, res) => {
  try {
    const { id } = req.params;
    const { password, confirmPassword, confirmationText } = req.body;
    const currentUser = (req as any).user;

    if (currentUser.id === id) {
      return res.status(400).json({ error: 'Cannot change your own password from this page' });
    }

    if (!password || !confirmPassword) {
      return res.status(400).json({ error: 'Password and confirmation are required' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Password confirmation does not match' });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    const target = await db.select().from(user).where(eq(user.id, id)).limit(1);
    if (target.length === 0) return res.status(404).json({ error: 'User not found' });
    if (target[0].role !== 'admin') {
      return res.status(403).json({ error: 'Only admin account passwords can be changed here' });
    }

    if (confirmationText !== target[0].email) {
      return res.status(400).json({ error: 'Type the target email to confirm password change' });
    }

    const hashedPassword = await hashPassword(password);
    const updated = await db.update(account)
      .set({ password: hashedPassword, updatedAt: new Date() })
      .where(and(eq(account.userId, id), eq(account.providerId, 'credential')))
      .returning({ id: account.id });

    if (updated.length === 0) {
      return res.status(404).json({ error: 'Credential account not found' });
    }

    await db.delete(session).where(eq(session.userId, id));
    await db.update(user).set({ updatedAt: new Date() }).where(eq(user.id, id));

    return res.json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE user
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { confirmationText } = req.body || {};
    
    // Check if trying to delete oneself
    const currentUser = (req as any).user;
    if (currentUser.id === id) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }

    const target = await db.select().from(user).where(eq(user.id, id)).limit(1);
    if (target.length === 0) return res.status(404).json({ error: 'User not found' });
    if (target[0].role !== 'admin') {
      return res.status(403).json({ error: 'Only admin accounts can be deleted here' });
    }

    if (confirmationText !== target[0].email) {
      return res.status(400).json({ error: 'Type the target email to confirm deletion' });
    }

    await db.delete(session).where(eq(session.userId, id));
    await db.delete(account).where(eq(account.userId, id));
    await db.update(news).set({ authorId: currentUser.id, updatedAt: new Date() }).where(eq(news.authorId, id));
    const deleted = await db.delete(user).where(eq(user.id, id)).returning({ id: user.id });
    
    return res.json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
