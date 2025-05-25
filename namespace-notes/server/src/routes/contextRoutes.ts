import { Router } from 'express';
import contextController from '../controllers/contextController';

/**
 * Routes related to fetching chat context for a workspace.
 */

const router = Router();

/**
 * POST /fetch - Return relevant context for a set of chat messages.
 */
router.post('/fetch', contextController.fetchContext);

export default router;
