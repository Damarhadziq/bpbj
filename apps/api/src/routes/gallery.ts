import { Router } from 'express';
import { db } from '../config/db';
import { gallery } from '../db/schema';
import { eq, desc } from 'drizzle-orm';
import { verifyAuth, requireRole } from '../middlewares/auth';

const router = Router();

const requireFields = (fields: Record<string, unknown>) => {
  const missingField = Object.entries(fields).find(([, value]) => !String(value || '').trim());
  return missingField?.[0];
};

// GET all gallery (Public)
router.get('/', async (req, res) => {
  try {
    const allGallery = await db.select().from(gallery).orderBy(desc(gallery.createdAt));
    return res.json(allGallery);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// GET single gallery (Public)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const item = await db.select().from(gallery).where(eq(gallery.id, id as any));
    if (item.length === 0) return res.status(404).json({ error: 'Not found' });
    return res.json(item[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// POST new gallery (Admin/Superadmin)
router.post('/', verifyAuth, requireRole(['admin', 'superadmin']), async (req, res) => {
  try {
    const { title, category, location, description, imageUrl, imageAlt, isFeatured, date } = req.body;
    const missingField = requireFields({ title, category, location, description, imageUrl, imageAlt, date });

    if (missingField) {
      return res.status(400).json({ error: `${missingField} is required` });
    }
    
    const newItem = await db.insert(gallery).values({
      title,
      category,
      location,
      description,
      imageUrl,
      imageAlt,
      isFeatured: isFeatured || false,
      date: date ? new Date(date) : new Date(),
    }).returning();
    
    return res.status(201).json(newItem[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT update gallery (Admin/Superadmin)
router.put('/:id', verifyAuth, requireRole(['admin', 'superadmin']), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, category, location, description, imageUrl, imageAlt, isFeatured, date } = req.body;
    const missingField = requireFields({ title, category, location, description, imageUrl, imageAlt, date });

    if (missingField) {
      return res.status(400).json({ error: `${missingField} is required` });
    }
    
    const updated = await db.update(gallery).set({
      title,
      category,
      location,
      description,
      imageUrl,
      imageAlt,
      isFeatured,
      date: date ? new Date(date) : undefined,
      updatedAt: new Date()
    }).where(eq(gallery.id, id as any)).returning();
    
    if (updated.length === 0) return res.status(404).json({ error: 'Not found' });
    return res.json(updated[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE gallery (Admin/Superadmin)
router.delete('/:id', verifyAuth, requireRole(['admin', 'superadmin']), async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await db.delete(gallery).where(eq(gallery.id, id as any)).returning();
    
    if (deleted.length === 0) return res.status(404).json({ error: 'Not found' });
    return res.json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
