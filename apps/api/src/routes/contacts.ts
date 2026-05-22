import { Router } from 'express';
import { db } from '../config/db';
import { contacts } from '../db/schema';
import { eq, desc } from 'drizzle-orm';
import { verifyAuth, requireRole } from '../middlewares/auth';
import { validateConfirmationText, validateContactPayload, validateContactStatus, validateUuid } from '../utils/validation';

const router = Router();

// POST a new contact message (Public)
router.post('/', async (req, res) => {
  try {
    const payload = validateContactPayload(req.body);
    if (!payload.ok) return res.status(400).json({ error: payload.error });
    
    const newContact = await db.insert(contacts).values({
      name: payload.data.name,
      email: payload.data.email,
      subject: payload.data.subject,
      message: payload.data.message,
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
    const id = validateUuid(req.params.id);
    if (!id.ok) return res.status(400).json({ error: id.error });
    const status = validateContactStatus(req.body);
    if (!status.ok) return res.status(400).json({ error: status.error });
    
    const updated = await db.update(contacts)
      .set({ status: status.data, updatedAt: new Date() })
      .where(eq(contacts.id, id.data))
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
    const id = validateUuid(req.params.id);
    if (!id.ok) return res.status(400).json({ error: id.error });
    const confirmationText = validateConfirmationText(req.body);
    if (!confirmationText.ok) return res.status(400).json({ error: confirmationText.error });

    const existing = await db.select().from(contacts).where(eq(contacts.id, id.data)).limit(1);
    if (existing.length === 0) return res.status(404).json({ error: 'Not found' });

    if (!['READ', 'REPLIED'].includes(existing[0].status)) {
      return res.status(400).json({ error: 'Only read or replied complaints can be deleted' });
    }

    if (confirmationText.data !== 'DELETE') {
      return res.status(400).json({ error: 'Type DELETE to confirm deletion' });
    }

    await db.delete(contacts).where(eq(contacts.id, id.data));
    return res.json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
