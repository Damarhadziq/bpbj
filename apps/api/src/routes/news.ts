import { Router } from 'express';
import { db } from '../config/db';
import { news } from '../db/schema';
import { eq, desc } from 'drizzle-orm';
import { verifyAuth, requireRole } from '../middlewares/auth';

const router = Router();

const generateSummary = (content = '', maxLength = 180) => {
  const normalized = content.replace(/\s+/g, ' ').trim();

  if (normalized.length <= maxLength) return normalized;

  const excerpt = normalized.slice(0, maxLength);
  const lastSentence = Math.max(
    excerpt.lastIndexOf('.'),
    excerpt.lastIndexOf('!'),
    excerpt.lastIndexOf('?')
  );
  const lastSpace = excerpt.lastIndexOf(' ');
  const cutPoint = lastSentence > 80 ? lastSentence + 1 : lastSpace;

  return `${excerpt.slice(0, cutPoint).trim()}...`;
};

const requireFields = (fields: Record<string, unknown>) => {
  const missingField = Object.entries(fields).find(([, value]) => !String(value || '').trim());
  return missingField?.[0];
};

// GET all news (Public)
router.get('/', async (req, res) => {
  try {
    const allNews = await db.select().from(news).orderBy(desc(news.createdAt));
    return res.json(allNews);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// GET single news (Public)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const item = await db.select().from(news).where(eq(news.id, id as any));
    if (item.length === 0) return res.status(404).json({ error: 'Not found' });
    return res.json(item[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// POST new article (Admin/Superadmin)
router.post('/', verifyAuth, requireRole(['admin', 'superadmin']), async (req, res) => {
  try {
    const user = (req as any).user;
    const { title, slug, category, content, imageUrl, isFeatured, date } = req.body;
    const missingField = requireFields({ title, category, content, imageUrl, date });

    if (missingField) {
      return res.status(400).json({ error: `${missingField} is required` });
    }
    
    const newArticle = await db.insert(news).values({
      title,
      slug,
      category,
      summary: generateSummary(content),
      content,
      imageUrl,
      isFeatured: isFeatured || false,
      date: date ? new Date(date) : new Date(),
      authorId: user.id
    }).returning();
    
    return res.status(201).json(newArticle[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT update article (Admin/Superadmin)
router.put('/:id', verifyAuth, requireRole(['admin', 'superadmin']), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, slug, category, content, imageUrl, isFeatured, date } = req.body;
    const missingField = requireFields({ title, category, content, imageUrl, date });

    if (missingField) {
      return res.status(400).json({ error: `${missingField} is required` });
    }
    
    const updated = await db.update(news).set({
      title,
      slug,
      category,
      summary: generateSummary(content),
      content,
      imageUrl,
      isFeatured,
      date: date ? new Date(date) : undefined,
      updatedAt: new Date()
    }).where(eq(news.id, id as any)).returning();
    
    if (updated.length === 0) return res.status(404).json({ error: 'Not found' });
    return res.json(updated[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE article (Admin/Superadmin)
router.delete('/:id', verifyAuth, requireRole(['admin', 'superadmin']), async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await db.delete(news).where(eq(news.id, id as any)).returning();
    
    if (deleted.length === 0) return res.status(404).json({ error: 'Not found' });
    return res.json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
