import { Request, Response } from 'express';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { getItemIdByTestPlan } from '../services/mondayQaseService';
import { uploadToMonday } from '../services/mondayUploadService';

export const handleQaseWebhook = async (req: Request, res: Response) => {
  try {
    const { event, run, project } = req.body;

    if (event !== 'run.completed') {
      return res.status(200).json({ message: 'Evento ignorado' });
    }

    const testPlanId = run.test_plan_id;
    console.log(`Run ${run.id} finalizado no projeto ${project.code}, testPlanId: ${testPlanId}`);

    const itemId = await getItemIdByTestPlan(testPlanId);
    if (!itemId) {
      console.error(`Nenhum item encontrado para testPlanId: ${testPlanId}`);
      return res.status(404).json({ error: 'Mapeamento não encontrado' });
    }

    // Baixar relatório do Qase
    const reportUrl = `https://api.qase.io/v1/report/${project.code}/${run.id}?format=pdf`;
    const reportResponse = await axios.get(reportUrl, {
      headers: { 'Token': process.env.QASE_API_KEY },
      responseType: 'arraybuffer'
    });

    const filePath = path.join('/tmp', `testrun-${run.id}.pdf`);
    fs.writeFileSync(filePath, reportResponse.data);

    // Upload no Monday
    await uploadToMonday(itemId, filePath);

    // Remover arquivo temporário
    fs.unlinkSync(filePath);

    return res.status(200).json({ message: 'Relatório anexado com sucesso' });
  } catch (error) {
    console.error('Erro ao processar webhook do Qase:', error);
    return res.status(500).json({ error: 'Erro interno' });
  }
};
