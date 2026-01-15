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

/* ✅ Create Employee */
export async function POST({ request }) {
  const body = await request.json();

  const employee = {
    name: body.name,
    email: body.email,
    login_id: body.loginId,
    avatar: body.avatar,
    photo_url: body.photoUrl,

    role: body.role,
    role_type: body.roleType,

    department: body.department,
    department_type: body.departmentType,

    status: body.status,
    join_date: body.joinDate,

    location: body.location,
    phone: body.phone,

    bio: body.bio,
    skills: body.skills,

    expertise: body.expertise,
    experience: body.experience,
    salary: body.salary,

    current_tasks: body.currentTasks,
    completed_tasks: body.completedTasks,

    projects: body.projects,
    availability: body.availability,
    last_active: body.lastActive
  };

  let pgResult = null;
  let supabaseResult = null;

  /* -------------------- 1️⃣ PostgreSQL INSERT (PRIMARY) -------------------- */
  try {
    const query = `
      INSERT INTO employees (
        name, email, login_id, avatar, photo_url,
        role, role_type,
        department, department_type,
        status, join_date,
        location, phone,
        bio, skills,
        expertise, experience, salary,
        current_tasks, completed_tasks,
        projects, availability, last_active
      )
      VALUES (
        $1,$2,$3,$4,$5,
        $6,$7,
        $8,$9,
        $10,$11,
        $12,$13,
        $14,$15,
        $16,$17,$18,
        $19,$20,
        $21,$22,now()
      )
      RETURNING *
    `;

    const values = [
      employee.name,
      employee.email,
      employee.login_id,
      employee.avatar,
      employee.photo_url,

      employee.role,
      employee.role_type,

      employee.department,
      employee.department_type,

      employee.status,
      employee.join_date,

      employee.location,
      employee.phone,

      employee.bio,
      employee.skills,

      employee.expertise,
      employee.experience,
      employee.salary,

      employee.current_tasks,
      employee.completed_tasks,

      employee.projects,
      employee.availability,

    ];

    const { rows } = await pool.query(query, values);
    pgResult = rows[0];
  } catch (pgError) {
    console.error('PostgreSQL insert failed:', pgError.message);
  }

  /* -------------------- 2️⃣ Supabase INSERT (SECONDARY) -------------------- */
  try {
    const { data, error } = await supabase
      .from('employees')
      .insert(employee)
      .select()
      .single();

    if (error) throw error;
    supabaseResult = data;
  } catch (sbError) {
    console.error('Supabase insert failed:', sbError.message);
  }

  /* -------------------- 3️⃣ RETURN PRIORITY RESULT -------------------- */
  if (pgResult) {
    return json(
      { success: true, source: 'postgres', data: pgResult },
      { status: 201, headers: corsHeaders }
    );
  }

  if (supabaseResult) {
    return json(
      { success: true, source: 'supabase', data: supabaseResult },
      { status: 201, headers: corsHeaders }
    );
  }

  /* -------------------- 4️⃣ BOTH FAILED -------------------- */
  return json(
    { success: false, error: 'Insert failed in both databases' },
    { status: 500, headers: corsHeaders }
  );
}

/* ✅ Get Employees */

export async function GET() {
  let pgData = null;
  let supabaseData = null;

  /* -------------------- 1️⃣ PostgreSQL SELECT (PRIMARY) -------------------- */
  try {
    const query = `SELECT * FROM employees ORDER BY created_at DESC`;
    const { rows } = await pool.query(query);
    pgData = rows;
  } catch (pgError) {
    console.error('PostgreSQL fetch failed:', pgError.message);
  }

  /* -------------------- 2️⃣ Supabase SELECT (FALLBACK) -------------------- */
  if (!pgData) {
    try {
      const { data, error } = await supabase
        .from('employees')
        .select('*');

      if (error) throw error;
      supabaseData = data;
    } catch (sbError) {
      console.error('Supabase fetch failed:', sbError.message);
    }
  }

  /* -------------------- 3️⃣ RETURN PRIORITY RESULT -------------------- */
  if (pgData) {
    return json(
      { success: true, source: 'postgres', data: pgData },
      { headers: corsHeaders }
    );
  }

  if (supabaseData) {
    return json(
      { success: true, source: 'supabase', data: supabaseData },
      { headers: corsHeaders }
    );
  }

  /* -------------------- 4️⃣ BOTH FAILED -------------------- */
  return json(
    { success: false, error: 'Failed to fetch employees from both databases' },
    { status: 500, headers: corsHeaders }
  );
}