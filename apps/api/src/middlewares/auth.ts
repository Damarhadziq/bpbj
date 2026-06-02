import { Request, Response, NextFunction } from 'express';
import { auth } from '../auth/auth';
import { fromNodeHeaders } from 'better-auth/node';
import { db } from '../config/db';
import { session as sessionTable, user as userTable } from '../db/schema';
import { eq } from 'drizzle-orm';
import { cookieName, parseCookies } from '../routes/authSession';

export const verifyAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = parseCookies(req.headers.cookie)[cookieName];
    if (token) {
      const rows = await db.select({
        expiresAt: sessionTable.expiresAt,
        user: {
          id: userTable.id,
          name: userTable.name,
          email: userTable.email,
          image: userTable.image,
          role: userTable.role,
        },
      })
        .from(sessionTable)
        .innerJoin(userTable, eq(sessionTable.userId, userTable.id))
        .where(eq(sessionTable.token, token))
        .limit(1);

      if (rows.length > 0 && rows[0].expiresAt > new Date()) {
        (req as any).user = rows[0].user;
        return next();
      }
    }

    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers)
    });
    
    if (!session || !session.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    // Attach user to request
    (req as any).user = session.user;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
};

export const requireRole = (allowedRoles: ('admin' | 'superadmin')[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = (req as any).user;
      
      if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      
      if (!allowedRoles.includes(user.role)) {
        return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
      }
      
      next();
    } catch (error) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  };
};
