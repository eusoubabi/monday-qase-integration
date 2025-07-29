import axios from 'axios';
import fs from 'fs';
import path from 'path';

export const exportTestRun = async (runId: string): Promise<string> => {
    const apiKey = process.env.QASE_API_KEY;
    const projectCode = process.env.QASE_PROJECT_CODE;

    const url = `https://api.qase.io/v1/run/${projectCode}/${runId}/export?format=pdf`;

    const response = await axios.get(url, {
        headers: { 'Token': apiKey },
        responseType: 'arraybuffer'
    });

    const exportDir = path.join(__dirname, '../../exports');
    if (!fs.existsSync(exportDir)) fs.mkdirSync(exportDir);

    const filePath = path.join(exportDir, `run_${runId}.pdf`);
    fs.writeFileSync(filePath, response.data);
    return filePath;
};
