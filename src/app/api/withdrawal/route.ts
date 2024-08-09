import { createAdminSupabaseClient } from '@/utils/supabase/server';

export async function DELETE(request: Request) {
  const supabase = createAdminSupabaseClient();
  const url = new URL(request.url);
  const userId = url.searchParams.get('userId');

  console.log(userId);
  const { data, error } = await supabase.auth.admin.deleteUser(userId!);

  if (error) {
    console.log('회원 탈퇴 실패: ', error);
    return Response.json({ errorMsg: error.message });
  } else {
    console.log('회원 탈퇴 성공');
    return Response.json({ successMsg: '회원 탈퇴 성공' });
  }
}
