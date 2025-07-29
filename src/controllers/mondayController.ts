import { Request, Response } from 'express';
import pool from '../db';

export const saveMapping = async (req: Request, res: Response): Promise<void> => {
    try {
        // ✅ Passo 1: Verificar se é o desafio do Monday
        if (req.body.challenge) {
            res.status(200).json({ challenge: req.body.challenge });
            return;
        }

        // ✅ Passo 2: Fluxo normal para salvar o mapeamento
        const { testPlanId, itemId } = req.body;

        if (!testPlanId || !itemId) {
            res.status(400).json({ error: 'testPlanId e itemId são obrigatórios.' });
            return;
        }

        const query = `
            INSERT INTO monday_qase_mapping (test_plan_id, item_id)
            VALUES ($1, $2)
            ON CONFLICT (test_plan_id)
            DO UPDATE SET item_id = EXCLUDED.item_id;
        `;

        await pool.query(query, [testPlanId, itemId]);

        res.status(200).json({ message: 'Mapeamento salvo/atualizado com sucesso!' });
    } catch (error) {
        console.error('Erro ao salvar mapeamento:', error);
        res.status(500).json({ error: 'Erro interno no servidor.' });
    }
};
