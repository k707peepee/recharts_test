import { NextRequest } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DB_URL,
});

// 获取过去30天内power最高的记录
async function getHighestPowerLast30Days() {
  const query = `
    SELECT date, power FROM f_node_stats
    WHERE date > current_date - INTERVAL '30 days'
    ORDER BY power DESC, date ASC
    LIMIT 1;
  `;
  return (await pool.query(query)).rows[0];
}

// 获取过去30天内power最低的记录
async function getLowestPowerLast30Days() {
  const query = `
    SELECT date, power FROM f_node_stats
    WHERE date > current_date - INTERVAL '30 days'
    ORDER BY power ASC, date ASC
    LIMIT 1;
  `;
  return (await pool.query(query)).rows[0];
}

// 获取最近30天的所有记录
async function getLast30DaysData() {
  const query = `
    SELECT date, power FROM f_node_stats
    WHERE date > current_date - INTERVAL '30 days'
    ORDER BY date ASC;
  `;
  return (await pool.query(query)).rows;
}

export async function GET(req: NextRequest) {
  try {
    const [highest, lowest, last30DaysData] = await Promise.all([
      getHighestPowerLast30Days(),
      getLowestPowerLast30Days(),
      getLast30DaysData(),
    ]);

    // 合并查询结果
    const result = {
      highest,
      lowest,
      last30DaysData,
    };

    // 返回响应
    return new Response(JSON.stringify(result), {
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
