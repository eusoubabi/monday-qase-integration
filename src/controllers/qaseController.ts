import { Request, Response } from 'express';
import axios from 'axios';
import FormData from 'form-data';

export const handleQaseWebhook = async (req: Request, res: Response) => {
  try {
    const { event, run, project } = req.body;

    if (event !== 'run.completed') {
      return res.status(200).json({ message: 'Evento ignorado' });
    }

    console.log(`Run ${run.id} finalizado no projeto ${project.code}`);

    // ✅ Passo 1: Baixar relatório do Qase
    const reportUrl = `https://api.qase.io/v1/report/${project.code}/${run.id}?format=pdf`;
    const reportResponse = await axios.get(reportUrl, {
      headers: { 'Token': process.env.QASE_API_KEY },
      responseType: 'arraybuffer'
    });

    const buffer = Buffer.from(reportResponse.data);

    // ✅ Passo 2: Upload para o Monday
    // Aqui você precisa saber qual item no Monday receberá o arquivo
    // Exemplo: supomos que a relação itemId <-> testPlanId está salva
    const itemId = 9687041827; // <-- depois vamos buscar dinamicamente

    const formData = new FormData();
    formData.append('file', buffer, { filename: `testrun-${run.id}.pdf` });
    formData.append('item_id', String(itemId));

    await axios.post('https://api.monday.com/v2/file', formData, {
      headers: {
        Authorization: process.env.MONDAY_API_KEY!,
        ...formData.getHeaders()
      }
    });

    console.log(`Relatório do Run ${run.id} anexado ao item ${itemId} no Monday`);

    return res.status(200).json({ message: 'Webhook processado com sucesso' });
  } catch (error) {
    console.error('Erro ao processar webhook do Qase:', error);
    return res.status(500).json({ error: 'Erro interno' });
  }
};
