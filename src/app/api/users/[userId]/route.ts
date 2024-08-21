import { createClient } from '@/utils/supabase/server';

export async function GET(request: Request, { params }: { params: { userId: string } }) {
  const supabase = createClient();
  const userId = params.userId;

  const { data, error } = await supabase.from('Users').select('*').eq('id', userId).maybeSingle();

  if (error) {
    console.log('사용자 데이터 가져오기 실패: ', error.message);
    return Response.json({ errorMsg: error.message });
  } else {
    return Response.json({ userData: data });
  }
}
