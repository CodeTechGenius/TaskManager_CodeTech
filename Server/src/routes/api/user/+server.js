import { json } from '@sveltejs/kit';
import { supabase } from '$lib/server/supabase';

// GET all users
export async function GET() {
  const { data, error } = await supabase
    .from('users_profile')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return json({ error: error.message }, { status: 500 });
  }

  return json(data);
}

// CREATE user
export async function POST({ request }) {
  const body = await request.json();

  const { data, error } = await supabase
    .from('users_profile')
    .insert([
      {
        name: body.name,
        email: body.email,
        role: body.role
      }
    ])
    .select()
    .single();

  if (error) {
    return json({ error: error.message }, { status: 400 });
  }

  return json(data, { status: 201 });
}
