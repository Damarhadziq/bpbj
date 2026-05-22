import { Request, Response, NextFunction } from 'express';
import { auth } from '../auth/auth';
import { fromNodeHeaders } from 'better-auth/node';

export const verifyAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
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
