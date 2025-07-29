import { Request, Response } from 'express';
import { saveMapping } from '../services/mondayQaseService';

export const handleMondayWebhook = async (req: Request, res: Response) => {
  try {
    const { event } = req.body;

    if (!event) {
      return res.status(400).json({ error: 'Payload inválido' });
    }

    const itemId = event.pulseId;
    const testPlanId =
      event.value && typeof event.value === 'object'
        ? event.value.value
        : event.value;

    console.log(`Recebido do Monday -> itemId: ${itemId}, testPlanId: ${testPlanId}`);

    await saveMapping(testPlanId, itemId);

    return res.status(200).json({ message: 'Mapeamento salvo no banco', itemId, testPlanId });
  } catch (error) {
    console.error('Erro no webhook do Monday:', error);
    return res.status(500).json({ error: 'Erro interno' });
  }
};
