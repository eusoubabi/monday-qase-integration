import pool from './db';

export async function setupDatabase() {
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS monday_qase_mapping (
            id SERIAL PRIMARY KEY,
            test_plan_id VARCHAR(50) NOT NULL,
            item_id VARCHAR(50) NOT NULL
        );
    `;

    try {
        await pool.query(createTableQuery);
        console.log('✅ Tabela criada/verificada com sucesso!');
    } catch (error) {
        console.error('❌ Erro ao criar tabela:', error);
    }
}

// Se quiser usar como default export:
export default setupDatabase;
