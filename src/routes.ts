import { Router } from 'express';
import { handleMondayWebhook } from './controllers/mondayController';
import { handleQaseWebhook } from './controllers/qaseController';

const router = Router();

// Webhook do Monday (com validação de challenge)
router.post('/monday', (req, res) => {
  const { challenge } = req.body;

  if (challenge) {
    console.log('Desafio recebido do Monday:', challenge);
    return res.status(200).json({ challenge });
  }

  return handleMondayWebhook(req, res);
});

// Webhook do Qase
router.post('/qase', handleQaseWebhook);

export default router;
