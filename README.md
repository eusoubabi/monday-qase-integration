# Monday-Qase Integration

## Rodando Localmente
1. Renomeie `.env.example` para `.env` e preencha as variáveis.
2. Instale dependências:
   ```
   npm install
   ```
3. Para rodar em dev:
   ```
   npm run dev
   ```
4. Para build:
   ```
   npm run build
   ```
5. Para rodar build:
   ```
   npm start
   ```

## Deploy no Render
1. Conecte seu repositório no Render.
2. Configure variáveis de ambiente no painel.
3. Comando de build:
   ```
   npm install && npm run build
   ```
4. Comando de start:
   ```
   npm start
   ```

## Endpoints
- POST `/webhook/monday` → Recebe dados do Monday.
- POST `/webhook/qase` → Recebe dados do Qase.
