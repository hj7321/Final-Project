import { FormStatePart } from '@/types/form.type';
import { createClient } from '@/utils/supabase/server';

export async function POST(request: Request) {
  const supabase = createClient();
  const { email, password } = (await request.json()) as FormStatePart;

  const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (loginError) {
    console.log('로그인 실패: ', loginError.message);
    return Response.json({ errorMsg: loginError.message });
  } else {
    console.log('로그인 성공');
    console.log(loginData.user.user_metadata);
    console.log(loginData.session.user.user_metadata);
    return Response.json({ userData: loginData });
  }
}
