import { Router } from 'express';
import { db } from '../config/db';
import { news } from '../db/schema';
import { and, count, desc, eq, ne } from 'drizzle-orm';
import { verifyAuth, requireRole } from '../middlewares/auth';
import { NEWS_CATEGORIES, validateNewsPayload, validateUuid } from '../utils/validation';
import { createId } from '../utils/id';

const router = Router();
const MAX_SELECTED_NEWS = 5;

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

// GET news categories (Public)
router.get('/categories', (req, res) => {
  return res.json(NEWS_CATEGORIES);
});

// GET single news (Public)
router.get('/:id', async (req, res) => {
  try {
    const id = validateUuid(req.params.id);
    if (!id.ok) return res.status(400).json({ error: id.error });

    const item = await db.select().from(news).where(eq(news.id, id.data));
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
    const payload = validateNewsPayload(req.body);
    if (!payload.ok) return res.status(400).json({ error: payload.error });

    if (payload.data.isSelected && !payload.data.isFeatured) {
      const selectedCount = await db.select({ value: count() }).from(news).where(eq(news.isSelected, true));
      if ((selectedCount[0]?.value || 0) >= MAX_SELECTED_NEWS) {
        return res.status(400).json({ error: `Berita pilihan maksimal ${MAX_SELECTED_NEWS} item.` });
      }
    }

    if (payload.data.isFeatured) {
      await db.update(news).set({ isFeatured: false, updatedAt: new Date() }).where(eq(news.isFeatured, true));
    }
    
    const newArticle = await db.insert(news).values({
      id: createId(),
      title: payload.data.title,
      slug: payload.data.slug,
      category: payload.data.category,
      summary: generateSummary(payload.data.content),
      content: payload.data.content,
      imageUrl: payload.data.imageUrl,
      isFeatured: payload.data.isFeatured,
      isSelected: payload.data.isFeatured ? false : payload.data.isSelected,
      date: payload.data.date,
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
    const id = validateUuid(req.params.id);
    if (!id.ok) return res.status(400).json({ error: id.error });
    const payload = validateNewsPayload(req.body);
    if (!payload.ok) return res.status(400).json({ error: payload.error });

    if (payload.data.isSelected && !payload.data.isFeatured) {
      const selectedCount = await db.select({ value: count() }).from(news).where(and(eq(news.isSelected, true), ne(news.id, id.data)));
      if ((selectedCount[0]?.value || 0) >= MAX_SELECTED_NEWS) {
        return res.status(400).json({ error: `Berita pilihan maksimal ${MAX_SELECTED_NEWS} item.` });
      }
    }

    if (payload.data.isFeatured) {
      await db.update(news).set({ isFeatured: false, updatedAt: new Date() }).where(and(eq(news.isFeatured, true), ne(news.id, id.data)));
    }
    
    const updated = await db.update(news).set({
      title: payload.data.title,
      slug: payload.data.slug,
      category: payload.data.category,
      summary: generateSummary(payload.data.content),
      content: payload.data.content,
      imageUrl: payload.data.imageUrl,
      isFeatured: payload.data.isFeatured,
      isSelected: payload.data.isFeatured ? false : payload.data.isSelected,
      date: payload.data.date,
      updatedAt: new Date()
    }).where(eq(news.id, id.data)).returning();
    
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
    const id = validateUuid(req.params.id);
    if (!id.ok) return res.status(400).json({ error: id.error });

    const deleted = await db.delete(news).where(eq(news.id, id.data)).returning();
    
    if (deleted.length === 0) return res.status(404).json({ error: 'Not found' });
    return res.json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
