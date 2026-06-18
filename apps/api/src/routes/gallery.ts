import { Router } from 'express';
import { db } from '../config/db';
import { gallery } from '../db/schema';
import { eq, desc } from 'drizzle-orm';
import { verifyAuth, requireRole } from '../middlewares/auth';
import { validateGalleryPayload, validateUuid } from '../utils/validation';
import { createId } from '../utils/id';

const router = Router();

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
    const id = validateUuid(req.params.id);
    if (!id.ok) return res.status(400).json({ error: id.error });

    const item = await db.select().from(gallery).where(eq(gallery.id, id.data));
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
    const payload = validateGalleryPayload(req.body);
    if (!payload.ok) return res.status(400).json({ error: payload.error });
    
    const newItem = await db.insert(gallery).values({
      id: createId(),
      title: payload.data.title,
      category: payload.data.category,
      location: payload.data.location,
      description: payload.data.description,
      imageUrl: payload.data.imageUrl,
      imageAlt: payload.data.imageAlt,
      galleryImages: payload.data.galleryImages,
      isFeatured: payload.data.isFeatured,
      date: payload.data.date,
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
    const id = validateUuid(req.params.id);
    if (!id.ok) return res.status(400).json({ error: id.error });
    const payload = validateGalleryPayload(req.body);
    if (!payload.ok) return res.status(400).json({ error: payload.error });
    
    const updated = await db.update(gallery).set({
      title: payload.data.title,
      category: payload.data.category,
      location: payload.data.location,
      description: payload.data.description,
      imageUrl: payload.data.imageUrl,
      imageAlt: payload.data.imageAlt,
      galleryImages: payload.data.galleryImages,
      isFeatured: payload.data.isFeatured,
      date: payload.data.date,
      updatedAt: new Date()
    }).where(eq(gallery.id, id.data)).returning();
    
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
    const id = validateUuid(req.params.id);
    if (!id.ok) return res.status(400).json({ error: id.error });

    const deleted = await db.delete(gallery).where(eq(gallery.id, id.data)).returning();
    
    if (deleted.length === 0) return res.status(404).json({ error: 'Not found' });
    return res.json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
