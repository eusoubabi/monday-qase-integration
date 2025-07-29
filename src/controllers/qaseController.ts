import { Request, Response } from 'express';
import pool from '../db';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import FormData from 'form-data';

const QASE_API_TOKEN = process.env.QASE_API_TOKEN as string;
const MONDAY_API_TOKEN = process.env.MONDAY_API_TOKEN as string;

export const handleQaseWebhook = async (req: Request, res: Response): Promise<void> => {
    try {
        const { result } = req.body;

        if (!result || !result.test_plan_id || !result.id) {
            res.status(400).json({ error: 'Dados inválidos no webhook do Qase.' });
            return;
        }

        const testPlanId = result.test_plan_id;
        const runId = result.id;

        // 1. Busca itemId no banco
        const query = 'SELECT item_id FROM monday_qase_mapping WHERE test_plan_id = $1';
        const resultDb = await pool.query(query, [testPlanId]);

        if (resultDb.rows.length === 0) {
            res.status(404).json({ error: 'Mapeamento não encontrado.' });
            return;
        }

        const itemId = resultDb.rows[0].item_id;

        // 2. Baixar relatório PDF do Qase
        const pdfUrl = `https://api.qase.io/v1/run/${runId}/report?format=pdf`;
        const pdfPath = path.resolve(__dirname, `../../reports/qase-report-${runId}.pdf`);

        const pdfResponse = await axios.get(pdfUrl, {
            headers: { 'Token': QASE_API_TOKEN },
            responseType: 'arraybuffer'
        });

        fs.writeFileSync(pdfPath, pdfResponse.data);

        // 3. Upload do PDF no Monday
        const fileUploadQuery = `
            mutation addFile($file: File!, $itemId: Int!) {
                add_file_to_column(item_id: $itemId, column_id: "files", file: $file) {
                    id
                }
            }
        `;

        const formData = new FormData();
        formData.append('query', fileUploadQuery);
        formData.append('variables', JSON.stringify({ itemId: parseInt(itemId) }));
        formData.append('file', fs.createReadStream(pdfPath));

        await axios.post('https://api.monday.com/v2/file', formData, {
            headers: {
                'Authorization': MONDAY_API_TOKEN,
                ...formData.getHeaders()
            }
        });

        res.status(200).json({ message: 'Webhook do Qase processado com sucesso.' });
    } catch (error) {
        console.error('Erro no webhook do Qase:', error);
        res.status(500).json({ error: 'Erro interno no servidor.' });
    }
};
