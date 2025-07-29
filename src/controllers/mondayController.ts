import { Request, Response } from 'express';

export const handleMondayWebhook = (req: Request, res: Response) => {
  try {
    const { event } = req.body;

    if (!event) {
      return res.status(400).json({ error: 'Payload inválido' });
    }

    const itemId = event.pulseId; // ID do item no board
    const testPlanId = event.value; // Novo valor da coluna alterada

    console.log(`Recebido do Monday -> itemId: ${itemId}, testPlanId: ${testPlanId}`);

    // Aqui você pode salvar no banco ou fazer a lógica que precisar
    return res.status(200).json({ message: 'Webhook recebido', itemId, testPlanId });
  } catch (error) {
    console.error('Erro no webhook do Monday:', error);
    return res.status(500).json({ error: 'Erro interno' });
  }
};
