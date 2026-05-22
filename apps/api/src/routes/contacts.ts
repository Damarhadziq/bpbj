import { Router } from 'express';
import { db } from '../config/db';
import { contacts } from '../db/schema';
import { eq, desc } from 'drizzle-orm';
import { verifyAuth, requireRole } from '../middlewares/auth';

const router = Router();

// POST a new contact message (Public)
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required' });
    }
    
    const newContact = await db.insert(contacts).values({
      name,
      email,
      subject,
      message,
    }).returning();
    
    return res.status(201).json({ success: true, message: 'Message sent successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// GET all contact messages (Admin/Superadmin)
router.get('/', verifyAuth, requireRole(['admin', 'superadmin']), async (req, res) => {
  try {
    const allContacts = await db.select().from(contacts).orderBy(desc(contacts.createdAt));
    return res.json(allContacts);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT update status (Admin/Superadmin)
router.put('/:id/status', verifyAuth, requireRole(['admin', 'superadmin']), async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!['UNREAD', 'READ', 'REPLIED'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    
    const updated = await db.update(contacts)
      .set({ status, updatedAt: new Date() })
      .where(eq(contacts.id, id as any))
      .returning();
      
    if (updated.length === 0) return res.status(404).json({ error: 'Not found' });
    return res.json(updated[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE contact message (Admin/Superadmin)
router.delete('/:id', verifyAuth, requireRole(['admin', 'superadmin']), async (req, res) => {
  try {
    const { id } = req.params;
    const { confirmationText } = req.body || {};

    const existing = await db.select().from(contacts).where(eq(contacts.id, id as any)).limit(1);
    if (existing.length === 0) return res.status(404).json({ error: 'Not found' });

    if (!['READ', 'REPLIED'].includes(existing[0].status)) {
      return res.status(400).json({ error: 'Only read or replied complaints can be deleted' });
    }

    if (confirmationText !== 'DELETE') {
      return res.status(400).json({ error: 'Type DELETE to confirm deletion' });
    }

    await db.delete(contacts).where(eq(contacts.id, id as any));
    return res.json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
