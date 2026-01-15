import { json } from '@sveltejs/kit';
import { pool } from '$lib/server/pgdb';
import { supabase } from '$lib/server/supabase';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { env } from '$env/dynamic/private';
let JWT_SECRET = env.JWT_SECRET

console.log('jwtSECRET',JWT_SECRET)
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
// GET all users
export async function GET() {
  // const { data, error } = await supabase
  //   .from('users_profile')
  //   .select('*')
  //   .order('created_at', { ascending: false });
  const result = await pool.query(`select * from users`)


  return json({ data: result.rows });
}


export async function POST({ request }) {
  try {
    const { email, password, role } = await request.json();

    if (!email || !password || !role) {
      return json(
        { error: 1, errorMsg: 'Email, password and role are required' },
        { status: 400 }
      );
    }

    let user = null;
    let source = null;

    /* =====================================================
       1️⃣ POSTGRESQL LOGIN (PRIMARY)
    ===================================================== */
    try {
      const pgQuery = `
        SELECT id, full_name, email, password, role
        FROM users
        WHERE email = $1 AND role = $2 
        LIMIT 1
      `;
      const { rows } = await pool.query(pgQuery, [email, role]);
      console.log('rows',rows)
      if (rows.length > 0) {

          user = rows[0];
          source = 'postgres';
        
      }
    } catch (pgErr) {
      console.error('PostgreSQL login failed:', pgErr.message);
    }
    console.log('user is',user)
    /* =====================================================
       2️⃣ SUPABASE LOGIN (FALLBACK)
    ===================================================== */
    if (user == null) {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('id, name, email, password, role')
          .eq('email', email)
          .eq('role', role)
          .eq('is_active', true)
          .single();

        if (!error && data) {
            user = data;
            source = 'supabase';
        }
      } catch (sbErr) {
        console.error('Supabase login failed:', sbErr.message);
      }
    }

    /* =====================================================
       3️⃣ INVALID CREDENTIALS
    ===================================================== */
    if (user == null) {
      return json(
        { error: 1, errorMsg: 'Invalid email or password' },
        { status: 401 }
      );
    }

    /* =====================================================
       4️⃣ JWT TOKEN
    ===================================================== */
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    /* =====================================================
       5️⃣ SUCCESS RESPONSE
    ===================================================== */
    return json(
      {
        error: 0,
        source,
        token,
        user: {
          id: user.id,
          email: user.email,
          role: user.role
        }
      },
      { status: 200 }
    );
  } catch (err) {
    console.error('Admin login error:', err);

    return json(
      { error: -1, errorMsg: 'Server error' },
      { status: 500 }
    );
  }
}