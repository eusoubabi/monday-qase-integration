import axios from 'axios';
import fs from 'fs';

export const uploadToMonday = async (itemId: string, filePath: string) => {
    const mondayToken = process.env.MONDAY_API_KEY;
    const query = `
        mutation addFile($file: File!) {
            add_file_to_column(item_id: ${itemId}, column_id: "files", file: $file) {
                id
            }
        }`;

    const fileStream = fs.createReadStream(filePath);

    await axios.post(
        'https://api.monday.com/v2/file',
        { query, variables: { file: fileStream } },
        {
            headers: {
                Authorization: mondayToken,
                'Content-Type': 'multipart/form-data'
            }
        }
    );
};
