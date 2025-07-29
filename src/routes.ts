import { Router, Request, Response } from 'express';
import { handleMondayWebhook } from './controllers/mondayController';
import { handleQaseWebhook } from './controllers/qaseController';

const router = Router();

// ✅ Validação do Monday (GET e POST)
router.get('/monday', (req: Request, res: Response) => {
  const challenge = req.query.challenge as string;
  if (challenge) {
    return res.status(200).send(challenge);
  }
  res.status(400).send('Missing challenge');
});

router.post('/monday', (req: Request, res: Response) => {
  const challenge = req.body.challenge;
  if (challenge) {
    return res.status(200).send(challenge);
  }
  return handleMondayWebhook(req, res);
});

router.post('/qase', handleQaseWebhook);

export default router;
