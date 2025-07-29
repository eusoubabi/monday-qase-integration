import express from 'express';
import dotenv from 'dotenv';
import routes from './routes';
import bodyParser from 'body-parser';
import './db';

dotenv.config();

const app = express();
app.use(bodyParser.json());

// ✅ Health check para validação do Monday
app.get('/', (req, res) => {
  res.status(200).send('OK');
});

app.use('/webhook', routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
