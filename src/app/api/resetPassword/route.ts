import { createClient } from '@/utils/supabase/server';

export async function PATCH(request: Request) {
  const supabase = createClient();
  const { password } = await request.json();

  const { data, error } = await supabase.auth.updateUser({ password });

  if (error) {
    console.log('비밀번호 변경 실패: ', error.message);
    return Response.json({ errorMsg: error.message });
  } else {
    console.log('비밀번호 변경 성공');
    return Response.json({ successData: data });
  }
}
