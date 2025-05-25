import { Request, Response, NextFunction } from 'express';
import axios from 'axios';

export interface LatenodeUser {
  id: string;
  email: string;
  [key: string]: any;
}

/**
 * Authentication middleware verifying AUTH_TOKEN cookie against latenode API.
 */
export default async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.cookies?.AUTH_TOKEN;
  if (!token) {
    return res.status(401).json({ message: 'You are not authorized' });
  }

  try {
    const response = await axios.get(
      'https://api.latenode.com/users/v1/user/info',
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const { data } = response;
    if (!data?.success || !data.data?.id || !data.data?.email) {
      return res.status(401).json({ message: 'You are not authorized' });
    }
    (req as Request & { user?: LatenodeUser }).user = data.data;
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'You are not authorized' });
  }
}
