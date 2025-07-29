import { Request, Response } from 'express';
import pool from '../db';

export const saveMapping = async (req: Request, res: Response): Promise<void> => {
    try {
        // ✅ Passo 1: Responder rápido se for desafio do Monday
        if (req.body.challenge) {
            res.status(200).json({ challenge: req.body.challenge });
            return;
        }

        // ✅ Passo 2: Responder ao webhook imediatamente
        res.status(200).json({ message: 'Webhook recebido com sucesso' });

        // ✅ Passo 3: Processar dados em segundo plano
        const { testPlanId, itemId } = req.body;

        if (!testPlanId || !itemId) {
            console.warn('Webhook recebido com dados incompletos:', req.body);
            return;
        }

        const query = `
            INSERT INTO monday_qase_mapping (test_plan_id, item_id)
            VALUES ($1, $2)
            ON CONFLICT (test_plan_id)
            DO UPDATE SET item_id = EXCLUDED.item_id;
        `;

        await pool.query(query, [testPlanId, itemId]);
        console.log(`Mapeamento salvo para testPlanId=${testPlanId}, itemId=${itemId}`);
    } catch (error) {
        console.error('Erro ao processar webhook do Monday:', error);
    }
};
