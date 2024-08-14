import { createClient } from '@/utils/supabase/server';

export async function GET(request: Request, { params }: { params: { userId: string } }) {
  const userId = params.userId;
  const supabase = createClient();
  const { data, error } = await supabase.from('Users').select('*').eq('id', userId).single();
  if (error) throw error;
  return Response.json({ data });
}
