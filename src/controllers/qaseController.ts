import { Request, Response } from 'express';
import { exportTestRun } from '../services/qaseService';
import { uploadToMonday } from '../services/mondayService';

export const handleQaseWebhook = async (req: Request, res: Response) => {
    const { runId, status, itemId } = req.body;

    if (status !== 'completed') {
        return res.status(200).json({ message: 'Status não é completed, ignorado' });
    }

    try {
        const filePath = await exportTestRun(runId);
        await uploadToMonday(itemId, filePath);
        return res.status(200).json({ message: 'Relatório exportado e enviado para Monday' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erro no processamento' });
    }
};
