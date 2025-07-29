import { Router, Request, Response } from 'express';
import { handleMondayWebhook } from './controllers/mondayController';
import { handleQaseWebhook } from './controllers/qaseController';

const router = Router();

// ✅ Rota para validação e recebimento do webhook do Monday
router.post('/monday', (req: Request, res: Response) => {
  const { challenge } = req.body;

  // Validação do Monday: precisa retornar o challenge puro
  if (challenge) {
    res.setHeader('Content-Type', 'text/plain');
    return res.status(200).send(challenge);
  }

  // Caso não seja validação, segue fluxo normal
  return handleMondayWebhook(req, res);
});

// ✅ Rota do Qase
router.post('/qase', handleQaseWebhook);

export default router;
