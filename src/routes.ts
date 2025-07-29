import express from 'express';
import { saveMapping } from './controllers/mondayController';
import { handleQaseWebhook } from './controllers/qaseController';

const router = express.Router();

router.post('/webhook/monday', saveMapping);
router.post('/webhook/qase', handleQaseWebhook);

export default router;
