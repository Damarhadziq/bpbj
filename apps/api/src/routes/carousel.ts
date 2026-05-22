import { Router } from 'express';
import { asc, eq } from 'drizzle-orm';
import { db } from '../config/db';
import { carousel } from '../db/schema';
import { verifyAuth, requireRole } from '../middlewares/auth';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const items = await db.select().from(carousel).orderBy(asc(carousel.displayOrder), asc(carousel.createdAt));
    return res.json(items);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/', verifyAuth, requireRole(['admin', 'superadmin']), async (req, res) => {
  try {
    const { imageUrl, imageAlt, displayOrder, isActive } = req.body;

    if (!imageUrl) {
      return res.status(400).json({ error: 'Image is required' });
    }

    const created = await db.insert(carousel).values({
      title: imageAlt || 'Carousel image',
      description: null,
      imageUrl,
      imageAlt,
      displayOrder: Number(displayOrder) || 0,
      isActive: isActive ?? true,
    }).returning();

    return res.status(201).json(created[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/:id', verifyAuth, requireRole(['admin', 'superadmin']), async (req, res) => {
  try {
    const { id } = req.params;
    const { imageUrl, imageAlt, displayOrder, isActive } = req.body;

    if (!imageUrl) {
      return res.status(400).json({ error: 'Image is required' });
    }

    const updated = await db.update(carousel).set({
      title: imageAlt || 'Carousel image',
      description: null,
      imageUrl,
      imageAlt,
      displayOrder: Number(displayOrder) || 0,
      isActive: isActive ?? true,
      updatedAt: new Date(),
    }).where(eq(carousel.id, id as any)).returning();

    if (updated.length === 0) return res.status(404).json({ error: 'Not found' });
    return res.json(updated[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:id', verifyAuth, requireRole(['admin', 'superadmin']), async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await db.delete(carousel).where(eq(carousel.id, id as any)).returning();
    if (deleted.length === 0) return res.status(404).json({ error: 'Not found' });
    return res.json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
