import { NextRequest } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DB_URL,
});

// 获取每个node_id的最新power、7天内power变化值、30天内power变化值
async function getPowerChanges() {
  const query = `
    WITH latest_data AS (
        SELECT 
        node_id,
        power,
        power_change_7_days,
        power_change_10_days,
        date,
        ROW_NUMBER() OVER (PARTITION BY node_id ORDER BY date DESC) AS rn
        FROM f_node_stats
    )
    SELECT 
        node_id,
        power,
        power_change_7_days,
        power_change_10_days
    FROM latest_data
    WHERE rn = 1;
  `;
  return (await pool.query(query)).rows;
}

export async function GET(req: NextRequest) {
  try {
    const powerChanges = await getPowerChanges();

    // 返回响应
    return new Response(JSON.stringify(powerChanges), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Database query error', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
