import { createClient } from '@/utils/supabase/server';

export async function GET(request: Request) {
  const supabase = createClient();
  const { data, error } = await supabase.from('Users').select('*');

  return Response.json({ data });
}

export async function PATCH(request: Request) {
  const supabase = createClient();
  const { userId } = await request.json();
  const { data, error } = await supabase.from('Users').update({ is_pro: true }).eq('id', userId).select();

  return Response.json({ data });
}
