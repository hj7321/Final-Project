import { FormStatePart } from '@/types/form.type';
import { createClient } from '@/utils/supabase/server';

export async function POST(request: Request) {
  const supabase = createClient();
  const { email, password } = (await request.json()) as FormStatePart;

  // 로그인 로직
  // signup 라우트 핸들러 3번이랑 같은 내용 - 나중에 리팩토링!
  const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (loginError) {
    console.log('로그인 실패: ', loginError.message);
    return Response.json({ errorMsg: loginError.message });
  } else {
    console.log('로그인 성공');
    console.log(loginData);
    return Response.json({ userData: loginData });
  }
}
