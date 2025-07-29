import { Router } from 'express';
import { handleMondayWebhook } from './controllers/mondayController';
import { handleQaseWebhook } from './controllers/qaseController';

const router = Router();

router.post('/monday', handleMondayWebhook);
router.post('/qase', handleQaseWebhook);

export default router;
