import { Router } from 'express';
import { asc, eq } from 'drizzle-orm';
import { db } from '../config/db';
import { floatingWidgets } from '../db/schema';
import { verifyAuth, requireRole } from '../middlewares/auth';
import { validateFloatingWidgetPayload, validateUuid } from '../utils/validation';
import { createId } from '../utils/id';

const router = Router();

router.get('/', async (_req, res) => {
  try {
    const items = await db.select()
      .from(floatingWidgets)
      .where(eq(floatingWidgets.isActive, true))
      .orderBy(asc(floatingWidgets.displayOrder), asc(floatingWidgets.createdAt));
    return res.json(items);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/admin', verifyAuth, requireRole(['admin', 'superadmin']), async (_req, res) => {
  try {
    const items = await db.select()
      .from(floatingWidgets)
      .orderBy(asc(floatingWidgets.displayOrder), asc(floatingWidgets.createdAt));
    return res.json(items);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/', verifyAuth, requireRole(['admin', 'superadmin']), async (req, res) => {
  try {
    const payload = validateFloatingWidgetPayload(req.body);
    if (!payload.ok) return res.status(400).json({ error: payload.error });

    const created = await db.insert(floatingWidgets).values({ id: createId(), ...payload.data }).returning();
    return res.status(201).json(created[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/:id', verifyAuth, requireRole(['admin', 'superadmin']), async (req, res) => {
  try {
    const id = validateUuid(req.params.id);
    if (!id.ok) return res.status(400).json({ error: id.error });
    const payload = validateFloatingWidgetPayload(req.body);
    if (!payload.ok) return res.status(400).json({ error: payload.error });

    const updated = await db.update(floatingWidgets)
      .set({ ...payload.data, updatedAt: new Date() })
      .where(eq(floatingWidgets.id, id.data))
      .returning();

    if (updated.length === 0) return res.status(404).json({ error: 'Not found' });
    return res.json(updated[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:id', verifyAuth, requireRole(['admin', 'superadmin']), async (req, res) => {
  try {
    const id = validateUuid(req.params.id);
    if (!id.ok) return res.status(400).json({ error: id.error });

    const deleted = await db.delete(floatingWidgets).where(eq(floatingWidgets.id, id.data)).returning();
    if (deleted.length === 0) return res.status(404).json({ error: 'Not found' });
    return res.json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
