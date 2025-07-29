import pool from '../db';

export const saveMapping = async (testPlanId: string, itemId: string) => {
  await pool.query(
    `INSERT INTO monday_qase (test_plan_id, item_id)
     VALUES ($1, $2)
     ON CONFLICT (test_plan_id) DO UPDATE SET item_id = EXCLUDED.item_id`,
    [testPlanId, itemId]
  );
};

export const getItemIdByTestPlan = async (testPlanId: string): Promise<string | null> => {
  const result = await pool.query('SELECT item_id FROM monday_qase WHERE test_plan_id = $1', [testPlanId]);
  return result.rows[0].item_id; // <- Aqui está o problema
};
