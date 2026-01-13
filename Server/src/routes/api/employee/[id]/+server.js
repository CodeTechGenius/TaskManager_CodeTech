import { json } from '@sveltejs/kit';
import { supabase } from '$lib/server/supabase';

export async function GET({ params }) {
  const { data, error } = await supabase
    .from('employees')
    .select('*')
    .eq('id', params.id)
    .single();

  if (error) return json({ error: error.message }, { status: 404 });

  return json({ data });
}
