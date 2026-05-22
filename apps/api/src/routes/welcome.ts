import { Router } from 'express';
import { db } from '../config/db';
import { headWelcome } from '../db/schema';
import { eq } from 'drizzle-orm';
import { verifyAuth, requireRole } from '../middlewares/auth';
import { validateWelcomePayload } from '../utils/validation';

const router = Router();

// Get the welcome message
router.get('/', async (req, res) => {
  try {
    const record = await db.select().from(headWelcome).where(eq(headWelcome.id, 1)).limit(1);
    if (record.length === 0) {
      return res.status(404).json({ error: 'Welcome message not found' });
    }
    return res.json(record[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Update the welcome message
router.put('/', verifyAuth, requireRole(['admin', 'superadmin']), async (req, res) => {
  try {
    const payload = validateWelcomePayload(req.body);
    if (!payload.ok) return res.status(400).json({ error: payload.error });
    
    // Check if it exists
    const existing = await db.select().from(headWelcome).where(eq(headWelcome.id, 1)).limit(1);
    
    let updated;
    if (existing.length === 0) {
      updated = await db.insert(headWelcome).values({
        id: 1,
        name: payload.data.name,
        position: payload.data.position,
        message: payload.data.message,
        imageUrl: payload.data.imageUrl,
        createdAt: new Date(),
        updatedAt: new Date()
      }).returning();
    } else {
      updated = await db.update(headWelcome).set({
        name: payload.data.name,
        position: payload.data.position,
        message: payload.data.message,
        imageUrl: payload.data.imageUrl,
        updatedAt: new Date()
      }).where(eq(headWelcome.id, 1)).returning();
    }
    
    return res.json(updated[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
