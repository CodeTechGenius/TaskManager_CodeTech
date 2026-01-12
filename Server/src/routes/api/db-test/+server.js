import { json } from '@sveltejs/kit';
import { pool } from '$lib/server/db';

export async function GET() {
  const result = await pool.query('SELECT NOW()');
  return json({
    success: true,
    time: result.rows[0]
  });
}
