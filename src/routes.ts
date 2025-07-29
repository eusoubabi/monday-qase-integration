import { Router } from 'express';
import { handleMondayWebhook } from './controllers/mondayController';
import { handleQaseWebhook } from './controllers/qaseController';

const router = Router();

// ✅ Endpoint de verificação do Monday
router.get('/monday', (req, res) => {
  res.status(200).send('Webhook OK');
});

router.post('/monday', handleMondayWebhook);
router.post('/qase', handleQaseWebhook);

export default router;
