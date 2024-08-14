import { createClient } from '@/utils/supabase/server';

export async function PATCH(request: Request) {
  const supabase = createClient();
  const { userId } = await request.json();
  const { data, error } = await supabase.from('Users').update({ is_pro: true }).eq('id', userId).select();

  return Response.json({ data });
}
