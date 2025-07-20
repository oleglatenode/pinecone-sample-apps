import { Router } from 'express';

const router = Router();

// Simple endpoint returning the authenticated user
router.get('/me', (req, res) => {
  res.json((req as any).user);
});

export default router;
