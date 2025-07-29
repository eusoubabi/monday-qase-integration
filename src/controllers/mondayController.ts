import { Request, Response } from 'express';
import { saveMapping } from '../utils/storage';

export const handleMondayWebhook = (req: Request, res: Response) => {
    const { itemId, testPlanId } = req.body;

    if (!itemId || !testPlanId) {
        return res.status(400).json({ message: 'Faltando itemId ou testPlanId' });
    }

    saveMapping(itemId, testPlanId);

    console.log(`Mapeado Item ${itemId} -> TestPlan ${testPlanId}`);
    return res.status(200).json({ message: 'Relação salva com sucesso' });
};
