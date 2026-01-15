import { json } from '@sveltejs/kit';
import { supabase } from '$lib/server/supabase';
import { pool } from '$lib/server/pgdb';

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
};

/* ✅ Handle Preflight */
export function OPTIONS() {
    return new Response(null, {
        status: 204,
        headers: corsHeaders
    });
}

export async function GET({ params }) {
  const { id } = params;

  let pgResult = null;
  let supabaseResult = null;

  /* -------------------- 1️⃣ PostgreSQL SELECT (PRIMARY) -------------------- */
  try {
    const query = `
      SELECT *
      FROM employees
      WHERE id = $1
      LIMIT 1
    `;

    const { rows } = await pool.query(query, [id]);

    if (rows.length > 0) {
      pgResult = rows[0];
    }
  } catch (pgError) {
    console.error('PostgreSQL fetch by ID failed:', pgError.message);
  }

  /* -------------------- 2️⃣ Supabase SELECT (FALLBACK) -------------------- */
  if (!pgResult) {
    try {
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      supabaseResult = data;
    } catch (sbError) {
      console.error('Supabase fetch by ID failed:', sbError.message);
    }
  }

  /* -------------------- 3️⃣ RETURN PRIORITY RESULT -------------------- */
  if (pgResult) {
    return json(
      { success: true, source: 'postgres', data: pgResult },
      { headers: corsHeaders }
    );
  }

  if (supabaseResult) {
    return json(
      { success: true, source: 'supabase', data: supabaseResult },
      { headers: corsHeaders }
    );
  }

  /* -------------------- 4️⃣ NOT FOUND -------------------- */
  return json(
    { success: false, error: 'Employee not found' },
    { status: 404, headers: corsHeaders }
  );
}