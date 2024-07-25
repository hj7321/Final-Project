import { createClient } from '@/utils/supabase/server';

export async function POST() {
  const supabase = createClient();
  await supabase.auth.signOut();
  return Response.json({ message: '로그아웃 완료' });
}
