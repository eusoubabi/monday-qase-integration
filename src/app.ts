import express from 'express';
import routes from './routes';
import './db'; // Inicializa conexão
import setupDataBase from './setupDataBase';

const app = express();
app.use(express.json());
app.use('/webhook', routes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  await setupDataBase(); // Cria tabela automaticamente
});
