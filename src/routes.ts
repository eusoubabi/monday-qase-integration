import { Router, Request, Response } from 'express';
import { handleMondayWebhook } from './controllers/mondayController';
import { handleQaseWebhook } from './controllers/qaseController';

const router = Router();

// ✅ Validação do Monday (com "challenge")
router.get('/monday', (req: Request, res: Response) => {
  const challenge = req.query.challenge as string;
  if (challenge) {
    return res.status(200).send(challenge);
  }
  res.status(200).send('Webhook OK');
});

router.post('/monday', handleMondayWebhook);
router.post('/qase', handleQaseWebhook);

export default router;
