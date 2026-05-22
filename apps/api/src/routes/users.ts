import { Router } from 'express';
import { db } from '../config/db';
import { account, news, session, user } from '../db/schema';
import { and, eq } from 'drizzle-orm';
import { verifyAuth, requireRole } from '../middlewares/auth';
import { auth } from '../auth/auth';
import { fromNodeHeaders } from 'better-auth/node';
import { hashPassword, verifyPassword } from '@better-auth/utils/password';
import {
  validateAdminPasswordPayload,
  validateConfirmationText,
  validateOwnPasswordPayload,
  validateRole,
  validateTextId,
  validateUserCreatePayload,
} from '../utils/validation';

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
    const payload = validateUserCreatePayload(req.body);
    if (!payload.ok) return res.status(400).json({ error: payload.error });

    const existingUser = await db.select().from(user).where(eq(user.email, payload.data.email)).limit(1);
    if (existingUser.length > 0) {
      return res.status(409).json({ error: 'Email already exists' });
    }

    const result = await auth.api.signUpEmail({
      body: {
        name: payload.data.name,
        email: payload.data.email,
        password: payload.data.password,
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
    const id = validateTextId(req.params.id);
    if (!id.ok) return res.status(400).json({ error: id.error });
    const role = validateRole(req.body);
    if (!role.ok) return res.status(400).json({ error: role.error });
    
    const updated = await db.update(user)
      .set({ role: role.data, updatedAt: new Date() })
      .where(eq(user.id, id.data))
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
    const payload = validateOwnPasswordPayload(req.body);
    if (!payload.ok) return res.status(400).json({ error: payload.error });

    const credentialAccount = await db.select()
      .from(account)
      .where(and(eq(account.userId, currentUser.id), eq(account.providerId, 'credential')))
      .limit(1);

    if (credentialAccount.length === 0 || !credentialAccount[0].password) {
      return res.status(404).json({ error: 'Credential account not found' });
    }

    const isCurrentPasswordValid = await verifyPassword(credentialAccount[0].password, payload.data.currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    const hashedPassword = await hashPassword(payload.data.password);
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
    const id = validateTextId(req.params.id);
    if (!id.ok) return res.status(400).json({ error: id.error });
    const payload = validateAdminPasswordPayload(req.body);
    if (!payload.ok) return res.status(400).json({ error: payload.error });
    const currentUser = (req as any).user;

    if (currentUser.id === id.data) {
      return res.status(400).json({ error: 'Cannot change your own password from this page' });
    }

    const target = await db.select().from(user).where(eq(user.id, id.data)).limit(1);
    if (target.length === 0) return res.status(404).json({ error: 'User not found' });
    if (target[0].role !== 'admin') {
      return res.status(403).json({ error: 'Only admin account passwords can be changed here' });
    }

    if (payload.data.confirmationText !== target[0].email) {
      return res.status(400).json({ error: 'Type the target email to confirm password change' });
    }

    const hashedPassword = await hashPassword(payload.data.password);
    const updated = await db.update(account)
      .set({ password: hashedPassword, updatedAt: new Date() })
      .where(and(eq(account.userId, id.data), eq(account.providerId, 'credential')))
      .returning({ id: account.id });

    if (updated.length === 0) {
      return res.status(404).json({ error: 'Credential account not found' });
    }

    await db.delete(session).where(eq(session.userId, id.data));
    await db.update(user).set({ updatedAt: new Date() }).where(eq(user.id, id.data));

    return res.json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE user
router.delete('/:id', async (req, res) => {
  try {
    const id = validateTextId(req.params.id);
    if (!id.ok) return res.status(400).json({ error: id.error });
    const confirmationText = validateConfirmationText(req.body);
    if (!confirmationText.ok) return res.status(400).json({ error: confirmationText.error });
    
    // Check if trying to delete oneself
    const currentUser = (req as any).user;
    if (currentUser.id === id.data) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }

    const target = await db.select().from(user).where(eq(user.id, id.data)).limit(1);
    if (target.length === 0) return res.status(404).json({ error: 'User not found' });
    if (target[0].role !== 'admin') {
      return res.status(403).json({ error: 'Only admin accounts can be deleted here' });
    }

    if (confirmationText.data !== target[0].email) {
      return res.status(400).json({ error: 'Type the target email to confirm deletion' });
    }

    await db.delete(session).where(eq(session.userId, id.data));
    await db.delete(account).where(eq(account.userId, id.data));
    await db.update(news).set({ authorId: currentUser.id, updatedAt: new Date() }).where(eq(news.authorId, id.data));
    const deleted = await db.delete(user).where(eq(user.id, id.data)).returning({ id: user.id });
    
    return res.json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
