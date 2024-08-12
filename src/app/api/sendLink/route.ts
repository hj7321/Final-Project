import { createClient } from '@/utils/supabase/server';

export async function POST(request: Request) {
  const supabase = createClient();
  const { email } = await request.json();

  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: 'https://final-project-flame-nu.vercel.app/login/resetPassword'
  });

  if (error) {
    console.log('링크 전송 실패: ', error.message);
    return Response.json({ errorMsg: error.message });
  } else {
    console.log('링크 전송 성공');
    return Response.json({ successData: data });
  }
}
