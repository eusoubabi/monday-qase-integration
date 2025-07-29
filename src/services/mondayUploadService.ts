import axios from 'axios';
import fs from 'fs';
import FormData from 'form-data';

export const uploadToMonday = async (itemId: string, filePath: string) => {
  const mondayToken = process.env.MONDAY_API_KEY;
  if (!mondayToken) {
    throw new Error('MONDAY_API_KEY não definido');
  }

  const query = `
    mutation addFile($file: File!) {
        add_file_to_column(item_id: ${itemId}, column_id: "files", file: $file) {
            id
        }
    }`;

  const fileStream = fs.createReadStream(filePath);

  const formData = new FormData();
  formData.append('query', query);
  formData.append('variables[file]', fileStream);

  await axios.post('https://api.monday.com/v2/file', formData, {
    headers: {
      Authorization: mondayToken,
      ...formData.getHeaders()
    }
  });

  console.log(`✅ Arquivo ${filePath} anexado ao item ${itemId} no Monday`);
};
