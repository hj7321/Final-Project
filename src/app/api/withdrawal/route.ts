import { createClient } from '@/utils/supabase/server';

export async function DELETE(request: Request) {
  const supabase = createClient();
  const { userId } = await request.json();
  console.log(userId);
  const { data, error } = await supabase.auth.admin.deleteUser(userId);

  if (error) {
    console.log('회원 탈퇴 실패: ', error.message);
    return Response.json({ errorMsg: error.message });
  } else {
    console.log('회원 탈퇴 성공');
    return Response.json({ successMsg: '회원 탈퇴 성공' });
  }
}
