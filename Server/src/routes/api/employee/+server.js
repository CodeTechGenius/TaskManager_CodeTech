import { json } from '@sveltejs/kit';
import { supabase } from '$lib/server/supabase';

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


    const { data, error } = await supabase
        .from('employees')
        .insert(employee)
        .select()
        .single();

    if (error) {
        return json(
            { success: false, error: error.message },
            { status: 400, headers: corsHeaders }
        );
    }

    return json(
        { success: true, data },
        { status: 201, headers: corsHeaders }
    );
}

/* ✅ Get Employees */
export async function GET() {
    const { data, error } = await supabase
        .from('employees')
        .select('*');

    if (error) {
        return json(
            { success: false, error: error.message },
            { status: 400, headers: corsHeaders }
        );
    }

    return json(
        { success: true, data },
        { headers: corsHeaders }
    );
}
