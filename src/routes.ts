import { Router, Request, Response } from 'express';
import { handleMondayWebhook } from './controllers/mondayController';
import { handleQaseWebhook } from './controllers/qaseController';

const router = Router();

// ✅ Responde ao desafio do Monday com JSON idêntico
router.post('/monday', (req: Request, res: Response) => {
  const { challenge } = req.body;

  if (challenge) {
    console.log('Desafio recebido do Monday:', challenge);
    return res.status(200).json({ challenge }); // Retorna JSON
  }

  // Caso não seja validação, processa evento real
  return handleMondayWebhook(req, res);
});

router.post('/qase', handleQaseWebhook);

export default router;
